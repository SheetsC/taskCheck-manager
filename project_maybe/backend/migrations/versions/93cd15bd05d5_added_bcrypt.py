"""added bcrypt

Revision ID: 93cd15bd05d5
Revises: 4b37cb17ae39
Create Date: 2023-04-25 07:00:12.320829

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '93cd15bd05d5'
down_revision = '4b37cb17ae39'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.alter_column('budget',
               existing_type=sa.FLOAT(),
               nullable=True)
        batch_op.alter_column('status',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)

    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.alter_column('status',
               existing_type=sa.VARCHAR(),
               nullable=True)

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('password_hash')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('password_hash', sa.VARCHAR(), nullable=False))

    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.alter_column('status',
               existing_type=sa.VARCHAR(),
               nullable=False)

    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.alter_column('status',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
        batch_op.alter_column('budget',
               existing_type=sa.FLOAT(),
               nullable=False)

    # ### end Alembic commands ###