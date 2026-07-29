import json
import os

from dotenv import load_dotenv
from google import genai

load_dotenv()


class MockInterviewGeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY not found.")

        self.client = genai.Client(api_key=api_key)

    async def generate_mock_interview(
        self,
        role: str,
        difficulty: str,
    ):
        prompt = f"""
You are an expert technical interviewer.

Generate exactly 5 interview questions.

Role:
{role}

Difficulty:
{difficulty}

Return ONLY valid JSON.

Format:

{{
  "questions": [
    {{
      "id": 1,
      "question": "Question here"
    }},
    {{
      "id": 2,
      "question": "Question here"
    }},
    {{
      "id": 3,
      "question": "Question here"
    }},
    {{
      "id": 4,
      "question": "Question here"
    }},
    {{
      "id": 5,
      "question": "Question here"
    }}
  ]
}}

Rules:
- Generate exactly 5 questions.
- Questions must match the selected role.
- Questions must match the selected difficulty.
- Mix conceptual, practical and scenario-based questions.
- Do not provide answers.
- Do not provide explanations.
- Do not return markdown.
- Return ONLY valid JSON.
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