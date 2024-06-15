from sqlmodel import SQLModel


class AuthUserResponse(SQLModel):
    id: str
    username: str
    password: str
