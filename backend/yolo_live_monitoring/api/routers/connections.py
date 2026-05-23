import asyncio
from datetime import datetime
from fastapi import APIRouter, Request, status, HTTPException, Body, Depends
from fastapi.responses import StreamingResponse
from yolo_live_monitoring.application.sqlite_repository import SqliteRepository
from yolo_live_monitoring.application.commands import CreateConnectionCommand, UpdateConnectionCommand
from yolo_live_monitoring.application.dependencies import get_sqlite_repository

router = APIRouter(prefix="/connections", tags=["connections"])


@router.get("")
def list_connections(
    sqlite_repository: SqliteRepository = Depends(get_sqlite_repository),
):
    return sqlite_repository.get_all_connections()


@router.get("/{connection_id}")
def get_connection(
    connection_id: int,
    sqlite_repository: SqliteRepository = Depends(get_sqlite_repository),
):
    connection = sqlite_repository.get_connection_by_id(connection_id)
    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Connection with id {connection_id} not found."
        )
    return connection


@router.get("/{connection_id}/stream")
async def stream_connection(
    connection_id: int,
    request: Request,
    sqlite_repository: SqliteRepository = Depends(get_sqlite_repository),
):
    if not sqlite_repository.get_connection_by_id(connection_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Connection with id {connection_id} not found."
        )

    async def event_generator():
        try:
            while True:
                if await request.is_disconnected():
                    break
                yield f"data: {datetime.now().isoformat()}\n\n"
                await asyncio.sleep(1)
        except asyncio.CancelledError:
            pass

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.delete("/{connection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_connection(
    connection_id: int,
    sqlite_repository: SqliteRepository = Depends(get_sqlite_repository),
):
    deleted = sqlite_repository.delete_connection(connection_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Connection with id {connection_id} not found."
        )


@router.put("/{connection_id}")
def update_connection(
    connection_id: int,
    name: str = Body(..., embed=True),
    rtsp_url: str = Body(..., embed=True),
    description: str | None = Body(None, embed=True),
    sqlite_repository: SqliteRepository = Depends(get_sqlite_repository),
):
    if not sqlite_repository.get_connection_by_id(connection_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Connection with id {connection_id} not found."
        )

    command = UpdateConnectionCommand(name=name, rtsp_url=rtsp_url, description=description)
    success = sqlite_repository.update_connection(connection_id, command)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The RTSP connection URL might already exist in the database."
        )

    return {
        "status": "success",
        "message": "Connection updated successfully.",
        "data": {**command.model_dump(), "id": connection_id}
    }


@router.post("", status_code=status.HTTP_201_CREATED)
def create_connection(
    name: str = Body(..., embed=True),
    rtsp_url: str = Body(..., embed=True),
    description: str | None = Body(..., embed=True),
    sqlite_repository: SqliteRepository = Depends(get_sqlite_repository),
):
    command = CreateConnectionCommand(name=name, rtsp_url=rtsp_url, description=description)

    success = sqlite_repository.create_connection(command)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The RTSP connection URL might already exist in the database."
        )

    return {
        "status": "success",
        "message": "Connection saved successfully.",
        "data": command.model_dump()
    }
