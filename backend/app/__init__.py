# app/__init__.py
from flask import Flask, jsonify, request, make_response
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
    app.config['DB'] = mongo.db 
    # CORS for API routes. (You can keep app-wide if you want; this is explicit.)
    CORS(
        app,
        resources={r"/api/*": {"origins": ALLOWED_ORIGINS}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Content-Type", "Authorization"],
        max_age=86400,
    )

    @app.route("/api/<path:_any>", methods=["OPTIONS"])
    def _any_api_preflight(_any):
        # Ensure preflights always succeed
        return ("", 204)

    @app.after_request
    def _add_cors_headers(resp):
        # Safety net: add headers even on errors
        origin = request.headers.get("Origin")
        if origin and any(origin == o for o in ALLOWED_ORIGINS):
            resp.headers["Access-Control-Allow-Origin"] = origin
            resp.headers["Vary"] = "Origin"
            resp.headers["Access-Control-Allow-Credentials"] = "true"
            resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            resp.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        return resp

    @app.get("/health")
    def health():
        return jsonify(status="ok")

    # Register blueprints
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
