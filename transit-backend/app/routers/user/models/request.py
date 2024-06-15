from sqlmodel import SQLModel


class CreateUserRequest(SQLModel):
    username: str
    password: str
