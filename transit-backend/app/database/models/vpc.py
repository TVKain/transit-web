import uuid


from sqlmodel import SQLModel, Field

from pydantic import ConfigDict


# Database model
class VPCModel(SQLModel, table=True):
    __tablename__ = "vpcs"
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    region_id: str = Field(foreign_key="regions.id")
    router_id: str
    network_id: str
    cidr: str
