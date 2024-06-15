from sqlmodel import SQLModel


class CreateSubnetRequest(SQLModel):
    vpc_id: str
    network_address: str
