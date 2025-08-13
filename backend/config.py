# config.py
import os

# Load .env.{APP_ENV} first, then fallback to .env
try:
    from dotenv import load_dotenv
    env = os.getenv("APP_ENV", "development").lower()  # "development" | "production" | "staging"
    if os.path.exists(f".env.{env}"):
        load_dotenv(dotenv_path=f".env.{env}", override=True)
    load_dotenv(override=False)  # fallback
except Exception:
    pass

MONGO_URI = os.environ.get("MONGO_URI", "")
SECRET_KEY = os.environ.get("SECRET_KEY", "change-me")
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "")

# Backward compatible: you can keep using FRONTEND_ORIGIN if you want
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "")  # comma-separated allowed origins

# Preferred: ALLOWED_ORIGINS (comma-separated)
# e.g., "http://localhost:3000,http://localhost:5173,https://your-frontend.vercel.app"
ALLOWED_ORIGINS = [
    o.strip() for o in (
        os.environ.get("ALLOWED_ORIGINS", FRONTEND_ORIGIN or "http://localhost:3000,http://localhost:5173")
    ).split(",") if o.strip()
]

APP_ENV = env
PORT = int(os.environ.get("PORT", "5000"))
FLASK_DEBUG = os.environ.get("FLASK_DEBUG", "0") == "1"
