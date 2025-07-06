# backend/app/__init__.py

from flask import Flask
from flask_pymongo import PyMongo
from config import MONGO_URI

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"] = MONGO_URI

    mongo.init_app(app)

    # ✅ Import Blueprints here and register them
    from app.routes.admin_routes import admin_routes
    from app.routes.auth_routes import auth_routes
    # Add any other routes if you have them
    app.register_blueprint(admin_routes)
    app.register_blueprint(auth_routes)

    return app
