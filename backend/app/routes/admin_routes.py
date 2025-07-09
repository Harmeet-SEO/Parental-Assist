from flask import Blueprint, jsonify, request
from bson import ObjectId
from app import mongo

admin_routes = Blueprint("admin_routes", __name__)

# === USERS ===

# Get all users
@admin_routes.route("/api/admin/users", methods=["GET"])
def get_users():
    users = list(mongo.db.users.find())
    for user in users:
        user["_id"] = str(user["_id"])
    return jsonify(users), 200

# Delete a user
@admin_routes.route("/api/admin/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    result = mongo.db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 1:
        return jsonify({"message": "User deleted"})
    return jsonify({"error": "User not found"}), 404

# (Optional) Update user
@admin_routes.route("/api/admin/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.json
    result = mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "firstname": data.get("firstname"),
            "lastname": data.get("lastname"),
            "email": data.get("email"),
            "phone_number": data.get("phone_number"),
            "address": data.get("address")
        }}
    )
    if result.matched_count == 1:
        return jsonify({"message": "User updated"})
    return jsonify({"error": "User not found"}), 404

# === CONTENT ===

# Get all content
@admin_routes.route("/api/admin/content", methods=["GET"])
def get_content():
    content = list(mongo.db.content.find())
    for item in content:
        item["_id"] = str(item["_id"])
    return jsonify(content), 200

# Add new content
@admin_routes.route("/api/admin/content", methods=["POST"])
def add_content():
    data = request.json
    new_item = {
        "title": data.get("title"),
        "body": data.get("body"),
        "created_at": data.get("created_at")
    }
    result = mongo.db.content.insert_one(new_item)
    new_item["_id"] = str(result.inserted_id)
    return jsonify(new_item), 201

# Update content
@admin_routes.route("/api/admin/content/<content_id>", methods=["PUT"])
def update_content(content_id):
    data = request.json
    result = mongo.db.content.update_one(
        {"_id": ObjectId(content_id)},
        {"$set": {
            "title": data.get("title"),
            "body": data.get("body")
        }}
    )
    if result.matched_count == 1:
        return jsonify({"message": "Content updated"})
    return jsonify({"error": "Content not found"}), 404

# Delete content
@admin_routes.route("/api/admin/content/<content_id>", methods=["DELETE"])
def delete_content(content_id):
    result = mongo.db.content.delete_one({"_id": ObjectId(content_id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Content deleted"})
    return jsonify({"error": "Content not found"}), 404
