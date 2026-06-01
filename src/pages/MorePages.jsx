import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SCHOLARSHIPS, PLANNER_DAYS, ADMIN_STUDENTS } from '../data';

// ─────────────────────────────────────────────
// RESUME BUILDER — with real browser PDF download
// ─────────────────────────────────────────────
export function ResumeBuilder() {
  const { user } = useAuth();
  const acad = user?.academics || {};

  const [form, setForm] = useState({
    name:      user?.name      || 'Rahul Sharma',
    email:     user?.email     || 'rahul@example.com',
    phone:     user?.phone     || '+91 98765 43210',
    city:      user?.city      || 'Delhi, India',
    linkedin:  user?.linkedin  || 'linkedin.com/in/rahulsharma',
    github:    user?.github    || 'github.com/rahulsharma',
    school:    'Delhi Public School, New Delhi',
    p12:       acad.p12  || 88,
    p10:       acad.p10  || 92,
    objective: 'Aspiring software engineer with strong foundation in CSE fundamentals, seeking to leverage academic excellence and problem-solving skills in a dynamic tech environment.',
    skills:    'Python, C++, Java, React, Machine Learning, SQL, Git, TensorFlow',
    proj1Title:'AI Admission Predictor',
    proj1Tech: 'Python, Scikit-learn, Flask, React',
    proj1Desc: 'ML model to predict college admission chances with 87% accuracy using Random Forest and Logistic Regression.',
    proj2Title:'Student Portal Web App',
    proj2Tech: 'React, Node.js, MySQL, Express',
    proj2Desc: 'Full-stack application for managing student records with JWT authentication and role-based access.',
    ach1:      'JEE Main 2025 — 95.2 Percentile',
    ach2:      'State-level Science Olympiad — Gold Medal 2024',
    ach3:      'NSS Volunteer — 120+ hours of community service',
  });
  const [preview, setPreview] = useState({ ...form });
  const [downloading, setDownloading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const skillList = preview.skills.split(',').map(s => s.trim()).filter(Boolean);

  // ── Generate HTML → print as PDF ──────────────────
  const downloadPDF = async () => {
    setDownloading(true);
    const current = { ...form };
    const skills = current.skills.split(',').map(s => s.trim()).filter(Boolean);

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${current.name} — Resume</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1a1a2e; background: #fff; padding: 32px 36px; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 22px; font-weight: 700; color: #1a1a2e; letter-spacing: -0.5px; }
  .role { font-size: 12px; color: #666; margin: 3px 0 8px; }
  .contact { display: flex; flex-wrap: wrap; gap: 12px; font-size: 10px; color: #444; padding-bottom: 10px; border-bottom: 2px solid #6c63ff; margin-bottom: 14px; }
  .section { margin-bottom: 14px; }
  .sec-title { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #6c63ff; border-bottom: 1px solid #e8e8f0; padding-bottom: 3px; margin-bottom: 8px; }
  .item { margin-bottom: 7px; }
  .item-row { display: flex; justify-content: space-between; }
  .item-title { font-weight: 700; font-size: 11px; }
  .item-date { font-size: 10px; color: #888; }
  .item-sub { font-size: 10px; color: #666; margin: 1px 0; }
  .item-desc { font-size: 10px; color: #444; line-height: 1.5; }
  .chip { display: inline-block; background: #f0effb; color: #6c63ff; border-radius: 3px; padding: 2px 7px; font-size: 9px; font-weight: 600; margin: 2px; }
  .ach { font-size: 10px; color: #333; padding: 2px 0; }
  @media print { body { padding: 20px 28px; } }
</style>
</head>
<body>
  <h1>${current.name}</h1>
  <div class="role">B.Tech CSE Aspirant · Science (PCM) · Class 12 · ${new Date().getFullYear()}</div>
  <div class="contact">
    <span>✉ ${current.email}</span>
    <span>📱 ${current.phone}</span>
    <span>📍 ${current.city}</span>
    <span>🔗 ${current.linkedin}</span>
    <span>💻 ${current.github}</span>
  </div>

  <div class="section">
    <div class="sec-title">Career Objective</div>
    <div style="font-size:10px;color:#444;line-height:1.6">${current.objective}</div>
  </div>

  <div class="section">
    <div class="sec-title">Education</div>
    <div class="item">
      <div class="item-row">
        <div class="item-title">Class 12 (CBSE) — ${current.p12}%</div>
        <div class="item-date">2025</div>
      </div>
      <div class="item-sub">${current.school}</div>
    </div>
    <div class="item">
      <div class="item-row">
        <div class="item-title">Class 10 (CBSE) — ${current.p10}%</div>
        <div class="item-date">2023</div>
      </div>
      <div class="item-sub">${current.school}</div>
    </div>
  </div>

  <div class="section">
    <div class="sec-title">Projects</div>
    <div class="item">
      <div class="item-row">
        <div class="item-title">${current.proj1Title}</div>
      </div>
      <div class="item-sub">${current.proj1Tech}</div>
      <div class="item-desc">${current.proj1Desc}</div>
    </div>
    <div class="item" style="margin-top:6px">
      <div class="item-row">
        <div class="item-title">${current.proj2Title}</div>
      </div>
      <div class="item-sub">${current.proj2Tech}</div>
      <div class="item-desc">${current.proj2Desc}</div>
    </div>
  </div>

  <div class="section">
    <div class="sec-title">Achievements</div>
    <div class="ach">• ${current.ach1}</div>
    <div class="ach">• ${current.ach2}</div>
    <div class="ach">• ${current.ach3}</div>
  </div>

  <div class="section">
    <div class="sec-title">Technical Skills</div>
    ${skills.map(s => `<span class="chip">${s}</span>`).join('')}
  </div>
</body>
</html>`;

    // Open in new window and trigger print dialog → Save as PDF
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      setDownloading(false);
    }, 500);
  };

  return (
    <div className="page-wrapper animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">📄 Resume Builder</h1>
          <p className="page-subtitle">Edit your details · Preview live · Download as PDF</p>
        </div>
        <button className="btn btn-success" onClick={downloadPDF} disabled={downloading}>
          {downloading ? '⏳ Opening…' : '📥 Download PDF'}
        </button>
      </div>

      {/* PDF tip */}
      <div style={{ padding:'10px 14px', background:'rgba(0,229,180,0.08)', border:'1px solid rgba(0,229,180,0.25)', borderRadius:'var(--r-md)', fontSize:'0.78rem', color:'var(--accent-success)', marginBottom:20 }}>
        💡 Click <strong>Download PDF</strong> → browser print dialog opens → select <strong>"Save as PDF"</strong> → Done! No backend needed.
      </div>

      <div className="grid-2" style={{ gap:20 }}>
        {/* Form */}
        <div className="card">
          <div className="card-title mb-16">✏️ Your Information</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e=>set('phone',e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} />
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" value={form.city} onChange={e=>set('city',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">School Name</label>
                <input className="form-input" value={form.school} onChange={e=>set('school',e.target.value)} />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input className="form-input" value={form.linkedin} onChange={e=>set('linkedin',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input className="form-input" value={form.github} onChange={e=>set('github',e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Career Objective</label>
              <textarea className="form-textarea" value={form.objective} onChange={e=>set('objective',e.target.value)} rows={2} />
            </div>
            <div className="form-group">
              <label className="form-label">Skills (comma separated)</label>
              <input className="form-input" value={form.skills} onChange={e=>set('skills',e.target.value)} />
            </div>
            <div style={{ padding:12, background:'var(--bg-elevated)', borderRadius:'var(--r-md)', border:'1px solid var(--border-subtle)' }}>
              <div className="form-label mb-8" style={{ marginBottom:8 }}>Project 1</div>
              <input className="form-input" style={{ marginBottom:6 }} placeholder="Project Title" value={form.proj1Title} onChange={e=>set('proj1Title',e.target.value)} />
              <input className="form-input" style={{ marginBottom:6 }} placeholder="Technologies used" value={form.proj1Tech} onChange={e=>set('proj1Tech',e.target.value)} />
              <textarea className="form-textarea" rows={2} placeholder="Description" value={form.proj1Desc} onChange={e=>set('proj1Desc',e.target.value)} />
            </div>
            <div style={{ padding:12, background:'var(--bg-elevated)', borderRadius:'var(--r-md)', border:'1px solid var(--border-subtle)' }}>
              <div className="form-label mb-8" style={{ marginBottom:8 }}>Project 2</div>
              <input className="form-input" style={{ marginBottom:6 }} placeholder="Project Title" value={form.proj2Title} onChange={e=>set('proj2Title',e.target.value)} />
              <input className="form-input" style={{ marginBottom:6 }} placeholder="Technologies used" value={form.proj2Tech} onChange={e=>set('proj2Tech',e.target.value)} />
              <textarea className="form-textarea" rows={2} placeholder="Description" value={form.proj2Desc} onChange={e=>set('proj2Desc',e.target.value)} />
            </div>
            <div style={{ padding:12, background:'var(--bg-elevated)', borderRadius:'var(--r-md)', border:'1px solid var(--border-subtle)' }}>
              <div className="form-label mb-8" style={{ marginBottom:8 }}>Achievements (3)</div>
              <input className="form-input" style={{ marginBottom:6 }} value={form.ach1} onChange={e=>set('ach1',e.target.value)} />
              <input className="form-input" style={{ marginBottom:6 }} value={form.ach2} onChange={e=>set('ach2',e.target.value)} />
              <input className="form-input" value={form.ach3} onChange={e=>set('ach3',e.target.value)} />
            </div>
            <div className="flex gap-8">
              <button className="btn btn-primary btn-full" onClick={()=>setPreview({...form})}>✨ Update Preview</button>
              <button className="btn btn-success btn-full" onClick={downloadPDF} disabled={downloading}>
                {downloading?'Opening…':'📥 Download PDF'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10, fontWeight:700 }}>Live Preview</div>
          <div className="resume-sheet">
            <div className="resume-header-name">{preview.name}</div>
            <div className="resume-header-role">B.Tech CSE Aspirant · Science (PCM) · Class 12</div>
            <div className="resume-contact-row">
              <span>✉ {preview.email}</span>
              <span>📱 {preview.phone}</span>
              <span>📍 {preview.city}</span>
              <span>🔗 {preview.linkedin}</span>
            </div>
            <div className="resume-section">
              <div className="resume-sec-title">Career Objective</div>
              <div style={{ fontSize:10, color:'#444', lineHeight:1.6 }}>{preview.objective}</div>
            </div>
            <div className="resume-section">
              <div className="resume-sec-title">Education</div>
              <div className="resume-item">
                <div className="resume-item-row">
                  <div className="resume-item-title">Class 12 (CBSE) — {preview.p12}%</div>
                  <div className="resume-item-date">2025</div>
                </div>
                <div className="resume-item-sub">{preview.school}</div>
              </div>
              <div className="resume-item">
                <div className="resume-item-row">
                  <div className="resume-item-title">Class 10 (CBSE) — {preview.p10}%</div>
                  <div className="resume-item-date">2023</div>
                </div>
                <div className="resume-item-sub">{preview.school}</div>
              </div>
            </div>
            <div className="resume-section">
              <div className="resume-sec-title">Projects</div>
              <div className="resume-item">
                <div className="resume-item-title">{preview.proj1Title}</div>
                <div className="resume-item-sub">{preview.proj1Tech}</div>
                <div className="resume-item-desc">{preview.proj1Desc}</div>
              </div>
              <div className="resume-item" style={{ marginTop:5 }}>
                <div className="resume-item-title">{preview.proj2Title}</div>
                <div className="resume-item-sub">{preview.proj2Tech}</div>
                <div className="resume-item-desc">{preview.proj2Desc}</div>
              </div>
            </div>
            <div className="resume-section">
              <div className="resume-sec-title">Achievements</div>
              <div style={{ fontSize:10, color:'#333', lineHeight:1.8 }}>
                • {preview.ach1}<br/>• {preview.ach2}<br/>• {preview.ach3}
              </div>
            </div>
            <div className="resume-section">
              <div className="resume-sec-title">Technical Skills</div>
              {skillList.map(s=><span key={s} className="skill-chip">{s}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export function ScholarshipFinder() {
  const eligible = SCHOLARSHIPS.filter(s => s.eligible);
  return (
    <div className="page-wrapper animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">💰 Scholarship Finder</h1>
          <p className="page-subtitle">Matched to your academic profile and category</p>
        </div>
        <div className="page-header-right">
          <span className="badge badge-warn">🎉 {eligible.length} eligible</span>
        </div>
      </div>

      {/* Summary */}
      <div className="card mb-24" style={{ background: 'linear-gradient(135deg, rgba(255,184,48,0.06) 0%, rgba(108,99,255,0.06) 100%)', border: '1px solid rgba(255,184,48,0.2)' }}>
        <div className="flex items-center gap-16">
          <div style={{ fontSize: 40 }}>🎉</div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>You qualify for</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--accent-warn)', letterSpacing: '-0.03em' }}>{eligible.length} Scholarships</div>
            <div className="text-xs text-muted">Total potential value: ₹4.2+ Lakhs per year</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm">Filter Eligible</button>
            <button className="btn btn-primary btn-sm">Apply All →</button>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-8 mb-16" style={{ flexWrap: 'wrap' }}>
        {['All', 'Eligible', 'Central Govt', 'State Govt', 'Private'].map(f => (
          <button key={f} className={`btn btn-sm ${f === 'All' ? 'btn-primary' : 'btn-ghost'}`}>{f}</button>
        ))}
      </div>

      {SCHOLARSHIPS.map((s, i) => (
        <div key={i} className="scholarship-item" style={{ background: s.color, borderColor: s.borderColor }}>
          <div className="scholarship-icon" style={{ background: s.color, border: `1px solid ${s.borderColor}` }}>{s.icon}</div>
          <div className="scholarship-info">
            <div className="scholarship-name">
              {s.name}
              <span style={{ marginLeft: 8 }}>
                {s.eligible
                  ? <span className="badge badge-success">Eligible</span>
                  : <span className="badge badge-muted">Check Eligibility</span>}
              </span>
            </div>
            <div className="scholarship-desc">{s.desc}</div>
          </div>
          <div className="scholarship-right">
            <div className="scholarship-amount">{s.amount}</div>
            <div className="scholarship-deadline">Deadline: {s.deadline}</div>
            {s.eligible && (
              <button className="btn btn-success btn-sm" style={{ marginTop: 8 }}>Apply Now →</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// STUDY PLANNER
// ─────────────────────────────────────────────
export function StudyPlanner() {
  const [days, setDays] = useState(PLANNER_DAYS.map(d => ({ ...d, done: [...d.done] })));

  const toggle = (di, ti) => {
    setDays(prev => prev.map((d, i) => i === di
      ? { ...d, done: d.done.map((v, j) => j === ti ? !v : v) }
      : d
    ));
  };

  const totalTasks = days.reduce((a, d) => a + d.tasks.length, 0);
  const doneTasks  = days.reduce((a, d) => a + d.done.filter(Boolean).length, 0);

  return (
    <div className="page-wrapper animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">📅 AI Study Planner</h1>
          <p className="page-subtitle">Personalized weekly schedule — tap tasks to mark complete</p>
        </div>
        <div className="page-header-right">
          <span className="badge badge-primary">{doneTasks}/{totalTasks} Done</span>
          <button className="btn btn-primary btn-sm" onClick={() => alert('🤖 AI is generating a fresh plan based on your weak areas (Math, Chemistry). Available with full backend.')}>
            🤖 Regenerate
          </button>
        </div>
      </div>

      <div className="grid-2 mb-24">
        {[
          { label: 'Study Hours This Week', value: '28h', sub: 'Target: 35h · 80% achieved', color: '#00e5b4' },
          { label: 'Tasks Completed', value: `${doneTasks}/${totalTasks}`, sub: `${Math.round((doneTasks / totalTasks) * 100)}% completion rate`, color: '#6c63ff' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--card-accent': s.color, '--card-color': s.color }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {days.map((d, di) => (
          <div key={d.day} className="planner-day-card">
            <div className="planner-day-title" style={{ color: d.color }}>
              <span>📅</span> {d.day}
              <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {d.done.filter(Boolean).length}/{d.tasks.length}
              </span>
            </div>
            {d.tasks.map((task, ti) => (
              <div key={ti} className="planner-task" onClick={() => toggle(di, ti)} style={{ cursor: 'pointer' }}>
                <div className={`task-checkbox ${d.done[ti] ? 'checked' : ''}`}>
                  {d.done[ti] ? '✓' : ''}
                </div>
                <span style={{ textDecoration: d.done[ti] ? 'line-through' : 'none', color: d.done[ti] ? 'var(--text-muted)' : 'var(--text-secondary)', fontSize: '0.82rem' }}>
                  {task}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────
export function AdminPanel() {
  const COLLEGE_DATA = [
    ['DTU Delhi', 420], ['VIT Vellore', 380], ['BITS Pilani', 310], ['NSIT Delhi', 270], ['IIIT Hyd', 220],
  ];
  const STREAM_DATA = [
    { label: 'Science (PCM)', pct: 62, color: '#6c63ff' },
    { label: 'Science (PCB)', pct: 18, color: '#a855f7' },
    { label: 'Commerce',      pct: 14, color: '#ffb830' },
    { label: 'Arts',          pct: 6,  color: '#ff4d6d' },
  ];

  return (
    <div className="page-wrapper animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">⚙️ Admin Panel</h1>
          <p className="page-subtitle">Manage students, colleges, and platform analytics</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-ghost btn-sm">Export CSV</button>
          <button className="btn btn-primary btn-sm">+ Add Student</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-24">
        {[
          { label: 'Total Students', value: '2,847', color: '#ff4d6d', accent: '#ff4d6d', icon: '👥' },
          { label: 'Colleges Listed', value: '512', color: '#00e5b4', accent: '#00e5b4', icon: '🏛️' },
          { label: 'Predictions Made', value: '18,492', color: '#ffb830', accent: '#ffb830', icon: '🎯' },
          { label: 'Active Today', value: '341', color: '#6c63ff', accent: '#6c63ff', icon: '🟢' },
        ].map((s, i) => (
          <div key={i} className={`stat-card animate-in delay-${i + 1}`} style={{ '--card-accent': s.accent, '--card-color': s.color }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Students Table */}
      <div className="card mb-24">
        <div className="card-header">
          <div className="card-title">👥 Recent Students</div>
          <div className="flex gap-8">
            <input className="form-input" placeholder="Search…" style={{ width: 180, padding: '6px 12px', fontSize: '0.8rem' }} />
            <button className="btn btn-ghost btn-sm">Filter</button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Stream</th><th>CGPA</th><th>Prediction</th><th>Status</th><th>Joined</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_STUDENTS.map(s => (
                <tr key={s.email}>
                  <td><strong style={{ color: 'var(--text-primary)' }}>{s.name}</strong></td>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{s.email}</td>
                  <td><span className="badge badge-primary">{s.stream}</span></td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-warn)', fontFamily: 'var(--font-display)' }}>{s.cgpa}</td>
                  <td><span className="badge badge-success">{s.pred}</span></td>
                  <td>
                    <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-muted'}`}>
                      {s.status === 'Active' ? '● ' : '○ '}{s.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{s.joined}</td>
                  <td>
                    <div className="flex gap-4">
                      <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>Edit</button>
                      <button className="btn btn-sm" style={{ padding: '4px 8px', background: 'rgba(255,77,109,0.12)', color: 'var(--accent-danger)', border: '1px solid rgba(255,77,109,0.2)' }}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title mb-16">🏛️ Top Colleges by Applications</div>
          {COLLEGE_DATA.map(([name, val]) => (
            <div key={name} style={{ marginBottom: 12 }}>
              <div className="flex justify-between" style={{ marginBottom: 5 }}>
                <span style={{ fontSize: '0.82rem' }}>{name}</span>
                <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{val}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${(val / 450) * 100}%`, background: '#00b4d8' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title mb-16">📊 Stream Distribution</div>
          {STREAM_DATA.map(s => (
            <div key={s.label} style={{ marginBottom: 14 }}>
              <div className="flex justify-between" style={{ marginBottom: 5 }}>
                <span style={{ fontSize: '0.82rem' }}>{s.label}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: s.color, fontFamily: 'var(--font-display)' }}>{s.pct}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
