from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    student_profile_id = Column(
        Integer,
        ForeignKey("student_profiles.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    original_filename = Column(String, nullable=False)
    stored_filename = Column(String, nullable=False)
    storage_path = Column(String, nullable=False, unique=True)
    content_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    checksum_sha256 = Column(String, nullable=False, index=True)
    is_primary = Column(Boolean, nullable=False, default=False, server_default="false")
    parsed_text = Column(Text, nullable=True)
    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user = relationship("User", back_populates="resumes")
    student_profile = relationship("StudentProfile", back_populates="resumes")
