# app/__init__.py
from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from config import MONGO_URI, SECRET_KEY, STRIPE_SECRET_KEY, ALLOWED_ORIGINS

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.config.update(
        MONGO_URI=MONGO_URI,
        SECRET_KEY=SECRET_KEY,
        STRIPE_SECRET_KEY=STRIPE_SECRET_KEY,
    )

    mongo.init_app(app)

    # CORS: allow multiple origins (dev + prod) from env
    CORS(
        app,
        supports_credentials=True,                 # ok even with JWT in Authorization
        origins=ALLOWED_ORIGINS,                  # list like ["http://localhost:3000", "https://your-frontend"]
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        max_age=86400
    )

    @app.get("/health")
    def health(): return jsonify(status="ok")

    # Register blueprints after CORS
    from app.routes.admin_routes import admin_routes
    from app.routes.auth_routes import auth_bp
    from app.routes.user_auth_routes import user_auth_bp
    from app.routes.student_routes import student_bp
    from app.routes.payment_routes import payment_bp
    from app.routes.chat_routes import chat_routes

    app.register_blueprint(user_auth_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_routes)
    app.register_blueprint(chat_routes)
    app.register_blueprint(student_bp)
    app.register_blueprint(payment_bp)

    return app
