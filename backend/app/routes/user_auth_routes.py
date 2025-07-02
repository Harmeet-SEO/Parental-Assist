from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from bson.objectid import ObjectId

user_auth_bp = Blueprint('user_auth', __name__, url_prefix='/api')

@user_auth_bp.route('/register', methods=['POST'])
def register():
    db = current_app.config['DB']
    data = request.json

    if db.users.find_one({"email": data['email']}):
        return jsonify({"error": "User already exists"}), 400

    hashed_pw = generate_password_hash(data['password'])
    user = {
        "firstname": data['firstname'],
        "lastname": data['lastname'],
        "email": data['email'],
        "password": hashed_pw,
        "userType": data.get('userType', 'parent'),
        "phone_number": data['phone_number'],
        "address": data['address'],
        "created_at": datetime.datetime.utcnow()
    }


    db.users.insert_one(user)
    return jsonify({"message": "User registered successfully"}), 201


@user_auth_bp.route('/login', methods=['POST'])
def login():
    db = current_app.config['DB']
    data = request.json
    user = db.users.find_one({"email": data['email']})

    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({"error": "Invalid email or password"}), 401

    token = jwt.encode({
        "user_id": str(user['_id']),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({"token": token})
@user_auth_bp.route('/user', methods=['GET'])
def get_user():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = decoded["user_id"]

        user = current_app.config['DB'].users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "email": user["email"],
            "firstname": user.get("firstname", ""),
            "lastname": user.get("lastname", ""),
            "userType": user.get("userType", ""),
            "address": user.get("address", ""),
            "phone_number": user.get("phone_number", "")
        })

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
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
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "email": update_data["email"],
                "phone_number": update_data["phone_number"],
                "address": update_data["address"]
            }}
        )

        updated_user = db.users.find_one({"_id": ObjectId(user_id)})
        updated_user["_id"] = str(updated_user["_id"])
        return jsonify(updated_user)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
