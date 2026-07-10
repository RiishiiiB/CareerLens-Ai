"""add applications table

Revision ID: 92a7db1b44aa
Revises: 20260621_0004
Create Date: 2026-07-10 13:33:47.112448+00:00
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "92a7db1b44aa"
down_revision = "20260621_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "applications",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("company_name", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("location", sa.String(), nullable=True),
        sa.Column("package", sa.String(), nullable=True),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("applied_date", sa.Date(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["student_id"],
            ["student_profiles.id"],
            ondelete="CASCADE",
        ),
    )

    op.create_index(
        op.f("ix_applications_id"),
        "applications",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_applications_id"),
        table_name="applications",
    )

    op.drop_table("applications")