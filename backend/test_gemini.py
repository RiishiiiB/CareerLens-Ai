from app.services.gemini_service import GeminiService

service = GeminiService()

resume = """
Rishi B

Python Developer

Skills:
Python
FastAPI
React
SQL

Projects:
CareerLens AI
Community Emergency Response Network

Education:
B.Tech Computer Science
"""

result = service.analyze_resume(resume)

print(result)