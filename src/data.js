// ─── Data Constants ───────────────────────────────────────────

export const COLLEGES = [
  { id: 1, name: 'IIT Bombay', loc: 'Mumbai, Maharashtra', rating: '4.9', fees: '₹2.5L/yr', placement: '₹28 LPA', cutoff: 'JEE Adv: Top 1500', stream: 'Engineering', match: 61 },
  { id: 2, name: 'DTU Delhi', loc: 'New Delhi, Delhi', rating: '4.5', fees: '₹1.8L/yr', placement: '₹18 LPA', cutoff: 'JEE Main: 95%ile', stream: 'Engineering', match: 82 },
  { id: 3, name: 'BITS Pilani', loc: 'Pilani, Rajasthan', rating: '4.8', fees: '₹5.2L/yr', placement: '₹22 LPA', cutoff: 'BITSAT: 340+', stream: 'Engineering', match: 74 },
  { id: 4, name: 'VIT Vellore', loc: 'Vellore, Tamil Nadu', rating: '4.3', fees: '₹2.2L/yr', placement: '₹7 LPA', cutoff: 'VITEEE: Top 10k', stream: 'Engineering', match: 88 },
  { id: 5, name: 'NSIT Delhi', loc: 'New Delhi, Delhi', rating: '4.4', fees: '₹1.5L/yr', placement: '₹14 LPA', cutoff: 'JEE Main: 90%ile', stream: 'Engineering', match: 75 },
  { id: 6, name: 'IIIT Hyderabad', loc: 'Hyderabad, Telangana', rating: '4.7', fees: '₹3.1L/yr', placement: '₹24 LPA', cutoff: 'JEE Main: 98%ile', stream: 'Engineering', match: 68 },
  { id: 7, name: 'Manipal Institute of Technology', loc: 'Manipal, Karnataka', rating: '4.2', fees: '₹3.8L/yr', placement: '₹6.5 LPA', cutoff: 'MET: Merit based', stream: 'Engineering', match: 91 },
  { id: 8, name: 'SRM Institute of Science & Technology', loc: 'Chennai, Tamil Nadu', rating: '4.0', fees: '₹3.0L/yr', placement: '₹5.8 LPA', cutoff: 'SRMJEEE: Merit', stream: 'Engineering', match: 93 },
];

export const CAREERS = [
  { icon: '💻', title: 'Software Engineer', salary: '₹8 – 45 LPA', growth: '25% growth/yr', skills: 'DSA, System Design, CS Fundamentals', desc: 'Build scalable software at top product companies like Google, Microsoft, Amazon.' },
  { icon: '🧠', title: 'AI / ML Engineer', salary: '₹12 – 60 LPA', growth: '38% growth/yr', skills: 'Python, TensorFlow, PyTorch, Math', desc: 'Design and deploy machine learning models and AI pipelines.' },
  { icon: '📊', title: 'Data Scientist', salary: '₹10 – 50 LPA', growth: '29% growth/yr', skills: 'Statistics, Python, SQL, Viz', desc: 'Extract actionable insights from complex datasets for business decisions.' },
  { icon: '🔒', title: 'Cybersecurity Analyst', salary: '₹6 – 35 LPA', growth: '32% growth/yr', skills: 'Networking, Ethical Hacking, VAPT', desc: 'Protect organizations from digital threats and vulnerabilities.' },
  { icon: '☁️', title: 'Cloud Architect', salary: '₹15 – 70 LPA', growth: '27% growth/yr', skills: 'AWS, GCP, Azure, DevOps, Kubernetes', desc: 'Design and manage scalable cloud infrastructure for enterprises.' },
  { icon: '📱', title: 'Product Manager', salary: '₹18 – 80 LPA', growth: '22% growth/yr', skills: 'Strategy, Analytics, Leadership, UX', desc: 'Lead product vision and roadmaps across cross-functional teams.' },
  { icon: '🌐', title: 'Full Stack Developer', salary: '₹6 – 30 LPA', growth: '21% growth/yr', skills: 'React, Node.js, Databases, APIs', desc: 'Build end-to-end web applications from frontend to backend.' },
  { icon: '🤖', title: 'Robotics Engineer', salary: '₹8 – 35 LPA', growth: '19% growth/yr', skills: 'ROS, C++, Control Systems, Vision', desc: 'Develop autonomous robotic systems for industry and research.' },
  { icon: '📡', title: 'VLSI / Embedded Engineer', salary: '₹5 – 25 LPA', growth: '16% growth/yr', skills: 'Verilog, VHDL, C, Microcontrollers', desc: 'Design chips and embedded systems for consumer electronics.' },
];

