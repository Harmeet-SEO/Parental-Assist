from functools import wraps
from flask import request, jsonify, current_app
import jwt
from bson.objectid import ObjectId

def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Missing token"}), 401
        try:
            decoded = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            user_id = decoded["user_id"]

            db = current_app.config['DB']
            user = db.users.find_one({"_id": ObjectId(user_id)})
            if not user or user.get("userType") != "admin":
                return jsonify({"error": "Unauthorized"}), 403

            return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
    return decorated
