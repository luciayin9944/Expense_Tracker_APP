from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from marshmallow import Schema, fields
from config import db, bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)

    expenses = db.relationship('Expense', back_populates='user')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'User {self.username}, ID {self.id}'


class Expense(db.Model):
    __tablename__ = 'expenses'

    id = db.Column(db.Integer, primary_key=True)
    purchase_item = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    #category = db.Column(db.String)
    category = db.Column(db.String, nullable=False, server_default='Other')


    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='expenses')

    @validates("category")
    def validate_category(self, key, value):
        allowed = {'Food', 'Utilities', 'Clothing', 'Home', 'Travel', 'Entertainment', 'Health', 'Other'}
        if value not in allowed:
            raise ValueError(f"Invalid category: {value}")
        return value

    def __repr__(self):
        return f'Expense {self.id}, Purchase Item: {self.purchase_item}, Amount: ${self.amount}'


class UserSchema(Schema):
    id = fields.Int()
    username = fields.Str()
    expenses = fields.List(fields.Nested(lambda: ExpenseSchema(exclude=("user",))))


class ExpenseSchema(Schema):
    id = fields.Int()
    purchase_item = fields.Str()
    amount = fields.Float()
    date = fields.Date()
    category = fields.Str()
    user = fields.Nested(lambda: UserSchema(exclude=("expenses",)))