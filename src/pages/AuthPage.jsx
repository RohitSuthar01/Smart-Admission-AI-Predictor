import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [tab,      setTab]      = useState('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [phone,    setPhone]    = useState('');
  const [stream,   setStream]   = useState('Science (PCM)');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email || 'rahul@example.com', password);
    if (!result.ok) setError(result.error);
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = await signup({ name: name.trim(), email: email.trim(), password, phone, stream });
    if (!result.ok) setError(result.error);
    setLoading(false);
  };

  return (
    <div className="auth-page">
      {/* Left — Hero */}
      <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-left-content">
          <div className="auth-hero-badge">
            <span>✦</span> AI-Powered Education Platform
          </div>
          <h1 className="auth-hero-title">
            Your Smart Path to <span>Top Colleges</span>
          </h1>
          <p className="auth-hero-desc">
            Get AI-driven admission predictions, personalized college recommendations,
            career guidance, and a complete academic toolkit — all in one place.
          </p>
          <div className="auth-features">
            {[
              'ML-powered admission chance prediction',
              'AI career counselor chatbot (Claude)',
              'College finder with 500+ institutions',
              'Smart resume builder & scholarship finder',
              'Personalized study planner',
            ].map(f => (
              <div key={f} className="auth-feature">
                <span className="auth-feature-dot" />
                {f}
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex gap-16 mt-24" style={{ paddingTop: 24, borderTop: '1px solid var(--border-subtle)' }}>
            {[['2,800+', 'Students'], ['500+', 'Colleges'], ['94%', 'Accuracy'], ['15+', 'ML Models']].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>{val}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="auth-right">
        <div className="auth-form-card">
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
              {tab === 'login' ? 'Welcome back 👋' : 'Create account 🎓'}
            </span>
          </div>
          <p className="auth-form-sub">
            {tab === 'login'
              ? 'Sign in to continue your admission journey'
              : 'Join 2,800+ students on their path to top colleges'}
          </p>

          <div className="auth-tabs">
            <div className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Sign In</div>
            <div className={`auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => setTab('signup')}>Sign Up</div>
          </div>

          {/* Error message */}
          {error && (
            <div style={{ padding:'10px 14px', background:'rgba(255,77,109,0.1)', border:'1px solid rgba(255,77,109,0.3)', borderRadius:'var(--r-md)', fontSize:'0.8rem', color:'#ff4d6d', marginBottom:8 }}>
              ⚠️ {error}
            </div>
          )}

          {tab === 'login' ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="••••••••" required />
              </div>
              <button className="btn btn-primary btn-lg btn-full" type="submit" disabled={loading}>
                {loading ? '⏳ Signing in…' : 'Sign In →'}
              </button>
              <div className="auth-footer-text">
                New user? <span style={{color:'var(--accent-primary)',cursor:'pointer',fontWeight:600}} onClick={()=>{setTab('signup');setError('');}}>Create account →</span>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignup}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" type="text" value={name} onChange={e => { setName(e.target.value); setError(''); }} placeholder="Rohit Suthar" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="rohit@gmail.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label className="form-label">Stream</label>
                <select className="form-select" value={stream} onChange={e => setStream(e.target.value)}>
                  <option>Science (PCM)</option>
                  <option>Science (PCB)</option>
                  <option>Commerce</option>
                  <option>Arts / Humanities</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Password * (min 6 characters)</label>
                <input className="form-input" type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="Min. 6 characters" required />
              </div>
              <button className="btn btn-primary btn-lg btn-full" type="submit" disabled={loading}>
                {loading ? '⏳ Creating account…' : 'Create Account →'}
              </button>
              <div className="auth-footer-text">
                Already have account? <span style={{color:'var(--accent-primary)',cursor:'pointer',fontWeight:600}} onClick={()=>{setTab('login');setError('');}}>Sign in →</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
