from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.enums import ApplicationStatus, DriveStatus, UserRole
from app.models.placement import DriveApplication, PlacementDrive
from app.models.user import User
from app.repositories.placement_repository import PlacementRepository
from app.repositories.recruiter_repository import RecruiterRepository
from app.repositories.resume_repository import ResumeRepository
from app.repositories.student_repository import StudentRepository
from app.repositories.user_repository import UserRepository
from app.schemas.placement import (
    DriveApplicationCreate,
    DriveApplicationStatusUpdate,
    PlacementDriveCreate,
    PlacementDriveUpdate,
)


class PlacementService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.placements = PlacementRepository(db)
        self.recruiters = RecruiterRepository(db)
        self.students = StudentRepository(db)
        self.users = UserRepository(db)
        self.resumes = ResumeRepository(db)

    def create_drive(
        self,
        current_user: User,
        payload: PlacementDriveCreate,
    ) -> PlacementDrive:
        self._require_staff(current_user)
        self._validate_company_and_job(payload.company_id, payload.job_posting_id)
        return self.placements.create_drive(
            {
                **self._payload(payload),
                "created_by_id": current_user.id,
            },
        )

    def list_drives(self, status_filter: str | None = None) -> list[PlacementDrive]:
        return self.placements.list_drives(status=status_filter)

    def get_drive(self, drive_id: int) -> PlacementDrive:
        return self._get_drive_or_404(drive_id)

    def update_drive(
        self,
        current_user: User,
        drive_id: int,
        payload: PlacementDriveUpdate,
    ) -> PlacementDrive:
        self._require_staff(current_user)
        drive = self._get_drive_or_404(drive_id)
        data = self._payload(payload, exclude_unset=True)
        self._validate_company_and_job(
            data.get("company_id", drive.company_id),
            data.get("job_posting_id", drive.job_posting_id),
        )
        return self.placements.update_drive(drive, data)

    def register_for_drive(
        self,
        current_user: User,
        drive_id: int,
        payload: DriveApplicationCreate,
    ) -> DriveApplication:
        if current_user.role != UserRole.STUDENT.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only student accounts can register for placement drives",
            )
        drive = self._get_drive_or_404(drive_id)
        if drive.status != DriveStatus.OPEN.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Placement drive is not open for registration",
            )
        if drive.registration_deadline and datetime.now(UTC) > drive.registration_deadline:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Placement drive registration deadline has passed",
            )

        profile = self.students.get_profile_by_user_id(current_user.id)
        if profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile is required before registering",
            )
        if self.placements.get_application_for_student(
            drive_id=drive_id,
            student_profile_id=profile.id,
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Student is already registered for this drive",
            )
        self._validate_student_eligibility(current_user, profile.id, drive)
        if payload.resume_id is not None:
            resume = self.resumes.get(payload.resume_id)
            if resume is None or resume.user_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Resume not found for current student",
                )

        return self.placements.create_application(
            {
                "drive_id": drive_id,
                "student_profile_id": profile.id,
                "resume_id": payload.resume_id,
                "notes": payload.notes,
                "status": ApplicationStatus.REGISTERED.value,
            },
        )

    def list_applications_for_drive(
        self,
        current_user: User,
        drive_id: int,
    ) -> list[DriveApplication]:
        self._require_staff(current_user)
        self._get_drive_or_404(drive_id)
        return self.placements.list_applications_for_drive(drive_id)

    def list_my_applications(self, current_user: User) -> list[DriveApplication]:
        if current_user.role != UserRole.STUDENT.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only student accounts have drive applications",
            )
        profile = self.students.get_profile_by_user_id(current_user.id)
        if profile is None:
            return []
        return self.placements.list_applications_for_student(profile.id)

    def update_application_status(
        self,
        current_user: User,
        application_id: int,
        payload: DriveApplicationStatusUpdate,
    ) -> DriveApplication:
        self._require_staff(current_user)
        application = self.placements.get_application(application_id)
        if application is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Drive application not found",
            )
        return self.placements.update_application(
            application,
            self._payload(payload, exclude_unset=True),
        )

    def _validate_student_eligibility(
        self,
        current_user: User,
        profile_id: int,
        drive: PlacementDrive,
    ) -> None:
        profile = self.students.get_profile(profile_id)
        if profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )
        if drive.min_cgpa is not None and (
            profile.cgpa is None or profile.cgpa < drive.min_cgpa
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student does not meet the minimum CGPA requirement",
            )
        if (
            drive.eligible_departments
            and current_user.department not in drive.eligible_departments
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student department is not eligible for this drive",
            )
        if (
            drive.eligible_graduation_years
            and current_user.graduation_year not in drive.eligible_graduation_years
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student graduation year is not eligible for this drive",
            )
        if drive.required_skills:
            student_skills = {skill.name.lower() for skill in profile.skills}
            required_skills = {skill.lower() for skill in drive.required_skills}
            missing_skills = sorted(required_skills - student_skills)
            if missing_skills:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Student is missing required skills: {', '.join(missing_skills)}",
                )

    def _validate_company_and_job(
        self,
        company_id: int | None,
        job_posting_id: int | None,
    ) -> None:
        if company_id is not None and self.recruiters.get_company(company_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company profile not found",
            )
        if job_posting_id is not None:
            job = self.recruiters.get_job(job_posting_id)
            if job is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Job posting not found",
                )
            if company_id is not None and job.company_id != company_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Job posting does not belong to the selected company",
                )

    def _get_drive_or_404(self, drive_id: int) -> PlacementDrive:
        drive = self.placements.get_drive(drive_id)
        if drive is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Placement drive not found",
            )
        return drive

    @staticmethod
    def _require_staff(current_user: User) -> None:
        if current_user.role in {
            UserRole.PLACEMENT_OFFICER.value,
            UserRole.ADMIN.value,
            UserRole.SUPER_ADMIN.value,
        }:
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only placement staff can manage placement drives",
        )

    @staticmethod
    def _payload(payload: Any, *, exclude_unset: bool = False) -> dict[str, Any]:
        return payload.model_dump(
            exclude_none=True,
            exclude_unset=exclude_unset,
            mode="json",
        )
