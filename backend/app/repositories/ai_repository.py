from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.models.ai import AIAnalysis


class AIAnalysisRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, data: dict[str, Any]) -> AIAnalysis:
        analysis = AIAnalysis(**data)
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        return analysis
