from flask import request, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User
class Users(Resource):
    def get(self):
        u_list = [u.to_dict() for u in User.query.all()]
        if u_list:
            return make_response(u_list, 200)
        return make_response({'error':'not found'},404)
api.add_resource(Users, '/users')

if __name__ == '__main__':
    app.run(port=5555, debug=True)