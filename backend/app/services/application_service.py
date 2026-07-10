from sqlalchemy.orm import Session

from app.models.application import Application
from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
)


class ApplicationService:

    @staticmethod
    def create_application(
        db: Session,
        student_id: int,
        application: ApplicationCreate,
    ):
        db_application = Application(
            **application.model_dump(),
            student_id=student_id,
        )

        db.add(db_application)
        db.commit()
        db.refresh(db_application)

        return db_application

    @staticmethod
    def get_all_applications(
        db: Session,
        student_id: int,
    ):
        return (
            db.query(Application)
            .filter(Application.student_id == student_id)
            .order_by(Application.id.desc())
            .all()
        )

    @staticmethod
    def get_application(
        db: Session,
        application_id: int,
        student_id: int,
    ):
        return (
            db.query(Application)
            .filter(
                Application.id == application_id,
                Application.student_id == student_id,
            )
            .first()
        )

    @staticmethod
    def update_application(
        db: Session,
        db_application: Application,
        application: ApplicationUpdate,
    ):
        update_data = application.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(db_application, key, value)

        db.commit()
        db.refresh(db_application)

        return db_application

    @staticmethod
    def delete_application(
        db: Session,
        db_application: Application,
    ):
        db.delete(db_application)
        db.commit()