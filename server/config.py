from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_jwt_extended import JWTManager

# Create Flask app
app = Flask(__name__)

# Naming convention for Alembic/Migrate
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})


# Config settings
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.config["JWT_SECRET_KEY"] = "i-should-be-secret-and-stored-in-env-variables"

# Initialize extensions with app
db = SQLAlchemy(app, metadata=metadata)  # app passed directly here
migrate = Migrate(app, db)
#db.init_app(app)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)
api = Api(app)




