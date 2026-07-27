from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from google.genai.errors import ClientError
from sqlalchemy.orm import Session
from app.schemas.gemini import (
    ResumeAnalysisResponse,
    CareerRoadmapResponse,
    CompanyRecommendationResponse,
)
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

@router.post(
    "/analyze-resume/{resume_id}",
    response_model=ResumeAnalysisResponse,
)
def analyze_resume(
    resume_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> ResumeAnalysisResponse:
    return AIService(db).analyze_resume(
        current_user,
        resume_id,
    )
@router.post(
    "/career-roadmap/{role}",
    response_model=CareerRoadmapResponse,
)
async def generate_career_roadmap(role: str):
    from app.services.gemini_service import GeminiService

    try:
        return await GeminiService().generate_career_roadmap(role)

    except ClientError as e:
        if "RESOURCE_EXHAUSTED" in str(e):
            raise HTTPException(
                status_code=429,
                detail="AI quota exceeded. Please try again later."
            )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate career roadmap."
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while generating the roadmap."
        )
@router.post(
    "/company-recommendations/{role}",
    response_model=CompanyRecommendationResponse,
)
async def generate_company_recommendations(role: str):
    from app.services.gemini_service import GeminiService

    try:
        return await GeminiService().generate_company_recommendations(role)

    except ClientError as e:
        if "RESOURCE_EXHAUSTED" in str(e):
            raise HTTPException(
                status_code=429,
                detail="AI quota exceeded. Please try again later."
            )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate company recommendations."
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while generating recommendations."
        )