export const SCHOLARSHIPS = [
  { icon: '🏛️', name: 'Central Sector Scholarship', desc: 'MHRD — For top 20 percentile CBSE students with family income < ₹8L', amount: '₹1,00,000/yr', deadline: 'Aug 31, 2025', eligible: true, color: 'rgba(108,99,255,0.12)', borderColor: 'rgba(108,99,255,0.25)' },
  { icon: '💡', name: 'INSPIRE Scholarship', desc: 'DST India — Science stream students with 60%+ in Class 12', amount: '₹80,000/yr', deadline: 'Sep 15, 2025', eligible: true, color: 'rgba(0,229,180,0.10)', borderColor: 'rgba(0,229,180,0.25)' },
  { icon: '🌟', name: 'Pragati Scholarship', desc: 'AICTE — Girls pursuing technical education (B.Tech / Diploma)', amount: '₹50,000/yr', deadline: 'Oct 1, 2025', eligible: false, color: 'rgba(255,77,109,0.08)', borderColor: 'rgba(255,77,109,0.2)' },
  { icon: '🏆', name: 'Sitaram Jindal Scholarship', desc: 'Meritorious students — Annual family income below ₹4 Lakhs', amount: '₹24,000/yr', deadline: 'Sep 30, 2025', eligible: true, color: 'rgba(255,184,48,0.10)', borderColor: 'rgba(255,184,48,0.25)' },
  { icon: '📚', name: 'National Talent Search (NTS)', desc: 'NCERT — For NTS examination qualified students in Class 12', amount: '₹1,250/month', deadline: 'Rolling', eligible: true, color: 'rgba(0,180,216,0.10)', borderColor: 'rgba(0,180,216,0.25)' },
  { icon: '🎓', name: 'PM Scholarship Scheme', desc: 'RPMS — For children of Ex-Servicemen and Ex-Coast Guard', amount: '₹36,000/yr', deadline: 'Aug 15, 2025', eligible: false, color: 'rgba(168,85,247,0.10)', borderColor: 'rgba(168,85,247,0.25)' },
];

export const COURSES = [
  { icon: '🤖', title: 'Machine Learning A-Z', platform: 'Udemy', duration: '40 hrs', level: 'Beginner', rating: '4.8', price: '₹499', badge: 'Bestseller', badgeColor: 'badge-primary' },
  { icon: '🌐', title: 'Full Stack Web Dev Bootcamp', platform: 'Coursera', duration: '6 months', level: 'Intermediate', rating: '4.7', price: '₹1,999/mo', badge: 'Popular', badgeColor: 'badge-success' },
  { icon: '📊', title: 'Data Science with Python', platform: 'edX', duration: '3 months', level: 'Beginner', rating: '4.6', price: 'Free', badge: 'Free', badgeColor: 'badge-warn' },
  { icon: '☁️', title: 'AWS Cloud Practitioner', platform: 'AWS Training', duration: '20 hrs', level: 'Beginner', rating: '4.9', price: '₹2,999', badge: 'Certified', badgeColor: 'badge-success' },
  { icon: '🔒', title: 'Ethical Hacking Complete', platform: 'Udemy', duration: '35 hrs', level: 'Intermediate', rating: '4.5', price: '₹649', badge: 'Hot', badgeColor: 'badge-danger' },
  { icon: '📱', title: 'React Native – Build Apps', platform: 'Udemy', duration: '28 hrs', level: 'Intermediate', rating: '4.6', price: '₹499', badge: 'New', badgeColor: 'badge-primary' },
  { icon: '🧠', title: 'Deep Learning Specialization', platform: 'Coursera', duration: '4 months', level: 'Advanced', rating: '4.9', price: '₹3,500/mo', badge: 'Top Rated', badgeColor: 'badge-success' },
  { icon: '🎮', title: 'Game Dev with Unity', platform: 'Udemy', duration: '45 hrs', level: 'Beginner', rating: '4.7', price: '₹699', badge: 'Fun', badgeColor: 'badge-warn' },
  { icon: '📐', title: 'DSA Mastery for Placements', platform: 'Coding Ninjas', duration: '60 hrs', level: 'Intermediate', rating: '4.8', price: '₹4,999', badge: 'Placement', badgeColor: 'badge-primary' },
];

export const PLANNER_DAYS = [
  {
    day: 'Monday', color: '#6c63ff',
    tasks: ['Physics — Optics Chapter (2h)', 'JEE Mock Test — Paper 1 (3h)', 'Math — Integration Practice (1.5h)'],
    done: [true, false, true],
  },
  {
    day: 'Tuesday', color: '#00e5b4',
    tasks: ['Chemistry — Organic Reactions (2.5h)', 'NCERT Revision — Physics (1h)', 'Current Affairs Reading (30 min)'],
    done: [true, true, false],
  },
  {
    day: 'Wednesday', color: '#a855f7',
    tasks: ['Math — Calculus Problems (2h)', 'Physics — Thermodynamics (1.5h)', 'Coding Practice — LeetCode (1h)'],
    done: [false, false, false],
  },
  {
    day: 'Thursday', color: '#ffb830',
    tasks: ['Full Mock Test (3h)', 'Weak Area Analysis (1h)', 'Chemistry — Inorganic Revision (1.5h)'],
    done: [false, false, false],
  },
  {
    day: 'Friday', color: '#ff4d6d',
    tasks: ['Physics — Modern Physics (2h)', 'Math — Probability (1.5h)', 'Revision of Weekly Notes (1h)'],
    done: [false, false, false],
  },
];

