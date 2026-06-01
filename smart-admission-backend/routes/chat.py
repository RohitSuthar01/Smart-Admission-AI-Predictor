"""
/api/chat  — proxies Anthropic Claude API
Frontend calls THIS instead of Anthropic directly → no CORS issue
"""
import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import User
import anthropic

chat_bp = Blueprint("chat", __name__)

def _get_system_prompt(user: User) -> str:
    acad = user.academics
    return f"""You are Aria, a friendly and expert AI Career Counselor for Indian students on the Smart Admission AI platform.

Student Profile:
- Name: {user.name}
- Stream: {user.stream or 'Science (PCM)'}
- Class 12: {acad.p12 if acad else 88}%
- Class 10: {acad.p10 if acad else 92}%
- CGPA: {acad.cgpa if acad else 8.4}
- Entrance Exam: {acad.entrance_exam if acad else 'JEE Main'}, Score: {acad.entrance_score if acad else 145}
- State: {acad.state if acad else 'Delhi'}
- Category: {acad.category if acad else 'General'}
- Preferred Branch: {acad.branch if acad else 'Computer Science'}

Your expertise covers:
1. Career guidance (Indian + Global job market, salaries in ₹ LPA and USD)
2. College recommendations (IITs, NITs, BITS, private colleges)
3. Entrance exam strategy (JEE, BITSAT, VITEEE, MHT-CET, KCET)
4. Course recommendations (online + offline)
5. Government exam guidance (UPSC, SSC, GATE, PSU)
6. Scholarship guidance
7. Study planning and motivation

Rules:
- Be warm, encouraging and conversational
- Use Indian context — ₹ LPA for salaries, Indian exams/colleges
- Keep responses under 200 words unless user asks for detail
- Use bullet points for structured info
- Address the student by first name occasionally
- Give REAL, accurate data for 2025 job market
- When discussing global salaries also mention USD equivalent"""


@chat_bp.route("/", methods=["POST"])
@jwt_required()
def chat():
    uid  = int(get_jwt_identity())
    user = User.query.get_or_404(uid)
    data = request.get_json()

    messages = data.get("messages", [])
    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key:
        return jsonify({"error": "ANTHROPIC_API_KEY not configured in .env"}), 500

    client = anthropic.Anthropic(api_key=api_key)

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=_get_system_prompt(user),
            messages=messages,
        )
        reply = response.content[0].text
        return jsonify({"reply": reply, "tokens_used": response.usage.output_tokens})

    except anthropic.AuthenticationError:
        return jsonify({"error": "Invalid Anthropic API key. Please check your .env file."}), 401
    except anthropic.RateLimitError:
        return jsonify({"error": "Rate limit reached. Please wait a moment and try again."}), 429
    except Exception as e:
        return jsonify({"error": f"AI service error: {str(e)}"}), 500
