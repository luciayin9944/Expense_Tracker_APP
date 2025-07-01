#!/usr/bin/env python3

from flask import request, session, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import app, db, api, jwt
from models import User, Expense, UserSchema, ExpenseSchema
from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request, jwt_required
from datetime import datetime


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
    @jwt_required()
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



class ExpensesIndex(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()

        # #pagination
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 5, type=int)

        pagination = Expense.query.filter_by(user_id=current_user_id).order_by(Expense.date.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        expenses = pagination.items
        total_pages = pagination.pages
        total_items = pagination.total

        result = [
            {
                "id": e.id,
                "purchase_item": e.purchase_item,
                "amount": e.amount,
                "date": e.date.isoformat(),
            }
            for e in expenses
        ]

        return jsonify({
            "expenses": result,
            "page": page,
            "per_page": per_page,
            "total_pages": total_pages,
            "total_items": total_items
        })

    
    @jwt_required()
    def post(self):
        data = request.get_json()

        try:
            date_obj = datetime.strptime(data["date"], "%Y-%m-%d").date()
        except ValueError:
            return {"errors": ["Invalid date format. Use YYYY-MM-DD."]}, 400

        new_expense = Expense(
            purchase_item=data["purchase_item"],
            amount=data["amount"],
            date=date_obj,  
            user_id=get_jwt_identity(), 
    )

        try:
            db.session.add(new_expense)
            db.session.commit()
            return ExpenseSchema().dump(new_expense), 201
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422



class ExpenseDetail(Resource):
    @jwt_required()
    def delete(self, id):
        expense = Expense.query.get(id)

        if not expense:
            return {"error": "Expense not found"}, 404

        if expense.user_id != int(get_jwt_identity()):
            return {"error": "Unauthorized"}, 403

        try:
            db.session.delete(expense)
            db.session.commit()
            return {"message": "Expense deleted successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 500
        
    
    @jwt_required()
    def patch(self, id):
        current_user_id = get_jwt_identity()
        expense = Expense.query.filter_by(id=id, user_id=current_user_id).first()

        if not expense:
            return {'error': 'Expense not found or not yours'}, 404

        data = request.get_json()
        print(f"PATCH /expenses/{id} with data: {data}")
        try:
            if 'purchase_item' in data:
                expense.purchase_item = data['purchase_item']
            if 'amount' in data:
                expense.amount = float(data['amount'])  
            if 'date' in data:
                expense.date = datetime.strptime(data['date'], "%Y-%m-%d").date()
                
            db.session.commit()  
            return ExpenseSchema().dump(expense), 200 
        except ValueError as e:
            return {"errors": [str(e)]}, 400
        except Exception as e:
            db.session.rollback()

            import traceback
            traceback.print_exc()  #print error
            return {"error": str(e)}, 500



api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(WhoAmI, '/me', endpoint='me')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(ExpensesIndex, '/expenses', endpoint='expenses')
api.add_resource(ExpenseDetail, '/expenses/<int:id>', endpoint='expense_detail')


if __name__ == '__main__':
    app.run(port=5555, debug=True)