export const ADMIN_STUDENTS = [
  { name: 'Priya Patel', email: 'priya@example.com', stream: 'Science (PCM)', cgpa: '9.1', pred: '84%', status: 'Active', joined: 'Jan 12, 2025' },
  { name: 'Rohan Gupta', email: 'rohan@example.com', stream: 'Science (PCB)', cgpa: '8.8', pred: '76%', status: 'Active', joined: 'Jan 18, 2025' },
  { name: 'Ananya Singh', email: 'ananya@example.com', stream: 'Commerce', cgpa: '9.4', pred: '91%', status: 'Inactive', joined: 'Feb 3, 2025' },
  { name: 'Karan Mehta', email: 'karan@example.com', stream: 'Science (PCM)', cgpa: '7.9', pred: '62%', status: 'Active', joined: 'Feb 9, 2025' },
  { name: 'Sneha Reddy', email: 'sneha@example.com', stream: 'Arts', cgpa: '8.5', pred: '79%', status: 'Active', joined: 'Feb 15, 2025' },
  { name: 'Dev Sharma', email: 'dev@example.com', stream: 'Science (PCM)', cgpa: '9.6', pred: '95%', status: 'Active', joined: 'Mar 2, 2025' },
];

export const DEADLINES = [
  { icon: '⚠️', name: 'JoSAA Round 1 Choice Filling', sub: 'IIT / NIT Counselling', days: 3, color: '#ff4d6d' },
  { icon: '📝', name: 'BITSAT 2025 Application', sub: 'BITS Pilani / Goa / Hyderabad', days: 8, color: '#ffb830' },
  { icon: '🏛️', name: 'VIT VITEEE Result', sub: 'VIT Vellore / Chennai / Bhopal', days: 12, color: '#00e5b4' },
  { icon: '📋', name: 'MHT-CET Merit List Round 1', sub: 'Maharashtra Engineering Colleges', days: 18, color: '#6c63ff' },
];

export const SALARY_DATA = [
  { label: 'SWE', value: 45, color: '#00e5b4' },
  { label: 'ML/AI', value: 60, color: '#6c63ff' },
  { label: 'Data Sci', value: 50, color: '#a855f7' },
  { label: 'Cyber', value: 35, color: '#ff4d6d' },
  { label: 'Cloud', value: 70, color: '#00b4d8' },
  { label: 'PM', value: 80, color: '#ffb830' },
  { label: 'Full Stack', value: 30, color: '#10b981' },
  { label: 'VLSI', value: 25, color: '#f472b6' },
];

export const SUBJECTS = [
  { name: 'Physics', score: 91, color: '#00e5b4' },
  { name: 'Mathematics', score: 62, color: '#ff4d6d', weak: true },
  { name: 'Chemistry', score: 70, color: '#ffb830', weak: true },
  { name: 'English', score: 88, color: '#6c63ff' },
  { name: 'Computer Science', score: 95, color: '#a855f7' },
];

export const MONTHLY_PROGRESS = [
  { month: 'Jan', score: 72 }, { month: 'Feb', score: 74 }, { month: 'Mar', score: 76 },
  { month: 'Apr', score: 80 }, { month: 'May', score: 85 }, { month: 'Jun', score: 88 },
];

// ─── Helper: compute prediction ──────────────────────────────
export function computePrediction({ p10, p12, cgpa, entrance, category, extra }) {
  const catBonus = { OBC: 3, SC: 8, ST: 10, EWS: 4, General: 0 }[category] || 0;
  const extraBonus = extra === 'Olympiad Winner' ? 4 : extra !== 'None' ? 2 : 0;
  const base = p10 * 0.12 + p12 * 0.28 + cgpa * 10 * 0.30 + (entrance / 300) * 100 * 0.30 + catBonus + extraBonus;
  const overall = Math.min(97, Math.max(20, Math.round(base)));
  const lr  = Math.min(97, Math.max(15, overall - 2 + Math.round(Math.random() * 4)));
  const rf  = Math.min(97, Math.max(15, overall + 1 + Math.round(Math.random() * 3)));
  const log = Math.min(97, Math.max(15, overall - 1 + Math.round(Math.random() * 2)));
  const rank = Math.round((100 - overall) * 150 + Math.random() * 500);
  return { overall, lr, rf, log, rank };
}
