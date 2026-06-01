import { useAuth } from '../context/AuthContext';

const NAV = [
  { id: 'dashboard',   icon: '📊', label: 'Dashboard',           group: 'Main' },
  { id: 'predict',     icon: '🎯', label: 'Admission Predictor', group: 'Main' },
  { id: 'colleges',    icon: '🏛️', label: 'College Finder',      group: 'Main' },
  { id: 'chatbot',     icon: '🤖', label: 'AI Counselor',        group: 'AI Tools', badge: 'AI' },
  { id: 'career',      icon: '🚀', label: 'Career Guidance',     group: 'AI Tools' },
  { id: 'courses',     icon: '📚', label: 'Course Recommender',  group: 'AI Tools' },
  { id: 'analytics',   icon: '📈', label: 'Performance',         group: 'Profile' },
  { id: 'resume',      icon: '📄', label: 'Resume Builder',      group: 'Profile' },
  { id: 'scholarship', icon: '💰', label: 'Scholarships',        group: 'Profile' },
  { id: 'planner',     icon: '📅', label: 'Study Planner',       group: 'Profile' },
  { id: 'admin',       icon: '⚙️', label: 'Admin Panel',         group: 'System' },
];

const GROUPS = ['Main', 'AI Tools', 'Profile', 'System'];

export default function Sidebar({ active, onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🎓</div>
        <div>
          <div className="sidebar-logo-text">Smart Admission</div>
          <div className="sidebar-logo-sub">AI Predictor v2.0</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {GROUPS.map(group => {
          const items = NAV.filter(n => n.group === group);
          return (
            <div key={group}>
              <div className="nav-group-label">{group}</div>
              {items.map(item => (
                <div
                  key={item.id}
                  className={`nav-item${active === item.id ? ' active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                  {item.id === 'chatbot' && active !== 'chatbot' && (
                    <span className="notif-new" />
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="sidebar-user">
        <div className="user-avatar" style={{ background: `hsl(${(user?.name?.charCodeAt(0) || 65) * 5}, 70%, 45%)` }}>
          {user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || 'RS'}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="user-name" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {user?.name || 'Student'}
          </div>
          <div className="user-role" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {user?.stream || 'Science (PCM)'}
          </div>
        </div>
        <button className="sidebar-logout-btn" onClick={logout} title="Sign out">↩</button>
      </div>
    </aside>
  );
}
