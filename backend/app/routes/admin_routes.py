# backend/app/routes/admin_routes.py

from flask import Blueprint, jsonify
from bson import ObjectId
from app import mongo

admin_routes = Blueprint('admin_routes', __name__)

# ✅ Get all users
@admin_routes.route('/api/admin/users', methods=['GET'])
def get_users():
    users = list(mongo.db.users.find())
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users), 200

# ✅ Get all content
@admin_routes.route('/api/admin/content', methods=['GET'])
def get_content():
    content = list(mongo.db.content.find())
    for item in content:
        item['_id'] = str(item['_id'])
    return jsonify(content), 200