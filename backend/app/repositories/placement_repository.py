from __future__ import annotations

from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.placement import DriveApplication, PlacementDrive


class PlacementRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_drive(self, data: dict[str, Any]) -> PlacementDrive:
        drive = PlacementDrive(**data)
        self.db.add(drive)
        self.db.commit()
        self.db.refresh(drive)
        return drive

    def get_drive(self, drive_id: int) -> PlacementDrive | None:
        return self.db.scalar(
            select(PlacementDrive)
            .where(PlacementDrive.id == drive_id)
            .options(
                selectinload(PlacementDrive.company),
                selectinload(PlacementDrive.job_posting),
            ),
        )

    def list_drives(self, *, status: str | None = None) -> list[PlacementDrive]:
        query = select(PlacementDrive).options(
            selectinload(PlacementDrive.company),
            selectinload(PlacementDrive.job_posting),
        )
        if status is not None:
            query = query.where(PlacementDrive.status == status)
        query = query.order_by(PlacementDrive.created_at.desc(), PlacementDrive.id.desc())
        return list(self.db.scalars(query).all())

    def update_drive(
        self,
        drive: PlacementDrive,
        data: dict[str, Any],
    ) -> PlacementDrive:
        for field_name, value in data.items():
            setattr(drive, field_name, value)
        self.db.add(drive)
        self.db.commit()
        self.db.refresh(drive)
        return drive

    def create_application(self, data: dict[str, Any]) -> DriveApplication:
        application = DriveApplication(**data)
        self.db.add(application)
        self.db.commit()
        self.db.refresh(application)
        return application

    def get_application(self, application_id: int) -> DriveApplication | None:
        return self.db.scalar(
            select(DriveApplication)
            .where(DriveApplication.id == application_id)
            .options(selectinload(DriveApplication.drive)),
        )

    def get_application_for_student(
        self,
        *,
        drive_id: int,
        student_profile_id: int,
    ) -> DriveApplication | None:
        return self.db.scalar(
            select(DriveApplication).where(
                DriveApplication.drive_id == drive_id,
                DriveApplication.student_profile_id == student_profile_id,
            ),
        )

    def list_applications_for_drive(self, drive_id: int) -> list[DriveApplication]:
        return list(
            self.db.scalars(
                select(DriveApplication)
                .where(DriveApplication.drive_id == drive_id)
                .order_by(DriveApplication.applied_at.desc()),
            ).all(),
        )

    def list_applications_for_student(
        self,
        student_profile_id: int,
    ) -> list[DriveApplication]:
        return list(
            self.db.scalars(
                select(DriveApplication)
                .where(DriveApplication.student_profile_id == student_profile_id)
                .order_by(DriveApplication.applied_at.desc()),
            ).all(),
        )

    def update_application(
        self,
        application: DriveApplication,
        data: dict[str, Any],
    ) -> DriveApplication:
        for field_name, value in data.items():
            setattr(application, field_name, value)
        self.db.add(application)
        self.db.commit()
        self.db.refresh(application)
        return application
