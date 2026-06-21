from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base
from app.models.enums import UserRole


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    registration_number = Column(
        String,
        unique=True,
        nullable=True,
    )

    college_name = Column(
        String,
        nullable=True,
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

    password_hash = Column(
        String,
        nullable=True,
    )

    role = Column(
        String,
        nullable=False,
        default=UserRole.STUDENT.value,
        server_default=UserRole.STUDENT.value,
        index=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
    )

    last_login_at = Column(
        DateTime(timezone=True),
        nullable=True,
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

    refresh_tokens = relationship(
        "RefreshToken",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    student_profile = relationship(
        "StudentProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    resumes = relationship(
        "Resume",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    recruiter_profile = relationship(
        "RecruiterProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    created_drives = relationship(
        "PlacementDrive",
        back_populates="created_by",
    )
