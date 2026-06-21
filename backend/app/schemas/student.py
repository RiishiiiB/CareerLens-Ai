from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, model_validator

from app.models.enums import SkillProficiency


class StudentSkillCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    proficiency: SkillProficiency = SkillProficiency.INTERMEDIATE
    years_experience: Optional[float] = Field(default=None, ge=0, le=60)


class StudentSkillUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    proficiency: Optional[SkillProficiency] = None
    years_experience: Optional[float] = Field(default=None, ge=0, le=60)


class StudentSkillResponse(StudentSkillCreate):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class StudentEducationCreate(BaseModel):
    institution: str = Field(min_length=1, max_length=255)
    degree: str = Field(min_length=1, max_length=255)
    field_of_study: Optional[str] = Field(default=None, max_length=255)
    start_year: Optional[int] = Field(default=None, ge=1950, le=2100)
    end_year: Optional[int] = Field(default=None, ge=1950, le=2100)
    grade: Optional[str] = Field(default=None, max_length=120)
    description: Optional[str] = None

    @model_validator(mode="after")
    def validate_years(self) -> "StudentEducationCreate":
        if self.start_year and self.end_year and self.start_year > self.end_year:
            raise ValueError("start_year cannot be after end_year")
        return self


class StudentEducationUpdate(BaseModel):
    institution: Optional[str] = Field(default=None, min_length=1, max_length=255)
    degree: Optional[str] = Field(default=None, min_length=1, max_length=255)
    field_of_study: Optional[str] = Field(default=None, max_length=255)
    start_year: Optional[int] = Field(default=None, ge=1950, le=2100)
    end_year: Optional[int] = Field(default=None, ge=1950, le=2100)
    grade: Optional[str] = Field(default=None, max_length=120)
    description: Optional[str] = None


class StudentEducationResponse(StudentEducationCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class StudentCertificationCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    issuing_organization: str = Field(min_length=1, max_length=255)
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    credential_url: Optional[HttpUrl] = None


class StudentCertificationUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    issuing_organization: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    credential_url: Optional[HttpUrl] = None


class StudentCertificationResponse(StudentCertificationCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class StudentProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    tech_stack: list[str] = Field(default_factory=list)
    project_url: Optional[HttpUrl] = None
    repository_url: Optional[HttpUrl] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class StudentProjectUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    tech_stack: Optional[list[str]] = None
    project_url: Optional[HttpUrl] = None
    repository_url: Optional[HttpUrl] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class StudentProjectResponse(StudentProjectCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class StudentProfileCreate(BaseModel):
    headline: Optional[str] = Field(default=None, max_length=255)
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    location: Optional[str] = Field(default=None, max_length=255)
    portfolio_url: Optional[HttpUrl] = None
    cgpa: Optional[float] = Field(default=None, ge=0, le=10)


class StudentProfileUpdate(StudentProfileCreate):
    pass


class StudentProfileResponse(StudentProfileCreate):
    id: int
    user_id: int
    profile_completion_score: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    skills: list[StudentSkillResponse] = Field(default_factory=list)
    education: list[StudentEducationResponse] = Field(default_factory=list)
    certifications: list[StudentCertificationResponse] = Field(default_factory=list)
    projects: list[StudentProjectResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
