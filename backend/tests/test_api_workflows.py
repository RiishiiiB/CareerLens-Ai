from __future__ import annotations

import os
from pathlib import Path
from typing import Any

BACKEND_DIR = Path(__file__).resolve().parents[1]

os.environ["DATABASE_URL"] = f"sqlite:///{BACKEND_DIR / 'test_api.db'}"
os.environ["JWT_SECRET_KEY"] = "test-secret"
os.environ["UPLOAD_DIR"] = str(BACKEND_DIR / ".test-storage")

from fastapi.testclient import TestClient

from app.db.base import Base
from app.db.database import engine
from app.main import app
from app.models import (  # noqa: F401
    AIAnalysis,
    CandidateShortlist,
    CompanyProfile,
    DriveApplication,
    JobPosting,
    PlacementDrive,
    RecruiterProfile,
    RefreshToken,
    Resume,
    StudentCertification,
    StudentEducation,
    StudentProfile,
    StudentProject,
    StudentSkill,
    User,
)


def setup_function() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def teardown_function() -> None:
    Base.metadata.drop_all(bind=engine)


def _token_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def _register_student(client: TestClient) -> tuple[dict[str, Any], str]:
    response = client.post(
        "/auth/register",
        json={
            "full_name": "Asha Raman",
            "email": "asha@example.com",
            "password": "StrongPass123",
            "role": "student",
            "registration_number": "CL-001",
            "college_name": "CareerLens University",
            "department": "Computer Science",
            "graduation_year": 2027,
        },
    )
    assert response.status_code == 201, response.text
    payload = response.json()
    return payload["user"], payload["tokens"]["access_token"]


def _create_student_profile(client: TestClient, token: str) -> dict[str, Any]:
    headers = _token_headers(token)
    response = client.post(
        "/students/profile",
        headers=headers,
        json={
            "headline": "Backend engineer",
            "bio": "Builds APIs and data products.",
            "location": "Bengaluru",
            "cgpa": 8.7,
        },
    )
    assert response.status_code == 201, response.text
    profile = response.json()

    skill_response = client.post(
        "/students/profile/skills",
        headers=headers,
        json={"name": "Python", "proficiency": "advanced", "years_experience": 2},
    )
    assert skill_response.status_code == 201, skill_response.text

    education_response = client.post(
        "/students/profile/education",
        headers=headers,
        json={
            "institution": "CareerLens University",
            "degree": "B.Tech",
            "field_of_study": "Computer Science",
            "start_year": 2023,
            "end_year": 2027,
        },
    )
    assert education_response.status_code == 201, education_response.text

    refreshed = client.get("/students/profile", headers=headers)
    assert refreshed.status_code == 200, refreshed.text
    assert refreshed.json()["profile_completion_score"] > profile["profile_completion_score"]
    return refreshed.json()


def _register_recruiter(client: TestClient) -> tuple[dict[str, Any], str]:
    response = client.post(
        "/recruiters/register",
        json={
            "full_name": "Nikhil Mehta",
            "email": "nikhil@example.com",
            "password": "StrongPass123",
            "designation": "Talent Partner",
            "company": {
                "name": "LensWorks",
                "industry": "SaaS",
                "location": "Remote",
            },
        },
    )
    assert response.status_code == 201, response.text
    payload = response.json()
    return payload["recruiter_profile"], payload["auth"]["tokens"]["access_token"]


def _register_placement_officer(client: TestClient) -> str:
    response = client.post(
        "/auth/register",
        json={
            "full_name": "Placement Officer",
            "email": "po@example.com",
            "password": "StrongPass123",
            "role": "placement_officer",
        },
    )
    assert response.status_code == 201, response.text
    return response.json()["tokens"]["access_token"]


def test_auth_student_recruiter_placement_and_ai_workflow() -> None:
    client = TestClient(app)
    student, student_token = _register_student(client)
    profile = _create_student_profile(client, student_token)

    recruiter_profile, recruiter_token = _register_recruiter(client)
    job_response = client.post(
        "/recruiters/jobs",
        headers=_token_headers(recruiter_token),
        json={
            "title": "Backend Intern",
            "description": "Build FastAPI services.",
            "employment_type": "internship",
            "required_skills": ["Python", "FastAPI"],
            "eligibility_criteria": {
                "min_cgpa": 7.5,
                "eligible_departments": ["Computer Science"],
                "eligible_graduation_years": [2027],
            },
        },
    )
    assert job_response.status_code == 201, job_response.text
    job = job_response.json()
    assert job["company_id"] == recruiter_profile["company_id"]

    match_response = client.post(
        "/ai/job-match-score",
        headers=_token_headers(student_token),
        json={"job_id": job["id"], "student_profile_id": profile["id"]},
    )
    assert match_response.status_code == 200, match_response.text
    match = match_response.json()
    assert match["student_profile_id"] == profile["id"]
    assert "python" in match["matched_skills"]
    assert "fastapi" in match["missing_skills"]

    placement_token = _register_placement_officer(client)
    drive_response = client.post(
        "/placement-drives",
        headers=_token_headers(placement_token),
        json={
            "company_id": recruiter_profile["company_id"],
            "job_posting_id": job["id"],
            "title": "LensWorks Campus Drive",
            "status": "open",
            "min_cgpa": 8.0,
            "eligible_departments": ["Computer Science"],
            "eligible_graduation_years": [2027],
            "required_skills": ["Python"],
        },
    )
    assert drive_response.status_code == 201, drive_response.text
    drive = drive_response.json()

    application_response = client.post(
        f"/placement-drives/{drive['id']}/register",
        headers=_token_headers(student_token),
        json={"notes": "Interested in backend roles."},
    )
    assert application_response.status_code == 201, application_response.text
    assert application_response.json()["status"] == "registered"
    assert student["id"] > 0
