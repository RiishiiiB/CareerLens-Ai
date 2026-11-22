import json
import re

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
You are an experienced technical interviewer.

Evaluate the candidate's answer to the interview question below.

QUESTION:
{question}

CANDIDATE ANSWER:
{answer}

SCORING RULES:
- Give a single integer score from 0 to 10.
- 0 means the answer is irrelevant, empty, or fundamentally incorrect.
- 1-3 means the answer shows very limited understanding or contains major errors.
- 4-6 means the answer is partially correct but incomplete or unclear.
- 7-8 means the answer is correct and reasonably complete, with minor omissions.
- 9-10 means the answer is accurate, relevant, well-explained, and sufficiently complete.
- Judge the answer against the specific question, not against an ideal answer to a different question.
- Do not award points for length alone.
- Do not give full credit when important parts of the question are unanswered.
- Be fair to concise answers when they fully answer the question.
- Do not use a 0-100 score scale.

Return ONLY valid JSON in exactly this format:
{{
    "score": 0,
    "feedback": "Brief overall feedback",
    "strengths": [
        "Specific strength demonstrated in the answer"
    ],
    "improvements": [
        "Specific, actionable improvement"
    ]
}}
"""

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = (response.text or "").strip()

        # Remove a Markdown code fence if Gemini includes one.
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text).strip()

        # Extract the JSON object if any extra text surrounds it.
        if not text.startswith("{"):
            match = re.search(r"\{.*\}", text, re.DOTALL)
            if not match:
                raise ValueError("Gemini returned no valid JSON evaluation.")
            text = match.group(0)

        data = json.loads(text)

        raw_score = float(data.get("score", 0))

        # Normalize older 0-100 responses to the frontend's 0-10 scale.
        if raw_score > 10:
            raw_score = raw_score / 10

        score = max(0, min(10, round(raw_score)))

        return {
            "score": score,
            "feedback": str(data.get("feedback", "")).strip(),
            "strengths": data.get("strengths") or [],
            "improvements": data.get("improvements") or [],
        }