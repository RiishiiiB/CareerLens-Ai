from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_roles
from app.db.session import get_db
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import create_user_service, get_all_users_service

router = APIRouter(tags=["Users"])


@router.post(
    "/users",
    response_model=UserResponse
)
def create_user(
    user: UserCreate,
    db: Annotated[Session, Depends(get_db)],
) -> User:
    return create_user_service(
        db,
        user.model_dump()
    )


@router.get("/users/me", response_model=UserResponse)
def get_me(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    return current_user


@router.get("/users", response_model=list[UserResponse])
def get_users(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[
        User,
        Depends(require_roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)),
    ],
) -> list[User]:
    return get_all_users_service(db)
