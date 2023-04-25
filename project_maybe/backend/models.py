from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
# from sqlalchemy.orm import validates

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primarykey= True )
    logged_in = db.Column(db.Boolean, default= False)
    name = db.Column(db.String, nullable=False)
    username = db.Column(db.String, unique= True)
    password_hash = db.Column(db.String, nullable=False)

    tasks = db.relationship('Task', backref='user', cascade='all, delete-orphan')
    projects = association_proxy('tasks', 'project')
    

class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects' 
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    budget = db.Column(db.Float, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(255), nullable=False)

    tasks = db.relationship('Task', backref='project', cascade='all, delete-orphan')
    users = association_proxy('tasks', 'user')
    


