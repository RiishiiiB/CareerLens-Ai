from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

from app.models.enums import UserRole
from app.schemas.user import UserResponse


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = UserRole.STUDENT
    registration_number: Optional[str] = None
    college_name: Optional[str] = None
    phone_number: Optional[str] = None
    department: Optional[str] = None
    graduation_year: Optional[int] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None

    @model_validator(mode="after")
    def validate_student_fields(self) -> "RegisterRequest":
        if self.role == UserRole.STUDENT:
            if not self.registration_number:
                raise ValueError("registration_number is required for students")
            if not self.college_name:
                raise ValueError("college_name is required for students")
        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class RefreshRequest(BaseModel):
    refresh_token: str = Field(min_length=20)


class LogoutRequest(BaseModel):
    refresh_token: str = Field(min_length=20)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class AuthResponse(BaseModel):
    user: UserResponse
    tokens: TokenResponse

    model_config = ConfigDict(from_attributes=True)


class RefreshTokenResponse(TokenResponse):
    pass


class RefreshTokenRead(BaseModel):
    id: int
    user_id: int
    jti: str
    is_revoked: bool
    expires_at: datetime
    revoked_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
