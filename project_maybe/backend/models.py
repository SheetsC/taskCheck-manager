from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt
from datetime import datetime
from sqlalchemy.orm import validates

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'
    serialize_rules = ('-users', '-projects', '-user', '-project')

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False, unique=True)
    due_date = db.Column(db.String, nullable=False)
    status = db.Column(db.String())
    complete = db.Column(db.Boolean, default= False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    

class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    # serialize_rules = ('-tasks.user,description,due_date,complete',)
    serialize_rules = ('-tasks','-projects', '-_password_hash', )
    id = db.Column(db.Integer, primary_key= True )
    logged_in = db.Column(db.Boolean, default= False)
    name = db.Column(db.String, nullable=False)
    username = db.Column(db.String, unique= True)
    _password_hash = db.Column(db.String, nullable=False)

    tasks = db.relationship('Task', backref='user', cascade='all, delete-orphan')
    projects = association_proxy('tasks', 'project')

    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')
    # add @validate to backend for username, and other potential issues
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    @staticmethod
    def simple_hash(input):
        return sum(bytearray(input, encoding='utf-8'))
    
    @validates('username')
    def validate_username(self, key, username):
        if len(username) < 5:
            raise ValueError("Username must be at least 3 characters long.")
        return username


class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects' 
    serialize_rules=('tasks', '-users' )
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text)
    budget = db.Column(db.Float, nullable= False)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.String())
    status = db.Column(db.String(255))
    complete = db.Column(db.Boolean, default= False)

    tasks = db.relationship('Task', backref='project', cascade='all, delete-orphan')
    users = association_proxy('tasks', 'user')
    
    @property
    def unique_users(self):
        return list(set(self.users))

    @property
    def unique_tasks(self):
        return list(set(self.tasks))
    
    @validates('name')
    def validates_name(self, key, name):
        if len(name) != 5:
            raise ValueError('Project name must be longer needs {len(name)} - 5} more ')
        return name
    
    @validates('budget')
    def validate_budget(self, key, budget):
        if not isinstance(budget, float) or budget <= 0:
            raise ValueError('Budget must be a positive dollar float')
        return budget
    


