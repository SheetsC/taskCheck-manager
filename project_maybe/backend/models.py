from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt
from datetime import datetime
from sqlalchemy.orm import validates

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'
    serialize_rules = ('-users', '-projects', '-clients','-user', '-project', '-client')

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False)
    due_date = db.Column(db.String, nullable=False)
    status = db.Column(db.String())
    complete = db.Column(db.Boolean, default= False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)

    @validates('description')
    def validates_name(self, key, description):
            existing_task = self.query.filter_by(description=description).first()
            if existing_task:
                raise ValueError('task name must be unique.')

            return description


class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    # serialize_rules = ('-tasks.user,description,due_date,complete',)
    serialize_rules = ('-tasks','-projects', '-_password_hash', '-clients')
    id = db.Column(db.Integer, primary_key= True )
    logged_in = db.Column(db.Boolean, default= False)
    name = db.Column(db.String, nullable=False)
    username = db.Column(db.String, unique= True)
    _password_hash = db.Column(db.String, nullable=False)

    tasks = db.relationship('Task', backref='user', cascade='all, delete-orphan')
    projects = association_proxy('tasks', 'project')
    clients = association_proxy('tasks', 'client')


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
    def validates_name(self, key, username):
        if len(username) != 5:
            raise ValueError(f'Project username must be 5 characters long. {5 - len(name)} more characters are needed.')

    
        existing_user = self.query.filter_by(username=username).first()
        if existing_user:
            raise ValueError('User name must be unique.')

        return username


class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects' 
    serialize_rules=('tasks', '-users', '-clients' )
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    budget = db.Column(db.Float)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.String())
    status = db.Column(db.String(255))
    complete = db.Column(db.Boolean, default= False)

    tasks = db.relationship('Task', backref='project', cascade='all, delete-orphan')
    users = association_proxy('tasks', 'user')
    clients = association_proxy('tasks', 'client')
    
    @property
    def unique_clients(self):
        return list(set(self.clients))
    
    @property
    def unique_users(self):
        return list(set(self.users))

    @property
    def unique_tasks(self):
        return list(set(self.tasks))
    
    @validates('name')
    def validates_name(self, key, name):
        if len(name) != 5:
            raise ValueError(f'Project name must be 5 characters long. {5 - len(name)} more characters are needed.')

    
        existing_project = self.query.filter_by(name=name).first()
        if existing_project:
            raise ValueError('Project name must be unique.')

        return name

    
    @validates('budget')
    def validate_budget(self, key, budget):
        if not isinstance(budget, float) or budget <= 0:
            raise ValueError('Budget must be a positive dollar float')
        return budget
    

class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'
    serialize_rules = ('-tasks','-projects', '-users', '-_password_hash')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    company = db.Column(db.String, nullable=False)
    logged_in = db.Column(db.Boolean, default= False)
    _password_hash = db.Column(db.String, nullable=False)

    tasks = db.relationship('Task', backref='client', cascade='all, delete-orphan')
    projects = association_proxy('tasks', 'project')
    users = association_proxy('tasks', 'user')

    @property
    def unique_projects(self):
        return list(set(self.projects))
    
    @property
    def unique_users(self):
        return list(set(self.users))

    @property
    def unique_tasks(self):
        return list(set(self.tasks))
    

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
    
    @validates('client')
    def validates_name(self, key, name, company):    
        existing_client = self.query.filter(name == name and company ==company).first()
        if existing_client:
            raise ValueError('Client name must be unique.')

        return name
    