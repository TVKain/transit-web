from sqlmodel import SQLModel, Field

from pydantic import ConfigDict


# Database model
class UserVPCModel(SQLModel, table=True):
    __tablename__ = "users_vpcs"
    model_config = ConfigDict(extra="ignore")
    user_id: str = Field(primary_key=True, foreign_key="users.id")
    vpc_id: str = Field(primary_key=True, foreign_key="vpcs.id")
