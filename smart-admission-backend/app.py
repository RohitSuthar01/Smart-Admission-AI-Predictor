"""
Smart Admission AI Predictor — Flask Backend
=============================================
Run:  python app.py
API:  http://localhost:5000
"""

from flask import Flask
from flask_cors import CORS
from database.db import init_db
from routes.auth      import auth_bp
from routes.predict   import predict_bp
from routes.colleges  import colleges_bp
from routes.chat      import chat_bp
from routes.courses   import courses_bp
from routes.career    import career_bp
from routes.scholarship import scholarship_bp
from routes.resume    import resume_bp
from routes.analytics import analytics_bp
from routes.admin     import admin_bp

app = Flask(__name__)
app.config["SECRET_KEY"] = "smart-admission-secret-2025"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///smart_admission.db"   # swap to postgresql://... in prod
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

# ── Init DB ──────────────────────────────────
init_db(app)

# ── Register Blueprints ───────────────────────
app.register_blueprint(auth_bp,         url_prefix="/api/auth")
app.register_blueprint(predict_bp,      url_prefix="/api/predict")
app.register_blueprint(colleges_bp,     url_prefix="/api/colleges")
app.register_blueprint(chat_bp,         url_prefix="/api/chat")
app.register_blueprint(courses_bp,      url_prefix="/api/courses")
app.register_blueprint(career_bp,       url_prefix="/api/career")
app.register_blueprint(scholarship_bp,  url_prefix="/api/scholarship")
app.register_blueprint(resume_bp,       url_prefix="/api/resume")
app.register_blueprint(analytics_bp,    url_prefix="/api/analytics")
app.register_blueprint(admin_bp,        url_prefix="/api/admin")

@app.route("/")
def health():
    return {"status": "ok", "message": "Smart Admission AI Backend running 🚀"}

if __name__ == "__main__":
    app.run(debug=True, port=5000)
