from sqlmodel import SQLModel


class IPAddress(SQLModel):
    ip_address: str
    subnet: str


class GetComputeResponse(SQLModel):
    id: str
    name: str
    ip_addresses: list[IPAddress]
    status: str
    console_url: str


class GetAllComputeResponse(SQLModel):
    computes: list[GetComputeResponse]
