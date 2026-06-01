# 🎓 Smart Admission AI Predictor — Full Stack

**React Frontend + Flask Backend + SQLite/PostgreSQL + Claude AI**

---

## 🚀 Quick Start (5 Steps)

### Step 1 — Setup Backend
```bash
cd smart-admission-backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt
```

### Step 2 — Configure Environment
```bash
# Copy and edit .env
copy .env.example .env        # Windows
# cp .env.example .env        # Mac/Linux

# Edit .env — add your Anthropic API key:
# ANTHROPIC_API_KEY=sk-ant-xxxx...
# Get key from: https://console.anthropic.com
```

### Step 3 — Run Backend
```bash
python app.py
# ✅ Running on http://localhost:5000
# ✅ Database ready (SQLite auto-created)
# ✅ 15 colleges, scholarships, courses seeded
```

### Step 4 — Setup Frontend
```bash
cd smart-admission-ai
npm install
```

### Step 5 — Run Frontend
```bash
npm start
# ✅ Opens http://localhost:3000
```

---

## 📁 Full Project Structure

```
📦 Smart Admission AI Predictor
│
├── 🐍 smart-admission-backend/
│   ├── app.py                    ← Flask entry point
│   ├── requirements.txt          ← Python dependencies
│   ├── .env.example              ← Copy to .env, add API key
│   │
│   ├── database/
│   │   └── db.py                 ← SQLAlchemy models + seed data
│   │
│   ├── models/
│   │   ├── predictor.py          ← ML engine (LR + RF + LogReg)
│   │   └── saved_models/         ← Auto-created after first run
│   │
│   └── routes/
│       ├── auth.py               ← /api/auth  (login, signup, profile)
│       ├── predict.py            ← /api/predict (ML prediction)
│       ├── colleges.py           ← /api/colleges (search, filter, paginate)
│       ├── chat.py               ← /api/chat (Claude AI proxy)
│       └── all_routes.py         ← courses, career, scholarship, resume, admin
│
└── ⚛️  smart-admission-ai/
    ├── src/
    │   ├── api.js                ← All backend API calls
    │   ├── App.jsx               ← Router + shell
    │   ├── index.css             ← Full design system
    │   ├── data.js               ← Fallback static data
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx   ← JWT auth with localStorage
    │   │
    │   ├── components/
    │   │   └── Sidebar.jsx
    │   │
    │   └── pages/
    │       ├── AuthPage.jsx
    │       ├── Dashboard.jsx      ← JEE/Non-JEE toggle, full academic
    │       ├── AdmissionPredictor.jsx
    │       ├── CollegeFinder.jsx  ← Real filters + pagination
    │       ├── AIChatbot.jsx      ← Backend-proxied Claude AI
    │       ├── OtherPages.jsx     ← Career, Courses, Analytics
    │       └── MorePages.jsx      ← Resume, Scholarship, Planner, Admin
    └── package.json
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login → returns JWT token |
| POST | `/api/auth/signup` | Create account |
| GET  | `/api/auth/profile` | Get user + academic profile |
| PUT  | `/api/auth/profile` | Update profile |
| POST | `/api/predict/` | Run ML prediction (3 models) |
| GET  | `/api/predict/history` | Past predictions |
| GET  | `/api/colleges/?search=&stream=&state=&sort=` | List/filter colleges |
| GET  | `/api/colleges/<id>` | Single college detail |
| GET  | `/api/colleges/states` | All available states |
| POST | `/api/chat/` | Claude AI chat (proxied) |
| GET  | `/api/courses/?topic=&level=&platform=&price=` | Filtered courses |
| GET  | `/api/career/` | Career list |
| GET  | `/api/career/salary-chart` | Salary data for chart |
| GET  | `/api/scholarship/?p12=&category=` | Matched scholarships |
| GET  | `/api/analytics/dashboard` | Student stats |
| POST | `/api/resume/generate` | PDF resume download |
| GET  | `/api/admin/stats` | Admin analytics |
| GET  | `/api/admin/students` | Student list |

---

## 🤖 Features Fixed

### ✅ Dashboard — Academic Snapshot
- JEE Mode: Shows Score/300, subject-wise breakdown (Phy/Chem/Math), percentile
- Non-JEE Mode: Shows BITSAT score, VITEEE rank, MHT-CET
- CGPA with grade equivalent, percentage conversion
- Category benefit table (General/OBC/SC/ST impact)
- All colleges linked → College Finder page

### ✅ AI Counselor
- Now routes through Flask backend → no CORS error
- Claude gets full student profile as context
- Proper error messages if API key not set

### ✅ College Finder
- Real search + filter from SQLite database
- Filters: stream, state, budget, rating, sort, your 12th %
- Pagination (20 per page)
- Match % calculated from your 12th score vs cutoff
- Falls back to static data if backend offline

### ✅ Career Guidance
- Real 2025 salary data: India (₹ LPA) + Global (USD/yr)
- Top companies per career
- Growth % and demand level
- Sorted by growth rate

### ✅ Course Recommender
- Real filter: topic, level, platform, price (free/paid/under₹500)
- Search by title
- Backend-driven, works with filters

### ✅ Scholarship Finder
- Eligibility computed from your 12th %, category, income
- Ineligibility reasons shown
- Sorted: eligible first, then by amount

### ✅ Resume Builder
- PDF download via ReportLab (backend)
- Live preview in frontend

---

## 🌐 Deployment

### Backend → Railway / Render
```bash
# On Railway: Add environment variables in dashboard
# ANTHROPIC_API_KEY = sk-ant-...
# DATABASE_URL = postgresql://...  ← Railway provides this

# Procfile
web: python app.py
```

### Frontend → Vercel
```bash
# Update src/api.js BASE URL:
# const BASE = "https://your-backend.railway.app/api";

npm run build
vercel --prod
```

### Switch to PostgreSQL
```env
# In .env:
DATABASE_URL=postgresql://user:password@host:5432/smart_admission
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, CSS Variables |
| Backend | Flask 3.0, SQLAlchemy |
| Database | SQLite (dev) → PostgreSQL (prod) |
| Auth | JWT (flask-jwt-extended) |
| ML | scikit-learn (LR + RF + LogReg) |
| AI | Anthropic Claude Sonnet |
| PDF | ReportLab |
| CORS | flask-cors |

---

## ❓ Common Errors

| Error | Fix |
|-------|-----|
| `Missing script: dev` | Use `npm start` not `npm run dev` |
| `CORS error` in browser | Backend must be running on port 5000 |
| `401 Unauthorized` | API key missing in .env |
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` |
| AI says "trouble connecting" | Check: backend running + API key set |
| Colleges not loading | Check `http://localhost:5000/api/colleges/` in browser |
