from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ResumeResponse(BaseModel):
    id: int
    user_id: int
    student_profile_id: Optional[int] = None
    original_filename: str
    stored_filename: str
    content_type: str
    file_size: int
    checksum_sha256: str
    is_primary: bool
    uploaded_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
