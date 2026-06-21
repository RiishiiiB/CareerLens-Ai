from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    analysis_type = Column(String, nullable=False, index=True)
    target_type = Column(String, nullable=True)
    target_id = Column(Integer, nullable=True, index=True)
    input_payload = Column(JSON, nullable=False, default=dict)
    result_payload = Column(JSON, nullable=False, default=dict)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user = relationship("User", back_populates="ai_analyses")
