"""swithed logged_on to in

Revision ID: b12ca249f0a4
Revises: 1cf1a541946d
Create Date: 2023-05-16 16:54:42.016865

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b12ca249f0a4'
down_revision = '1cf1a541946d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('clients', schema=None) as batch_op:
        batch_op.add_column(sa.Column('logged_in', sa.Boolean(), nullable=True))
        batch_op.drop_column('logged_on')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('clients', schema=None) as batch_op:
        batch_op.add_column(sa.Column('logged_on', sa.BOOLEAN(), nullable=True))
        batch_op.drop_column('logged_in')

    # ### end Alembic commands ###