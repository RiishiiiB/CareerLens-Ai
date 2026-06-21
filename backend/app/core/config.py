from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv


load_dotenv()


def _get_int(name: str, default: int) -> int:
    raw_value = os.getenv(name)
    if raw_value is None:
        return default
    try:
        return int(raw_value)
    except ValueError:
        return default


@dataclass(frozen=True)
class Settings:
    app_name: str
    environment: str
    database_url: str
    jwt_secret_key: str
    jwt_algorithm: str
    access_token_expire_minutes: int
    refresh_token_expire_days: int
    upload_dir: Path
    max_resume_size_bytes: int


@lru_cache
def get_settings() -> Settings:
    return Settings(
        app_name=os.getenv("APP_NAME", "CareerLens AI"),
        environment=os.getenv("ENVIRONMENT", "development"),
        database_url=os.getenv("DATABASE_URL", "sqlite:///./careerlens.db"),
        jwt_secret_key=os.getenv(
            "JWT_SECRET_KEY",
            "change-me-before-production",
        ),
        jwt_algorithm=os.getenv("JWT_ALGORITHM", "HS256"),
        access_token_expire_minutes=_get_int(
            "ACCESS_TOKEN_EXPIRE_MINUTES",
            30,
        ),
        refresh_token_expire_days=_get_int("REFRESH_TOKEN_EXPIRE_DAYS", 7),
        upload_dir=Path(
            os.getenv(
                "UPLOAD_DIR",
                str(Path(__file__).resolve().parents[2] / "storage" / "resumes"),
            ),
        ),
        max_resume_size_bytes=_get_int(
            "MAX_RESUME_SIZE_BYTES",
            5 * 1024 * 1024,
        ),
    )
