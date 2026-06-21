from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl, model_validator

from app.models.enums import EmploymentType, JobStatus, ShortlistStatus
from app.schemas.auth import AuthResponse


class CompanyProfileCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    industry: Optional[str] = Field(default=None, max_length=255)
    website_url: Optional[HttpUrl] = None
    location: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = None
    company_size: Optional[str] = Field(default=None, max_length=120)


class CompanyProfileUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    industry: Optional[str] = Field(default=None, max_length=255)
    website_url: Optional[HttpUrl] = None
    location: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = None
    company_size: Optional[str] = Field(default=None, max_length=120)
    is_verified: Optional[bool] = None


class CompanyProfileResponse(CompanyProfileCreate):
    id: int
    owner_user_id: Optional[int] = None
    is_verified: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class RecruiterProfileCreate(BaseModel):
    company_id: Optional[int] = None
    designation: Optional[str] = Field(default=None, max_length=255)
    work_email: Optional[EmailStr] = None


class RecruiterProfileUpdate(BaseModel):
    company_id: Optional[int] = None
    designation: Optional[str] = Field(default=None, max_length=255)
    work_email: Optional[EmailStr] = None
    is_verified: Optional[bool] = None


class RecruiterProfileResponse(RecruiterProfileCreate):
    id: int
    user_id: int
    is_verified: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    company: Optional[CompanyProfileResponse] = None

    model_config = ConfigDict(from_attributes=True)


class RecruiterRegistrationRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    phone_number: Optional[str] = None
    designation: Optional[str] = Field(default=None, max_length=255)
    work_email: Optional[EmailStr] = None
    company: Optional[CompanyProfileCreate] = None
    company_id: Optional[int] = None

    @model_validator(mode="after")
    def validate_company_source(self) -> "RecruiterRegistrationRequest":
        if self.company and self.company_id:
            raise ValueError("Provide either company or company_id, not both")
        return self


class RecruiterRegistrationResponse(BaseModel):
    auth: AuthResponse
    recruiter_profile: RecruiterProfileResponse

    model_config = ConfigDict(from_attributes=True)


class JobPostingCreate(BaseModel):
    company_id: Optional[int] = None
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    location: Optional[str] = Field(default=None, max_length=255)
    employment_type: EmploymentType = EmploymentType.FULL_TIME
    salary_min: Optional[float] = Field(default=None, ge=0)
    salary_max: Optional[float] = Field(default=None, ge=0)
    currency: str = Field(default="INR", min_length=3, max_length=3)
    required_skills: list[str] = Field(default_factory=list)
    eligibility_criteria: dict[str, object] = Field(default_factory=dict)
    status: JobStatus = JobStatus.OPEN
    expires_at: Optional[datetime] = None

    @model_validator(mode="after")
    def validate_salary(self) -> "JobPostingCreate":
        if (
            self.salary_min is not None
            and self.salary_max is not None
            and self.salary_min > self.salary_max
        ):
            raise ValueError("salary_min cannot exceed salary_max")
        return self


class JobPostingUpdate(BaseModel):
    company_id: Optional[int] = None
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, min_length=1)
    location: Optional[str] = Field(default=None, max_length=255)
    employment_type: Optional[EmploymentType] = None
    salary_min: Optional[float] = Field(default=None, ge=0)
    salary_max: Optional[float] = Field(default=None, ge=0)
    currency: Optional[str] = Field(default=None, min_length=3, max_length=3)
    required_skills: Optional[list[str]] = None
    eligibility_criteria: Optional[dict[str, object]] = None
    status: Optional[JobStatus] = None
    expires_at: Optional[datetime] = None


class JobPostingResponse(JobPostingCreate):
    id: int
    company_id: int
    recruiter_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    company: Optional[CompanyProfileResponse] = None

    model_config = ConfigDict(from_attributes=True)


class CandidateShortlistCreate(BaseModel):
    student_profile_id: int
    status: ShortlistStatus = ShortlistStatus.SHORTLISTED
    notes: Optional[str] = None


class CandidateShortlistUpdate(BaseModel):
    status: Optional[ShortlistStatus] = None
    notes: Optional[str] = None


class CandidateShortlistResponse(CandidateShortlistCreate):
    id: int
    job_id: int
    recruiter_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
