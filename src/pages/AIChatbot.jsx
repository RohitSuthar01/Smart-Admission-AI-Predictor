import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const QUICK_PROMPTS = [
  'Best careers for PCM student in 2025?',
  'CSE vs ECE — which to choose?',
  'How to crack JEE Advanced?',
  'Government jobs after engineering?',
  'Top paying tech skills to learn?',
  'MBA vs MS after B.Tech?',
];

// ── Offline knowledge base ─────────────────────────────────
const OFFLINE_KB = [
  {
    keys: ['cse', 'ece', 'which'],
    reply: `**CSE vs ECE — 2025 Guide 🎯**\n\n**CSE (Computer Science):**\n• Salary India: ₹8–45 LPA | Global: $90k–200k\n• Top companies: Google, Microsoft, Amazon, Flipkart, Swiggy\n• Roles: SWE, AI/ML, Data Science, Cloud\n• Job market: Very High demand\n\n**ECE (Electronics):**\n• Salary India: ₹5–25 LPA | Global: $70k–150k\n• Top companies: Qualcomm, Intel, Samsung, ISRO, Texas Instruments\n• Roles: VLSI, Embedded, Signal Processing, Telecom\n• Job market: High demand (semiconductor boom)\n\n**My Verdict:** With your JEE score, **CSE gives higher salary + more jobs**. But if you love hardware, ECE is also excellent especially with VLSI boom in India (₹50k crore semiconductor mission). Choose based on your interest! 🚀`,
  },
  {
    keys: ['jee advanced', 'jee adv', 'crack jee'],
    reply: `**How to Crack JEE Advanced 🎯**\n\n**Subject-wise Strategy:**\n\n📐 **Math** (easiest to score):\n• Focus: Calculus, Algebra, Coordinate Geometry, Permutation\n• Books: RD Sharma + Arihant Problems\n• Daily: 10 problems minimum\n\n⚡ **Physics** (your strong subject):\n• Focus: Mechanics, Electrodynamics, Modern Physics\n• Books: HC Verma (must) + DC Pandey\n• Solve all HC Verma exercises\n\n⚗️ **Chemistry**:\n• Organic: Named reactions chart banao\n• Physical: Numericals daily\n• Inorganic: NCERT line by line\n• Books: NCERT + JD Lee\n\n**Timeline:**\n• 5+ past year papers solve karo\n• Target 55–60% marks for IIT (General)\n• Last 2 months: Only revision + mock tests\n\n💪 With 92% in 10th, 88% in 12th — you have strong base!`,
  },
  {
    keys: ['government', 'govt', 'psu', 'gate', 'sarkari'],
    reply: `**Government Jobs After Engineering 🏛️**\n\n**Via GATE (Best Route):**\n• ONGC — ₹12–18 LPA + perks\n• BHEL — ₹8–14 LPA\n• NTPC — ₹10–16 LPA\n• IOCL — ₹10–15 LPA\n• Power Grid — ₹8–12 LPA\n• GATE score valid 3 years\n\n**Direct Recruitment:**\n• ISRO Scientist — ₹7–12 LPA + research glory 🚀\n• DRDO Scientist — ₹7–11 LPA\n• Defence (TGC) — ₹7–12 LPA + army officer\n• RRB JE — ₹4–8 LPA\n• SSC JE — ₹4–7 LPA\n\n**UPSC Engineering Services:**\n• Class-1 Central Govt Officer\n• Salary: ₹9–18 LPA + perks\n• Exam: Prelims → Mains → Interview\n\n**Best Strategy:** Prepare GATE in final year B.Tech. Score 700+ for top PSUs!`,
  },
  {
    keys: ['salary', 'lpa', 'package', 'earn', 'income'],
    reply: `**2025 Tech Salary Guide 💰**\n\n| Role | India | Global (USD) |\n|------|-------|------|\n| AI/ML Engineer | ₹12–60 LPA | $120k–250k |\n| Cloud Architect | ₹15–70 LPA | $130k–280k |\n| Product Manager | ₹18–80 LPA | $140k–300k |\n| Software Engineer | ₹8–45 LPA | $90k–200k |\n| Data Scientist | ₹10–50 LPA | $100k–200k |\n| Cybersecurity | ₹6–35 LPA | $80k–160k |\n| Full Stack Dev | ₹6–30 LPA | $80k–160k |\n| VLSI Engineer | ₹5–25 LPA | $70k–150k |\n\n**Fresher Packages (2025):**\n• TCS/Wipro/Infosys: ₹3.5–7 LPA\n• Mid-tier IT: ₹7–12 LPA\n• Product companies: ₹15–30 LPA\n• Top product (Google/MS): ₹40–80 LPA\n\n🎯 DSA + System Design prepare karo for product companies!`,
  },
  {
    keys: ['career', 'pcm', 'after 12', 'options', 'scope'],
    reply: `**Top Careers for PCM Students 2025 🚀**\n\n**🔥 Hottest (AI Era):**\n• AI/ML Engineer — ₹12–60 LPA | 38% growth\n• Data Scientist — ₹10–50 LPA | 29% growth\n• Cloud Architect — ₹15–70 LPA | 27% growth\n\n**💻 Tech Classics:**\n• Software Engineer — ₹8–45 LPA | 25% growth\n• Cybersecurity — ₹6–35 LPA | 32% growth\n• Full Stack Dev — ₹6–30 LPA | 21% growth\n\n**⚡ Core Engineering:**\n• VLSI/Embedded — ₹5–25 LPA (Qualcomm, Intel)\n• Robotics — ₹6–30 LPA (ISRO, Tesla)\n\n**💰 High Pay Non-Tech:**\n• Quant Analyst — ₹15–80 LPA (Goldman Sachs)\n• Product Manager — ₹18–80 LPA\n• Investment Banking — ₹12–50 LPA\n\n**My pick for you:** AI/ML or SWE at a product company — best ROI for PCM + JEE background! 🎯`,
  },
  {
    keys: ['mba', 'ms', 'masters', 'higher study', 'abroad'],
    reply: `**MBA vs MS After B.Tech — 2025 🎓**\n\n**MS (Master of Science):**\n• Best for: Deep tech, research, USA/Europe jobs\n• Top destinations: USA, Germany (free!), Canada\n• Cost: $40–80k (USA) | Free (Germany/TU Munich)\n• After MS salary: $100k–150k in USA\n• Good for: AI/ML, Robotics, VLSI, CS\n• Requirements: GRE 320+ | GPA 8+\n\n**MBA:**\n• Best for: Management, consulting, startups\n• Top Indian: IIM A/B/C — ₹25–35 LPA avg\n• Foreign: ISB, XLRI — ₹20–30 LPA\n• Requires: 2–4 yrs work experience ideally\n• CAT exam for IIMs\n\n**🎯 My Recommendation:**\n• Love tech deeply? → **MS** (especially Germany = free!)\n• Want leadership/business? → **Work 2 yrs → MBA**\n• Want USA job? → **MS from state university** (better ROI)\n\nWith your PCM background — **MS in CS/AI from Germany is FREE and excellent value!** 🇩🇪`,
  },
  {
    keys: ['college', 'arya', 'private', 'fees', 'rajasthan', 'jaipur'],
    reply: `**Private Engineering Colleges Guide 🏛️**\n\n**Rajasthan Top Colleges:**\n• BITS Pilani — ₹5.2L/yr | Best private in India | BITSAT 340+\n• Manipal Jaipur — ₹3L/yr | Good placement\n• Arya College of Engineering, Jaipur — Affiliated to RTU\n• JECRC Jaipur — Popular local college\n• Poornima Group — Good for CSE\n\n**Arya College of Engineering, Jaipur:**\n• Affiliated: Rajasthan Technical University (RTU)\n• Courses: B.Tech CSE, ECE, ME, CE etc.\n• Fees: ~₹80k–1.2L/yr (approx)\n• Placement: Local Jaipur companies + some IT firms\n• Suitable for: If JEE score doesn't get NIT/DTU\n\n**Better Alternatives (similar fees):**\n• MNIT Jaipur (NIT) — Much better! JEE Main 85%ile+\n• Poornima College — Private but good CS placements\n• LNM Institute — Jaipur, excellent for CS\n\nFor specific college details, always check: **NIRF Rankings + placement report** on college website! 📊`,
  },
  {
    keys: ['mnit', 'nit jaipur', 'nit', 'national institute'],
    reply: `**NITs — Complete Guide 2025 🏛️**\n\n**Top NITs for CSE:**\n| NIT | Avg Package | Cutoff (Gen) |\n|-----|------------|---------------|\n| NIT Trichy | ₹14 LPA | 98%ile |\n| NIT Warangal | ₹13 LPA | 97%ile |\n| NIT Surathkal | ₹12 LPA | 96%ile |\n| NIT Calicut | ₹11 LPA | 95%ile |\n| MNIT Jaipur | ₹10 LPA | 93%ile |\n| NIT Rourkela | ₹9 LPA | 92%ile |\n\n**MNIT Jaipur Specifically:**\n• NIRF Rank: ~40\n• CSE Cutoff: ~93 percentile (General)\n• Avg Package: ₹10 LPA | Max: ₹45 LPA\n• Fees: ₹1.5L/yr (very affordable!)\n• Top Recruiters: Amazon, Microsoft, Infosys, TCS\n• Home state quota: Rajasthan students get advantage!\n\n**With your JEE score (145/300 = ~95%ile):**\n• MNIT Jaipur CSE — possible ✅\n• Try DTU, NSIT also (Delhi rounds)\n• IIIT Allahabad CSE — good option too 🎯`,
  },
  {
    keys: ['skill', 'learn', 'programming', 'language', 'python', 'coding'],
    reply: `**Top Skills to Learn in 2025 💻**\n\n**🔥 Most In-Demand (High Salary):**\n1. **Python** — AI/ML, Data Science, Automation\n2. **DSA** — Must for product company interviews\n3. **System Design** — Senior roles, ₹25 LPA+\n4. **SQL** — Every data/backend role needs it\n5. **React.js** — Frontend, ₹8–25 LPA\n\n**AI/ML Stack:**\n• Python → NumPy → Pandas → Scikit-learn → TensorFlow/PyTorch\n\n**Web Dev Stack:**\n• HTML/CSS → JavaScript → React → Node.js → MongoDB\n\n**Cloud (Premium Salaries):**\n• AWS/GCP/Azure certifications → ₹15–40 LPA\n\n**Free Resources:**\n• CS50 (Harvard) — Free on edX\n• NPTEL — Free Python/ML courses\n• LeetCode — DSA practice\n• GitHub — Show your projects\n\n**For placements:** DSA + 2 good projects + internship = ₹15–25 LPA offer at product company! 🚀`,
  },
];

