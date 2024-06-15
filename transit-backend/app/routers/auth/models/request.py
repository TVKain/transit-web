from sqlmodel import SQLModel


class AuthUserRequest(SQLModel):
    username: str
    password: str
