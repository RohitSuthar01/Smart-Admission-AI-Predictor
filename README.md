#  Smart Admission AI Predictor — Frontend

A professional, production-grade React frontend for the Smart Admission AI Predictor platform.

---

##  QuickStart

```bash
# 1. Navigate to the frontend folder
cd smart-admission-ai

# 2. Install dependencies
npm install

# 3. Start the development server
npm start

# 4. Open http://localhost:3000
```

**Demo login:** Use any email + any password on the sign-in screen.

---

##  Project Structure

```
smart-admission-ai/
├── public/
│   └── index.html              # HTML shell with Google Fonts
│
├── src/
│   |── index.js                # React DOM entry point
│   ├── index.css               # Global design system (CSS variables, components)
│   ├── App.jsx                 # App shell + routing
│   ├── data.js                 # Static data, constants & ML helper
│   │
│   ├── context/
│   │   └── AuthContext.jsx     # Global auth state (login/logout)
│   │
│   ├── components/
│   │   └── Sidebar.jsx         # Navigation sidebar
│   │
│   └── pages/
│       ├── AuthPage.jsx        # Login + Sign Up
│       ├── Dashboard.jsx       # Main overview
│       ├── AdmissionPredictor.jsx  # ML prediction page
│       ├── CollegeFinder.jsx   # College search & filter
│       ├── AIChatbot.jsx       # Claude AI counselor chat
│       ├── OtherPages.jsx      # Career, Courses, Analytics
│       └── MorePages.jsx       # Resume, Scholarships, Planner, Admin
│
└── package.json
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0a0a0f` | Page background |
| `--bg-surface` | `#111118` | Card backgrounds |
| `--accent-primary` | `#6c63ff` | Purple — main brand |
| `--accent-secondary` | `#00e5b4` | Teal — success/AI |
| `--font-display` | Clash Display | Headings, numbers |
| `--font-body` | Cabinet Grotesk | Body text |
| `--font-mono` | JetBrains Mono | Code, badges |

---

## 📄 Pages & Features

| Page | Route Key | Features |
|------|-----------|----------|
| Auth | — | Sign in / Sign up, hero panel |
| Dashboard | `dashboard` | Stats, snapshot, deadlines, career cards |
| Admission Predictor | `predict` | 3 ML models, rank estimate, eligible colleges |
| College Finder | `colleges` | Search, filter by stream/state/budget/rating |
| AI Counselor | `chatbot` | Live Claude AI chat, quick prompts |
| Career Guidance | `career` | 9 career cards, salary bar chart |
| Course Recommender | `courses` | 9 course cards with filters |
| Performance Analytics | `analytics` | Subject scores, monthly chart, weak area analysis |
| Resume Builder | `resume` | Live preview, PDF export button |
| Scholarship Finder | `scholarship` | 6 scholarships with eligibility status |
| Study Planner | `planner` | Interactive weekly planner with checkboxes |
| Admin Panel | `admin` | Student table, college chart, stream distribution |

---

## 🤖 AI Chatbot Setup

The chatbot uses the **Anthropic Claude API** directly from the browser.

The API key is **handled by the platform** (claude.ai artifact environment).

For **production deployment**, move the API call to your backend:

```python
# backend/routes/chat.py (Flask example)
from anthropic import Anthropic

client = Anthropic()

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=data['system'],
        messages=data['messages']
    )
    return jsonify({"reply": response.content[0].text})
```

Then update `AIChatbot.jsx` to call `/api/chat` instead of the Anthropic URL directly.

---

## 🔗 Backend Integration Points

Replace these mock functions with real API calls:

```js
// AdmissionPredictor.jsx — replace computePrediction()
const res = await axios.post('/api/predict', formData);

// CollegeFinder.jsx — replace static COLLEGES array
const { data } = await axios.get('/api/colleges', { params: filters });

// AIChatbot.jsx — already calls Anthropic API
// → move to /api/chat in production

// Dashboard.jsx — replace hardcoded stats
const { data } = await axios.get('/api/student/stats');
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2 | UI framework |
| react-dom | ^18.2 | DOM rendering |
| react-router-dom | ^6.22 | Routing |
| lucide-react | ^0.383 | Icons (optional) |
| recharts | ^2.12 | Charts (optional upgrade) |
| axios | ^1.6 | HTTP client for backend |

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# drag & drop the /build folder to app.netlify.com
```

### GitHub Pages
```bash
npm install gh-pages
# Add to package.json: "homepage": "https://yourusername.github.io/smart-admission-ai"
npm run build && npx gh-pages -d build
```

---

## 🎓 Project Info

- **Type:** Final Year Project / Hackathon / AI Portfolio
- **Frontend:** React 18, CSS Variables, Vanilla CSS
- **AI:** Claude Sonnet (Anthropic API)
- **Design:** Dark Futuristic Academic theme
- **Fonts:** Clash Display + Cabinet Grotesk + JetBrains Mono
- **No external CSS framework** — fully custom design system

---

## 📝 License

MIT — Free to use for educational and portfolio purposes.
