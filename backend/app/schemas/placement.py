from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.enums import ApplicationStatus, DriveStatus
from app.schemas.recruiter import CompanyProfileResponse, JobPostingResponse


class PlacementDriveCreate(BaseModel):
    company_id: Optional[int] = None
    job_posting_id: Optional[int] = None
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    location: Optional[str] = Field(default=None, max_length=255)
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    registration_deadline: Optional[datetime] = None
    min_cgpa: Optional[float] = Field(default=None, ge=0, le=10)
    eligible_departments: list[str] = Field(default_factory=list)
    eligible_graduation_years: list[int] = Field(default_factory=list)
    required_skills: list[str] = Field(default_factory=list)
    eligibility_notes: Optional[str] = None
    status: DriveStatus = DriveStatus.DRAFT

    @model_validator(mode="after")
    def validate_schedule(self) -> "PlacementDriveCreate":
        if self.starts_at and self.ends_at and self.starts_at > self.ends_at:
            raise ValueError("starts_at cannot be after ends_at")
        if (
            self.registration_deadline
            and self.starts_at
            and self.registration_deadline > self.starts_at
        ):
            raise ValueError("registration_deadline cannot be after starts_at")
        return self


class PlacementDriveUpdate(BaseModel):
    company_id: Optional[int] = None
    job_posting_id: Optional[int] = None
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    location: Optional[str] = Field(default=None, max_length=255)
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    registration_deadline: Optional[datetime] = None
    min_cgpa: Optional[float] = Field(default=None, ge=0, le=10)
    eligible_departments: Optional[list[str]] = None
    eligible_graduation_years: Optional[list[int]] = None
    required_skills: Optional[list[str]] = None
    eligibility_notes: Optional[str] = None
    status: Optional[DriveStatus] = None


class PlacementDriveResponse(PlacementDriveCreate):
    id: int
    created_by_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    company: Optional[CompanyProfileResponse] = None
    job_posting: Optional[JobPostingResponse] = None

    model_config = ConfigDict(from_attributes=True)


class DriveApplicationCreate(BaseModel):
    resume_id: Optional[int] = None
    notes: Optional[str] = None


class DriveApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus
    status_reason: Optional[str] = None


class DriveApplicationResponse(BaseModel):
    id: int
    drive_id: int
    student_profile_id: int
    status: ApplicationStatus
    resume_id: Optional[int] = None
    notes: Optional[str] = None
    status_reason: Optional[str] = None
    applied_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
