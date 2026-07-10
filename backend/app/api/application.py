from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services.application_service import ApplicationService
from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse,
)

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


@router.post(
    "/",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = current_user.student_profile

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found.",
        )

    return ApplicationService.create_application(
        db,
        profile.id,
        application,
    )


@router.get(
    "/",
    response_model=list[ApplicationResponse],
)
def get_all_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = current_user.student_profile

    return ApplicationService.get_all_applications(
        db,
        profile.id,
    )


@router.get(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = current_user.student_profile

    application = ApplicationService.get_application(
        db,
        application_id,
        profile.id,
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    return application


@router.put(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def update_application(
    application_id: int,
    updated_application: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = current_user.student_profile

    application = ApplicationService.get_application(
        db,
        application_id,
        profile.id,
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    return ApplicationService.update_application(
        db,
        application,
        updated_application,
    )


@router.delete(
    "/{application_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = current_user.student_profile

    application = ApplicationService.get_application(
        db,
        application_id,
        profile.id,
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    ApplicationService.delete_application(
        db,
        application,
    )