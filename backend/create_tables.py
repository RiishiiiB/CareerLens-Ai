from app.db.base import Base
from app.db.database import engine

# Import all models here
from app.models import (
    RefreshToken,
    Resume,
    StudentCertification,
    StudentEducation,
    StudentProfile,
    StudentProject,
    StudentSkill,
    User,
)

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")
