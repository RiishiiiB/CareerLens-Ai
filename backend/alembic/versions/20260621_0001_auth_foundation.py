"""Add authentication foundation.

Revision ID: 20260621_0001
Revises: None
Create Date: 2026-06-21
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "20260621_0001"
down_revision = None
branch_labels = None
depends_on = None


def _has_column(table_name: str, column_name: str) -> bool:
    inspector = inspect(op.get_bind())
    return column_name in {
        column["name"] for column in inspector.get_columns(table_name)
    }


def upgrade() -> None:
    inspector = inspect(op.get_bind())
    if "users" not in inspector.get_table_names():
        op.create_table(
            "users",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("registration_number", sa.String(), nullable=True, unique=True),
            sa.Column("college_name", sa.String(), nullable=True),
            sa.Column("full_name", sa.String(), nullable=False),
            sa.Column("email", sa.String(), nullable=False, unique=True),
            sa.Column("phone_number", sa.String(), nullable=True),
            sa.Column("department", sa.String(), nullable=True),
            sa.Column("graduation_year", sa.Integer(), nullable=True),
            sa.Column("linkedin_url", sa.String(), nullable=True),
            sa.Column("github_url", sa.String(), nullable=True),
            sa.Column("resume_url", sa.String(), nullable=True),
            sa.Column("password_hash", sa.String(), nullable=True),
            sa.Column(
                "role",
                sa.String(),
                nullable=False,
                server_default="student",
            ),
            sa.Column(
                "is_active",
                sa.Boolean(),
                nullable=False,
                server_default=sa.true(),
            ),
            sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
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
        )
    else:
        if not _has_column("users", "password_hash"):
            op.add_column(
                "users",
                sa.Column("password_hash", sa.String(), nullable=True),
            )
        if not _has_column("users", "role"):
            op.add_column(
                "users",
                sa.Column(
                    "role",
                    sa.String(),
                    nullable=False,
                    server_default="student",
                ),
            )
        if not _has_column("users", "is_active"):
            op.add_column(
                "users",
                sa.Column(
                    "is_active",
                    sa.Boolean(),
                    nullable=False,
                    server_default=sa.true(),
                ),
            )
        if not _has_column("users", "last_login_at"):
            op.add_column(
                "users",
                sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
            )
        try:
            op.alter_column("users", "registration_number", nullable=True)
            op.alter_column("users", "college_name", nullable=True)
        except Exception:
            pass

    if "refresh_tokens" not in inspector.get_table_names():
        op.create_table(
            "refresh_tokens",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("token_hash", sa.String(), nullable=False, unique=True),
            sa.Column("jti", sa.String(), nullable=False, unique=True),
            sa.Column(
                "is_revoked",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            ),
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        )
        op.create_index(
            "ix_refresh_tokens_user_id",
            "refresh_tokens",
            ["user_id"],
        )
        op.create_index(
            "ix_refresh_tokens_token_hash",
            "refresh_tokens",
            ["token_hash"],
        )
        op.create_index("ix_refresh_tokens_jti", "refresh_tokens", ["jti"])
        op.create_index(
            "ix_refresh_tokens_expires_at",
            "refresh_tokens",
            ["expires_at"],
        )


def downgrade() -> None:
    inspector = inspect(op.get_bind())
    if "refresh_tokens" in inspector.get_table_names():
        op.drop_table("refresh_tokens")

    if "users" in inspector.get_table_names():
        for column_name in ("last_login_at", "is_active", "role", "password_hash"):
            if _has_column("users", column_name):
                op.drop_column("users", column_name)
