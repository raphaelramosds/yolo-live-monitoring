from fastapi import APIRouter

router = APIRouter(tags=["healthcheck"])

@router.get("/healthcheck")
def get_status():
    return {
        "status": "active",
        "service": "yolo-live-monitoring-backend",
    }
