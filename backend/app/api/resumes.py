from __future__ import annotations

from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, File, Query, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeResponse
from app.services.resume_service import ResumeService


router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.post(
    "/upload",
    response_model=ResumeResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_resume(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    file: UploadFile = File(...),
    is_primary: bool = Query(default=True),
) -> Resume:
    return await ResumeService(db).upload_resume(
        current_user,
        file,
        is_primary=is_primary,
    )


@router.get("", response_model=list[ResumeResponse])
def list_my_resumes(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[Resume]:
    return ResumeService(db).list_my_resumes(current_user)


@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume_metadata(
    resume_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> Resume:
    return ResumeService(db).get_resume(current_user, resume_id)


@router.get("/{resume_id}/download", response_class=FileResponse)
def download_resume(
    resume_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> FileResponse:
    resume = ResumeService(db).get_resume(current_user, resume_id)
    resume_path: Path = ResumeService(db).get_resume_path(current_user, resume_id)
    return FileResponse(
        path=resume_path,
        filename=resume.original_filename,
        media_type="application/pdf",
    )
