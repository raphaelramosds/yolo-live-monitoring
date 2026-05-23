from fastapi import FastAPI

app = FastAPI(
    title="YOLO Live Monitoring Backend",
    version="0.1.0",
    description="Real-time video streaming consumer and periodic inference delivery"
)

@app.get("/healthcheck")
def get_status():
    return {
        "status": "active",
        "service": "yolo-live-monitoring-backend",
    }