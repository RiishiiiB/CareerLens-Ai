from app.services.resume_parser import ResumeParser

text = ResumeParser.extract_text(
    "uploads/resumes/B.Maheshwara Singh's Resume.pdf"
)

print(text)