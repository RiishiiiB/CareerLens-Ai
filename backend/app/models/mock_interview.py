from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base


class MockInterview(Base):
    __tablename__ = "mock_interviews"

    id = Column(Integer, primary_key=True, index=True)

    role = Column(String, nullable=False)

    difficulty = Column(String, nullable=False)

    questions = Column(Text, nullable=False)

    profile_id = Column(
        Integer,
        ForeignKey("student_profiles.id", ondelete="CASCADE"),
        nullable=False,
    )

    profile = relationship(
        "StudentProfile",
        back_populates="mock_interviews",
    )