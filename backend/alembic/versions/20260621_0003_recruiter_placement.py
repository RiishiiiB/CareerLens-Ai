"""Add recruiter, job, shortlist, and placement drive modules.

Revision ID: 20260621_0003
Revises: 20260621_0002
Create Date: 2026-06-21
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "20260621_0003"
down_revision = "20260621_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = inspect(op.get_bind())
    tables = set(inspector.get_table_names())

    if "company_profiles" not in tables:
        op.create_table(
            "company_profiles",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("owner_user_id", sa.Integer(), nullable=True),
            sa.Column("name", sa.String(), nullable=False, unique=True),
            sa.Column("industry", sa.String(), nullable=True),
            sa.Column("website_url", sa.String(), nullable=True),
            sa.Column("location", sa.String(), nullable=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("company_size", sa.String(), nullable=True),
            sa.Column(
                "is_verified",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
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
            sa.ForeignKeyConstraint(
                ["owner_user_id"],
                ["users.id"],
                ondelete="SET NULL",
            ),
        )
        op.create_index("ix_company_profiles_id", "company_profiles", ["id"])
        op.create_index("ix_company_profiles_name", "company_profiles", ["name"])
        op.create_index(
            "ix_company_profiles_owner_user_id",
            "company_profiles",
            ["owner_user_id"],
        )

    if "recruiter_profiles" not in tables:
        op.create_table(
            "recruiter_profiles",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("user_id", sa.Integer(), nullable=False, unique=True),
            sa.Column("company_id", sa.Integer(), nullable=True),
            sa.Column("designation", sa.String(), nullable=True),
            sa.Column("work_email", sa.String(), nullable=True),
            sa.Column(
                "is_verified",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
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
            sa.ForeignKeyConstraint(
                ["company_id"],
                ["company_profiles.id"],
                ondelete="SET NULL",
            ),
        )
        op.create_index("ix_recruiter_profiles_id", "recruiter_profiles", ["id"])
        op.create_index(
            "ix_recruiter_profiles_user_id",
            "recruiter_profiles",
            ["user_id"],
        )
        op.create_index(
            "ix_recruiter_profiles_company_id",
            "recruiter_profiles",
            ["company_id"],
        )

    if "job_postings" not in tables:
        op.create_table(
            "job_postings",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("company_id", sa.Integer(), nullable=False),
            sa.Column("recruiter_id", sa.Integer(), nullable=True),
            sa.Column("title", sa.String(), nullable=False),
            sa.Column("description", sa.Text(), nullable=False),
            sa.Column("location", sa.String(), nullable=True),
            sa.Column(
                "employment_type",
                sa.String(),
                nullable=False,
                server_default="full_time",
            ),
            sa.Column("salary_min", sa.Float(), nullable=True),
            sa.Column("salary_max", sa.Float(), nullable=True),
            sa.Column("currency", sa.String(), nullable=False, server_default="INR"),
            sa.Column("required_skills", sa.JSON(), nullable=False),
            sa.Column("eligibility_criteria", sa.JSON(), nullable=False),
            sa.Column(
                "status",
                sa.String(),
                nullable=False,
                server_default="open",
            ),
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
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
            sa.ForeignKeyConstraint(
                ["company_id"],
                ["company_profiles.id"],
                ondelete="CASCADE",
            ),
            sa.ForeignKeyConstraint(
                ["recruiter_id"],
                ["recruiter_profiles.id"],
                ondelete="SET NULL",
            ),
        )
        op.create_index("ix_job_postings_id", "job_postings", ["id"])
        op.create_index("ix_job_postings_title", "job_postings", ["title"])
        op.create_index("ix_job_postings_status", "job_postings", ["status"])
        op.create_index("ix_job_postings_company_id", "job_postings", ["company_id"])
        op.create_index(
            "ix_job_postings_recruiter_id",
            "job_postings",
            ["recruiter_id"],
        )

    if "candidate_shortlists" not in tables:
        op.create_table(
            "candidate_shortlists",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("job_id", sa.Integer(), nullable=False),
            sa.Column("student_profile_id", sa.Integer(), nullable=False),
            sa.Column("recruiter_id", sa.Integer(), nullable=True),
            sa.Column(
                "status",
                sa.String(),
                nullable=False,
                server_default="shortlisted",
            ),
            sa.Column("notes", sa.Text(), nullable=True),
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
            sa.ForeignKeyConstraint(["job_id"], ["job_postings.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(
                ["student_profile_id"],
                ["student_profiles.id"],
                ondelete="CASCADE",
            ),
            sa.ForeignKeyConstraint(
                ["recruiter_id"],
                ["recruiter_profiles.id"],
                ondelete="SET NULL",
            ),
            sa.UniqueConstraint(
                "job_id",
                "student_profile_id",
                name="uq_candidate_shortlist_job_student",
            ),
        )
        op.create_index(
            "ix_candidate_shortlists_id",
            "candidate_shortlists",
            ["id"],
        )
        op.create_index(
            "ix_candidate_shortlists_job_id",
            "candidate_shortlists",
            ["job_id"],
        )
        op.create_index(
            "ix_candidate_shortlists_student_profile_id",
            "candidate_shortlists",
            ["student_profile_id"],
        )
        op.create_index(
            "ix_candidate_shortlists_recruiter_id",
            "candidate_shortlists",
            ["recruiter_id"],
        )

    if "placement_drives" not in tables:
        op.create_table(
            "placement_drives",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("created_by_id", sa.Integer(), nullable=True),
            sa.Column("company_id", sa.Integer(), nullable=True),
            sa.Column("job_posting_id", sa.Integer(), nullable=True),
            sa.Column("title", sa.String(), nullable=False),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("location", sa.String(), nullable=True),
            sa.Column("starts_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("ends_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column(
                "registration_deadline",
                sa.DateTime(timezone=True),
                nullable=True,
            ),
            sa.Column("min_cgpa", sa.Float(), nullable=True),
            sa.Column("eligible_departments", sa.JSON(), nullable=False),
            sa.Column("eligible_graduation_years", sa.JSON(), nullable=False),
            sa.Column("required_skills", sa.JSON(), nullable=False),
            sa.Column("eligibility_notes", sa.Text(), nullable=True),
            sa.Column(
                "status",
                sa.String(),
                nullable=False,
                server_default="draft",
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
            sa.ForeignKeyConstraint(
                ["created_by_id"],
                ["users.id"],
                ondelete="SET NULL",
            ),
            sa.ForeignKeyConstraint(
                ["company_id"],
                ["company_profiles.id"],
                ondelete="SET NULL",
            ),
            sa.ForeignKeyConstraint(
                ["job_posting_id"],
                ["job_postings.id"],
                ondelete="SET NULL",
            ),
        )
        op.create_index("ix_placement_drives_id", "placement_drives", ["id"])
        op.create_index("ix_placement_drives_title", "placement_drives", ["title"])
        op.create_index("ix_placement_drives_status", "placement_drives", ["status"])
        op.create_index(
            "ix_placement_drives_created_by_id",
            "placement_drives",
            ["created_by_id"],
        )
        op.create_index(
            "ix_placement_drives_company_id",
            "placement_drives",
            ["company_id"],
        )
        op.create_index(
            "ix_placement_drives_job_posting_id",
            "placement_drives",
            ["job_posting_id"],
        )

    if "drive_applications" not in tables:
        op.create_table(
            "drive_applications",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("drive_id", sa.Integer(), nullable=False),
            sa.Column("student_profile_id", sa.Integer(), nullable=False),
            sa.Column(
                "status",
                sa.String(),
                nullable=False,
                server_default="registered",
            ),
            sa.Column("resume_id", sa.Integer(), nullable=True),
            sa.Column("notes", sa.Text(), nullable=True),
            sa.Column("status_reason", sa.Text(), nullable=True),
            sa.Column(
                "applied_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
            ),
            sa.Column(
                "updated_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
            ),
            sa.ForeignKeyConstraint(
                ["drive_id"],
                ["placement_drives.id"],
                ondelete="CASCADE",
            ),
            sa.ForeignKeyConstraint(
                ["student_profile_id"],
                ["student_profiles.id"],
                ondelete="CASCADE",
            ),
            sa.ForeignKeyConstraint(["resume_id"], ["resumes.id"], ondelete="SET NULL"),
            sa.UniqueConstraint(
                "drive_id",
                "student_profile_id",
                name="uq_drive_application_drive_student",
            ),
        )
        op.create_index("ix_drive_applications_id", "drive_applications", ["id"])
        op.create_index(
            "ix_drive_applications_drive_id",
            "drive_applications",
            ["drive_id"],
        )
        op.create_index(
            "ix_drive_applications_student_profile_id",
            "drive_applications",
            ["student_profile_id"],
        )
        op.create_index(
            "ix_drive_applications_status",
            "drive_applications",
            ["status"],
        )
        op.create_index(
            "ix_drive_applications_resume_id",
            "drive_applications",
            ["resume_id"],
        )


def downgrade() -> None:
    inspector = inspect(op.get_bind())
    tables = set(inspector.get_table_names())
    for table_name in (
        "drive_applications",
        "placement_drives",
        "candidate_shortlists",
        "job_postings",
        "recruiter_profiles",
        "company_profiles",
    ):
        if table_name in tables:
            op.drop_table(table_name)
