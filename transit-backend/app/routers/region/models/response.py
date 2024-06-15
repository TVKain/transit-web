from sqlmodel import SQLModel


class GetRegionVPCResponse(SQLModel):
    id: str
    name: str
    cidr: str


class GetRegionResponse(SQLModel):
    id: str
    auth_url: str
    vpcs: list[GetRegionVPCResponse]


class GetAllRegionResponse(SQLModel):
    regions: list[GetRegionResponse]


class CreateRegionResponse(SQLModel):
    id: str
    auth_url: str
