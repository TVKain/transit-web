import uuid


from sqlmodel import SQLModel, Field

from pydantic import ConfigDict


# Database model
class UserModel(SQLModel, table=True):
    __tablename__ = "users"
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=uuid.uuid4, primary_key=True)
    username: str
    password: str
