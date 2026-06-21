from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import create_user_service

router = APIRouter()


@router.post(
    "/users",
    response_model=UserResponse
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    return create_user_service(
        db,
        user.model_dump()
    )
@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return get_all_users_service(db)