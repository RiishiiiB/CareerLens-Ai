from __future__ import annotations

from typing import Any, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.student import (
    StudentCertification,
    StudentEducation,
    StudentProfile,
    StudentProject,
    StudentSkill,
)


StudentChild = TypeVar(
    "StudentChild",
    StudentSkill,
    StudentEducation,
    StudentCertification,
    StudentProject,
)


class StudentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_profile(self, profile_id: int) -> StudentProfile | None:
        return self.db.scalar(
            select(StudentProfile)
            .where(StudentProfile.id == profile_id)
            .options(
                selectinload(StudentProfile.skills),
                selectinload(StudentProfile.education),
                selectinload(StudentProfile.certifications),
                selectinload(StudentProfile.projects),
            ),
        )

    def get_profile_by_user_id(self, user_id: int) -> StudentProfile | None:
        return self.db.scalar(
            select(StudentProfile)
            .where(StudentProfile.user_id == user_id)
            .options(
                selectinload(StudentProfile.skills),
                selectinload(StudentProfile.education),
                selectinload(StudentProfile.certifications),
                selectinload(StudentProfile.projects),
            ),
        )

    def list_profiles(self) -> list[StudentProfile]:
        return list(
            self.db.scalars(
                select(StudentProfile).options(selectinload(StudentProfile.skills)),
            ).all(),
        )

    def create_profile(
        self,
        *,
        user_id: int,
        data: dict[str, Any],
    ) -> StudentProfile:
        profile = StudentProfile(user_id=user_id, **data)
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def update_profile(
        self,
        profile: StudentProfile,
        data: dict[str, Any],
    ) -> StudentProfile:
        for field_name, value in data.items():
            setattr(profile, field_name, value)
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def delete_profile(self, profile: StudentProfile) -> None:
        self.db.delete(profile)
        self.db.commit()

    def create_child(
        self,
        model: type[StudentChild],
        *,
        profile_id: int,
        data: dict[str, Any],
    ) -> StudentChild:
        child = model(profile_id=profile_id, **data)
        self.db.add(child)
        self.db.commit()
        self.db.refresh(child)
        return child

    def get_child(
        self,
        model: type[StudentChild],
        child_id: int,
        profile_id: int,
    ) -> StudentChild | None:
        return self.db.scalar(
            select(model).where(
                model.id == child_id,
                model.profile_id == profile_id,
            ),
        )

    def update_child(
        self,
        child: StudentChild,
        data: dict[str, Any],
    ) -> StudentChild:
        for field_name, value in data.items():
            setattr(child, field_name, value)
        self.db.add(child)
        self.db.commit()
        self.db.refresh(child)
        return child

    def delete_child(self, child: StudentChild) -> None:
        self.db.delete(child)
        self.db.commit()
