"""Add AI analysis audit table.

Revision ID: 20260621_0004
Revises: 20260621_0003
Create Date: 2026-06-21
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "20260621_0004"
down_revision = "20260621_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = inspect(op.get_bind())
    if "ai_analyses" in inspector.get_table_names():
        return

    op.create_table(
        "ai_analyses",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("analysis_type", sa.String(), nullable=False),
        sa.Column("target_type", sa.String(), nullable=True),
        sa.Column("target_id", sa.Integer(), nullable=True),
        sa.Column("input_payload", sa.JSON(), nullable=False),
        sa.Column("result_payload", sa.JSON(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_ai_analyses_id", "ai_analyses", ["id"])
    op.create_index("ix_ai_analyses_user_id", "ai_analyses", ["user_id"])
    op.create_index(
        "ix_ai_analyses_analysis_type",
        "ai_analyses",
        ["analysis_type"],
    )
    op.create_index("ix_ai_analyses_target_id", "ai_analyses", ["target_id"])


def downgrade() -> None:
    inspector = inspect(op.get_bind())
    if "ai_analyses" in inspector.get_table_names():
        op.drop_table("ai_analyses")
