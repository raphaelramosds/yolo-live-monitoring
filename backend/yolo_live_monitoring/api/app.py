from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from yolo_live_monitoring.application.settings import settings
from yolo_live_monitoring.application.sqlite_repository import SqliteRepository

@asynccontextmanager
async def _lifespan(app: FastAPI):
    # Everything before the 'yield' runs on application startup
    print("Executing startup tasks...")
    sqlite_repository = SqliteRepository()

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