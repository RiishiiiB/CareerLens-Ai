from fastapi import FastAPI

app = FastAPI(
    title="CareerLens AI",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "CareerLens AI Backend Running"
    }