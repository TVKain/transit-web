from sqlmodel import SQLModel


class CreateUserResponse(SQLModel):
    id: str
    username: str
    password: str
