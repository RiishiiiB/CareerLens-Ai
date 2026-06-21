from __future__ import annotations

from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.enums import UserRole
from app.models.recruiter import (
    CandidateShortlist,
    CompanyProfile,
    JobPosting,
    RecruiterProfile,
)
from app.models.user import User
from app.repositories.recruiter_repository import RecruiterRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.auth import RegisterRequest
from app.schemas.recruiter import (
    CandidateShortlistCreate,
    CandidateShortlistUpdate,
    CompanyProfileCreate,
    CompanyProfileUpdate,
    JobPostingCreate,
    JobPostingUpdate,
    RecruiterProfileCreate,
    RecruiterProfileUpdate,
    RecruiterRegistrationRequest,
    RecruiterRegistrationResponse,
)
from app.services.auth_service import AuthService


class RecruiterService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.recruiters = RecruiterRepository(db)
        self.students = StudentRepository(db)

    def register_recruiter(
        self,
        payload: RecruiterRegistrationRequest,
    ) -> RecruiterRegistrationResponse:
        company_id = self._resolve_registration_company(payload)
        auth_response = AuthService(self.db).register(
            RegisterRequest(
                full_name=payload.full_name,
                email=payload.email,
                password=payload.password,
                role=UserRole.RECRUITER,
                phone_number=payload.phone_number,
            ),
        )
        user_id = auth_response.user.id
        profile = self.recruiters.create_recruiter_profile(
            {
                "user_id": user_id,
                "company_id": company_id,
                "designation": payload.designation,
                "work_email": str(payload.work_email) if payload.work_email else None,
            },
        )
        return RecruiterRegistrationResponse(
            auth=auth_response,
            recruiter_profile=profile,
        )

    def create_company(
        self,
        current_user: User,
        payload: CompanyProfileCreate,
    ) -> CompanyProfile:
        self._require_recruiter_or_staff(current_user)
        if self.recruiters.get_company_by_name(payload.name):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A company with this name already exists",
            )
        data = self._payload(payload)
        data["owner_user_id"] = current_user.id
        try:
            return self.recruiters.create_company(data)
        except IntegrityError as exc:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Company profile conflicts with an existing record",
            ) from exc

    def list_companies(self) -> list[CompanyProfile]:
        return self.recruiters.list_companies()

    def get_company(self, company_id: int) -> CompanyProfile:
        return self._get_company_or_404(company_id)

    def update_company(
        self,
        current_user: User,
        company_id: int,
        payload: CompanyProfileUpdate,
    ) -> CompanyProfile:
        company = self._get_company_or_404(company_id)
        self._authorize_company_write(current_user, company)
        return self.recruiters.update_company(
            company,
            self._payload(payload, exclude_unset=True),
        )

    def create_my_profile(
        self,
        current_user: User,
        payload: RecruiterProfileCreate,
    ) -> RecruiterProfile:
        if current_user.role != UserRole.RECRUITER.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only recruiter accounts can create recruiter profiles",
            )
        if self.recruiters.get_recruiter_profile_by_user_id(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Recruiter profile already exists",
            )
        if payload.company_id:
            self._get_company_or_404(payload.company_id)
        return self.recruiters.create_recruiter_profile(
            {
                "user_id": current_user.id,
                **self._payload(payload),
            },
        )

    def get_my_profile(self, current_user: User) -> RecruiterProfile:
        profile = self.recruiters.get_recruiter_profile_by_user_id(current_user.id)
        if profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recruiter profile not found",
            )
        return profile

    def update_my_profile(
        self,
        current_user: User,
        payload: RecruiterProfileUpdate,
    ) -> RecruiterProfile:
        profile = self.get_my_profile(current_user)
        data = self._payload(payload, exclude_unset=True)
        if "company_id" in data and data["company_id"] is not None:
            self._get_company_or_404(data["company_id"])
        if (
            "is_verified" in data
            and current_user.role
            not in {UserRole.ADMIN.value, UserRole.SUPER_ADMIN.value}
        ):
            data.pop("is_verified")
        return self.recruiters.update_recruiter_profile(profile, data)

    def create_job(
        self,
        current_user: User,
        payload: JobPostingCreate,
    ) -> JobPosting:
        recruiter_profile = self._optional_recruiter_profile(current_user)
        company_id = self._resolve_job_company_id(
            current_user,
            recruiter_profile,
            payload.company_id,
        )
        self._get_company_or_404(company_id)
        return self.recruiters.create_job(
            {
                **self._payload(payload),
                "company_id": company_id,
                "recruiter_id": recruiter_profile.id if recruiter_profile else None,
            },
        )

    def list_jobs(
        self,
        *,
        company_id: int | None = None,
        status_filter: str | None = None,
    ) -> list[JobPosting]:
        return self.recruiters.list_jobs(
            company_id=company_id,
            status=status_filter,
        )

    def get_job(self, job_id: int) -> JobPosting:
        return self._get_job_or_404(job_id)

    def update_job(
        self,
        current_user: User,
        job_id: int,
        payload: JobPostingUpdate,
    ) -> JobPosting:
        job = self._get_job_or_404(job_id)
        self._authorize_job_write(current_user, job)
        data = self._payload(payload, exclude_unset=True)
        if "company_id" in data and data["company_id"] is not None:
            self._get_company_or_404(data["company_id"])
        return self.recruiters.update_job(job, data)

    def shortlist_candidate(
        self,
        current_user: User,
        job_id: int,
        payload: CandidateShortlistCreate,
    ) -> CandidateShortlist:
        job = self._get_job_or_404(job_id)
        self._authorize_job_write(current_user, job)
        if self.students.get_profile(payload.student_profile_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )
        if self.recruiters.get_shortlist(
            job_id=job_id,
            student_profile_id=payload.student_profile_id,
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Candidate is already shortlisted for this job",
            )
        recruiter_profile = self._optional_recruiter_profile(current_user)
        return self.recruiters.create_shortlist(
            {
                **self._payload(payload),
                "job_id": job_id,
                "recruiter_id": recruiter_profile.id if recruiter_profile else None,
            },
        )

    def list_shortlists(self, current_user: User, job_id: int) -> list[CandidateShortlist]:
        job = self._get_job_or_404(job_id)
        self._authorize_job_write(current_user, job)
        return self.recruiters.list_shortlists_for_job(job_id)

    def update_shortlist(
        self,
        current_user: User,
        shortlist_id: int,
        payload: CandidateShortlistUpdate,
    ) -> CandidateShortlist:
        shortlist = self.recruiters.get_shortlist_by_id(shortlist_id)
        if shortlist is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shortlist entry not found",
            )
        self._authorize_job_write(current_user, shortlist.job)
        return self.recruiters.update_shortlist(
            shortlist,
            self._payload(payload, exclude_unset=True),
        )

    def _resolve_registration_company(
        self,
        payload: RecruiterRegistrationRequest,
    ) -> int | None:
        if payload.company_id is not None:
            self._get_company_or_404(payload.company_id)
            return payload.company_id
        if payload.company is None:
            return None
        if self.recruiters.get_company_by_name(payload.company.name):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A company with this name already exists",
            )
        company = self.recruiters.create_company(self._payload(payload.company))
        return company.id

    def _resolve_job_company_id(
        self,
        current_user: User,
        recruiter_profile: RecruiterProfile | None,
        requested_company_id: int | None,
    ) -> int:
        if current_user.role in self._staff_roles():
            if requested_company_id is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="company_id is required for staff-created jobs",
                )
            return requested_company_id
        if recruiter_profile is None or recruiter_profile.company_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Recruiter profile must be linked to a company",
            )
        if requested_company_id and requested_company_id != recruiter_profile.company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Recruiters can only create jobs for their company",
            )
        return recruiter_profile.company_id

    def _optional_recruiter_profile(
        self,
        current_user: User,
    ) -> RecruiterProfile | None:
        if current_user.role == UserRole.RECRUITER.value:
            profile = self.recruiters.get_recruiter_profile_by_user_id(current_user.id)
            if profile is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Recruiter profile not found",
                )
            return profile
        if current_user.role in self._staff_roles():
            return None
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters and placement staff can manage jobs",
        )

    def _authorize_company_write(
        self,
        current_user: User,
        company: CompanyProfile,
    ) -> None:
        if current_user.role in self._staff_roles():
            return
        if current_user.role == UserRole.RECRUITER.value:
            profile = self.recruiters.get_recruiter_profile_by_user_id(current_user.id)
            if profile and profile.company_id == company.id:
                return
            if company.owner_user_id == current_user.id:
                return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    def _authorize_job_write(self, current_user: User, job: JobPosting) -> None:
        if current_user.role in self._staff_roles():
            return
        if current_user.role == UserRole.RECRUITER.value:
            profile = self.recruiters.get_recruiter_profile_by_user_id(current_user.id)
            if profile and (
                profile.id == job.recruiter_id or profile.company_id == job.company_id
            ):
                return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    def _require_recruiter_or_staff(self, current_user: User) -> None:
        if current_user.role == UserRole.RECRUITER.value:
            return
        if current_user.role in self._staff_roles():
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters and placement staff can manage companies",
        )

    def _get_company_or_404(self, company_id: int) -> CompanyProfile:
        company = self.recruiters.get_company(company_id)
        if company is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company profile not found",
            )
        return company

    def _get_job_or_404(self, job_id: int) -> JobPosting:
        job = self.recruiters.get_job(job_id)
        if job is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job posting not found",
            )
        return job

    @staticmethod
    def _staff_roles() -> set[str]:
        return {
            UserRole.PLACEMENT_OFFICER.value,
            UserRole.ADMIN.value,
            UserRole.SUPER_ADMIN.value,
        }

    @staticmethod
    def _payload(payload: Any, *, exclude_unset: bool = False) -> dict[str, Any]:
        return payload.model_dump(
            exclude_none=True,
            exclude_unset=exclude_unset,
            mode="json",
        )
