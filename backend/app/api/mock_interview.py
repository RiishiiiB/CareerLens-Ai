from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.gemini.mock_interview import MockInterviewGeminiService
from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.mock_interview import (
    MockInterviewGenerate,
    MockInterviewResponse,
    EvaluateAnswerRequest,
    EvaluateAnswerResponse,
    InterviewSummaryRequest,
    InterviewSummaryResponse,
)
from app.services.mock_interview_service import (
    MockInterviewService,
)
from app.services.gemini.interview_feedback import (
    InterviewFeedbackService,
)
from app.services.gemini.interview_summary import (
    InterviewSummaryService,
)
router = APIRouter(
    prefix="/mock-interview",
    tags=["Mock Interview"],
)


@router.post(
    "/generate",
    response_model=MockInterviewResponse,
)
async def generate_interview(
    request: MockInterviewGenerate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = current_user.student_profile

    gemini = MockInterviewGeminiService()

    result = await gemini.generate_mock_interview(
        request.role,
        request.difficulty,
    )

    questions = result["questions"]

    return MockInterviewService.create_interview(
        db,
        profile.id,
        request.role,
        request.difficulty,
        questions,
    )
@router.post(
    "/evaluate",
    response_model=EvaluateAnswerResponse,
)
async def evaluate_answer(
    request: EvaluateAnswerRequest,
):
    service = InterviewFeedbackService()

    result = await service.evaluate_answer(
        request.question,
        request.answer,
    )

    return result
@router.post(
    "/summary",
    response_model=InterviewSummaryResponse,
)
async def interview_summary(
    request: InterviewSummaryRequest,
):
    service = InterviewSummaryService()

    result = await service.generate_summary(
        role=request.role,
        difficulty=request.difficulty,
        questions=request.questions,
        answers=request.answers,
    )

    return result
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