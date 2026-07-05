from __future__ import annotations

from pathlib import Path
from typing import Any

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.models.resume import Resume


class ResumeRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, data: dict[str, Any]) -> Resume:
        resume = Resume(**data)
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)
        return resume

    def get(self, resume_id: int) -> Resume | None:
        return self.db.get(Resume, resume_id)

    def list_by_user(self, user_id: int) -> list[Resume]:
        return list(
            self.db.scalars(
                select(Resume)
                .where(Resume.user_id == user_id)
                .order_by(
                    Resume.uploaded_at.desc(),
                    Resume.id.desc(),
                )
            ).all()
        )

    def clear_primary_for_user(self, user_id: int) -> None:
        self.db.execute(
            update(Resume)
            .where(Resume.user_id == user_id)
            .values(is_primary=False)
        )
        self.db.commit()

    def get_primary_by_user(
        self,
        user_id: int,
    ) -> Resume | None:
        return self.db.scalar(
            select(Resume).where(
                Resume.user_id == user_id,
                Resume.is_primary.is_(True),
            )
        )

    def delete(self, resume: Resume) -> None:
        self.db.delete(resume)
        self.db.commit()

    def delete_file(self, resume: Resume) -> None:
        path = Path(resume.storage_path)

        if path.exists():
            path.unlink()