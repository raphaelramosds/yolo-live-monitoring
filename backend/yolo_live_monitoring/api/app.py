from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from yolo_live_monitoring.application.settings import settings
from yolo_live_monitoring.application.sqlite_repository import SqliteRepository
from yolo_live_monitoring.api.api_models import RTSPConnectionPayload
from yolo_live_monitoring.application.commands import CreateRTSPConnectionCommand

@asynccontextmanager
async def _lifespan(app: FastAPI):
    # Everything before the 'yield' runs on application startup
    print("Executing startup tasks...")

    # Store the instance inside app.state os it is globally available across requests
    app.state.sqlite_repository = SqliteRepository()

    yield

    # Everything after the 'yield' runs on application shutdown
    print("Executings shutdown tasks")

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

@app.post("/connections", status_code=status.HTTP_201_CREATED)
def create_connection(
    payload: RTSPConnectionPayload,
    request: Request
):
    # TODO: use FastAPI dependency injection (wiring container) to get Sqlite connection
    sqlite_repository: SqliteRepository = request.app.state.sqlite_repository

    create_rtsp_connection_command = CreateRTSPConnectionCommand(
        name=payload.name,
        rtsp_url=payload.rtsp_url,
        description=payload.description
    )

    success = sqlite_repository.create_rtsp_connection(
        create_rtsp_connection_command
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"The RTSP connection URL might already exist in the database."
        )
        
    return {
        "status": "success",
        "message": "Connection saved successfully.",
        "data": create_rtsp_connection_command.model_dump()
    }