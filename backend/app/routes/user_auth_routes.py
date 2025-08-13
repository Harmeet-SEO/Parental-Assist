# backend/app/routes/user_auth_routes.py
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
import jwt, datetime
from bson.objectid import ObjectId

from app import mongo                      # 👈 use the PyMongo instance
from config import ALLOWED_ORIGINS, SECRET_KEY

user_auth_bp = Blueprint("user_auth_bp", __name__, url_prefix="/api")

@user_auth_bp.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True,
              allow_headers=['Content-Type','Authorization'])
def register():
    if request.method == 'OPTIONS':
        return ("", 204)

    db = mongo.db                          # 👈 use mongo.db
    data = request.get_json(silent=True) or {}

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    user_type = data.get('userType', 'parent')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if db.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = generate_password_hash(password)
    user = {
        "firstname": data.get('firstname', ''),
        "lastname": data.get('lastname', ''),
        "email": email,
        "password": hashed_pw,
        "phone_number": data.get('phone_number', ''),
        "address": data.get('address', ''),
        "city": data.get('city', ''),
        "province": data.get('province', ''),
        "country": data.get('country', ''),
        "userType": user_type,
        "created_at": datetime.datetime.utcnow()
    }
    db.users.insert_one(user)
    return jsonify({"message": f"{user_type.capitalize()} registered successfully"}), 201


@user_auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True,
              allow_headers=['Content-Type','Authorization'])
def login():
    if request.method == 'OPTIONS':
        return ("", 204)

    db = mongo.db                          # 👈 use mongo.db
    data = request.get_json(silent=True) or {}

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = db.users.find_one({"email": email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = jwt.encode({
        "user_id": str(user['_id']),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({"token": token, "role": user.get("userType", "parent")}), 200


@user_auth_bp.route('/user', methods=['GET', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True,
              allow_headers=['Content-Type','Authorization'])
def get_user():
    if request.method == 'OPTIONS':
        return ("", 204)

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["user_id"]

        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})  # 👈
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "email": user["email"],
            "firstname": user.get("firstname", ""),
            "lastname": user.get("lastname", ""),
            "userType": user.get("userType", ""),
            "phone_number": user.get("phone_number", ""),
            "city": user.get("city", ""),
            "province": user.get("province", ""),
            "country": user.get("country", ""),
            "chatbot_paid": user.get("chatbot_paid", False)
        })
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401


@user_auth_bp.route('/user/update', methods=['PUT', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True,
              allow_headers=['Content-Type','Authorization'])
def update_user():
    if request.method == 'OPTIONS':
        return ("", 204)

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["user_id"]

        db = mongo.db
        payload = request.get_json(silent=True) or {}
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "email": payload.get("email"),
                "phone_number": payload.get("phone_number"),
                "address": payload.get("address"),
                "city": payload.get("city"),
                "province": payload.get("province"),
                "country": payload.get("country")
            }}
        )
        updated = db.users.find_one({"_id": ObjectId(user_id)})
        updated["_id"] = str(updated["_id"])
        return jsonify(updated)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_auth_bp.route('/mark-chatbot-paid', methods=['POST', 'OPTIONS'])
@cross_origin(origins=ALLOWED_ORIGINS, supports_credentials=True,
              allow_headers=['Content-Type','Authorization'])
def mark_chatbot_paid():
    if request.method == 'OPTIONS':
        return ("", 204)

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["user_id"]

        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"chatbot_paid": True}}
        )
        return jsonify({"message": "Chatbot access granted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
