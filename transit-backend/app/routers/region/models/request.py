from sqlmodel import SQLModel


class CreateRegionRequest(SQLModel):
    id: str
    auth_url: str
