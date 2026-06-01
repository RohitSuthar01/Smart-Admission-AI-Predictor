from flask import Blueprint, request, jsonify
from database.db import db, College

colleges_bp = Blueprint("colleges", __name__)


@colleges_bp.route("/", methods=["GET"])
def get_colleges():
    q     = College.query

    # ── Filters ──────────────────────────────
    search  = request.args.get("search", "").strip()
    stream  = request.args.get("stream", "")
    state   = request.args.get("state", "")
    budget  = request.args.get("budget", "")   # "1L","3L","8L","8L+"
    rating  = request.args.get("rating", "")   # "3.5","4.0","4.5"
    sort_by = request.args.get("sort", "match") # match|rating|fees|package|nirf
    page    = int(request.args.get("page", 1))
    per     = int(request.args.get("per", 20))

    # Score-based match (if provided)
    p12      = float(request.args.get("p12", 0))
    entrance = float(request.args.get("entrance", 0))

    if search:
        q = q.filter(
            (College.name.ilike(f"%{search}%")) |
            (College.location.ilike(f"%{search}%"))
        )
    if stream and stream != "All":
        q = q.filter(College.stream.ilike(f"%{stream}%"))
    if state and state != "All":
        q = q.filter(College.state.ilike(f"%{state}%"))
    if rating:
        q = q.filter(College.rating >= float(rating))

    if budget == "1L":
        q = q.filter(College.fees_min <= 100000)
    elif budget == "3L":
        q = q.filter(College.fees_min <= 300000)
    elif budget == "8L":
        q = q.filter(College.fees_min <= 800000)

    # ── Sort ─────────────────────────────────
    if sort_by == "rating":
        q = q.order_by(College.rating.desc())
    elif sort_by == "fees":
        q = q.order_by(College.fees_min.asc())
    elif sort_by == "package":
        q = q.order_by(College.avg_package.desc())
    elif sort_by == "nirf":
        q = q.order_by(College.nirf_rank.asc())
    else:
        q = q.order_by(College.rating.desc())

    total   = q.count()
    results = q.offset((page-1)*per).limit(per).all()

    # Compute match % per college
    colleges_out = []
    for c in results:
        d = c.to_dict()
        if p12 > 0:
            gap = max(0, c.cutoff_pct - p12)
            match = max(10, min(98, round(100 - gap * 3)))
        else:
            match = round(c.rating * 18)
        d["match"] = match
        colleges_out.append(d)

    # Sort by match if requested
    if sort_by == "match":
        colleges_out.sort(key=lambda x: x["match"], reverse=True)

    return jsonify({
        "colleges": colleges_out,
        "total": total,
        "page": page,
        "per": per,
        "pages": (total + per - 1) // per,
    })


@colleges_bp.route("/<int:cid>", methods=["GET"])
def get_college(cid):
    c = College.query.get_or_404(cid)
    return jsonify(c.to_dict())


@colleges_bp.route("/states", methods=["GET"])
def get_states():
    states = db.session.query(College.state).distinct().order_by(College.state).all()
    return jsonify([s[0] for s in states if s[0]])
