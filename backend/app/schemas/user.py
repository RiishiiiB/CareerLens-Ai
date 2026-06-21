from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.enums import UserRole


class UserBase(BaseModel):
    registration_number: Optional[str] = None
    college_name: Optional[str] = None
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr

    phone_number: Optional[str] = None
    department: Optional[str] = None
    graduation_year: Optional[int] = None

    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None


class UserCreate(UserBase):
    registration_number: str
    college_name: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    phone_number: Optional[str] = None
    department: Optional[str] = None
    graduation_year: Optional[int] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    resume_url: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None


class UserResponse(UserBase):
    id: int
    role: UserRole = UserRole.STUDENT
    is_active: bool = True
    resume_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
