from flask import Flask, make_response, jsonify, request, session, flash
from flask_restful import Resource
import datetime



from config import app, db, api, bcrypt
from models import User, Task, Project

NO_AUTH_ENDPOINTS = ['login', 'signup','check_session']

@app.before_request
def check_if_logged_in():

    if request.endpoint in NO_AUTH_ENDPOINTS:
        return None
  
    if not session.get('user_id'):
        return {'error': 'Unauthorized, Please log in'}, 401
class Home(Resource):
    def get(self):
        return {'message': '200: Welcome to our Home Page'}, 200
    
class SignUp(Resource):
    def post(self):
        password = request.json['password']
        name = request.json['name']
        username = request.json['username']

        special_characters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', '\\', ';', ':', "\'",',','.', '<', '>', '/', '?']
        if len(password) < 8 and not any(char in special_characters for char in password):
            return jsonify({"error": "Try again, no hint provided"}), 400

        user_exists = User.query.filter(User.username == username).first() is not None

        if user_exists:
            return jsonify({"error": "Username already in-use"}), 409

        hashed_password = bcrypt.generate_password_hash(password)
        new_user = User(
            name= name,
            _password_hash=hashed_password,  
            username=username
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            "id": new_user.id,
            "username": new_user.username
        })

class Login(Resource):

    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter(User.username == username).first()

        # password = request.get_json()['password']

        # if user.authenticate(password):
        if user is None:
            return {'error': 'Invalid username or password'}, 401
        if not bcrypt.check_password_hash(user._password_hash, password):
            return {'error': 'Invalid username or password'}, 401

        flash("Login Successful!")
    
        user.logged_in = True
        db.session.commit()
        session.permanent = True
        session['user_id'] = user.id
        return jsonify({
            "id": user.id,
            "username": user.username,
            
        })
class Logout(Resource):

    def delete(self):
        # username = request.get_json().get('username')
        # user = Fan.query.filter(Fan.username == username).first()
        # flash(f"You have been logged out! See you again, {username}")
        user = User.query.filter(User.id == session.get('user_id')).first()
        user.logged_in = False
        db.session.commit()
        session.pop("user_id", None)
        
        return {}, 204

class CheckSession(Resource):

    def get(self):

        user_id = session.get('user_id')
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return user.to_dict(), 200

        return {}, 401

class ClearSession(Resource):

    def delete(self):

        # session['page_views'] = None
        session['user_id'] = None

        return {}, 204

class Tasks(Resource):
    def get(self):
        t_list = [t.to_dict() for t in Task.query.all()]
        if t_list:
            return make_response(t_list, 200)
        return make_response({'error':'not found'},404)
    def post(self):
        data = request.get_json()
        newTask = Task(
            description = data['description'],
            due_date = data['due_date'],
            status = data['status'],
            complete = data['complete'],
            project_id = data['project_id'],
            user_id = data['user_id']
        )
        try:
            db.session.add(newTask)
            db.session.commit()

        except Exception as e:
            db.session.rollback()
            return make_response({'error': f'{repr(e)} using the frontend would be easier'}, 422)
class TasksById(Resource):
     
     def get (self,id):
         t = Task.query.filter_by(id=id).first()
         if t is None:
             return make_response({'error': 'no task found'}, 404)
         return make_response(t.to_dict(), 200)
     def patch(self, id):
        data = request.get_json()
        try:
            t = Task.query.filter_by(id = id).first()

            for attr in request.get_json():
                setattr(t, attr, data[attr])
        except:
            response_body = {
                'error': 'no task'
            }
            return make_response( response_body, 404 )
        else:
            db.session.add(t)
            db.session.commit()
        
        return make_response(t.to_dict(), 200)
     def delete(self, id):
         t = Task.query.filter_by(id=id).first()
         if t == None:
            return make_response("no task found", 404)
         db.session.delete(t)
         db.session.commit()

class Users(Resource):
    def get(self):
        u_list = [u.to_dict() for u in User.query.all()]
        if u_list:
            return make_response(u_list, 200)
        return make_response({'error':'not found'},404)
    def post(self):
        data = request.get_json()
        new_user = User(
            name = data['name'],
            username = data['username'],
        )
        try:
            db.session.add(new_user)
            db.session.commit()

        except Exception as e:
            db.session.rollback()
            return make_response({'error': f'{repr(e)} please create user via sign-up'}, 422)

class UsersById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        project_ids = set()
        unique_projects = []
        for project in user.projects:
            if project.id not in project_ids:
                project_ids.add(project.id)
                unique_projects.append(project.to_dict())
        u_dict = {
            "name": user.name,
            "username" : user.username,
            "logged_in": user.logged_in,
            "projects": unique_projects
        }
        return make_response(u_dict, 200)
    def delete(self, id):
         u = User.query.filter_by(id=id).first()
         if u == None:
            return make_response("no user found", 404)
         db.session.delete(u)
         db.session.commit()
            
