from sqlmodel import SQLModel


class GetSubnetResponse(SQLModel):
    id: str
    network_address: str
    gateway_ip: str


class GetAllSubnetResponse(SQLModel):
    subnets: list[GetSubnetResponse]


class CreateSubnetResponse(SQLModel):
    id: str
