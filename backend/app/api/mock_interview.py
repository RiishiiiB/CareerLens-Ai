from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.mock_interview import (
    MockInterviewGenerate,
    MockInterviewResponse,
)
from app.services.mock_interview_service import (
    MockInterviewService,
)

router = APIRouter(
    prefix="/mock-interview",
    tags=["Mock Interview"],
)


@router.post(
    "/generate",
    response_model=MockInterviewResponse,
)
def generate_interview(
    request: MockInterviewGenerate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = current_user.student_profile

    questions = f"""
1. Tell me about yourself.

2. Why do you want to become a {request.role}?

3. Explain one project you've worked on.

4. What are your strengths?

5. Where do you see yourself in five years?
"""

    return MockInterviewService.create_interview(
        db,
        profile.id,
        request.role,
        request.difficulty,
        questions,
    )


@router.get(
    "/",
    response_model=list[MockInterviewResponse],
)
def get_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = current_user.student_profile

    return MockInterviewService.get_interviews(
        db,
        profile.id,
    )