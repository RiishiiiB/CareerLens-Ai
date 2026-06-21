from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.enums import JobStatus
from app.models.recruiter import (
    CandidateShortlist,
    CompanyProfile,
    JobPosting,
    RecruiterProfile,
)
from app.models.user import User
from app.schemas.recruiter import (
    CandidateShortlistCreate,
    CandidateShortlistResponse,
    CandidateShortlistUpdate,
    CompanyProfileCreate,
    CompanyProfileResponse,
    CompanyProfileUpdate,
    JobPostingCreate,
    JobPostingResponse,
    JobPostingUpdate,
    RecruiterProfileCreate,
    RecruiterProfileResponse,
    RecruiterProfileUpdate,
    RecruiterRegistrationRequest,
    RecruiterRegistrationResponse,
)
from app.services.recruiter_service import RecruiterService


router = APIRouter(prefix="/recruiters", tags=["Recruiters"])


@router.post(
    "/register",
    response_model=RecruiterRegistrationResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_recruiter(
    payload: RecruiterRegistrationRequest,
    db: Annotated[Session, Depends(get_db)],
) -> RecruiterRegistrationResponse:
    return RecruiterService(db).register_recruiter(payload)


@router.post(
    "/companies",
    response_model=CompanyProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_company(
    payload: CompanyProfileCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> CompanyProfile:
    return RecruiterService(db).create_company(current_user, payload)


@router.get("/companies", response_model=list[CompanyProfileResponse])
def list_companies(
    db: Annotated[Session, Depends(get_db)],
) -> list[CompanyProfile]:
    return RecruiterService(db).list_companies()


@router.get("/companies/{company_id}", response_model=CompanyProfileResponse)
def get_company(
    company_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> CompanyProfile:
    return RecruiterService(db).get_company(company_id)


@router.patch("/companies/{company_id}", response_model=CompanyProfileResponse)
def update_company(
    company_id: int,
    payload: CompanyProfileUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> CompanyProfile:
    return RecruiterService(db).update_company(current_user, company_id, payload)


@router.post(
    "/profile",
    response_model=RecruiterProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_my_recruiter_profile(
    payload: RecruiterProfileCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> RecruiterProfile:
    return RecruiterService(db).create_my_profile(current_user, payload)


@router.get("/profile", response_model=RecruiterProfileResponse)
def get_my_recruiter_profile(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> RecruiterProfile:
    return RecruiterService(db).get_my_profile(current_user)


@router.patch("/profile", response_model=RecruiterProfileResponse)
def update_my_recruiter_profile(
    payload: RecruiterProfileUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> RecruiterProfile:
    return RecruiterService(db).update_my_profile(current_user, payload)


@router.post(
    "/jobs",
    response_model=JobPostingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_job(
    payload: JobPostingCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> JobPosting:
    return RecruiterService(db).create_job(current_user, payload)


@router.get("/jobs", response_model=list[JobPostingResponse])
def list_jobs(
    db: Annotated[Session, Depends(get_db)],
    company_id: int | None = None,
    status_filter: JobStatus | None = Query(default=None, alias="status"),
) -> list[JobPosting]:
    return RecruiterService(db).list_jobs(
        company_id=company_id,
        status_filter=status_filter.value if status_filter else None,
    )


@router.get("/jobs/{job_id}", response_model=JobPostingResponse)
def get_job(
    job_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> JobPosting:
    return RecruiterService(db).get_job(job_id)


@router.patch("/jobs/{job_id}", response_model=JobPostingResponse)
def update_job(
    job_id: int,
    payload: JobPostingUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> JobPosting:
    return RecruiterService(db).update_job(current_user, job_id, payload)


@router.post(
    "/jobs/{job_id}/shortlists",
    response_model=CandidateShortlistResponse,
    status_code=status.HTTP_201_CREATED,
)
def shortlist_candidate(
    job_id: int,
    payload: CandidateShortlistCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> CandidateShortlist:
    return RecruiterService(db).shortlist_candidate(current_user, job_id, payload)


@router.get(
    "/jobs/{job_id}/shortlists",
    response_model=list[CandidateShortlistResponse],
)
def list_shortlists(
    job_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[CandidateShortlist]:
    return RecruiterService(db).list_shortlists(current_user, job_id)


@router.patch(
    "/shortlists/{shortlist_id}",
    response_model=CandidateShortlistResponse,
)
def update_shortlist(
    shortlist_id: int,
    payload: CandidateShortlistUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> CandidateShortlist:
    return RecruiterService(db).update_shortlist(
        current_user,
        shortlist_id,
        payload,
    )
