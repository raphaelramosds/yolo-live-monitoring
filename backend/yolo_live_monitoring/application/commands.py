from pydantic import BaseModel

class BaseCommand(BaseModel):
    pass

class CreateRTSPConnectionCommand(BaseCommand):
    name: str
    rtsp_url: str
    description: str | None = None

class UpdateRTSPConnectionCommand(BaseCommand):
    name: str
    rtsp_url: str
    description: str | None = None