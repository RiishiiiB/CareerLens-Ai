from sqlalchemy.orm import Session
from app.models.user import User


def create_user(db: Session, user_data: dict):
    user = User(**user_data)

    db.add(user)
    db.commit()
    db.refresh(user)

    return user