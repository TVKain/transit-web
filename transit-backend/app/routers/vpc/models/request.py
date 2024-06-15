from sqlmodel import SQLModel


class CreateVPCRequest(SQLModel):
    user_id: str
    region_id: str
    name: str
    cidr: str
