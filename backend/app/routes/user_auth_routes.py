from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime

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
