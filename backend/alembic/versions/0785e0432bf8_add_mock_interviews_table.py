"""add mock interviews table

Revision ID: 0785e0432bf8
Revises: 92a7db1b44aa
Create Date: 2026-07-11 02:15:58.619312+00:00
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0785e0432bf8"
down_revision = "92a7db1b44aa"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "mock_interviews",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("difficulty", sa.String(), nullable=False),
        sa.Column("questions", sa.Text(), nullable=False),
        sa.Column("profile_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["profile_id"],
            ["student_profiles.id"],
            ondelete="CASCADE",
        ),
    )

    op.create_index(
        op.f("ix_mock_interviews_id"),
        "mock_interviews",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_mock_interviews_id"),
        table_name="mock_interviews",
    )

    op.drop_table("mock_interviews")