from sqlmodel import SQLModel


class CreateComputeRequest(SQLModel):
    vpc_id: str
    subnet_id: str
    name: str
