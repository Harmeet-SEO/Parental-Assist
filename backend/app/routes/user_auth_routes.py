from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from bson.objectid import ObjectId

user_auth_bp = Blueprint('user_auth', __name__, url_prefix='/api')

# === REGISTER PARENT ===
@user_auth_bp.route('/register', methods=['POST'])
def register():
    db = current_app.config['DB']
    data = request.json or {}

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if db.parents.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = generate_password_hash(password)

    parent = {
        "firstname": data.get('firstname', ''),
        "lastname": data.get('lastname', ''),
        "email": email,
        "password": hashed_pw,
        "phone_number": data.get('phone_number', ''),
        "address": data.get('address', ''),
        "city": data.get('city', ''),
        "province": data.get('province', ''),
        "country": data.get('country', ''),
        "created_at": datetime.datetime.utcnow()
    }

    db.parents.insert_one(parent)
    return jsonify({"message": "Parent registered successfully"}), 201


# === LOGIN PARENT ===
@user_auth_bp.route('/login', methods=['POST'])
def login():
    db = current_app.config['DB']
    data = request.json

    parent = db.parents.find_one({"email": data['email']})

    if not parent or not check_password_hash(parent['password'], data['password']):
        return jsonify({"error": "Invalid email or password"}), 401

    token = jwt.encode({
        "user_id": str(parent['_id']),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({"token": token})

# === GET CURRENT PARENT ===
@user_auth_bp.route('/user', methods=['GET'])
def get_user():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = decoded["user_id"]

        parent = current_app.config['DB'].parents.find_one({"_id": ObjectId(user_id)})
        if not parent:
            return jsonify({"error": "Parent not found"}), 404

        return jsonify({
            "email": parent["email"],
            "firstname": parent.get("firstname", ""),
            "lastname": parent.get("lastname", ""),
            "phone_number": parent.get("phone_number", ""),
            "city": parent.get("city", ""),
            "province": parent.get("province", ""),
            "country": parent.get("country", "")
        })

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

# === UPDATE PARENT ===
@user_auth_bp.route('/user/update', methods=['PUT'])
def update_user():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = decoded["user_id"]
        db = current_app.config['DB']

        update_data = request.json
        db.parents.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "email": update_data["email"],
                "phone_number": update_data["phone_number"],
                "city": update_data["city"],
                "province": update_data["province"],
                "country": update_data["country"]
            }}
        )

        updated_parent = db.parents.find_one({"_id": ObjectId(user_id)})
        updated_parent["_id"] = str(updated_parent["_id"])
        return jsonify(updated_parent)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
