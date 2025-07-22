# backend/app/routes/chat_routes.py
from flask import Blueprint, request, jsonify
from app.chatbot import get_bot_response

chat_routes = Blueprint('chat_routes', __name__)

@chat_routes.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    user_id = data.get("user_id", "default")  # Optional per-user history

    response = get_bot_response(user_id, message)
    return jsonify({"response": response})
