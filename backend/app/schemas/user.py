from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    registration_number: str
    college_name: str
    full_name: str
    email: EmailStr

    phone_number: Optional[str] = None
    department: Optional[str] = None
    graduation_year: Optional[int] = None

    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None


class UserResponse(UserCreate):
    id: int

    class Config:
        from_attributes = True
        