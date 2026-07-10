import json
import os

from dotenv import load_dotenv
from google import genai

from app.schemas.gemini import (
    ResumeAnalysisResponse,
    CareerRoadmapResponse,
    CompanyRecommendationResponse,
)

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

    async def generate_career_roadmap(self, role: str) -> CareerRoadmapResponse:
        prompt = f"""
You are an expert career mentor.

Generate a structured 3-month learning roadmap for becoming a {role}.

Return ONLY valid JSON.

Format:

{{
    "role": "{role}",
    "duration": "3 Months",
    "months": [
        {{
            "month": "Month 1",
            "focus": "",
            "tasks": []
        }},
        {{
            "month": "Month 2",
            "focus": "",
            "tasks": []
        }},
        {{
            "month": "Month 3",
            "focus": "",
            "tasks": []
        }}
    ],
    "summary": ""
}}
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

        return CareerRoadmapResponse(**data)

    async def generate_company_recommendations(self, role: str) -> CompanyRecommendationResponse:
        prompt = f"""
You are an expert career advisor.

Recommend the best companies for a {role}.

Return ONLY valid JSON.

Format:

{{
  "role": "{role}",
  "companies": [
    {{
      "company": "",
      "package": "",
      "hiring": "",
      "required_skills": [],
      "reason": "",
      "career_url": ""
    }}
  ]
}}

Requirements:

- Recommend exactly 8 companies.
- Prefer globally recognized companies and top Indian companies.
- Mention realistic average fresher package.
- Hiring should be either "Yes", "Likely", or "Limited".
- career_url must be the official careers page.
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

        return CompanyRecommendationResponse(**data)
