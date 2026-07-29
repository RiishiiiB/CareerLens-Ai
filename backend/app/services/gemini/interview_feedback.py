import json

from google import genai

from app.core.config import get_settings


class InterviewFeedbackService:
    def __init__(self):
        settings = get_settings()

        self.client = genai.Client(
            api_key=settings.gemini_api_key,
        )

    async def evaluate_answer(
        self,
        question: str,
        answer: str,
    ):
        prompt = f"""
You are an experienced Technical Interviewer.

Evaluate the candidate's answer.

Question:
{question}

Candidate Answer:
{answer}

Return ONLY valid JSON in this format:

{{
    "score": 85,
    "feedback": "Overall feedback",
    "strengths": [
        "Strength 1",
        "Strength 2"
    ],
    "improvements": [
        "Improvement 1",
        "Improvement 2"
    ]
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

        return json.loads(text)