"""Add student profile and resume modules.

Revision ID: 20260621_0002
Revises: 20260621_0001
Create Date: 2026-06-21
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "20260621_0002"
down_revision = "20260621_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = inspect(op.get_bind())
    tables = set(inspector.get_table_names())

    if "student_profiles" not in tables:
        op.create_table(
            "student_profiles",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("user_id", sa.Integer(), nullable=False, unique=True),
            sa.Column("headline", sa.String(), nullable=True),
            sa.Column("bio", sa.Text(), nullable=True),
            sa.Column("date_of_birth", sa.Date(), nullable=True),
            sa.Column("location", sa.String(), nullable=True),
            sa.Column("portfolio_url", sa.String(), nullable=True),
            sa.Column("cgpa", sa.Float(), nullable=True),
            sa.Column(
                "profile_completion_score",
                sa.Integer(),
                nullable=False,
                server_default="0",
            ),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
            ),
            sa.Column(
                "updated_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
            ),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        )
        op.create_index("ix_student_profiles_user_id", "student_profiles", ["user_id"])

    if "student_skills" not in tables:
        op.create_table(
            "student_skills",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("profile_id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(), nullable=False),
            sa.Column(
                "proficiency",
                sa.String(),
                nullable=False,
                server_default="intermediate",
            ),
            sa.Column("years_experience", sa.Float(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
            ),
            sa.ForeignKeyConstraint(
                ["profile_id"],
                ["student_profiles.id"],
                ondelete="CASCADE",
            ),
        )
        op.create_index(
            "ix_student_skills_profile_id",
            "student_skills",
            ["profile_id"],
        )
        op.create_index("ix_student_skills_name", "student_skills", ["name"])

    if "student_education" not in tables:
        op.create_table(
            "student_education",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("profile_id", sa.Integer(), nullable=False),
            sa.Column("institution", sa.String(), nullable=False),
            sa.Column("degree", sa.String(), nullable=False),
            sa.Column("field_of_study", sa.String(), nullable=True),
            sa.Column("start_year", sa.Integer(), nullable=True),
            sa.Column("end_year", sa.Integer(), nullable=True),
            sa.Column("grade", sa.String(), nullable=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.ForeignKeyConstraint(
                ["profile_id"],
                ["student_profiles.id"],
                ondelete="CASCADE",
            ),
        )
        op.create_index(
            "ix_student_education_profile_id",
            "student_education",
            ["profile_id"],
        )

    if "student_certifications" not in tables:
        op.create_table(
            "student_certifications",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("profile_id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(), nullable=False),
            sa.Column("issuing_organization", sa.String(), nullable=False),
            sa.Column("issue_date", sa.Date(), nullable=True),
            sa.Column("expiry_date", sa.Date(), nullable=True),
            sa.Column("credential_url", sa.String(), nullable=True),
            sa.ForeignKeyConstraint(
                ["profile_id"],
                ["student_profiles.id"],
                ondelete="CASCADE",
            ),
        )
        op.create_index(
            "ix_student_certifications_profile_id",
            "student_certifications",
            ["profile_id"],
        )

    if "student_projects" not in tables:
        op.create_table(
            "student_projects",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("profile_id", sa.Integer(), nullable=False),
            sa.Column("title", sa.String(), nullable=False),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("tech_stack", sa.JSON(), nullable=False),
            sa.Column("project_url", sa.String(), nullable=True),
            sa.Column("repository_url", sa.String(), nullable=True),
            sa.Column("start_date", sa.Date(), nullable=True),
            sa.Column("end_date", sa.Date(), nullable=True),
            sa.ForeignKeyConstraint(
                ["profile_id"],
                ["student_profiles.id"],
                ondelete="CASCADE",
            ),
        )
        op.create_index(
            "ix_student_projects_profile_id",
            "student_projects",
            ["profile_id"],
        )

    if "resumes" not in tables:
        op.create_table(
            "resumes",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("student_profile_id", sa.Integer(), nullable=True),
            sa.Column("original_filename", sa.String(), nullable=False),
            sa.Column("stored_filename", sa.String(), nullable=False),
            sa.Column("storage_path", sa.String(), nullable=False, unique=True),
            sa.Column("content_type", sa.String(), nullable=False),
            sa.Column("file_size", sa.Integer(), nullable=False),
            sa.Column("checksum_sha256", sa.String(), nullable=False),
            sa.Column(
                "is_primary",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            ),
            sa.Column("parsed_text", sa.Text(), nullable=True),
            sa.Column(
                "uploaded_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(
                ["student_profile_id"],
                ["student_profiles.id"],
                ondelete="SET NULL",
            ),
        )
        op.create_index("ix_resumes_user_id", "resumes", ["user_id"])
        op.create_index(
            "ix_resumes_student_profile_id",
            "resumes",
            ["student_profile_id"],
        )
        op.create_index(
            "ix_resumes_checksum_sha256",
            "resumes",
            ["checksum_sha256"],
        )


def downgrade() -> None:
    inspector = inspect(op.get_bind())
    tables = set(inspector.get_table_names())
    for table_name in (
        "resumes",
        "student_projects",
        "student_certifications",
        "student_education",
        "student_skills",
        "student_profiles",
    ):
        if table_name in tables:
            op.drop_table(table_name)
