// src/context/AuthContext.jsx — Fixed Firebase version
import { createContext, useContext, useState, useEffect } from 'react';
import {
  signupUser, loginUser, logoutUser,
  getUserProfile, onAuthChange,
} from '../firebase/firebaseService';

const AuthContext = createContext(null);

// Helper — build user object from profile
function buildUser(profile) {
  if (!profile) return null;
  return {
    ...profile,
    initials: (profile.name || 'RS')
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
  };
}

// Demo fallback — works even without Firebase configured
function demoUser(email = 'demo@example.com', name = 'Rahul Sharma', stream = 'Science (PCM)') {
  return buildUser({
    uid:      'demo-001',
    name,
    email,
    stream,
    phone:    '+91 98765 43210',
    city:     'Delhi, India',
    linkedin: 'linkedin.com/in/rahulsharma',
    github:   'github.com/rahulsharma',
    is_admin: false,
    academics: {
      p10: 92, p12: 88, cgpa: 8.4,
      entrance_score: 145, entrance_exam: 'JEE Main',
      category: 'General', branch: 'Computer Science (CSE)',
      state: 'Delhi', extra: 'Sports (State Level)',
    },
    objective: 'Aspiring software engineer with strong CSE fundamentals.',
    skills:    'Python, C++, Java, React, Machine Learning, SQL, Git',
  });
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase auth state listener
  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUser(buildUser(profile));
        } catch (e) {
          console.error('Profile fetch error:', e);
          // If Firestore fails, use Firebase display name
          setUser(buildUser({
            uid:    firebaseUser.uid,
            name:   firebaseUser.displayName || firebaseUser.email,
            email:  firebaseUser.email,
            stream: 'Science (PCM)',
            academics: {},
          }));
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ── SIGNUP ────────────────────────────────────────
  const signup = async (formData) => {
    const { name, email, password, stream, phone } = formData;
    try {
      // Firebase signup — also saves to Firestore
      const firebaseUser = await signupUser({ name, email, password, stream, phone });

      // Immediately set user state — don't wait for onAuthChange
      const newUser = buildUser({
        uid:    firebaseUser.uid,
        name:   name || firebaseUser.displayName || email,
        email:  email,
        stream: stream || 'Science (PCM)',
        phone:  phone || '',
        is_admin: false,
        academics: {
          p10: 0, p12: 0, cgpa: 0,
          entrance_score: 0, entrance_exam: 'JEE Main',
          category: 'General', branch: 'Computer Science (CSE)',
          state: 'Delhi', extra: 'None',
        },
        objective: '',
        skills:    '',
      });
      setUser(newUser);
      return { ok: true };

    } catch (e) {
      console.error('Signup error:', e);

      // Firebase not configured → demo mode
      if (!e.code || e.code === 'auth/invalid-api-key' || e.code === 'auth/configuration-not-found') {
        setUser(demoUser(email, name, stream));
        return { ok: true };
      }

      const msgs = {
        'auth/email-already-in-use': 'Email already registered. Please login instead.',
        'auth/weak-password':        'Password must be at least 6 characters.',
        'auth/invalid-email':        'Invalid email address.',
        'auth/network-request-failed': 'Network error. Check your internet connection.',
      };
      return { ok: false, error: msgs[e.code] || e.message };
    }
  };

  // ── LOGIN ─────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const firebaseUser = await loginUser(email, password);

      // Try to get full profile from Firestore
      try {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          setUser(buildUser(profile));
        } else {
          // Profile not in Firestore — use Firebase data
          setUser(buildUser({
            uid:    firebaseUser.uid,
            name:   firebaseUser.displayName || email.split('@')[0],
            email:  firebaseUser.email,
            stream: 'Science (PCM)',
            academics: {},
          }));
        }
      } catch {
        setUser(buildUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || email.split('@')[0],
          email: firebaseUser.email,
          stream: 'Science (PCM)',
          academics: {},
        }));
      }

      return { ok: true };

    } catch (e) {
      console.error('Login error:', e);

      // Demo fallback
      if (!e.code || e.code === 'auth/invalid-api-key' || e.code === 'auth/configuration-not-found') {
        setUser(demoUser(email));
        return { ok: true };
      }

      const msgs = {
        'auth/user-not-found':     'Email not registered. Please sign up first.',
        'auth/wrong-password':     'Wrong password. Please try again.',
        'auth/invalid-credential': 'Wrong email or password.',
        'auth/invalid-email':      'Invalid email address.',
        'auth/too-many-requests':  'Too many attempts. Try again later.',
        'auth/network-request-failed': 'Network error. Check your internet connection.',
      };
      return { ok: false, error: msgs[e.code] || e.message };
    }
  };

  // ── LOGOUT ────────────────────────────────────────
  const logout = async () => {
    try { await logoutUser(); } catch (e) { console.error(e); }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
