from __future__ import annotations

from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.enums import AIAnalysisType, UserRole
from app.models.recruiter import JobPosting
from app.models.resume import Resume
from app.models.student import StudentProfile
from app.models.user import User
from app.repositories.ai_repository import AIAnalysisRepository
from app.repositories.recruiter_repository import RecruiterRepository
from app.repositories.resume_repository import ResumeRepository
from app.repositories.student_repository import StudentRepository
from app.repositories.user_repository import UserRepository
from app.schemas.ai import (
    JobMatchScoreRequest,
    JobMatchScoreResponse,
    ResumeScoreRequest,
    ResumeScoreResponse,
    SkillGapRequest,
    SkillGapResponse,
    StudentRecommendationItem,
    StudentRecommendationRequest,
    StudentRecommendationResponse,
)


class AIService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.ai_analyses = AIAnalysisRepository(db)
        self.recruiters = RecruiterRepository(db)
        self.resumes = ResumeRepository(db)
        self.students = StudentRepository(db)
        self.users = UserRepository(db)

    def score_resume(
        self,
        current_user: User,
        payload: ResumeScoreRequest,
    ) -> ResumeScoreResponse:
        resume = self._get_resume_or_404(payload.resume_id)
        self._authorize_student_asset_read(current_user, resume.user_id)
        profile = self.students.get_profile_by_user_id(resume.user_id)
        score = 20
        strengths: list[str] = []
        improvements: list[str] = []

        if resume.is_primary:
            score += 10
            strengths.append("Primary resume is selected")
        else:
            improvements.append("Mark the strongest resume as primary")

        if resume.file_size > 0:
            score += 10
            strengths.append("Resume file is available and non-empty")

        if profile:
            if profile.education:
                score += 15
                strengths.append("Education details are available")
            else:
                improvements.append("Add education details")
            if profile.skills:
                skill_points = min(20, len(profile.skills) * 5)
                score += skill_points
                strengths.append(f"{len(profile.skills)} skills are listed")
            else:
                improvements.append("Add relevant technical and professional skills")
            if profile.projects:
                score += min(15, len(profile.projects) * 5)
                strengths.append("Project portfolio is present")
            else:
                improvements.append("Add projects with impact and tech stack")
            if profile.certifications:
                score += 10
                strengths.append("Certifications strengthen the profile")
            if profile.bio or profile.headline:
                score += 10
                strengths.append("Profile summary is present")
            else:
                improvements.append("Add a concise profile summary or headline")
        else:
            improvements.append("Create a student profile to improve resume scoring")

        result = ResumeScoreResponse(
            resume_id=resume.id,
            score=min(score, 100),
            strengths=strengths,
            improvements=improvements,
            signals={
                "file_size": resume.file_size,
                "is_primary": resume.is_primary,
                "has_profile": profile is not None,
            },
        )
        self._record(
            current_user,
            AIAnalysisType.RESUME_SCORE,
            "resume",
            resume.id,
            payload.model_dump(mode="json"),
            result.model_dump(mode="json"),
        )
        return result

    def analyze_skill_gap(
        self,
        current_user: User,
        payload: SkillGapRequest,
    ) -> SkillGapResponse:
        profile = self._resolve_profile(current_user, payload.student_profile_id)
        target_skills = self._resolve_target_skills(payload.job_id, payload.target_skills)
        if not target_skills:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Provide target_skills or job_id with required skills",
            )
        result = self._build_skill_gap(profile, target_skills)
        self._record(
            current_user,
            AIAnalysisType.SKILL_GAP,
            "student_profile",
            profile.id,
            payload.model_dump(mode="json"),
            result.model_dump(mode="json"),
        )
        return result

    def score_job_match(
        self,
        current_user: User,
        payload: JobMatchScoreRequest,
    ) -> JobMatchScoreResponse:
        job = self._get_job_or_404(payload.job_id)
        profile = self._resolve_profile(current_user, payload.student_profile_id)
        result = self._score_job_match(job, profile)
        self._record(
            current_user,
            AIAnalysisType.JOB_MATCH,
            "job_posting",
            job.id,
            payload.model_dump(mode="json"),
            result.model_dump(mode="json"),
        )
        return result

    def recommend_students(
        self,
        current_user: User,
        payload: StudentRecommendationRequest,
    ) -> StudentRecommendationResponse:
        self._require_recruiter_or_staff(current_user)
        job = self._get_job_or_404(payload.job_id)
        recommendations: list[StudentRecommendationItem] = []
        for profile in self.students.list_profiles():
            match = self._score_job_match(job, profile)
            if match.score <= 0:
                continue
            recommendations.append(
                StudentRecommendationItem(
                    student_profile_id=profile.id,
                    score=match.score,
                    matched_skills=match.matched_skills,
                    missing_skills=match.missing_skills,
                    reasons=match.reasons,
                ),
            )
        recommendations.sort(key=lambda item: item.score, reverse=True)
        result = StudentRecommendationResponse(
            job_id=job.id,
            recommendations=recommendations[: payload.limit],
        )
        self._record(
            current_user,
            AIAnalysisType.STUDENT_RECOMMENDATION,
            "job_posting",
            job.id,
            payload.model_dump(mode="json"),
            result.model_dump(mode="json"),
        )
        return result

    def _build_skill_gap(
        self,
        profile: StudentProfile,
        target_skills: list[str],
    ) -> SkillGapResponse:
        student_skills = self._skill_set(skill.name for skill in profile.skills)
        normalized_targets = self._skill_set(target_skills)
        matched = sorted(student_skills & normalized_targets)
        missing = sorted(normalized_targets - student_skills)
        additional = sorted(student_skills - normalized_targets)
        score = int((len(matched) / len(normalized_targets)) * 100)
        recommendations = [
            f"Prioritize {skill} through a project or certification"
            for skill in missing[:5]
        ]
        if not recommendations:
            recommendations.append("Maintain skill depth with recent project evidence")
        return SkillGapResponse(
            student_profile_id=profile.id,
            target_skills=sorted(normalized_targets),
            matched_skills=matched,
            missing_skills=missing,
            additional_skills=additional,
            match_score=score,
            recommendations=recommendations,
        )

    def _score_job_match(
        self,
        job: JobPosting,
        profile: StudentProfile,
    ) -> JobMatchScoreResponse:
        user = self.users.get_by_id(profile.user_id)
        required_skills = self._skill_set(job.required_skills or [])
        student_skills = self._skill_set(skill.name for skill in profile.skills)
        matched_skills = sorted(student_skills & required_skills)
        missing_skills = sorted(required_skills - student_skills)
        reasons: list[str] = []
        score = 0

        if required_skills:
            skill_score = int((len(matched_skills) / len(required_skills)) * 55)
            score += skill_score
            reasons.append(f"Skill alignment contributes {skill_score} points")
        else:
            score += 35
            reasons.append("Job has no explicit required skills")

        eligibility_passed = self._passes_job_eligibility(job, profile, user, reasons)
        if eligibility_passed:
            score += 25
            reasons.append("Eligibility criteria passed")
        else:
            score -= 20

        if profile.projects:
            project_score = min(10, len(profile.projects) * 5)
            score += project_score
            reasons.append(f"Projects contribute {project_score} points")
        if profile.certifications:
            score += 5
            reasons.append("Certifications contribute 5 points")
        if profile.profile_completion_score:
            completion_score = min(5, profile.profile_completion_score // 20)
            score += completion_score
            reasons.append(f"Profile completion contributes {completion_score} points")

        return JobMatchScoreResponse(
            job_id=job.id,
            student_profile_id=profile.id,
            score=max(0, min(score, 100)),
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            eligibility_passed=eligibility_passed,
            reasons=reasons,
        )

    def _passes_job_eligibility(
        self,
        job: JobPosting,
        profile: StudentProfile,
        user: User | None,
        reasons: list[str],
    ) -> bool:
        criteria = job.eligibility_criteria or {}
        min_cgpa = self._float_or_none(criteria.get("min_cgpa"))
        if min_cgpa is not None and (profile.cgpa is None or profile.cgpa < min_cgpa):
            reasons.append("CGPA does not meet job eligibility")
            return False
        departments = criteria.get("eligible_departments") or criteria.get("departments")
        if departments and user and user.department not in departments:
            reasons.append("Department does not meet job eligibility")
            return False
        years = criteria.get("eligible_graduation_years") or criteria.get(
            "graduation_years",
        )
        if years and user and user.graduation_year not in years:
            reasons.append("Graduation year does not meet job eligibility")
            return False
        return True

    def _resolve_profile(
        self,
        current_user: User,
        student_profile_id: int | None,
    ) -> StudentProfile:
        if student_profile_id is None:
            profile = self.students.get_profile_by_user_id(current_user.id)
        else:
            profile = self.students.get_profile(student_profile_id)
        if profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )
        self._authorize_profile_read(current_user, profile)
        return profile

    def _resolve_target_skills(
        self,
        job_id: int | None,
        target_skills: list[str],
    ) -> list[str]:
        if target_skills:
            return target_skills
        if job_id is None:
            return []
        job = self._get_job_or_404(job_id)
        return list(job.required_skills or [])

    def _get_resume_or_404(self, resume_id: int) -> Resume:
        resume = self.resumes.get(resume_id)
        if resume is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found",
            )
        return resume

    def _get_job_or_404(self, job_id: int) -> JobPosting:
        job = self.recruiters.get_job(job_id)
        if job is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job posting not found",
            )
        return job

    def _authorize_student_asset_read(self, current_user: User, user_id: int) -> None:
        if current_user.id == user_id or current_user.role in self._privileged_roles():
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    def _authorize_profile_read(
        self,
        current_user: User,
        profile: StudentProfile,
    ) -> None:
        if current_user.id == profile.user_id or current_user.role in self._privileged_roles():
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    def _require_recruiter_or_staff(self, current_user: User) -> None:
        if current_user.role in {
            UserRole.RECRUITER.value,
            UserRole.PLACEMENT_OFFICER.value,
            UserRole.ADMIN.value,
            UserRole.SUPER_ADMIN.value,
        }:
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters and placement staff can request recommendations",
        )

    def _record(
        self,
        current_user: User,
        analysis_type: AIAnalysisType,
        target_type: str,
        target_id: int,
        input_payload: dict[str, Any],
        result_payload: dict[str, Any],
    ) -> None:
        self.ai_analyses.create(
            {
                "user_id": current_user.id,
                "analysis_type": analysis_type.value,
                "target_type": target_type,
                "target_id": target_id,
                "input_payload": input_payload,
                "result_payload": result_payload,
            },
        )

    @staticmethod
    def _skill_set(skills: Any) -> set[str]:
        return {
            str(skill).strip().lower()
            for skill in skills
            if str(skill).strip()
        }

    @staticmethod
    def _float_or_none(value: Any) -> float | None:
        if value is None:
            return None
        try:
            return float(value)
        except (TypeError, ValueError):
            return None

    @staticmethod
    def _privileged_roles() -> set[str]:
        return {
            UserRole.RECRUITER.value,
            UserRole.PLACEMENT_OFFICER.value,
            UserRole.ADMIN.value,
            UserRole.SUPER_ADMIN.value,
        }
