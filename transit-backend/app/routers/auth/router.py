from fastapi import APIRouter, HTTPException

from app.routers.auth.models.request import AuthUserRequest
from app.routers.auth.models.response import AuthUserResponse

from app.database.repositories.user.user import UserRepository

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/", response_model=AuthUserResponse, responses={401: {"detail": "Unauthorized"}}
)
def authenticate(request: AuthUserRequest):
    user_repo = UserRepository()

    user = user_repo.get_by_username(username=request.username)

    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if user.password != request.password:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return user
