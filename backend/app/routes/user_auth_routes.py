from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from bson.objectid import ObjectId

user_auth_bp = Blueprint('user_auth', __name__, url_prefix='/api')

# === REGISTER (Parent or Student) ===
@user_auth_bp.route('/register', methods=['POST'])
def register():
    db = current_app.config['DB']
    data = request.json or {}

    email = data.get('email')
    password = data.get('password')
    user_type = data.get('userType', 'parent')  # default to parent

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


# === LOGIN ===
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

    return jsonify({
        "token": token,
        "role": user.get("userType", "parent")
    })


# === GET CURRENT USER ===
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


# === UPDATE USER ===
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
                "email": update_data.get("email"),
                "phone_number": update_data.get("phone_number"),
                "address": update_data.get("address"),
                "city": update_data.get("city"),
                "province": update_data.get("province"),
                "country": update_data.get("country")
            }}
        )

        updated_user = db.users.find_one({"_id": ObjectId(user_id)})
        updated_user["_id"] = str(updated_user["_id"])
        return jsonify(updated_user)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_auth_bp.route('/mark-chatbot-paid', methods=['POST'])
def mark_chatbot_paid():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = decoded["user_id"]
        db = current_app.config['DB']

        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"chatbot_paid": True}}
        )

        return jsonify({"message": "Chatbot access granted"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
