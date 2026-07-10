from datetime import date
from typing import Optional

from pydantic import BaseModel


class ApplicationBase(BaseModel):
    company_name: str
    role: str
    location: Optional[str] = None
    package: Optional[str] = None
    status: str = "Applied"
    applied_date: Optional[date] = None
    notes: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    company_name: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    package: Optional[str] = None
    status: Optional[str] = None
    applied_date: Optional[date] = None
    notes: Optional[str] = None


class ApplicationResponse(ApplicationBase):
    id: int
    student_id: int

    class Config:
        from_attributes = True