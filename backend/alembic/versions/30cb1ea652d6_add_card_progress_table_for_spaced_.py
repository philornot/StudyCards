"""add card progress table for spaced repetition

Revision ID: 30cb1ea652d6
Revises: 9db70ed366c8
Create Date: 2025-11-02 10:32:26.754982

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '30cb1ea652d6'
down_revision: Union[str, Sequence[str], None] = '9db70ed366c8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('card_progress',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('card_id', sa.Integer(), nullable=False),
    sa.Column('ease_factor', sa.Float(), nullable=False, server_default='2.5'),
    sa.Column('interval_days', sa.Integer(), nullable=False, server_default='0'),
    sa.Column('repetitions', sa.Integer(), nullable=False, server_default='0'),
    sa.Column('lapses', sa.Integer(), nullable=False, server_default='0'),
    sa.Column('last_reviewed', sa.DateTime(timezone=True), nullable=True),
    sa.Column('next_review', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['card_id'], ['cards.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('card_id')
    )
    op.create_index(op.f('ix_card_progress_card_id'), 'card_progress', ['card_id'], unique=False)
    op.create_index(op.f('ix_card_progress_id'), 'card_progress', ['id'], unique=False)
    op.create_index(op.f('ix_card_progress_next_review'), 'card_progress', ['next_review'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_card_progress_next_review'), table_name='card_progress')
    op.drop_index(op.f('ix_card_progress_id'), table_name='card_progress')
    op.drop_index(op.f('ix_card_progress_card_id'), table_name='card_progress')
    op.drop_table('card_progress')