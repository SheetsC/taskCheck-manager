from flask import Flask, make_response, jsonify, request, session, flash
from flask_restful import Resource


# Local imports
from config import app, db, api, bcrypt
from models import User, Task, Project


class Home(Resource):
    def get(self):
        return {'message': '200: Welcome to our Home Page'}, 200
    
class SignUp(Resource):
    def post(self):
        password = request.json['password']
        name = request.json['name']
        username = request.json['username']
        

        user_exists = User.query.filter(User.username == username).first() is not None

        if user_exists:
            return jsonify({"error": "User already exists"}), 409

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
        user = User.query.filter(User.id == session['user_id']).first()
        user.logged_in = False
        db.session.commit()
        session.pop("user_id", None)
        
        return {}, 204

class CheckSession(Resource):

    def get(self):

        user_id = session['user_id']
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
        data = request.get_json
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
            return make_response({'error': f'{repr(e)}'}, 422)
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
        data = request.get_json
        new_user = User(
            name = data['name'],
            username = data['username'],
        )
        try:
            db.session.add(new_user)
            db.session.commit()

        except Exception as e:
            db.session.rollback()
            return make_response({'error': f'{repr(e)}'}, 422)

    
class UsersById(Resource):
    def get(self, id):
            for u in User.query.filter_by(id=id).all():
                u_dict= {
                    "name": u.name,
                    "username" : u.username,
                    "logged_in": u.logged_in,
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
        p = Project.query.filter_by(id=id).first()
        if p == None:
            return make_response("not project found", 404)
        return make_response(p.to_dict(), 200)
    def delete(self, id):
        p = Project.query.filter_by(id=id).first()
        if p == None:
            return make_response("no user found", 404)
        db.session.delete(p)
        db.session.commit()

class ProjectsByUserId(Resource):
    def get(self, id):
        task = Task.query.filter(Task.user_id == id).first()
        task_project = task.project
        if task_project == None:
            return make_response({'error': 'user has no tasks'}, 404)
        return make_response(task_project.to_dict(), 200)
    

class TasksByProjectId(Resource):
    def get(self, id):
        
        # project = Project.query.filter_by(id=id).first()
        task = Task.query.filter(Task.project_id == id).first()
        if task == None:
            return make_response({'error': 'user has no tasks'}, 404)
        session['project_id'] = task.project.id
        return make_response(task.to_dict(), 200)

api.add_resource(Tasks, '/tasks')
api.add_resource(TasksById, '/tasks/<int:id>')
api.add_resource(Users, '/users')
api.add_resource(UsersById, '/users/<int:id>')
api.add_resource(Projects, '/projects')
api.add_resource(ProjectsById, '/projects/<int:id>')
api.add_resource(ProjectsByUserId, '/users/<int:id>/projects')
api.add_resource(TasksByProjectId, '/projects/<int:id>/tasks')
api.add_resource(ClearSession, '/clear', endpoint='clear')
api.add_resource(SignUp, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')


api.add_resource(Home, '/')

if __name__ == '__main__':
    app.run(port=5555, debug=True)