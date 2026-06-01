/**
 * api.js — All backend calls in one place
 * Base URL: http://localhost:5000/api
 */

const BASE = "http://localhost:5000/api";

// ── Token helpers ──────────────────────────────────────────
const getToken = () => localStorage.getItem("sam_token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

async function req(method, path, body) {
  const opts = { method, headers: authHeaders() };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ── Auth ───────────────────────────────────────────────────
export const authAPI = {
  login:  (email, password) => req("POST", "/auth/login",  { email, password }),
  signup: (data)            => req("POST", "/auth/signup", data),
  profile: ()               => req("GET",  "/auth/profile"),
  updateProfile: (data)     => req("PUT",  "/auth/profile", data),
};

// ── Prediction ─────────────────────────────────────────────
export const predictAPI = {
  run:     (data)   => req("POST", "/predict/",  data),
  history: ()       => req("GET",  "/predict/history"),
};

// ── Colleges ───────────────────────────────────────────────
export const collegesAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return req("GET", `/colleges/?${qs}`);
  },
  getOne:  (id) => req("GET", `/colleges/${id}`),
  getStates: () => req("GET", "/colleges/states"),
};

// ── Chat ───────────────────────────────────────────────────
export const chatAPI = {
  send: (messages) => req("POST", "/chat/", { messages }),
};

// ── Courses ────────────────────────────────────────────────
export const coursesAPI = {
  getAll:   (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return req("GET", `/courses/?${qs}`);
  },
  getTopics: () => req("GET", "/courses/topics"),
};

// ── Career ─────────────────────────────────────────────────
export const careerAPI = {
  getAll:      (params = {}) => req("GET", `/career/?${new URLSearchParams(params)}`),
  salaryChart: ()            => req("GET", "/career/salary-chart"),
};

// ── Scholarship ────────────────────────────────────────────
export const scholarshipAPI = {
  getAll: (params = {}) => req("GET", `/scholarship/?${new URLSearchParams(params)}`),
};

// ── Analytics ──────────────────────────────────────────────
export const analyticsAPI = {
  dashboard: () => req("GET", "/analytics/dashboard"),
};

// ── Resume ─────────────────────────────────────────────────
export const resumeAPI = {
  generatePDF: async (data) => {
    const res = await fetch(`${BASE}/resume/generate`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "PDF generation failed");
    }
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "Resume.pdf"; a.click();
    URL.revokeObjectURL(url);
  },
};

// ── Admin ──────────────────────────────────────────────────
export const adminAPI = {
  stats:    ()      => req("GET", "/admin/stats"),
  students: (params={}) => req("GET", `/admin/students?${new URLSearchParams(params)}`),
  delete:   (uid)   => req("DELETE", `/admin/students/${uid}`),
};
