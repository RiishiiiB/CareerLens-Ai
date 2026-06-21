from __future__ import annotations

from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.recruiter import (
    CandidateShortlist,
    CompanyProfile,
    JobPosting,
    RecruiterProfile,
)


class RecruiterRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_company(self, data: dict[str, Any]) -> CompanyProfile:
        company = CompanyProfile(**data)
        self.db.add(company)
        self.db.commit()
        self.db.refresh(company)
        return company

    def get_company(self, company_id: int) -> CompanyProfile | None:
        return self.db.get(CompanyProfile, company_id)

    def get_company_by_name(self, name: str) -> CompanyProfile | None:
        return self.db.scalar(
            select(CompanyProfile).where(CompanyProfile.name == name),
        )

    def list_companies(self) -> list[CompanyProfile]:
        return list(
            self.db.scalars(select(CompanyProfile).order_by(CompanyProfile.name)).all(),
        )

    def update_company(
        self,
        company: CompanyProfile,
        data: dict[str, Any],
    ) -> CompanyProfile:
        for field_name, value in data.items():
            setattr(company, field_name, value)
        self.db.add(company)
        self.db.commit()
        self.db.refresh(company)
        return company

    def create_recruiter_profile(self, data: dict[str, Any]) -> RecruiterProfile:
        profile = RecruiterProfile(**data)
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def get_recruiter_profile(self, profile_id: int) -> RecruiterProfile | None:
        return self.db.scalar(
            select(RecruiterProfile)
            .where(RecruiterProfile.id == profile_id)
            .options(selectinload(RecruiterProfile.company)),
        )

    def get_recruiter_profile_by_user_id(
        self,
        user_id: int,
    ) -> RecruiterProfile | None:
        return self.db.scalar(
            select(RecruiterProfile)
            .where(RecruiterProfile.user_id == user_id)
            .options(selectinload(RecruiterProfile.company)),
        )

    def update_recruiter_profile(
        self,
        profile: RecruiterProfile,
        data: dict[str, Any],
    ) -> RecruiterProfile:
        for field_name, value in data.items():
            setattr(profile, field_name, value)
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def create_job(self, data: dict[str, Any]) -> JobPosting:
        job = JobPosting(**data)
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job

    def get_job(self, job_id: int) -> JobPosting | None:
        return self.db.scalar(
            select(JobPosting)
            .where(JobPosting.id == job_id)
            .options(selectinload(JobPosting.company)),
        )

    def list_jobs(
        self,
        *,
        company_id: int | None = None,
        status: str | None = None,
    ) -> list[JobPosting]:
        query = select(JobPosting).options(selectinload(JobPosting.company))
        if company_id is not None:
            query = query.where(JobPosting.company_id == company_id)
        if status is not None:
            query = query.where(JobPosting.status == status)
        query = query.order_by(JobPosting.created_at.desc(), JobPosting.id.desc())
        return list(self.db.scalars(query).all())

    def update_job(self, job: JobPosting, data: dict[str, Any]) -> JobPosting:
        for field_name, value in data.items():
            setattr(job, field_name, value)
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job

    def create_shortlist(self, data: dict[str, Any]) -> CandidateShortlist:
        shortlist = CandidateShortlist(**data)
        self.db.add(shortlist)
        self.db.commit()
        self.db.refresh(shortlist)
        return shortlist

    def get_shortlist(
        self,
        *,
        job_id: int,
        student_profile_id: int,
    ) -> CandidateShortlist | None:
        return self.db.scalar(
            select(CandidateShortlist).where(
                CandidateShortlist.job_id == job_id,
                CandidateShortlist.student_profile_id == student_profile_id,
            ),
        )

    def get_shortlist_by_id(self, shortlist_id: int) -> CandidateShortlist | None:
        return self.db.scalar(
            select(CandidateShortlist)
            .where(CandidateShortlist.id == shortlist_id)
            .options(selectinload(CandidateShortlist.job)),
        )

    def list_shortlists_for_job(self, job_id: int) -> list[CandidateShortlist]:
        return list(
            self.db.scalars(
                select(CandidateShortlist)
                .where(CandidateShortlist.job_id == job_id)
                .order_by(CandidateShortlist.created_at.desc()),
            ).all(),
        )

    def update_shortlist(
        self,
        shortlist: CandidateShortlist,
        data: dict[str, Any],
    ) -> CandidateShortlist:
        for field_name, value in data.items():
            setattr(shortlist, field_name, value)
        self.db.add(shortlist)
        self.db.commit()
        self.db.refresh(shortlist)
        return shortlist
