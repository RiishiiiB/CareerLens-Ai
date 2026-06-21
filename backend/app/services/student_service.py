from __future__ import annotations

from typing import Any, TypeVar

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.enums import UserRole
from app.models.resume import Resume
from app.models.student import (
    StudentCertification,
    StudentEducation,
    StudentProfile,
    StudentProject,
    StudentSkill,
)
from app.models.user import User
from app.repositories.resume_repository import ResumeRepository
from app.repositories.student_repository import StudentRepository
from app.repositories.user_repository import UserRepository
from app.schemas.student import (
    StudentCertificationCreate,
    StudentCertificationUpdate,
    StudentEducationCreate,
    StudentEducationUpdate,
    StudentProfileCreate,
    StudentProfileUpdate,
    StudentProjectCreate,
    StudentProjectUpdate,
    StudentSkillCreate,
    StudentSkillUpdate,
)


StudentChild = TypeVar(
    "StudentChild",
    StudentSkill,
    StudentEducation,
    StudentCertification,
    StudentProject,
)


class StudentService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.students = StudentRepository(db)
        self.users = UserRepository(db)
        self.resumes = ResumeRepository(db)

    def create_profile(
        self,
        current_user: User,
        payload: StudentProfileCreate,
    ) -> StudentProfile:
        self._require_student(current_user)
        if self.students.get_profile_by_user_id(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Student profile already exists",
            )
        profile = self.students.create_profile(
            user_id=current_user.id,
            data=self._payload(payload),
        )
        return self._update_completion_score(profile.id)

    def get_my_profile(self, current_user: User) -> StudentProfile:
        profile = self.students.get_profile_by_user_id(current_user.id)
        if profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )
        return profile

    def get_profile(self, current_user: User, profile_id: int) -> StudentProfile:
        profile = self._get_profile_or_404(profile_id)
        self._authorize_profile_read(current_user, profile)
        return profile

    def update_my_profile(
        self,
        current_user: User,
        payload: StudentProfileUpdate,
    ) -> StudentProfile:
        profile = self.get_my_profile(current_user)
        data = self._payload(payload, exclude_unset=True)
        updated_profile = self.students.update_profile(profile, data)
        return self._update_completion_score(updated_profile.id)

    def delete_my_profile(self, current_user: User) -> None:
        profile = self.get_my_profile(current_user)
        self.students.delete_profile(profile)

    def add_skill(
        self,
        current_user: User,
        payload: StudentSkillCreate,
    ) -> StudentSkill:
        profile = self.get_my_profile(current_user)
        skill = self.students.create_child(
            StudentSkill,
            profile_id=profile.id,
            data=self._payload(payload),
        )
        self._update_completion_score(profile.id)
        return skill

    def update_skill(
        self,
        current_user: User,
        skill_id: int,
        payload: StudentSkillUpdate,
    ) -> StudentSkill:
        profile = self.get_my_profile(current_user)
        skill = self._get_child_or_404(StudentSkill, skill_id, profile.id)
        updated_skill = self.students.update_child(
            skill,
            self._payload(payload, exclude_unset=True),
        )
        self._update_completion_score(profile.id)
        return updated_skill

    def delete_skill(self, current_user: User, skill_id: int) -> None:
        profile = self.get_my_profile(current_user)
        skill = self._get_child_or_404(StudentSkill, skill_id, profile.id)
        self.students.delete_child(skill)
        self._update_completion_score(profile.id)

    def add_education(
        self,
        current_user: User,
        payload: StudentEducationCreate,
    ) -> StudentEducation:
        profile = self.get_my_profile(current_user)
        education = self.students.create_child(
            StudentEducation,
            profile_id=profile.id,
            data=self._payload(payload),
        )
        self._update_completion_score(profile.id)
        return education

    def update_education(
        self,
        current_user: User,
        education_id: int,
        payload: StudentEducationUpdate,
    ) -> StudentEducation:
        profile = self.get_my_profile(current_user)
        education = self._get_child_or_404(
            StudentEducation,
            education_id,
            profile.id,
        )
        updated_education = self.students.update_child(
            education,
            self._payload(payload, exclude_unset=True),
        )
        self._update_completion_score(profile.id)
        return updated_education

    def delete_education(self, current_user: User, education_id: int) -> None:
        profile = self.get_my_profile(current_user)
        education = self._get_child_or_404(
            StudentEducation,
            education_id,
            profile.id,
        )
        self.students.delete_child(education)
        self._update_completion_score(profile.id)

    def add_certification(
        self,
        current_user: User,
        payload: StudentCertificationCreate,
    ) -> StudentCertification:
        profile = self.get_my_profile(current_user)
        certification = self.students.create_child(
            StudentCertification,
            profile_id=profile.id,
            data=self._payload(payload),
        )
        self._update_completion_score(profile.id)
        return certification

    def update_certification(
        self,
        current_user: User,
        certification_id: int,
        payload: StudentCertificationUpdate,
    ) -> StudentCertification:
        profile = self.get_my_profile(current_user)
        certification = self._get_child_or_404(
            StudentCertification,
            certification_id,
            profile.id,
        )
        updated_certification = self.students.update_child(
            certification,
            self._payload(payload, exclude_unset=True),
        )
        self._update_completion_score(profile.id)
        return updated_certification

    def delete_certification(
        self,
        current_user: User,
        certification_id: int,
    ) -> None:
        profile = self.get_my_profile(current_user)
        certification = self._get_child_or_404(
            StudentCertification,
            certification_id,
            profile.id,
        )
        self.students.delete_child(certification)
        self._update_completion_score(profile.id)

    def add_project(
        self,
        current_user: User,
        payload: StudentProjectCreate,
    ) -> StudentProject:
        profile = self.get_my_profile(current_user)
        project = self.students.create_child(
            StudentProject,
            profile_id=profile.id,
            data=self._payload(payload),
        )
        self._update_completion_score(profile.id)
        return project

    def update_project(
        self,
        current_user: User,
        project_id: int,
        payload: StudentProjectUpdate,
    ) -> StudentProject:
        profile = self.get_my_profile(current_user)
        project = self._get_child_or_404(StudentProject, project_id, profile.id)
        updated_project = self.students.update_child(
            project,
            self._payload(payload, exclude_unset=True),
        )
        self._update_completion_score(profile.id)
        return updated_project

    def delete_project(self, current_user: User, project_id: int) -> None:
        profile = self.get_my_profile(current_user)
        project = self._get_child_or_404(StudentProject, project_id, profile.id)
        self.students.delete_child(project)
        self._update_completion_score(profile.id)

    def _update_completion_score(self, profile_id: int) -> StudentProfile:
        profile = self._get_profile_or_404(profile_id)
        profile.profile_completion_score = self._calculate_completion_score(profile)
        self.db.add(profile)
        self.db.commit()
        refreshed_profile = self.students.get_profile(profile_id)
        if refreshed_profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )
        return refreshed_profile

    def _calculate_completion_score(self, profile: StudentProfile) -> int:
        user = self.users.get_by_id(profile.user_id)
        resumes = self.resumes.list_by_user(profile.user_id)
        score = 0
        if user and all([user.full_name, user.email, user.department]):
            score += 15
        if user and user.graduation_year:
            score += 5
        if any([profile.headline, profile.bio]) and profile.location:
            score += 15
        if profile.cgpa is not None or profile.portfolio_url:
            score += 5
        if profile.skills:
            score += min(20, 5 + len(profile.skills) * 5)
        if profile.education:
            score += 15
        if profile.certifications:
            score += 10
        if profile.projects:
            score += min(15, 5 + len(profile.projects) * 5)
        if resumes:
            score += 15 if any(resume.is_primary for resume in resumes) else 10
        return min(score, 100)

    def _get_profile_or_404(self, profile_id: int) -> StudentProfile:
        profile = self.students.get_profile(profile_id)
        if profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )
        return profile

    def _get_child_or_404(
        self,
        model: type[StudentChild],
        child_id: int,
        profile_id: int,
    ) -> StudentChild:
        child = self.students.get_child(model, child_id, profile_id)
        if child is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile item not found",
            )
        return child

    def _require_student(self, current_user: User) -> None:
        if current_user.role != UserRole.STUDENT.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only student accounts can manage student profiles",
            )

    def _authorize_profile_read(self, current_user: User, profile: StudentProfile) -> None:
        privileged_roles = {
            UserRole.RECRUITER.value,
            UserRole.PLACEMENT_OFFICER.value,
            UserRole.ADMIN.value,
            UserRole.SUPER_ADMIN.value,
        }
        if current_user.id == profile.user_id or current_user.role in privileged_roles:
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    @staticmethod
    def _payload(
        payload: Any,
        *,
        exclude_unset: bool = False,
    ) -> dict[str, Any]:
        return payload.model_dump(
            exclude_unset=exclude_unset,
            exclude_none=True,
            mode="json",
        )
