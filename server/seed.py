#!/usr/bin/env python3

from random import randint, choice as rc

from faker import Faker
from faker_commerce import Provider

from app import app
from models import db, Expense, User

fake = Faker()
fake.add_provider(Provider)

with app.app_context():

    print("Deleting all records...")
    Expense.query.delete()
    User.query.delete()

    fake = Faker()

    print("Creating users...")

    # make sure users have unique usernames
    users = []
    usernames = []

    for i in range(6):
        
        username = fake.first_name()
        while username in usernames:
            username = fake.first_name()
        usernames.append(username)

        user = User(
            username=username,
        )

        user.password_hash = user.username + 'password'

        users.append(user)

    db.session.add_all(users)

    print("Creating expenses...")
    expenses = []
    #categories = ['Food', 'Utilities', 'Clothing']
    
    for i in range(20):   
        expense = Expense(
            purchase_item=fake.commerce.product(),
            amount=fake.commerce.price(),
            date=fake.date_between(start_date='-1y', end_date='today'),
            user=rc(users)  # randomly assign a user
            #category=rc(categories),
        )
        expenses.append(expense)

    db.session.add_all(expenses)
    db.session.commit()
    print("Complete.")
