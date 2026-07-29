import json

from google import genai

from app.core.config import get_settings


class InterviewSummaryService:
    def __init__(self):
        settings = get_settings()

        self.client = genai.Client(
            api_key=settings.gemini_api_key,
        )

    async def generate_summary(
        self,
        role: str,
        difficulty: str,
        questions: list[str],
        answers: list[str],
    ):
        qa_pairs = ""

        for i, (question, answer) in enumerate(
            zip(questions, answers),
            start=1,
        ):
            qa_pairs += f"""
Question {i}
{question}

Answer
{answer}

"""

        prompt = f"""
You are an experienced Technical Interviewer.

Analyze the following interview.

Role:
{role}

Difficulty:
{difficulty}

Interview:

{qa_pairs}

Return ONLY valid JSON in the following format.

{{
    "score": 88,
    "strengths": [
        "Strength 1",
        "Strength 2"
    ],
    "improvements": [
        "Improvement 1",
        "Improvement 2"
    ],
    "recommendation": "Final recommendation."
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