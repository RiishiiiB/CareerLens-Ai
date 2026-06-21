from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.user_repository import create_user


def create_user_service(db: Session, user_data: dict):
    return create_user(db, user_data)
def get_all_users_service(db):
    return db.query(User).all()