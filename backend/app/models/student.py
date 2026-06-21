from sqlalchemy import (
    JSON,
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base
from app.models.enums import SkillProficiency


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    headline = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    location = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    cgpa = Column(Float, nullable=True)
    profile_completion_score = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    user = relationship("User", back_populates="student_profile")
    skills = relationship(
        "StudentSkill",
        back_populates="profile",
        cascade="all, delete-orphan",
    )
    education = relationship(
        "StudentEducation",
        back_populates="profile",
        cascade="all, delete-orphan",
    )
    certifications = relationship(
        "StudentCertification",
        back_populates="profile",
        cascade="all, delete-orphan",
    )
    projects = relationship(
        "StudentProject",
        back_populates="profile",
        cascade="all, delete-orphan",
    )
    resumes = relationship("Resume", back_populates="student_profile")


class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(
        Integer,
        ForeignKey("student_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String, nullable=False, index=True)
    proficiency = Column(
        String,
        nullable=False,
        default=SkillProficiency.INTERMEDIATE.value,
        server_default=SkillProficiency.INTERMEDIATE.value,
    )
    years_experience = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    profile = relationship("StudentProfile", back_populates="skills")


class StudentEducation(Base):
    __tablename__ = "student_education"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(
        Integer,
        ForeignKey("student_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    institution = Column(String, nullable=False)
    degree = Column(String, nullable=False)
    field_of_study = Column(String, nullable=True)
    start_year = Column(Integer, nullable=True)
    end_year = Column(Integer, nullable=True)
    grade = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    profile = relationship("StudentProfile", back_populates="education")


class StudentCertification(Base):
    __tablename__ = "student_certifications"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(
        Integer,
        ForeignKey("student_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String, nullable=False)
    issuing_organization = Column(String, nullable=False)
    issue_date = Column(Date, nullable=True)
    expiry_date = Column(Date, nullable=True)
    credential_url = Column(String, nullable=True)

    profile = relationship("StudentProfile", back_populates="certifications")


class StudentProject(Base):
    __tablename__ = "student_projects"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(
        Integer,
        ForeignKey("student_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    tech_stack = Column(JSON, nullable=False, default=list)
    project_url = Column(String, nullable=True)
    repository_url = Column(String, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    profile = relationship("StudentProfile", back_populates="projects")
