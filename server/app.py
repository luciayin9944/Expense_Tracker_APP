#!/usr/bin/env python3

from flask import request, session, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import app, db, api, jwt
from models import User, Expense, UserSchema, ExpenseSchema
from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request



class Signup(Resource):
    pass

class WhoAmI(Resource):
    pass

class Login(Resource):
    pass

class Logout(Resource):
    pass

class ExpenseIndex(Resource):
    pass





api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(WhoAmI, '/me', endpoint='me')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(ExpenseIndex, '/expenses', endpoint='expenses')


if __name__ == '__main__':
    app.run(port=5555, debug=True)