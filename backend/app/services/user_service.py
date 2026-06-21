from typing import Any

from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import create_user, get_all_users


def create_user_service(db: Session, user_data: dict[str, Any]) -> User:
    return create_user(db, user_data)


def get_all_users_service(db: Session) -> list[User]:
    return get_all_users(db)
