"""Add participation image and notes fields

Revision ID: add_participation_fields
Revises: [previous_revision]
Create Date: 2024-10-29 23:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_participation_fields'
down_revision = None  # Update this with the actual previous revision ID
branch_labels = None
depends_on = None

def upgrade():
    """Add participation_image and notes columns to action_participants table"""
    # Add new columns
    op.add_column('action_participants', sa.Column('participation_image', sa.String(500), nullable=True))
    op.add_column('action_participants', sa.Column('notes', sa.Text, nullable=True))

def downgrade():
    """Remove participation_image and notes columns from action_participants table"""
    # Remove columns
    op.drop_column('action_participants', 'notes')
    op.drop_column('action_participants', 'participation_image')
