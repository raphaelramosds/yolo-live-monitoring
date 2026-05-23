from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from yolo_live_monitoring.application.settings import settings
from yolo_live_monitoring.api.routers import connections, healthcheck

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

app.include_router(healthcheck.router)
app.include_router(connections.router)
