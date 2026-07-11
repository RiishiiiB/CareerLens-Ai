from pydantic import BaseModel


class MockInterviewGenerate(BaseModel):
    role: str
    difficulty: str


class MockInterviewResponse(BaseModel):
    id: int
    role: str
    difficulty: str
    questions: str

    class Config:
        from_attributes = True