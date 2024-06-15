# from datetime import datetime

from sqlmodel import SQLModel


class GetVPCResponse(SQLModel):
    id: str
    name: str
    router_id: str
    network_id: str
    region_id: str


class CreateVPCResponse(SQLModel):
    id: str
    user_id: str
    region_id: str
    name: str
