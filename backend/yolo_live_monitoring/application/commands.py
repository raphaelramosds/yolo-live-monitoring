from pydantic import BaseModel

class BaseCommand(BaseModel):
    pass

class CreateConnectionCommand(BaseCommand):
    name: str
    rtsp_url: str
    description: str | None = None

class UpdateConnectionCommand(BaseCommand):
    name: str
    rtsp_url: str
    description: str | None = None
