from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from config import MONGO_URI, SECRET_KEY
from app.routes.user_auth_routes import user_auth_bp

app = Flask(__name__)
CORS(app)

# DB connection
client = MongoClient(MONGO_URI)
db = client.get_database()  # parental_assist

# make db and secret available globally
app.config['DB'] = db
app.config['SECRET_KEY'] = SECRET_KEY

# Register routes
from app.routes.auth_routes import auth_bp
app.register_blueprint(auth_bp)         # admin dashboard
app.register_blueprint(user_auth_bp)    # frontend user auth

if __name__ == '__main__':
    app.run(debug=True)
