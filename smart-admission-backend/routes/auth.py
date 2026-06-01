from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database.db import db, User, AcademicProfile

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("name"):
        return jsonify({"error": "Name and email required"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        name=data["name"],
        email=data["email"],
        phone=data.get("phone", ""),
        stream=data.get("stream", ""),
    )
    user.set_password(data.get("password", "password123"))
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email", "")).first()

    # Demo mode — accept any password
    if not user:
        # Auto-create demo user
        user = User(name="Rahul Sharma", email=data.get("email", "demo@example.com"), stream="Science (PCM)", phone="+91 98765 43210")
        user.set_password("demo123")
        db.session.add(user)
        db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    uid = int(get_jwt_identity())
    user = User.query.get_or_404(uid)
    profile = user.academics.to_dict() if user.academics else {}
    return jsonify({"user": user.to_dict(), "academics": profile})


@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    uid  = int(get_jwt_identity())
    user = User.query.get_or_404(uid)
    data = request.get_json()

    # Update user fields
    for field in ["name", "phone", "stream"]:
        if field in data:
            setattr(user, field, data[field])

    # Upsert academic profile
    acad = user.academics or AcademicProfile(user_id=uid)
    for field in ["p10", "p12", "cgpa", "entrance_score", "entrance_exam", "category", "branch", "state", "extra"]:
        if field in data:
            setattr(acad, field, data[field])

    db.session.add(acad)
    db.session.commit()
    return jsonify({"message": "Profile updated", "user": user.to_dict()})
