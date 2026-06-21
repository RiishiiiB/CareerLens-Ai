from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.enums import DriveStatus
from app.models.placement import DriveApplication, PlacementDrive
from app.models.user import User
from app.schemas.placement import (
    DriveApplicationCreate,
    DriveApplicationResponse,
    DriveApplicationStatusUpdate,
    PlacementDriveCreate,
    PlacementDriveResponse,
    PlacementDriveUpdate,
)
from app.services.placement_service import PlacementService


router = APIRouter(prefix="/placement-drives", tags=["Placement Drives"])


@router.post(
    "",
    response_model=PlacementDriveResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_drive(
    payload: PlacementDriveCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> PlacementDrive:
    return PlacementService(db).create_drive(current_user, payload)


@router.get("", response_model=list[PlacementDriveResponse])
def list_drives(
    db: Annotated[Session, Depends(get_db)],
    status_filter: DriveStatus | None = Query(default=None, alias="status"),
) -> list[PlacementDrive]:
    return PlacementService(db).list_drives(
        status_filter=status_filter.value if status_filter else None,
    )


@router.get("/applications/me", response_model=list[DriveApplicationResponse])
def list_my_applications(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[DriveApplication]:
    return PlacementService(db).list_my_applications(current_user)


@router.get("/{drive_id}", response_model=PlacementDriveResponse)
def get_drive(
    drive_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> PlacementDrive:
    return PlacementService(db).get_drive(drive_id)


@router.patch("/{drive_id}", response_model=PlacementDriveResponse)
def update_drive(
    drive_id: int,
    payload: PlacementDriveUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> PlacementDrive:
    return PlacementService(db).update_drive(current_user, drive_id, payload)


@router.post(
    "/{drive_id}/register",
    response_model=DriveApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_for_drive(
    drive_id: int,
    payload: DriveApplicationCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> DriveApplication:
    return PlacementService(db).register_for_drive(current_user, drive_id, payload)


@router.get(
    "/{drive_id}/applications",
    response_model=list[DriveApplicationResponse],
)
def list_applications_for_drive(
    drive_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[DriveApplication]:
    return PlacementService(db).list_applications_for_drive(current_user, drive_id)


@router.patch(
    "/applications/{application_id}/status",
    response_model=DriveApplicationResponse,
)
def update_application_status(
    application_id: int,
    payload: DriveApplicationStatusUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> DriveApplication:
    return PlacementService(db).update_application_status(
        current_user,
        application_id,
        payload,
    )
