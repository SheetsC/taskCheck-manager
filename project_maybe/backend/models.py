from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt
# from sqlalchemy.orm import validates

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String())
    complete = db.Column(db.Boolean, default= False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key= True )
    logged_in = db.Column(db.Boolean, default= False)
    name = db.Column(db.String, nullable=False)
    username = db.Column(db.String, unique= True)
    password_hash = db.Column(db.String, nullable=False)

    tasks = db.relationship('Task', backref='user', cascade='all, delete-orphan')
    projects = association_proxy('tasks', 'project')

    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        # utf-8 encoding and decoding is required in python 3
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    @staticmethod
    def simple_hash(input):
        return sum(bytearray(input, encoding='utf-8'))
    

class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects' 

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    budget = db.Column(db.Float)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(255))
    complete = db.Column(db.Boolean, default= False)

    tasks = db.relationship('Task', backref='project', cascade='all, delete-orphan')
    users = association_proxy('tasks', 'user')
    


