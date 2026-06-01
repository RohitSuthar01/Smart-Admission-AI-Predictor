from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db, Prediction, College
from models.predictor import predict_admission

predict_bp = Blueprint("predict", __name__)


@predict_bp.route("/", methods=["POST"])
@jwt_required()
def run_prediction():
    uid  = int(get_jwt_identity())
    data = request.get_json()

    required = ["p10", "p12", "cgpa", "entrance"]
    for r in required:
        if r not in data:
            return jsonify({"error": f"Missing field: {r}"}), 400

    result = predict_admission(
        p10=float(data["p10"]),
        p12=float(data["p12"]),
        cgpa=float(data["cgpa"]),
        entrance=float(data["entrance"]),
        category=data.get("category", "General"),
        extra=data.get("extra", "None"),
        exam=data.get("exam", "JEE Main"),
    )

    # Save to DB
    pred = Prediction(
        user_id=uid,
        overall=result["overall"],
        lr_score=result["lr_score"],
        rf_score=result["rf_score"],
        log_score=result["log_score"],
        rank=result["rank"],
    )
    db.session.add(pred)
    db.session.commit()

    # Eligible colleges
    overall = result["overall"]
    p12     = float(data["p12"])
    eligible = College.query.filter(
        College.cutoff_pct <= p12 + 5
    ).order_by(College.rating.desc()).limit(20).all()

    result["eligible_colleges"] = [c.to_dict() for c in eligible]
    result["prediction_id"] = pred.id
    return jsonify(result)


@predict_bp.route("/history", methods=["GET"])
@jwt_required()
def history():
    uid = int(get_jwt_identity())
    preds = Prediction.query.filter_by(user_id=uid).order_by(Prediction.created_at.desc()).limit(10).all()
    return jsonify([p.to_dict() for p in preds])
