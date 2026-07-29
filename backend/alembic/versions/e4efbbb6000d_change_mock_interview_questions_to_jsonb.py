"""change mock interview questions to jsonb

Revision ID: e4efbbb6000d
Revises: 0785e0432bf8
Create Date: 2026-07-27 09:36:54.184571+00:00
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = 'e4efbbb6000d'
down_revision = '0785e0432bf8'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        "mock_interviews",
        "questions",
        existing_type=sa.TEXT(),
        type_=postgresql.JSONB(astext_type=sa.Text()),
        existing_nullable=False,
        postgresql_using="questions::jsonb",
    )


def downgrade() -> None:
    op.alter_column(
        "mock_interviews",
        "questions",
        existing_type=postgresql.JSONB(astext_type=sa.Text()),
        type_=sa.TEXT(),
        existing_nullable=False,
        postgresql_using="questions::text",
    )
