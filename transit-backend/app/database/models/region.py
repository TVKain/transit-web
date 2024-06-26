from sqlmodel import SQLModel, Field

from pydantic import ConfigDict


# Database model
class RegionModel(SQLModel, table=True):
    __tablename__ = "regions"
    model_config = ConfigDict(extra="ignore")
    id: str = Field(primary_key=True)
    auth_url: str
    provider_id: str | None
    transit_service_url: str | None 
