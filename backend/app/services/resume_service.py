from __future__ import annotations

import hashlib
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.enums import UserRole
from app.models.resume import Resume
from app.models.user import User
from app.repositories.resume_repository import ResumeRepository
from app.repositories.student_repository import StudentRepository


class ResumeService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.settings = get_settings()
        self.resumes = ResumeRepository(db)
        self.students = StudentRepository(db)

    async def upload_resume(
        self,
        current_user: User,
        file: UploadFile,
        *,
        is_primary: bool = True,
    ) -> Resume:
        if current_user.role != UserRole.STUDENT.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only student accounts can upload resumes",
            )

        original_filename = file.filename or "resume.pdf"
        content_type = file.content_type or "application/pdf"
        if not original_filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF resumes are supported",
            )
        if content_type not in {"application/pdf", "application/octet-stream"}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resume upload must be a PDF file",
            )

        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resume file is empty",
            )
        if len(file_bytes) > self.settings.max_resume_size_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Resume file exceeds the configured size limit",
            )

        profile = self.students.get_profile_by_user_id(current_user.id)
        existing_resumes = self.resumes.list_by_user(current_user.id)
        should_be_primary = is_primary or not existing_resumes
        if should_be_primary:
            self.resumes.clear_primary_for_user(current_user.id)

        user_dir = self.settings.upload_dir / str(current_user.id)
        user_dir.mkdir(parents=True, exist_ok=True)
        stored_filename = f"{uuid.uuid4().hex}.pdf"
        storage_path = user_dir / stored_filename
        storage_path.write_bytes(file_bytes)

        resume = self.resumes.create(
            {
                "user_id": current_user.id,
                "student_profile_id": profile.id if profile else None,
                "original_filename": original_filename,
                "stored_filename": stored_filename,
                "storage_path": str(storage_path),
                "content_type": "application/pdf",
                "file_size": len(file_bytes),
                "checksum_sha256": hashlib.sha256(file_bytes).hexdigest(),
                "is_primary": should_be_primary,
            },
        )
        if profile:
            from app.services.student_service import StudentService

            StudentService(self.db)._update_completion_score(profile.id)
        return resume

    def list_my_resumes(self, current_user: User) -> list[Resume]:
        return self.resumes.list_by_user(current_user.id)

    def get_resume(self, current_user: User, resume_id: int) -> Resume:
        resume = self.resumes.get(resume_id)
        if resume is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found",
            )
        self._authorize_resume_read(current_user, resume)
        return resume

    def get_resume_path(self, current_user: User, resume_id: int) -> Path:
        resume = self.get_resume(current_user, resume_id)
        path = Path(resume.storage_path)
        if not path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume file is missing from storage",
            )
        return path

    @staticmethod
    def _authorize_resume_read(current_user: User, resume: Resume) -> None:
        privileged_roles = {
            UserRole.RECRUITER.value,
            UserRole.PLACEMENT_OFFICER.value,
            UserRole.ADMIN.value,
            UserRole.SUPER_ADMIN.value,
        }
        if current_user.id == resume.user_id or current_user.role in privileged_roles:
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
