from sqlalchemy import (
    JSON,
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
from app.models.enums import ApplicationStatus, DriveStatus


class PlacementDrive(Base):
    __tablename__ = "placement_drives"

    id = Column(Integer, primary_key=True, index=True)
    created_by_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    company_id = Column(
        Integer,
        ForeignKey("company_profiles.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    job_posting_id = Column(
        Integer,
        ForeignKey("job_postings.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    starts_at = Column(DateTime(timezone=True), nullable=True)
    ends_at = Column(DateTime(timezone=True), nullable=True)
    registration_deadline = Column(DateTime(timezone=True), nullable=True)
    min_cgpa = Column(Float, nullable=True)
    eligible_departments = Column(JSON, nullable=False, default=list)
    eligible_graduation_years = Column(JSON, nullable=False, default=list)
    required_skills = Column(JSON, nullable=False, default=list)
    eligibility_notes = Column(Text, nullable=True)
    status = Column(
        String,
        nullable=False,
        default=DriveStatus.DRAFT.value,
        server_default=DriveStatus.DRAFT.value,
        index=True,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    created_by = relationship("User", back_populates="created_drives")
    company = relationship("CompanyProfile", back_populates="placement_drives")
    job_posting = relationship("JobPosting", back_populates="placement_drives")
    applications = relationship(
        "DriveApplication",
        back_populates="drive",
        cascade="all, delete-orphan",
    )


class DriveApplication(Base):
    __tablename__ = "drive_applications"
    __table_args__ = (
        UniqueConstraint(
            "drive_id",
            "student_profile_id",
            name="uq_drive_application_drive_student",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    drive_id = Column(
        Integer,
        ForeignKey("placement_drives.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    student_profile_id = Column(
        Integer,
        ForeignKey("student_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    status = Column(
        String,
        nullable=False,
        default=ApplicationStatus.REGISTERED.value,
        server_default=ApplicationStatus.REGISTERED.value,
        index=True,
    )
    resume_id = Column(
        Integer,
        ForeignKey("resumes.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    notes = Column(Text, nullable=True)
    status_reason = Column(Text, nullable=True)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    drive = relationship("PlacementDrive", back_populates="applications")
    student_profile = relationship("StudentProfile")
    resume = relationship("Resume")
