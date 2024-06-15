from fastapi import APIRouter, HTTPException

from app.routers.user.models.request import CreateUserRequest
from app.routers.user.models.response import CreateUserResponse

from app.database.repositories.user.user import UserRepository

router = APIRouter(prefix="/user", tags=["user"])


@router.post("/", response_model=CreateUserResponse, responses={400: {"detail": ""}})
def create(request: CreateUserRequest):
    user_repo = UserRepository()

    user = user_repo.get_by_username(username=request.username)

    if user is not None:
        raise HTTPException(status_code=400, detail="User exists")

    user = user_repo.create(username=request.username, password=request.password)

    print(user)

    return user


@router.get("/{id}")
def get(id: str):
    user_repo = UserRepository()

    user = user_repo.get(id)

    if user is None:
        raise HTTPException(status_code=400, detail="User does not exist")

    return user
