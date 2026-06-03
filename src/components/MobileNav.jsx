import { useAuth } from '../context/AuthContext';

const BOTTOM_NAV = [
  { id: 'dashboard',  icon: '📊', label: 'Home'     },
  { id: 'predict',    icon: '🎯', label: 'Predict'  },
  { id: 'colleges',   icon: '🏛️', label: 'Colleges' },
  { id: 'chatbot',    icon: '🤖', label: 'AI Chat'  },
  { id: 'career',     icon: '🚀', label: 'Career'   },
];

// More menu pages (shown via modal/drawer)
const MORE_PAGES = [
  { id: 'analytics',   icon: '📈', label: 'Analytics'   },
  { id: 'courses',     icon: '📚', label: 'Courses'      },
  { id: 'resume',      icon: '📄', label: 'Resume'       },
  { id: 'scholarship', icon: '💰', label: 'Scholarship'  },
  { id: 'planner',     icon: '📅', label: 'Planner'      },
  { id: 'admin',       icon: '⚙️', label: 'Admin'        },
];

export function MobileHeader({ onMenuClick, onLogout }) {
  const { user } = useAuth();
  return (
    <div className="mobile-header">
      <div className="mobile-header-logo">🎓 Smart Admission AI</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="mobile-header-user" onClick={onMenuClick}>
          {user?.initials || 'RS'}
        </div>
      </div>
    </div>
  );
}

export function MobileBottomNav({ active, onNavigate }) {
  return (
    <nav className="mobile-nav">
      {BOTTOM_NAV.map(item => (
        <div
          key={item.id}
          className={`mobile-nav-item${active === item.id ? ' active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </div>
      ))}
      {/* More button */}
      <MobileMoreMenu active={active} onNavigate={onNavigate} />
    </nav>
  );
}

function MobileMoreMenu({ active, onNavigate }) {
  const isMoreActive = MORE_PAGES.some(p => p.id === active);

  return (
    <div style={{ position: 'relative' }}>
      <div
        className={`mobile-nav-item${isMoreActive ? ' active' : ''}`}
        onClick={() => {
          const sheet = document.getElementById('mobileMoreSheet');
          if (sheet) sheet.style.display = sheet.style.display === 'flex' ? 'none' : 'flex';
        }}
      >
        <span className="nav-icon">⋯</span>
        <span className="nav-label">More</span>
      </div>

      {/* Bottom sheet */}
      <div
        id="mobileMoreSheet"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 62,
          left: 0,
          right: 0,
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-default)',
          borderRadius: '16px 16px 0 0',
          padding: '16px',
          zIndex: 999,
          flexDirection: 'column',
          gap: 4,
          boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ width: 36, height: 4, background: 'var(--border-strong)', borderRadius: 99, margin: '0 auto' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {MORE_PAGES.map(item => (
            <div
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                const sheet = document.getElementById('mobileMoreSheet');
                if (sheet) sheet.style.display = 'none';
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '12px 8px',
                background: active === item.id ? 'rgba(108,99,255,0.15)' : 'var(--bg-elevated)',
                borderRadius: 'var(--r-md)',
                cursor: 'pointer',
                border: active === item.id ? '1px solid rgba(108,99,255,0.3)' : '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      <div
        id="mobileMoreBackdrop"
        style={{ display: 'none', position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(0,0,0,0.5)' }}
        onClick={() => {
          document.getElementById('mobileMoreSheet').style.display = 'none';
          document.getElementById('mobileMoreBackdrop').style.display = 'none';
        }}
      />
    </div>
  );
}
