from pydantic import BaseModel

class RTSPConnectionInput(BaseModel):
    name: str
    rtsp_url: str
    description: str | None = None