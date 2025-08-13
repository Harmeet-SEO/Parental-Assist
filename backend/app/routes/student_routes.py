from flask import Blueprint, request, jsonify, current_app
import jwt
from bson.objectid import ObjectId
import datetime

student_bp = Blueprint('student', __name__, url_prefix='/api/student')

# === MARK ACTIVITY COMPLETE ===
@student_bp.route('/complete-activity', methods=['POST'])
def complete_activity():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = decoded["user_id"]

        db = current_app.config['DB']
        user = db.users.find_one({"_id": ObjectId(user_id)})

        if not user or user.get("userType") != "student":
            return jsonify({"error": "Unauthorized"}), 403

        activity_data = request.json
        activity_record = {
            "student_id": user_id,
            "question": activity_data.get("question"),
            "answered_on": datetime.datetime.utcnow(),
            "is_correct": activity_data.get("is_correct", False)
        }

        db.completed_activities.insert_one(activity_record)

        return jsonify({"message": "Activity recorded successfully"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
# === GET COMPLETED ACTIVITIES ===
@student_bp.route('/completed', methods=['GET'])
def get_completed_activities():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = decoded["user_id"]
        db = current_app.config['DB']

        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user or user.get("userType") != "student":
            return jsonify({"error": "Unauthorized"}), 403

        activities = list(db.completed_activities.find({"student_id": user_id}))
        for act in activities:
            act["_id"] = str(act["_id"])
            act["answered_on"] = act["answered_on"].isoformat()

        return jsonify({"activities": activities})

    except Exception as e:
        return jsonify({"error": str(e)}), 500