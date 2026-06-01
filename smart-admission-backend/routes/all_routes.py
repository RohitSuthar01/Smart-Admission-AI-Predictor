"""
All remaining API routes
"""
from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db, Course, Career, Scholarship, User, Prediction
import io, json

# ─── COURSES ─────────────────────────────────────────────────
courses_bp = Blueprint("courses", __name__)

@courses_bp.route("/", methods=["GET"])
def get_courses():
    q = Course.query

    topic   = request.args.get("topic", "")
    level   = request.args.get("level", "")
    platform= request.args.get("platform", "")
    price   = request.args.get("price", "")    # free | paid | under500
    search  = request.args.get("search", "")
    sort_by = request.args.get("sort", "rating")

    if topic   and topic != "All":    q = q.filter(Course.topic.ilike(f"%{topic}%"))
    if level   and level != "All":    q = q.filter(Course.level == level)
    if platform and platform != "All":q = q.filter(Course.platform.ilike(f"%{platform}%"))
    if search:                         q = q.filter(Course.title.ilike(f"%{search}%"))

    if price == "free":     q = q.filter(Course.price_inr == 0)
    elif price == "paid":   q = q.filter(Course.price_inr > 0)
    elif price == "under500": q = q.filter(Course.price_inr.between(1, 500))

    if sort_by == "rating": q = q.order_by(Course.rating.desc())
    elif sort_by == "price_asc": q = q.order_by(Course.price_inr.asc())
    elif sort_by == "price_desc": q = q.order_by(Course.price_inr.desc())

    courses = q.all()
    return jsonify({"courses": [c.to_dict() for c in courses], "total": len(courses)})


@courses_bp.route("/topics", methods=["GET"])
def get_topics():
    topics = db.session.query(Course.topic).distinct().all()
    return jsonify([t[0] for t in topics if t[0]])


# ─── CAREER ──────────────────────────────────────────────────
career_bp = Blueprint("career", __name__)

@career_bp.route("/", methods=["GET"])
def get_careers():
    demand = request.args.get("demand", "")
    q = Career.query
    if demand and demand != "All":
        q = q.filter(Career.demand == demand)
    q = q.order_by(Career.growth_pct.desc())
    careers = q.all()
    return jsonify({"careers": [c.to_dict() for c in careers]})


@career_bp.route("/salary-chart", methods=["GET"])
def salary_chart():
    careers = Career.query.order_by(Career.salary_india_max.desc()).limit(10).all()
    return jsonify([{
        "title": c.title,
        "icon": c.icon,
        "india_max": c.salary_india_max,
        "india_min": c.salary_india_min,
        "us_max": c.salary_us_max,
        "us_min": c.salary_us_min,
        "growth": c.growth_pct,
        "demand": c.demand,
    } for c in careers])


# ─── SCHOLARSHIP ─────────────────────────────────────────────
scholarship_bp = Blueprint("scholarship", __name__)

@scholarship_bp.route("/", methods=["GET"])
def get_scholarships():
    p12      = float(request.args.get("p12", 0))
    category = request.args.get("category", "General")
    stream   = request.args.get("stream", "All")
    income   = int(request.args.get("income", 0))

    scholarships = Scholarship.query.all()
    result = []
    for s in scholarships:
        d = s.to_dict()
        eligible = True
        reasons  = []
        if p12 and p12 < s.min_marks:
            eligible = False
            reasons.append(f"Need {s.min_marks}% in Class 12 (you have {p12}%)")
        if category and category not in s.categories:
            eligible = False
            reasons.append(f"Only for {s.categories}")
        if income and s.income_limit and income > s.income_limit:
            eligible = False
            reasons.append(f"Income limit ₹{s.income_limit:,}")
        d["eligible"] = eligible
        d["ineligible_reasons"] = reasons
        result.append(d)

    result.sort(key=lambda x: (not x["eligible"], -x["amount_raw"]))
    return jsonify({"scholarships": result, "eligible_count": sum(1 for r in result if r["eligible"])})


# ─── ANALYTICS ───────────────────────────────────────────────
analytics_bp = Blueprint("analytics", __name__)

@analytics_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard_stats():
    uid  = int(get_jwt_identity())
    user = User.query.get_or_404(uid)
    preds = Prediction.query.filter_by(user_id=uid).order_by(Prediction.created_at.desc()).all()
    latest = preds[0] if preds else None

    acad = user.academics
    subjects = []
    if acad:
        subjects = [
            {"name": "Physics",      "score": min(acad.p12 + 3, 100) if acad.p12 else 88, "target": 90},
            {"name": "Mathematics",  "score": max(acad.p12 - 10, 40) if acad.p12 else 75, "target": 85},
            {"name": "Chemistry",    "score": max(acad.p12 - 5, 50)  if acad.p12 else 80, "target": 85},
            {"name": "English",      "score": min(acad.p12 + 5, 100) if acad.p12 else 90, "target": 85},
            {"name": "Computer Sci", "score": min(acad.cgpa * 10 + 3, 100) if acad.cgpa else 92, "target": 90},
        ]

    return jsonify({
        "user":    user.to_dict(),
        "latest_prediction": latest.to_dict() if latest else None,
        "total_predictions": len(preds),
        "subjects": subjects,
        "study_hours": 142,
        "mock_tests": 18,
        "monthly_progress": [
            {"month": "Jan", "score": 72}, {"month": "Feb", "score": 74},
            {"month": "Mar", "score": 76}, {"month": "Apr", "score": 80},
            {"month": "May", "score": 85}, {"month": "Jun", "score": 88},
        ],
    })


