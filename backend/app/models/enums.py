from enum import Enum


class UserRole(str, Enum):
    STUDENT = "student"
    RECRUITER = "recruiter"
    PLACEMENT_OFFICER = "placement_officer"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class TokenType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"


class SkillProficiency(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class EmploymentType(str, Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    INTERNSHIP = "internship"
    CONTRACT = "contract"


class JobStatus(str, Enum):
    DRAFT = "draft"
    OPEN = "open"
    CLOSED = "closed"


class ShortlistStatus(str, Enum):
    SHORTLISTED = "shortlisted"
    INTERVIEWING = "interviewing"
    REJECTED = "rejected"
    HIRED = "hired"


class DriveStatus(str, Enum):
    DRAFT = "draft"
    OPEN = "open"
    CLOSED = "closed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ApplicationStatus(str, Enum):
    REGISTERED = "registered"
    UNDER_REVIEW = "under_review"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"
    SELECTED = "selected"
    WITHDRAWN = "withdrawn"


class AIAnalysisType(str, Enum):
    RESUME_SCORE = "resume_score"
    SKILL_GAP = "skill_gap"
    JOB_MATCH = "job_match"
    STUDENT_RECOMMENDATION = "student_recommendation"
