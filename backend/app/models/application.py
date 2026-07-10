from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    company_name = Column(String, nullable=False)

    role = Column(String, nullable=False)

    location = Column(String, nullable=True)

    package = Column(String, nullable=True)

    status = Column(
        String,
        nullable=False,
        default="Applied",
    )

    applied_date = Column(Date, nullable=True)

    notes = Column(Text, nullable=True)

    student_id = Column(
        Integer,
        ForeignKey("student_profiles.id", ondelete="CASCADE"),
        nullable=False,
    )

    student = relationship(
        "StudentProfile",
        back_populates="applications",
    )