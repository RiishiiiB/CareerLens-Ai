from app.db.base import Base
from app.db.database import engine

# Import all models here
from app.models.user import User

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")