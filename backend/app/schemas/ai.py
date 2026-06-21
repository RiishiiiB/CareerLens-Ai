from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import AIAnalysisType


class ResumeScoreRequest(BaseModel):
    resume_id: int


class ResumeScoreResponse(BaseModel):
    resume_id: int
    score: int
    strengths: list[str] = Field(default_factory=list)
    improvements: list[str] = Field(default_factory=list)
    signals: dict[str, object] = Field(default_factory=dict)


class SkillGapRequest(BaseModel):
    student_profile_id: Optional[int] = None
    job_id: Optional[int] = None
    target_skills: list[str] = Field(default_factory=list)


class SkillGapResponse(BaseModel):
    student_profile_id: int
    target_skills: list[str]
    matched_skills: list[str]
    missing_skills: list[str]
    additional_skills: list[str]
    match_score: int
    recommendations: list[str] = Field(default_factory=list)


class JobMatchScoreRequest(BaseModel):
    job_id: int
    student_profile_id: Optional[int] = None


class JobMatchScoreResponse(BaseModel):
    job_id: int
    student_profile_id: int
    score: int
    matched_skills: list[str]
    missing_skills: list[str]
    eligibility_passed: bool
    reasons: list[str] = Field(default_factory=list)


class StudentRecommendationRequest(BaseModel):
    job_id: int
    limit: int = Field(default=10, ge=1, le=100)


class StudentRecommendationItem(BaseModel):
    student_profile_id: int
    score: int
    matched_skills: list[str]
    missing_skills: list[str]
    reasons: list[str] = Field(default_factory=list)


class StudentRecommendationResponse(BaseModel):
    job_id: int
    recommendations: list[StudentRecommendationItem]


class AIAnalysisResponse(BaseModel):
    id: int
    user_id: int
    analysis_type: AIAnalysisType
    target_type: Optional[str] = None
    target_id: Optional[int] = None
    input_payload: dict[str, object]
    result_payload: dict[str, object]
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
