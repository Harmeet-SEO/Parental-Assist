from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS  # ✅✅✅ ADD THIS
from config import MONGO_URI, SECRET_KEY

from pymongo import MongoClient

from app.routes.chat_routes import chat_routes


mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"] = MONGO_URI
    app.config['SECRET_KEY'] = SECRET_KEY

    mongo.init_app(app)


    # ✅✅✅ Apply CORS to the entire app:
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    client = MongoClient(MONGO_URI)
    db = client.get_database()
    app.config['DB'] = db


    app.config['DB'] = mongo.db
    # Import and register your Blueprints
    from app.routes.admin_routes import admin_routes
    from app.routes.auth_routes import auth_bp
    from app.routes.user_auth_routes import user_auth_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.admin_routes import admin_routes

    app.register_blueprint(user_auth_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_routes)
    app.register_blueprint(chat_routes)

    return app
