from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.student import (
    StudentCertification,
    StudentEducation,
    StudentProfile,
    StudentProject,
    StudentSkill,
)
from app.models.user import User
from app.schemas.student import (
    StudentCertificationCreate,
    StudentCertificationResponse,
    StudentCertificationUpdate,
    StudentEducationCreate,
    StudentEducationResponse,
    StudentEducationUpdate,
    StudentProfileCreate,
    StudentProfileResponse,
    StudentProfileUpdate,
    StudentProjectCreate,
    StudentProjectResponse,
    StudentProjectUpdate,
    StudentSkillCreate,
    StudentSkillResponse,
    StudentSkillUpdate,
)
from app.services.student_service import StudentService


router = APIRouter(prefix="/students", tags=["Students"])


@router.post(
    "/profile",
    response_model=StudentProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_my_profile(
    payload: StudentProfileCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentProfile:
    return StudentService(db).create_profile(current_user, payload)


@router.get("/profile", response_model=StudentProfileResponse)
def get_my_profile(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentProfile:
    return StudentService(db).get_my_profile(current_user)


@router.patch("/profile", response_model=StudentProfileResponse)
def update_my_profile(
    payload: StudentProfileUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentProfile:
    return StudentService(db).update_my_profile(current_user, payload)


@router.delete("/profile", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_profile(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> None:
    StudentService(db).delete_my_profile(current_user)


@router.get("/profiles/{profile_id}", response_model=StudentProfileResponse)
def get_student_profile(
    profile_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentProfile:
    return StudentService(db).get_profile(current_user, profile_id)


@router.get("/profile/skills", response_model=list[StudentSkillResponse])
def list_my_skills(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentSkill]:
    return StudentService(db).get_my_profile(current_user).skills


@router.post(
    "/profile/skills",
    response_model=StudentSkillResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_skill(
    payload: StudentSkillCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentSkill:
    return StudentService(db).add_skill(current_user, payload)


@router.patch("/profile/skills/{skill_id}", response_model=StudentSkillResponse)
def update_skill(
    skill_id: int,
    payload: StudentSkillUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentSkill:
    return StudentService(db).update_skill(current_user, skill_id, payload)


@router.delete("/profile/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> None:
    StudentService(db).delete_skill(current_user, skill_id)


@router.get("/profile/education", response_model=list[StudentEducationResponse])
def list_my_education(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentEducation]:
    return StudentService(db).get_my_profile(current_user).education


@router.post(
    "/profile/education",
    response_model=StudentEducationResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_education(
    payload: StudentEducationCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentEducation:
    return StudentService(db).add_education(current_user, payload)


@router.patch(
    "/profile/education/{education_id}",
    response_model=StudentEducationResponse,
)
def update_education(
    education_id: int,
    payload: StudentEducationUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentEducation:
    return StudentService(db).update_education(current_user, education_id, payload)


@router.delete(
    "/profile/education/{education_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_education(
    education_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> None:
    StudentService(db).delete_education(current_user, education_id)


@router.get(
    "/profile/certifications",
    response_model=list[StudentCertificationResponse],
)
def list_my_certifications(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentCertification]:
    return StudentService(db).get_my_profile(current_user).certifications


@router.post(
    "/profile/certifications",
    response_model=StudentCertificationResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_certification(
    payload: StudentCertificationCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentCertification:
    return StudentService(db).add_certification(current_user, payload)


@router.patch(
    "/profile/certifications/{certification_id}",
    response_model=StudentCertificationResponse,
)
def update_certification(
    certification_id: int,
    payload: StudentCertificationUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentCertification:
    return StudentService(db).update_certification(
        current_user,
        certification_id,
        payload,
    )


@router.delete(
    "/profile/certifications/{certification_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_certification(
    certification_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> None:
    StudentService(db).delete_certification(current_user, certification_id)


@router.get("/profile/projects", response_model=list[StudentProjectResponse])
def list_my_projects(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentProject]:
    return StudentService(db).get_my_profile(current_user).projects


@router.post(
    "/profile/projects",
    response_model=StudentProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_project(
    payload: StudentProjectCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentProject:
    return StudentService(db).add_project(current_user, payload)


@router.patch("/profile/projects/{project_id}", response_model=StudentProjectResponse)
def update_project(
    project_id: int,
    payload: StudentProjectUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentProject:
    return StudentService(db).update_project(current_user, project_id, payload)


@router.delete(
    "/profile/projects/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project(
    project_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> None:
    StudentService(db).delete_project(current_user, project_id)
