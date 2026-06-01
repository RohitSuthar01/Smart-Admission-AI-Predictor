import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, predictAPI } from '../api';
import { DEADLINES } from '../data';

export default function Dashboard({ onNavigate }) {
  const { user } = useAuth();
  const [stats,   setStats]   = useState(null);
  const [lastPred, setLastPred] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jeeMode, setJeeMode] = useState(true); // toggle JEE vs Non-JEE view

  useEffect(() => {
    Promise.all([
      analyticsAPI.dashboard().catch(() => null),
      predictAPI.history().catch(() => []),
    ]).then(([s, h]) => {
      setStats(s);
      if (Array.isArray(h) && h.length > 0) setLastPred(h[0]);
      setLoading(false);
    });
  }, []);

  // Academic data — from user profile or fallback
  const acad = stats?.user?.academics || {};
  const p10  = acad.p10  || 92;
  const p12  = acad.p12  || 88;
  const cgpa = acad.cgpa || 8.4;
  const jeeScore   = acad.entrance_score || 145;
  const jeeMax     = 300;
  const jeePct     = Math.round((jeeScore / jeeMax) * 100);
  const jeePercentile = Math.round(90 + (jeeScore - 100) / 200 * 9.5); // approx

  const admChance = lastPred?.overall || 78;
  const predRank  = lastPred?.rank    || 1240;

  const TOP_COLLEGES = [
    { name:'DTU Delhi',       branch:'Computer Science Engineering', match: admChance >= 75 ? 82 : 60, color:'badge-success' },
    { name:'NSIT Delhi',      branch:'Information Technology',        match: admChance >= 70 ? 75 : 55, color:'badge-primary' },
    { name:'IIIT Hyderabad',  branch:'CSE + MS by Research',          match: admChance >= 80 ? 68 : 50, color:'badge-warn'    },
    { name:'VIT Vellore',     branch:'CSE – AI & ML Specialization',  match: admChance >= 60 ? 88 : 70, color:'badge-success' },
  ];

  return (
    <div className="page-wrapper animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Your complete admission journey overview</p>
        </div>
        <div className="page-header-right">
          <span className="badge badge-success">● Active</span>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('predict')}>Run Prediction ↗</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-4 mb-24">
        {[
          { label:'Admission Chance',  value: `${admChance}%`,        sub: lastPred ? '↑ Latest prediction' : 'Run prediction first', icon:'🎯', color:'#00e5b4', accent:'#00e5b4' },
          { label:'Predicted Rank',    value: `#${predRank.toLocaleString('en-IN')}`, sub:'State level estimate', icon:'🏆', color:'#6c63ff', accent:'#6c63ff' },
          { label:'Eligible Colleges', value: admChance >= 70 ? '34' : '18', sub:'Based on your profile', icon:'🏛️', color:'#ffb830', accent:'#ffb830' },
          { label:'CGPA Score',        value: cgpa.toFixed(1),        sub:'Out of 10.0',             icon:'📊', color:'#a855f7', accent:'#a855f7' },
        ].map((s, i) => (
          <div key={i} className={`stat-card animate-in delay-${i+1}`} style={{ '--card-accent':s.accent, '--card-color':s.color }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-24">
        {/* Academic Snapshot */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📊 Academic Snapshot</div>
            {/* JEE / Non-JEE Toggle */}
            <div style={{ display:'flex', background:'var(--bg-overlay)', borderRadius:'var(--r-sm)', padding:3, border:'1px solid var(--border-subtle)' }}>
              <button onClick={()=>setJeeMode(true)}  className="btn btn-sm" style={{ padding:'4px 10px', fontSize:'0.72rem', background: jeeMode ? 'var(--bg-elevated)' : 'transparent', color: jeeMode ? 'var(--text-primary)':'var(--text-muted)', border:'none' }}>JEE</button>
              <button onClick={()=>setJeeMode(false)} className="btn btn-sm" style={{ padding:'4px 10px', fontSize:'0.72rem', background:!jeeMode ? 'var(--bg-elevated)' : 'transparent', color:!jeeMode ? 'var(--text-primary)':'var(--text-muted)', border:'none' }}>Non-JEE</button>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* 10th */}
            <div>
              <div className="flex justify-between" style={{ marginBottom:5 }}>
                <span style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>10th Percentage</span>
                <span style={{ fontSize:'0.82rem', fontWeight:700, color:'#00e5b4' }}>{p10}%</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ width:`${p10}%`, background:'#00e5b4' }}/></div>
              <div className="text-xs text-muted mt-4">Board: CBSE · Grade: {p10>=90?'A1':p10>=80?'A2':'B1'}</div>
            </div>

            {/* 12th */}
            <div>
              <div className="flex justify-between" style={{ marginBottom:5 }}>
                <span style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>12th Percentage</span>
                <span style={{ fontSize:'0.82rem', fontWeight:700, color:'#6c63ff' }}>{p12}%</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ width:`${p12}%`, background:'#6c63ff' }}/></div>
              <div className="text-xs text-muted mt-4">Stream: Science (PCM) · Board: CBSE · Year: 2025</div>
            </div>

            {/* JEE section */}
            {jeeMode ? (
              <>
                <div>
                  <div className="flex justify-between" style={{ marginBottom:5 }}>
                    <span style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>JEE Main Score</span>
                    <span style={{ fontSize:'0.82rem', fontWeight:700, color:'#ffb830' }}>{jeeScore} / {jeeMax}</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width:`${jeePct}%`, background:'#ffb830' }}/></div>
                  <div className="text-xs text-muted mt-4">Percentile: ~{jeePercentile}%ile · Paper: B.E./B.Tech</div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                  {[['Physics', Math.round(jeeScore*0.35), 100],['Chemistry', Math.round(jeeScore*0.32), 100],['Math', Math.round(jeeScore*0.33), 100]].map(([sub,sc,mx])=>(
                    <div key={sub} style={{ padding:'10px', background:'var(--bg-elevated)', borderRadius:'var(--r-sm)', textAlign:'center' }}>
                      <div className="text-xs text-muted">{sub}</div>
                      <div style={{ fontSize:'1rem', fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-display)' }}>{sc}</div>
                      <div className="text-xs text-muted">/{mx}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex justify-between" style={{ marginBottom:5 }}>
                    <span style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>BITSAT Score</span>
                    <span style={{ fontSize:'0.82rem', fontWeight:700, color:'#ff4d6d' }}>310 / 390</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width:'79%', background:'#ff4d6d' }}/></div>
                  <div className="text-xs text-muted mt-4">BITS Pilani: Need 340+ for CSE · Goa: 330+</div>
                </div>
                <div>
                  <div className="flex justify-between" style={{ marginBottom:5 }}>
                    <span style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>VITEEE Rank</span>
                    <span style={{ fontSize:'0.82rem', fontWeight:700, color:'#a855f7' }}>#8,420</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width:'82%', background:'#a855f7' }}/></div>
                  <div className="text-xs text-muted mt-4">VIT CSE Vellore: Need Top 10k · ✅ Eligible</div>
                </div>
              </>
            )}

            {/* CGPA */}
            <div>
              <div className="flex justify-between" style={{ marginBottom:5 }}>
                <span style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>CGPA (Class 11 Internal)</span>
                <span style={{ fontSize:'0.82rem', fontWeight:700, color:'#a855f7' }}>{cgpa} / 10</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ width:`${cgpa*10}%`, background:'#a855f7' }}/></div>
              <div className="text-xs text-muted mt-4">Equivalent %: {Math.round(cgpa*9.5)}% · Grade: {cgpa>=9?'O':cgpa>=8?'A+':'A'}</div>
            </div>
          </div>

          <div style={{ marginTop:14, paddingTop:12, borderTop:'1px solid var(--border-subtle)' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('analytics')}>View Full Analytics →</button>
          </div>
        </div>

        {/* Top College Matches */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🎯 Top College Matches</div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('colleges')}>All Colleges →</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {TOP_COLLEGES.map(c => (
              <div key={c.name} className="flex items-center gap-12" style={{ padding:'11px 12px', background:'var(--bg-elevated)', borderRadius:'var(--r-md)', border:'1px solid var(--border-subtle)', cursor:'pointer', transition:'border-color 0.15s' }}
                onClick={() => onNavigate('colleges')}>
                <div style={{ fontSize:20, flexShrink:0 }}>🏛️</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'0.85rem', fontWeight:700, color:'var(--text-primary)' }}>{c.name}</div>
                  <div className="text-xs text-muted truncate">{c.branch}</div>
                </div>
                <span className={`badge ${c.color}`}>{c.match}%</span>
              </div>
            ))}
          </div>

          {/* Admit category breakdown */}
          <div style={{ marginTop:14, padding:'12px', background:'var(--bg-elevated)', borderRadius:'var(--r-md)', border:'1px solid var(--border-subtle)' }}>
            <div className="text-xs text-muted mb-8" style={{ marginBottom:8, fontWeight:600 }}>Category Benefit (General → OBC/SC/ST)</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
              {[['General','0%','#8888aa'],['OBC','+3–5%','#00b4d8'],['SC','+8–12%','#6c63ff'],['ST','+12–15%','#00e5b4']].map(([cat,bonus,color])=>(
                <div key={cat} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', marginBottom:3 }}>{cat}</div>
                  <div style={{ fontSize:'0.78rem', fontWeight:700, color }}>{bonus}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Career + Deadlines */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">🚀 AI Career Suggestions</div>
            <button className="btn btn-ghost btn-sm" onClick={()=>onNavigate('career')}>Explore →</button>
          </div>
          <div className="grid-2" style={{ gap:10 }}>
            {[
              { icon:'💻', title:'Software Engineer', salary:'₹8–45 LPA', growth:'↑ 25%' },
              { icon:'🧠', title:'AI / ML Engineer', salary:'₹12–60 LPA', growth:'↑ 38%' },
              { icon:'🔒', title:'Cybersecurity', salary:'₹6–35 LPA', growth:'↑ 32%' },
              { icon:'📊', title:'Data Scientist', salary:'₹10–50 LPA', growth:'↑ 29%' },
            ].map(c=>(
              <div key={c.title} className="career-card" onClick={()=>onNavigate('career')}>
                <div className="career-card-icon">{c.icon}</div>
                <div className="career-card-title" style={{ fontSize:'0.82rem' }}>{c.title}</div>
                <div className="career-card-salary">{c.salary}</div>
                <div className="career-card-growth">{c.growth} / yr</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">📅 Upcoming Deadlines</div>
            <span className="badge badge-danger">{DEADLINES.length} due soon</span>
          </div>
          {DEADLINES.map(d => (
            <div key={d.name} className="deadline-item" style={{ borderColor:d.color }}>
              <div className="deadline-icon">{d.icon}</div>
              <div className="deadline-info">
                <div className="deadline-name">{d.name}</div>
                <div className="deadline-sub">{d.sub}</div>
              </div>
              <span className="badge" style={{ background:`${d.color}18`, color:d.color, border:`1px solid ${d.color}40`, whiteSpace:'nowrap' }}>
                {d.days}d
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