function getOfflineReply(msg) {
  const q = msg.toLowerCase();
  for (const item of OFFLINE_KB) {
    if (item.keys.some(k => q.includes(k))) {
      return item.reply;
    }
  }
  return `I can answer that! Here are topics I know well:\n\n• **Career options** for PCM/engineering students\n• **Salary data** — India + Global 2025\n• **JEE Advanced** strategy and tips\n• **Government jobs** — GATE, PSU, ISRO, UPSC\n• **CSE vs ECE** comparison\n• **MBA vs MS** after B.Tech\n• **Skills to learn** — Python, DSA, Cloud\n• **College info** — NITs, private colleges, Rajasthan\n\nTry asking one of these or click a quick prompt below! 💡\n\n*(For any question, AI backend needed: run **python app.py** in backend folder with API key)*`;
}

export default function AIChatbot() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';
  const acad = user?.academics || {};

  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hi ${firstName}! 👋 I'm **Aria**, your AI Career Counselor.\n\nI can help you with:\n• Career paths & real 2025 salary data (₹ LPA + USD)\n• College recommendations based on your JEE score\n• Entrance exam strategy (JEE, BITSAT, VITEEE)\n• Government jobs & GATE guidance\n• Skills & courses to learn\n\nWhat would you like to explore today?`,
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('connecting'); // connecting | online | offline
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Check backend on mount
  useEffect(() => {
    fetch('http://localhost:5000/', { signal: AbortSignal.timeout(2000) })
      .then(() => setMode('online'))
      .catch(() => setMode('offline'));
  }, []);

  const SYSTEM = `You are Aria, an expert AI Career Counselor for Indian students on Smart Admission AI platform.
Student: ${user?.name}, Stream: ${user?.stream || 'Science PCM'}, Class 12: ${acad.p12 || 88}%, Class 10: ${acad.p10 || 92}%, CGPA: ${acad.cgpa || 8.4}, Entrance: ${acad.entrance_exam || 'JEE Main'} ${acad.entrance_score || 145}/300, State: ${acad.state || 'Delhi'}, Category: ${acad.category || 'General'}.
Always give: 1) India salary in ₹ LPA 2) Global salary in USD/yr 3) Top 3-5 companies 4) Specific actionable advice. Be warm, concise (under 200 words), use bullets. Address student by first name.`;

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const updated = [...messages, { role: 'user', content: msg }];
    setMessages(updated);
    setLoading(true);

    const history = updated
      .filter((m, i) => !(i === 0 && m.role === 'assistant'))
      .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));

    let reply = null;

    // Try 1: Backend
    if (mode === 'online') {
      try {
        const token = localStorage.getItem('sam_token') || 'demo';
        const res = await fetch('http://localhost:5000/api/chat/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ messages: history }),
          signal: AbortSignal.timeout(20000),
        });
        if (res.ok) {
          const data = await res.json();
          reply = data.reply;
        }
      } catch (e) {
        setMode('offline');
      }
    }

    // Try 2: Direct Anthropic (works in claude.ai)
    if (!reply) {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 800,
            system: SYSTEM,
            messages: history,
          }),
          signal: AbortSignal.timeout(15000),
        });
        if (res.ok) {
          const data = await res.json();
          reply = data.content?.map(b => b.text || '').join('');
        }
      } catch {}
    }

    // Try 3: Offline KB
    if (!reply) reply = getOfflineReply(msg);

    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  const fmt = (t) => t
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');

  const statusColor = mode === 'online' ? 'var(--accent-success)' : mode === 'offline' ? 'var(--accent-warn)' : 'var(--text-muted)';
  const statusText  = mode === 'online' ? '● Backend Connected' : mode === 'offline' ? '⚡ Smart Offline Mode' : '◌ Connecting…';

  return (
    <div className="page-wrapper animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">🤖 AI Career Counselor</h1>
          <p className="page-subtitle">Powered by Claude AI · Real 2025 career data</p>
        </div>
        <div className="page-header-right">
          <span style={{ fontSize:'0.75rem', color: statusColor, fontWeight:600 }}>{statusText}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setMessages([messages[0]])}>Clear</button>
        </div>
      </div>

      <div className="card">
        <div className="chat-header">
          <div className="chat-ai-avatar">🤖</div>
          <div>
            <div className="chat-ai-name">Aria — AI Counselor</div>
            <div className="chat-ai-status" style={{ color: statusColor }}>{statusText}</div>
          </div>
          <span className="badge badge-muted" style={{ marginLeft:'auto' }}>{messages.length - 1} msgs</span>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role === 'user' ? 'user' : 'ai'}`}>
              <div className={`chat-msg-avatar ${m.role === 'user' ? 'user' : 'ai'}`}>
                {m.role === 'user' ? (user?.initials || 'RS') : '🤖'}
              </div>
              <div className="chat-msg-bubble" dangerouslySetInnerHTML={{ __html: fmt(m.content) }} />
            </div>
          ))}
          {loading && (
            <div className="chat-msg ai">
              <div className="chat-msg-avatar ai">🤖</div>
              <div className="chat-msg-bubble"><div className="typing-dots"><span/><span/><span/></div></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-quick-btns">
          {QUICK_PROMPTS.map(p => (
            <button key={p} className="chat-quick-btn" onClick={() => sendMessage(p)} disabled={loading}>{p}</button>
          ))}
        </div>

        <div className="chat-input-row">
          <textarea
            className="chat-input" rows={2} value={input}
            placeholder="Ask about careers, colleges, exams, salaries…"
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}}}
            disabled={loading}
          />
          <button className="btn btn-success" onClick={() => sendMessage()} disabled={loading||!input.trim()}>
            {loading ? '…' : 'Send ↗'}
          </button>
        </div>
      </div>
    </div>
  );
}
