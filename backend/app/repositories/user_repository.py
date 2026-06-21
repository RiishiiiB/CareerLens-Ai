from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, user_data: dict[str, Any]) -> User:
        if "email" in user_data and user_data["email"]:
            user_data["email"] = user_data["email"].lower()
        user = User(**user_data)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_by_id(self, user_id: int) -> User | None:
        return self.db.get(User, user_id)

    def get_by_email(self, email: str) -> User | None:
        return self.db.scalar(
            select(User).where(User.email == email.lower()),
        )

    def get_by_registration_number(
        self,
        registration_number: str,
    ) -> User | None:
        return self.db.scalar(
            select(User).where(
                User.registration_number == registration_number,
            ),
        )

    def list(self) -> list[User]:
        return list(self.db.scalars(select(User).order_by(User.id)).all())

    def update(self, user: User, user_data: dict[str, Any]) -> User:
        for field_name, value in user_data.items():
            setattr(user, field_name, value)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user


def create_user(db: Session, user_data: dict[str, Any]) -> User:
    if "email" in user_data and user_data["email"]:
        user_data["email"] = user_data["email"].lower()
    user = User(**user_data)

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_all_users(db: Session) -> list[User]:
    return UserRepository(db).list()
