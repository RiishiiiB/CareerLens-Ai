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
