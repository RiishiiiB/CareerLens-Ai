from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.ai import (
    JobMatchScoreRequest,
    JobMatchScoreResponse,
    ResumeScoreRequest,
    ResumeScoreResponse,
    SkillGapRequest,
    SkillGapResponse,
    StudentRecommendationRequest,
    StudentRecommendationResponse,
)
from app.services.ai_service import AIService


router = APIRouter(prefix="/ai", tags=["AI Features"])


@router.post("/resume-score", response_model=ResumeScoreResponse)
def score_resume(
    payload: ResumeScoreRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> ResumeScoreResponse:
    return AIService(db).score_resume(current_user, payload)


@router.post("/skill-gap", response_model=SkillGapResponse)
def analyze_skill_gap(
    payload: SkillGapRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> SkillGapResponse:
    return AIService(db).analyze_skill_gap(current_user, payload)


@router.post("/job-match-score", response_model=JobMatchScoreResponse)
def score_job_match(
    payload: JobMatchScoreRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> JobMatchScoreResponse:
    return AIService(db).score_job_match(current_user, payload)


@router.post(
    "/student-recommendations",
    response_model=StudentRecommendationResponse,
)
def recommend_students(
    payload: StudentRecommendationRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentRecommendationResponse:
    return AIService(db).recommend_students(current_user, payload)
