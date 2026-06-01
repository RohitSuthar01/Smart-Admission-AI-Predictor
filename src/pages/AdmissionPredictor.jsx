import { useState } from 'react';
import { COLLEGES, computePrediction } from '../data';

const ALL_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Chandigarh',
  'Puducherry','Andaman & Nicobar','Lakshadweep','Dadra & Nagar Haveli',
];

const EXAMS = [
  'No Entrance Exam (Direct Admission)',
  'JEE Main','JEE Advanced','BITSAT','VITEEE','MHT-CET','KCET','WBJEE',
  'SRMJEEE','COMEDK','UPSEE','AP EAMCET','TS EAMCET','OJEE','GUJCET',
  'BCECE','KEAM','TANCET','CUET','Management Quota',
];
const CATS    = ['General','OBC','OBC-NCL','SC','ST','EWS','PwD'];
const BRANCHES = [
  'Computer Science (CSE)','CSE – AI & ML','CSE – Data Science','CSE – Cybersecurity',
  'Information Technology (IT)','Electronics & Communication (ECE)',
  'Electrical Engineering (EEE)','Mechanical Engineering','Civil Engineering',
  'Chemical Engineering','Aerospace Engineering','Biotechnology',
  'Environmental Engineering','Mining Engineering','Textile Engineering',
];
const EXTRAS = [
  'None','Sports (State Level)','Sports (National Level)','Cultural Activities',
  'NSS / NCC','Olympiad Winner (National)','Olympiad Winner (International)',
  'Published Research Paper','Patent Holder',
];

const ML_MODELS = [
  { key:'lr',  label:'Linear Regression',  color:'#00e5b4', desc:'Linear fit between academic scores and admission probability.' },
  { key:'rf',  label:'Random Forest',      color:'#6c63ff', desc:'Ensemble of 100 decision trees for robust prediction.' },
  { key:'log', label:'Logistic Regression',color:'#ffb830', desc:'Binary classifier giving probability of admission.' },
];

// Extended college list for predictions
const EXTENDED_COLLEGES = [
  ...COLLEGES,
  { id:9,  name:'Manipal Institute of Technology',   loc:'Manipal, Karnataka',       rating:'4.2', fees:'₹3.8L/yr', placement:'₹6.5 LPA', cutoff:'MET Merit',        match:91 },
  { id:10, name:'SRM Institute of Science',          loc:'Chennai, Tamil Nadu',       rating:'4.0', fees:'₹3.0L/yr', placement:'₹5.8 LPA', cutoff:'SRMJEEE Merit',     match:93 },
  { id:11, name:'Thapar Institute of Engineering',   loc:'Patiala, Punjab',           rating:'4.3', fees:'₹3.2L/yr', placement:'₹10 LPA',  cutoff:'JEE Main 85%ile',  match:78 },
  { id:12, name:'COEP Pune',                         loc:'Pune, Maharashtra',         rating:'4.2', fees:'₹1.0L/yr', placement:'₹9 LPA',   cutoff:'MHT-CET 95%ile',   match:76 },
  { id:13, name:'Jadavpur University',               loc:'Kolkata, West Bengal',      rating:'4.6', fees:'₹0.3L/yr', placement:'₹12 LPA',  cutoff:'WBJEE Top 1000',   match:70 },
  { id:14, name:'IIIT Allahabad',                    loc:'Prayagraj, UP',             rating:'4.5', fees:'₹2.5L/yr', placement:'₹20 LPA',  cutoff:'JEE Main 96%ile',  match:65 },
  { id:15, name:'NIT Trichy',                        loc:'Tiruchirappalli, TN',        rating:'4.6', fees:'₹1.5L/yr', placement:'₹14 LPA',  cutoff:'JEE Main 98%ile',  match:60 },
  { id:16, name:'NIT Warangal',                      loc:'Warangal, Telangana',       rating:'4.5', fees:'₹1.4L/yr', placement:'₹13 LPA',  cutoff:'JEE Main 97%ile',  match:62 },
  { id:17, name:'MNIT Jaipur',                       loc:'Jaipur, Rajasthan',         rating:'4.3', fees:'₹1.5L/yr', placement:'₹10 LPA',  cutoff:'JEE Main 93%ile',  match:72 },
  { id:18, name:'Amity University',                  loc:'Noida, Uttar Pradesh',      rating:'3.9', fees:'₹2.5L/yr', placement:'₹5 LPA',   cutoff:'Merit Based',       match:95 },
  { id:19, name:'Chandigarh University',             loc:'Mohali, Punjab',            rating:'4.1', fees:'₹2.0L/yr', placement:'₹6 LPA',   cutoff:'CUCET Merit',      match:94 },
  { id:20, name:'Lovely Professional University',    loc:'Phagwara, Punjab',          rating:'3.8', fees:'₹1.8L/yr', placement:'₹4.5 LPA', cutoff:'Merit Based',       match:97 },
  { id:21, name:'Bennett University',                loc:'Greater Noida, UP',         rating:'4.0', fees:'₹3.0L/yr', placement:'₹6 LPA',   cutoff:'Bennett Entrance', match:96 },
  { id:22, name:'PSG College of Technology',         loc:'Coimbatore, Tamil Nadu',    rating:'4.1', fees:'₹0.8L/yr', placement:'₹6 LPA',   cutoff:'TNEA Merit',       match:80 },
  { id:23, name:'JECRC University',                  loc:'Jaipur, Rajasthan',         rating:'3.8', fees:'₹1.2L/yr', placement:'₹4 LPA',   cutoff:'Direct Admission', match:98 },
  { id:24, name:'Poornima College of Engineering',   loc:'Jaipur, Rajasthan',         rating:'3.7', fees:'₹1.0L/yr', placement:'₹3.5 LPA', cutoff:'Direct Admission', match:98 },
];

