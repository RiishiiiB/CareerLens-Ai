import json
import os

from dotenv import load_dotenv
from google import genai

from app.schemas.gemini import ResumeAnalysisResponse

load_dotenv()


class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY not found.")

        self.client = genai.Client(api_key=api_key)

    def analyze_resume(self, resume_text: str) -> ResumeAnalysisResponse:
        prompt = f"""
You are an expert ATS Resume Reviewer.

Analyze the following resume.

Return ONLY valid JSON.

Format:

{{
  "ats_score": 0,
  "strengths": [],
  "weaknesses": [],
  "missing_skills": [],
  "recommended_projects": [],
  "summary": "",
  "verdict": ""
}}

Resume:

{resume_text}
"""

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = response.text.strip()

        if text.startswith("```"):
            text = (
                text.replace("```json", "")
                .replace("```", "")
                .strip()
            )

        data = json.loads(text)

        score = int(data["ats_score"])

        if score >= 90:
            rating = "Excellent"
        elif score >= 75:
            rating = "Good"
        elif score >= 60:
            rating = "Average"
        else:
            rating = "Needs Improvement"

        return ResumeAnalysisResponse(
            ats_score=score,
            ats_rating=rating,
            strengths=data.get("strengths", []),
            weaknesses=data.get("weaknesses", []),
            missing_skills=data.get("missing_skills", []),
            recommended_projects=data.get(
                "recommended_projects", []
            ),
            summary=data.get("summary", ""),
            verdict=data.get("verdict", ""),
        )