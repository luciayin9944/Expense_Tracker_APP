#!/usr/bin/env python3

from flask import request, session, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import app, db, api, jwt
from models import User, Expense, UserSchema, ExpenseSchema
from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request


@app.before_request
def check_if_logged_in():                 
    open_access_list = ['signup', 'login']
    
    if request.endpoint not in open_access_list:
        try:
            verify_jwt_in_request()
        except:
            return {'error': '401 Unauthorized'}, 401


class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User(username=username)
        user.password_hash = password

        try:
            db.session.add(user)
            db.session.commit()
            access_token = create_access_token(identity=str(user.id))
            response = make_response(jsonify(token=access_token, user=UserSchema().dump(user)), 200)
            return response
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422



class WhoAmI(Resource):
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.filter(User.id==user_id).first()

        return UserSchema().dump(user), 200
    

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter(User.username==username).first()

        if user and user.authenticate(password):
            access_token = create_access_token(identity=str(user.id))
            response = make_response(jsonify(token=access_token, user=UserSchema().dump(user)), 200)
            return response
        
        return {'errors': ['401 Unauthorized']}, 401

# class Logout(Resource):
#     pass



class Expense(Resource):
    def get(self):
        # expenses = [ExpenseSchema().dump(e) for e in Expense.query.all()]
        # return expenses, 200

        #pagination
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 5, type=int)
        pagination = Expense.query.paginate(page=page, per_page=per_page, error_out=False)
        expenses = pagination.items

        return {
            "expense_records_page": page,
            "expenses": [ExpenseSchema().dump(e) for e in expenses]
        }

    

    def post(self):
        data = request.get_json()

        expense = Expense(
            purchase_item = data.get('purchase_item'),
            amount=data.get('amount'),
            date = data.get('date'),
            user_id = get_jwt_identity()
        )

        try:
            db.session.add(expense)
            db.session.commit()
            return ExpenseSchema().dump(expense), 201
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422





api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(WhoAmI, '/me', endpoint='me')
api.add_resource(Login, '/login', endpoint='login')
#api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Expense, '/expenses', endpoint='expenses')


if __name__ == '__main__':
    app.run(port=5555, debug=True)