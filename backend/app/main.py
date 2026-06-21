from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.placement import router as placement_router
from app.api.recruiters import router as recruiters_router
from app.api.resumes import router as resumes_router
from app.api.students import router as students_router
from app.api.user import router as user_router

app = FastAPI(
    title="CareerLens AI",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(students_router)
app.include_router(resumes_router)
app.include_router(recruiters_router)
app.include_router(placement_router)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "CareerLens AI Backend Running"
    }
