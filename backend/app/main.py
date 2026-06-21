from fastapi import FastAPI

from app.api.user import router as user_router

app = FastAPI(
    title="CareerLens AI",
    version="1.0.0"
)

app.include_router(user_router)


@app.get("/")
def root():
    return {
        "message": "CareerLens AI Backend Running"
    }