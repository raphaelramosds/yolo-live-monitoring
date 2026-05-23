from contextlib import asynccontextmanager
from fastapi import FastAPI, status, HTTPException, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
from yolo_live_monitoring.application.settings import settings
from yolo_live_monitoring.application.sqlite_repository import SqliteRepository
from yolo_live_monitoring.application.commands import CreateRTSPConnectionCommand, UpdateRTSPConnectionCommand
from yolo_live_monitoring.application.dependencies import get_sqlite_repository

@asynccontextmanager
async def _lifespan(app: FastAPI):
    print("Executing startup tasks...")
    yield
    print("Executing shutdown tasks")

app = FastAPI(
    title="YOLO Live Monitoring Backend",
    version="0.1.0",
    description="Real-time video streaming consumer and periodic inference delivery",
    lifespan=_lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthcheck")
def get_status():
    return {
        "status": "active",
        "service": "yolo-live-monitoring-backend",
    }

@app.get("/connections")
def list_connections(
    sqlite_repository: SqliteRepository = Depends(get_sqlite_repository),
):
    return sqlite_repository.get_all_rtsp_connections()


@app.get("/connections/{connection_id}")
def get_connection(
    connection_id: int,
    sqlite_repository: SqliteRepository = Depends(get_sqlite_repository),
):
    connection = sqlite_repository.get_rtsp_connection_by_id(connection_id)
    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Connection with id {connection_id} not found."
        )
    return connection


@app.delete("/connections/{connection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_connection(
    connection_id: int,
    sqlite_repository: SqliteRepository = Depends(get_sqlite_repository),
):
    deleted = sqlite_repository.delete_rtsp_connection(connection_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Connection with id {connection_id} not found."
        )


@app.put("/connections/{connection_id}")
def update_connection(
    connection_id: int,
    name: str = Body(..., embed=True),
    rtsp_url: str = Body(..., embed=True),
    description: str | None = Body(None, embed=True),
    sqlite_repository: SqliteRepository = Depends(get_sqlite_repository),
):
    if not sqlite_repository.get_rtsp_connection_by_id(connection_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Connection with id {connection_id} not found."
        )

    command = UpdateRTSPConnectionCommand(name=name, rtsp_url=rtsp_url, description=description)
    success = sqlite_repository.update_rtsp_connection(connection_id, command)

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


@app.post("/connections", status_code=status.HTTP_201_CREATED)
def create_connection(
    name: str = Body(..., embed=True),
    rtsp_url: str = Body(..., embed=True),
    description: str | None = Body(..., embed=True),
    sqlite_repository: SqliteRepository = Depends(get_sqlite_repository),
):
    create_rtsp_connection_command = CreateRTSPConnectionCommand(
        name=name,
        rtsp_url=rtsp_url,
        description=description
    )

    success = sqlite_repository.create_rtsp_connection(create_rtsp_connection_command)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The RTSP connection URL might already exist in the database."
        )

    return {
        "status": "success",
        "message": "Connection saved successfully.",
        "data": create_rtsp_connection_command.model_dump()
    }
