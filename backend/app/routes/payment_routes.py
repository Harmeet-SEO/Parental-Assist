import stripe
from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
import jwt

payment_bp = Blueprint("payment", __name__, url_prefix="/api")

@payment_bp.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    stripe.api_key = current_app.config["STRIPE_SECRET_KEY"]
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
        user_id = decoded["user_id"]
        db = current_app.config["DB"]

        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 403

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": "ChatBot Premium Access",
                    },
                    "unit_amount": 500,  # $5.00
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url="http://localhost:3000/chatbot-success",
            cancel_url="http://localhost:3000/",
        )

        return jsonify({"sessionId": session.id})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
