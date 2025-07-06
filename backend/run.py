from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from config import MONGO_URI, SECRET_KEY
from app.routes.user_auth_routes import user_auth_bp
from app.routes import admin_routes
from app import mongo
from flask import Flask, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)
CORS(app)

# DB connection
client = MongoClient(MONGO_URI)
db = client.get_database()  # parental_assist

# make db and secret available globally
app.config['DB'] = db
app.config['SECRET_KEY'] = SECRET_KEY

@app.route("/api/admin/users")
def get_users():
    users = list(mongo.db.users.find())
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users), 200

@app.route("/api/admin/content")
def get_content():
    content = list(mongo.db.content.find())
    for item in content:
        item['_id'] = str(item['_id'])
    return jsonify(content), 200

# Register routes
from app.routes.auth_routes import auth_bp
app.register_blueprint(auth_bp)         # admin dashboard
app.register_blueprint(admin_routes)
app.register_blueprint(user_auth_bp)    # frontend user auth

if __name__ == '__main__':
    app.run(debug=True)
