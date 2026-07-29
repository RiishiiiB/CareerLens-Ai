from pydantic import BaseModel


class InterviewQuestion(BaseModel):
    id: int
    question: str


class MockInterviewGenerate(BaseModel):
    role: str
    difficulty: str


class MockInterviewResponse(BaseModel):
    id: int
    role: str
    difficulty: str
    questions: list[InterviewQuestion]

    class Config:
        from_attributes = True
class EvaluateAnswerRequest(BaseModel):
    question: str
    answer: str


class EvaluateAnswerResponse(BaseModel):
    score: int
    feedback: str
    strengths: list[str]
    improvements: list[str]


class InterviewSummaryRequest(BaseModel):
    role: str
    difficulty: str
    questions: list[str]
    answers: list[str]


class InterviewSummaryResponse(BaseModel):
    score: int
    strengths: list[str]
    improvements: list[str]
    recommendation: str