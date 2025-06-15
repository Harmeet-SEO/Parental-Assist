import os
from flask import Flask
from flask_pymongo import PyMongo

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
    mongo.init_app(app)

    from app.routes import auth_routes, admin_routes, parent_routes
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(admin_routes.bp)
    app.register_blueprint(parent_routes.bp)

    return app
