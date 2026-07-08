from pydantic import BaseModel, Field


class ResumeAnalysisResponse(BaseModel):
    ats_score: int = Field(..., ge=0, le=100)
    ats_rating: str

    strengths: list[str]
    weaknesses: list[str]
    missing_skills: list[str]
    recommended_projects: list[str]

    summary: str
    verdict: str