# ─── RESUME ──────────────────────────────────────────────────
resume_bp = Blueprint("resume", __name__)

@resume_bp.route("/generate", methods=["POST"])
@jwt_required()
def generate_resume():
    """Generate a PDF resume using ReportLab"""
    uid  = int(get_jwt_identity())
    user = User.query.get_or_404(uid)
    data = request.get_json()

    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors
        from reportlab.lib.units import cm

        buffer = io.BytesIO()
        doc    = SimpleDocTemplate(buffer, pagesize=A4,
                                   leftMargin=2*cm, rightMargin=2*cm,
                                   topMargin=2*cm, bottomMargin=2*cm)
        styles = getSampleStyleSheet()
        story  = []

        # Title
        title_style = ParagraphStyle("title", parent=styles["Title"],
                                     fontSize=20, textColor=colors.HexColor("#1a1a2e"),
                                     spaceAfter=4)
        story.append(Paragraph(data.get("name", user.name), title_style))

        sub_style = ParagraphStyle("sub", parent=styles["Normal"],
                                   fontSize=11, textColor=colors.grey, spaceAfter=6)
        story.append(Paragraph("B.Tech CSE Aspirant · Science (PCM)", sub_style))

        # Contact
        contact = f"{data.get('email','')}&nbsp;|&nbsp;{data.get('phone','')}&nbsp;|&nbsp;{data.get('city','')}"
        story.append(Paragraph(contact, styles["Normal"]))
        story.append(HRFlowable(width="100%", color=colors.HexColor("#6c63ff"), spaceAfter=10, spaceBefore=8))

        def section(title):
            sec_style = ParagraphStyle("sec", parent=styles["Heading2"],
                                       fontSize=11, textColor=colors.HexColor("#6c63ff"),
                                       spaceAfter=4, spaceBefore=8, borderPadding=(0,0,2,0))
            story.append(Paragraph(title.upper(), sec_style))

        section("Career Objective")
        story.append(Paragraph(data.get("objective", "Aspiring software engineer."), styles["Normal"]))

        section("Education")
        story.append(Paragraph(f"<b>Class 12 (CBSE)</b> — {data.get('p12',88)}% &nbsp;&nbsp; 2025", styles["Normal"]))
        story.append(Paragraph(f"<b>Class 10 (CBSE)</b> — {data.get('p10',92)}% &nbsp;&nbsp; 2023", styles["Normal"]))

        section("Technical Skills")
        skills = data.get("skills", "Python, C++, Java, React, ML, SQL, Git")
        story.append(Paragraph(skills, styles["Normal"]))

        section("Projects")
        for proj in data.get("projects", [{"title":"AI Admission Predictor","desc":"ML model predicting admission chances with 87% accuracy."},{"title":"Student Portal","desc":"Full-stack web app with React & Flask."}]):
            story.append(Paragraph(f"<b>{proj['title']}</b>", styles["Normal"]))
            story.append(Paragraph(proj["desc"], styles["Normal"]))
            story.append(Spacer(1, 4))

        section("Achievements")
        for ach in data.get("achievements", ["JEE Main 2025 — 95.2 Percentile","State Science Olympiad — Gold Medal","NSS Volunteer — 120+ hours"]):
            story.append(Paragraph(f"• {ach}", styles["Normal"]))

        doc.build(story)
        buffer.seek(0)

        return send_file(buffer, mimetype="application/pdf",
                         as_attachment=True,
                         download_name=f"{user.name.replace(' ','_')}_Resume.pdf")

    except ImportError:
        return jsonify({"error": "ReportLab not installed. Run: pip install reportlab"}), 500


# ─── ADMIN ───────────────────────────────────────────────────
admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
def admin_stats():
    from database.db import College
    return jsonify({
        "total_students":  User.query.count(),
        "total_colleges":  College.query.count(),
        "total_predictions": Prediction.query.count(),
        "active_today": 341,  # replace with real session tracking
    })

@admin_bp.route("/students", methods=["GET"])
@jwt_required()
def admin_students():
    page = int(request.args.get("page", 1))
    per  = int(request.args.get("per", 20))
    search = request.args.get("search","")
    q = User.query
    if search:
        q = q.filter(User.name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%"))
    total = q.count()
    users = q.order_by(User.created_at.desc()).offset((page-1)*per).limit(per).all()
    return jsonify({"students": [u.to_dict() for u in users], "total": total})

@admin_bp.route("/students/<int:uid>", methods=["DELETE"])
@jwt_required()
def delete_student(uid):
    user = User.query.get_or_404(uid)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Student deleted"})
