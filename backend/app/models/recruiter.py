from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base
from app.models.enums import EmploymentType, JobStatus, ShortlistStatus


class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    id = Column(Integer, primary_key=True, index=True)
    owner_user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    name = Column(String, nullable=False, unique=True, index=True)
    industry = Column(String, nullable=True)
    website_url = Column(String, nullable=True)
    location = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    company_size = Column(String, nullable=True)
    is_verified = Column(Boolean, nullable=False, default=False, server_default="false")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    recruiters = relationship("RecruiterProfile", back_populates="company")
    job_postings = relationship("JobPosting", back_populates="company")
    placement_drives = relationship("PlacementDrive", back_populates="company")


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    company_id = Column(
        Integer,
        ForeignKey("company_profiles.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    designation = Column(String, nullable=True)
    work_email = Column(String, nullable=True)
    is_verified = Column(Boolean, nullable=False, default=False, server_default="false")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    user = relationship("User", back_populates="recruiter_profile")
    company = relationship("CompanyProfile", back_populates="recruiters")
    job_postings = relationship("JobPosting", back_populates="recruiter")
    shortlists = relationship("CandidateShortlist", back_populates="recruiter")


class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(
        Integer,
        ForeignKey("company_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    recruiter_id = Column(
        Integer,
        ForeignKey("recruiter_profiles.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=True)
    employment_type = Column(
        String,
        nullable=False,
        default=EmploymentType.FULL_TIME.value,
        server_default=EmploymentType.FULL_TIME.value,
    )
    salary_min = Column(Float, nullable=True)
    salary_max = Column(Float, nullable=True)
    currency = Column(String, nullable=False, default="INR", server_default="INR")
    required_skills = Column(JSON, nullable=False, default=list)
    eligibility_criteria = Column(JSON, nullable=False, default=dict)
    status = Column(
        String,
        nullable=False,
        default=JobStatus.OPEN.value,
        server_default=JobStatus.OPEN.value,
        index=True,
    )
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    company = relationship("CompanyProfile", back_populates="job_postings")
    recruiter = relationship("RecruiterProfile", back_populates="job_postings")
    shortlists = relationship(
        "CandidateShortlist",
        back_populates="job",
        cascade="all, delete-orphan",
    )
    placement_drives = relationship("PlacementDrive", back_populates="job_posting")


class CandidateShortlist(Base):
    __tablename__ = "candidate_shortlists"
    __table_args__ = (
        UniqueConstraint(
            "job_id",
            "student_profile_id",
            name="uq_candidate_shortlist_job_student",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(
        Integer,
        ForeignKey("job_postings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    student_profile_id = Column(
        Integer,
        ForeignKey("student_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    recruiter_id = Column(
        Integer,
        ForeignKey("recruiter_profiles.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    status = Column(
        String,
        nullable=False,
        default=ShortlistStatus.SHORTLISTED.value,
        server_default=ShortlistStatus.SHORTLISTED.value,
    )
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    job = relationship("JobPosting", back_populates="shortlists")
    recruiter = relationship("RecruiterProfile", back_populates="shortlists")
    student_profile = relationship("StudentProfile")
