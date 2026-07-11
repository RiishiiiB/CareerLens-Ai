from sqlalchemy.orm import Session

from app.models.mock_interview import MockInterview


class MockInterviewService:

    @staticmethod
    def create_interview(
        db: Session,
        profile_id: int,
        role: str,
        difficulty: str,
        questions: str,
    ):
        interview = MockInterview(
            profile_id=profile_id,
            role=role,
            difficulty=difficulty,
            questions=questions,
        )

        db.add(interview)
        db.commit()
        db.refresh(interview)

        return interview

    @staticmethod
    def get_interviews(
        db: Session,
        profile_id: int,
    ):
        return (
            db.query(MockInterview)
            .filter(MockInterview.profile_id == profile_id)
            .order_by(MockInterview.id.desc())
            .all()
        )