export default function AdmissionPredictor() {
  const [form, setForm] = useState({
    p10:92, p12:88, cgpa:8.4, entrance:145,
    exam:'JEE Main', category:'General',
    branch:'Computer Science (CSE)', state:'Delhi', extra:'Sports (State Level)',
    hasEntrance: true,
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleExamChange = (val) => {
    const noExam = val === 'No Entrance Exam (Direct Admission)' || val === 'Management Quota';
    set('exam', val);
    set('hasEntrance', !noExam);
    if (noExam) set('entrance', 0);
  };

  const runPrediction = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    const res = computePrediction({
      p10: +form.p10, p12: +form.p12, cgpa: +form.cgpa,
      entrance: form.hasEntrance ? +form.entrance : 0,
      category: form.category, extra: form.extra,
    });
    // Direct admission students get boosted match for private colleges
    if (!form.hasEntrance) res.overall = Math.max(res.overall, 55);
    setResult({ ...res, noExam: !form.hasEntrance });
    setLoading(false);
  };

  const eligible = result
    ? EXTENDED_COLLEGES
        .map(c => ({ ...c, matchScore: result.noExam ? (c.match >= 90 ? c.match : null) : (c.match <= result.overall + 15 ? c.match : null) }))
        .filter(c => c.matchScore !== null)
        .sort((a, b) => b.matchScore - a.matchScore)
    : [];

  return (
    <div className="page-wrapper animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">🎯 Admission Predictor</h1>
          <p className="page-subtitle">ML-powered · Works for JEE, BITSAT, State exams & Direct Admission</p>
        </div>
      </div>

      <div className="grid-2" style={{ gap:20 }}>
        {/* Form */}
        <div className="card">
          <div className="card-title mb-16">📋 Your Academic Profile</div>

          {/* Exam selector FIRST — controls rest of form */}
          <div className="form-group mb-16">
            <label className="form-label">🎓 Admission Route / Entrance Exam</label>
            <select className="form-select" value={form.exam} onChange={e => handleExamChange(e.target.value)}>
              {EXAMS.map(e => <option key={e}>{e}</option>)}
            </select>
            {!form.hasEntrance && (
              <div style={{ marginTop:8, padding:'8px 12px', background:'rgba(255,184,48,0.1)', border:'1px solid rgba(255,184,48,0.3)', borderRadius:'var(--r-sm)', fontSize:'0.78rem', color:'var(--accent-warn)' }}>
                ⚡ Direct Admission mode — prediction based on 10th, 12th & CGPA only
              </div>
            )}
          </div>

          <div className="form-grid-2 mb-16">
            <div className="form-group">
              <label className="form-label">10th Percentage (%)</label>
              <input className="form-input" type="number" min="0" max="100" value={form.p10} onChange={e => set('p10',e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">12th Percentage (%)</label>
              <input className="form-input" type="number" min="0" max="100" value={form.p12} onChange={e => set('p12',e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">CGPA (0–10)</label>
              <input className="form-input" type="number" step="0.1" min="0" max="10" value={form.cgpa} onChange={e => set('cgpa',e.target.value)} />
            </div>

            {/* Entrance score — hidden if no exam */}
            {form.hasEntrance && (
              <div className="form-group">
                <label className="form-label">Entrance Score</label>
                <input className="form-input" type="number" value={form.entrance} onChange={e => set('entrance',e.target.value)}
                  placeholder={form.exam==='JEE Main'?'0–300':form.exam==='BITSAT'?'0–390':'Score'} />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => set('category',e.target.value)}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Home State</label>
              <select className="form-select" value={form.state} onChange={e => set('state',e.target.value)}>
                {ALL_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn:'span 2' }}>
              <label className="form-label">Preferred Branch</label>
              <select className="form-select" value={form.branch} onChange={e => set('branch',e.target.value)}>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn:'span 2' }}>
              <label className="form-label">Extra-Curricular</label>
              <select className="form-select" value={form.extra} onChange={e => set('extra',e.target.value)}>
                {EXTRAS.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          </div>

          {/* ML model tags */}
          <div className="flex gap-8 mb-16" style={{ flexWrap:'wrap' }}>
            {ML_MODELS.map(m => (
              <div key={m.key} style={{ color:m.color, borderColor:`${m.color}40`, background:`${m.color}10`, padding:'5px 12px', borderRadius:'var(--r-full)', fontSize:'0.72rem', fontWeight:600, display:'inline-flex', alignItems:'center', gap:6, border:'1px solid' }}>
                <span style={{ width:7,height:7,borderRadius:'50%',background:m.color,display:'inline-block' }}/>
                {m.label}
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-lg btn-full" onClick={runPrediction} disabled={loading}>
            {loading ? '🔄 Running Models…' : '🚀 Predict Admission Chances'}
          </button>
        </div>

        {/* Results */}
        <div>
          {!result && !loading && (
            <div className="card" style={{ textAlign:'center', padding:'48px 24px' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🎯</div>
              <h3 style={{ fontFamily:'var(--font-display)', marginBottom:8 }}>Ready to Predict</h3>
              <p className="text-muted text-sm">Fill your details and click Predict.<br/>Works for all exam routes including Direct Admission.</p>
            </div>
          )}

          {loading && (
            <div className="card" style={{ textAlign:'center', padding:'40px 24px' }}>
              <div style={{ fontSize:40, marginBottom:12, animation:'spin 1s linear infinite', display:'inline-block' }}>⚙️</div>
              <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
              <h3 style={{ fontFamily:'var(--font-display)', marginBottom:16 }}>Running ML Models…</h3>
              {ML_MODELS.map((m,i) => (
                <div key={m.key} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid var(--border-subtle)' }}>
                  <div style={{ width:8,height:8,borderRadius:'50%',background:m.color }} />
                  <span style={{ fontSize:'0.8rem', color:'var(--text-secondary)', flex:1, textAlign:'left' }}>{m.label}</span>
                  <div style={{ width:100, height:3, background:'var(--bg-overlay)', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', background:m.color, animation:'ld 0.8s ease-in-out infinite alternate', borderRadius:99 }}/>
                  </div>
                  <style>{`@keyframes ld{from{width:10%}to{width:95%}}`}</style>
                </div>
              ))}
            </div>
          )}

          {result && (
            <>
              <div className="card mb-16">
                <div className="card-title mb-16">🎯 Prediction Results
                  {result.noExam && <span className="badge badge-warn" style={{ marginLeft:8 }}>Direct Admission</span>}
                </div>
                <div className="pred-result-box mb-16">
                  <div className="pred-percentage">{result.overall}%</div>
                  <div className="pred-label">Overall Admission Probability</div>
                  {!result.noExam && <div className="pred-rank">Estimated Rank: ~{result.rank.toLocaleString('en-IN')}</div>}
                  {result.noExam && <div className="pred-rank" style={{ color:'var(--accent-secondary)' }}>Based on Board Marks + CGPA</div>}
                </div>
                {!result.noExam && (
                  <div className="ml-model-grid">
                    {ML_MODELS.map(m => (
                      <div key={m.key} className="ml-model-card">
                        <div className="ml-model-name">{m.label}</div>
                        <div className="ml-model-score" style={{ color:m.color }}>{result[m.key]}%</div>
                        <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginTop:6, lineHeight:1.4 }}>{m.desc}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card">
                <div className="card-title mb-12">🏛️ Eligible Colleges ({eligible.length})</div>
                {eligible.length === 0 && <p className="text-muted text-sm">No matches found. Try adjusting your scores.</p>}
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {eligible.map(c => (
                    <div key={c.id} className="flex items-center gap-12" style={{ padding:'10px 12px', background:'var(--bg-elevated)', borderRadius:'var(--r-md)', border:'1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize:18 }}>🏛️</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:'0.85rem', fontWeight:700 }}>{c.name}</div>
                        <div className="text-xs text-muted">{c.loc} · {c.fees} · {c.placement} avg</div>
                      </div>
                      <span className={`badge ${c.matchScore>=80?'badge-success':c.matchScore>=65?'badge-primary':'badge-warn'}`}>{c.matchScore}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