class Projects(Resource):
    def get(self):
        p_list = [p.to_dict() for p in Project.query.all()]
        if p_list:
            return make_response(p_list, 200)
        return make_response({'error':'not found'},404)
    def post(self):
        data = request.get_json
        new_project = Project(
            name = data['name'],
            description = data['description'],
            budget = data['budget'],
            start_date = data['start_date'],
            end_date = data['end_date'],
            status = data['status'],
            complete =data['complete']
        )
        try:
            db.session.add(new_project)
            db.session.commit()

        except Exception as e:
            db.session.rollback()
            return make_response({'error': f'{repr(e)}'}, 422)
        
class ProjectsById(Resource):
    def get(self,id):
        projects_list = []
        for p in Project.query.filter(Project.id==id).all():
            p_dict = {
                'id' : p.id,
                'name' : p.name,
                'description' : p.description,
                'budget' : p.budget,
                'start_date' : p.start_date,
                'end_date' : p.end_date,
                'status' : p.status,
                'complete' : p.complete,
                'users': [u.to_dict() for u in p.unique_users],
                'tasks': [t.to_dict() for t in p.unique_tasks]
            }       
            projects_list.append(p_dict)
        if projects_list == None:
            return make_response({'error': 'user has no tasks'}, 404)
        return make_response(projects_list, 200)
    def delete(self, id):
        p = Project.query.filter_by(id=id).first()
        if p == None:
            return make_response("no user found", 404)
        db.session.delete(p)
        db.session.commit()
    def patch(self, id):
        data = request.get_json()
        try:
            p = Project.query.filter_by(id = id).first()

            for attr in request.get_json():
                setattr(p, attr, data[attr])
        except:
            response_body = {
                'error': 'no task'
            }
            return make_response( response_body, 404 )
        else:
            db.session.add(p)
            db.session.commit()
        
        return make_response(p.to_dict(), 200)
class ProjectsByUserId(Resource):
    def get(self, id):
        projects_list = []
        for p in Project.query.filter(Project.users.any(id=id)).all():
            p_dict = {
                'id' : p.id,
                'name' : p.name,
                'description' : p.description,
                'budget' : p.budget,
                'start_date' : p.start_date,
                'end_date' : p.end_date,
                'status' : p.status,
                'complete' : p.complete,
            }       
            projects_list.append(p_dict)
        if projects_list == None:
            return make_response({'error': 'user has no tasks'}, 404)
        return make_response(projects_list, 200)
    
class TaskByProjectId (Resource):
    def get(self, id):
        project = Project.query.filter_by(id=id).first()
        if project is None:
            return make_response({'error': 'project not found'}, 404)
        tasks = [t.to_dict() for t in project.tasks]
        return make_response(tasks,202)

    def post(self, id):
        if 'user_id' in session:
            data = request.get_json()

            description = data['description']
            status = data['status']
            complete = False
            project_id = id
            user_id = data['user_id']

            # Validate due date format
            try:
                due_date = datetime.datetime.strptime(data['due_date'], '%Y-%m-%d').date()
            except ValueError:
                return make_response({'error': 'Invalid due date format. Please use the format: YYYY-MM-DD'}, 422)

            new_task = Task(
                description=description,
                due_date=due_date,
                status=status,
                complete=complete,
                project_id=project_id,
                user_id=user_id
            )

            try:
                db.session.add(new_task)
                db.session.commit()
            except:
                db.session.rollback()
                return make_response({'error': 'Failed to create new task.'}, 422)
        return make_response(new_task.to_dict(), 201)
class TasksByUserId(Resource):
    def get(self, id):
        
        # project = Project.query.filter_by(id=id).first()
        tasks = [t.to_dict() for t in Task.query.filter(Task.user_id == id).all()]
        if tasks == None:
            return make_response({'error': 'user has no tasks'}, 404)
        # session['project_id'] = task.project.id
        return make_response(tasks, 200)
    



api.add_resource(Tasks, '/tasks')
api.add_resource(TasksById, '/tasks/<int:id>')
api.add_resource(TasksByUserId, '/users/<int:id>/tasks')
api.add_resource(TaskByProjectId, '/projects/<int:id>/tasks')
api.add_resource(Users, '/users')
api.add_resource(UsersById, '/users/<int:id>')
api.add_resource(Projects, '/projects')
api.add_resource(ProjectsById, '/projects/<int:id>')
api.add_resource(ProjectsByUserId, '/users/<int:id>/projects')
api.add_resource(ClearSession, '/clear', endpoint='clear')
api.add_resource(SignUp, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')



api.add_resource(Home, '/')

import os
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_ORIGINS'] = [
    'https://task-check-manager.vercel.app'  # Replace with your frontend URL
]

# Add your routes and other code here

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5555))
    app.run(host='0.0.0.0', port=port)
