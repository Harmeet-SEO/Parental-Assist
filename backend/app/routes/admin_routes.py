from flask import Blueprint, jsonify, request
from bson import ObjectId
from datetime import datetime
from app import mongo

admin_routes = Blueprint("admin_routes", __name__)

# === USERS ===

@admin_routes.route("/api/admin/users", methods=["GET"])
def get_users():
    users = list(mongo.db.users.find())
    for user in users:
        user["_id"] = str(user["_id"])
    return jsonify(users), 200

@admin_routes.route("/api/admin/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    result = mongo.db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 1:
        return jsonify({"message": "User deleted"})
    return jsonify({"error": "User not found"}), 404

@admin_routes.route("/api/admin/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.json
    new_type = data.get("userType")

    found_in = None
    collections = ["users", "admins", "parents"]
    for coll in collections:
        user = mongo.db[coll].find_one({"_id": ObjectId(user_id)})
        if user:
            found_in = coll
            break

    if not found_in:
        return jsonify({"error": "User not found"}), 404

    mongo.db[found_in].delete_one({"_id": ObjectId(user_id)})

    new_doc = user.copy()
    new_doc.update(data)
    new_doc.pop("_id")
    new_doc['created_at'] = datetime.utcnow()

    if new_type == "admin":
        mongo.db.admins.insert_one(new_doc)
    elif new_type == "parent":
        mongo.db.parents.insert_one(new_doc)
    else:
        mongo.db.users.insert_one(new_doc)

    return jsonify({"message": "User type updated"}), 200

@admin_routes.route("/api/admin/create_user", methods=["POST"])
def create_user():
    data = request.json
    userType = data.get("userType", "user")

    user_doc = {
        "firstname": data.get("firstname"),
        "lastname": data.get("lastname"),
        "email": data.get("email"),
        "phone_number": data.get("phone_number"),
        "address": data.get("address"),
        "userType": userType,
        "created_at": datetime.utcnow()
    }

    if userType == "admin":
        mongo.db.admins.insert_one(user_doc)
    elif userType == "parent":
        parent_result = mongo.db.parents.insert_one(user_doc)
        parent_id = parent_result.inserted_id

        children = data.get("children", [])
        for child in children:
            child_doc = {**child, "parent_id": parent_id}
            mongo.db.children.insert_one(child_doc)
    else:
        mongo.db.users.insert_one(user_doc)

    return jsonify({"message": "User created"}), 201

# === CONTENT ===

@admin_routes.route("/api/admin/content", methods=["GET"])
def get_content():
    content = list(mongo.db.content.find())
    for item in content:
        item["_id"] = str(item["_id"])
    return jsonify(content), 200

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

@admin_routes.route("/api/admin/content/<content_id>", methods=["DELETE"])
def delete_content(content_id):
    result = mongo.db.content.delete_one({"_id": ObjectId(content_id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Content deleted"})
    return jsonify({"error": "Content not found"}), 404

# === DASHBOARD ===

@admin_routes.route("/api/admin/dashboard", methods=["GET"])
def dashboard():
    admins = list(mongo.db.admins.find().sort([('created_at', -1)]).limit(5))
    parents = list(mongo.db.parents.find().sort([('created_at', -1)]).limit(5))
    users = list(mongo.db.users.find().sort([('created_at', -1)]).limit(5))
    children = list(mongo.db.children.find())

    # Convert all parent IDs to strings & init children
    parent_map = {}
    for parent in parents:
        parent["_id"] = str(parent["_id"])
        parent["children"] = []
        parent_map[parent["_id"]] = parent

    # Convert child IDs and parent_id to strings, then attach
    for child in children:
        child["_id"] = str(child["_id"])
        if "parent_id" in child:
            pid = str(child["parent_id"])  # Force parent_id to string
            if pid in parent_map:
                parent_map[pid]["children"].append(child)

    for u in admins + users:
        u["_id"] = str(u["_id"])

    return jsonify({
        "admins": admins,
        "parents": parents,
        "users": users
    })


@admin_routes.route("/api/admin/parents/<parent_id>/children", methods=["POST"])
def add_child(parent_id):
    data = request.json
    child_doc = {
        "name": data.get("name"),
        "age": data.get("age"),
        "gender": data.get("gender"),
        "parent_id": ObjectId(parent_id)
    }
    mongo.db.children.insert_one(child_doc)
    return jsonify({"message": "Child added"}), 201

@admin_routes.route("/api/admin/children/<child_id>", methods=["DELETE"])
def delete_child(child_id):
    result = mongo.db.children.delete_one({"_id": ObjectId(child_id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Child deleted"})
    return jsonify({"error": "Child not found"}), 404
