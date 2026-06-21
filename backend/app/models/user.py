from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    registration_number = Column(
        String,
        unique=True,
        nullable=False
    )

    college_name = Column(
        String,
        nullable=False
    )

    full_name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    phone_number = Column(
        String,
        nullable=True
    )

    department = Column(
        String,
        nullable=True
    )

    graduation_year = Column(
        Integer,
        nullable=True
    )

    linkedin_url = Column(
        String,
        nullable=True
    )

    github_url = Column(
        String,
        nullable=True
    )

    resume_url = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )