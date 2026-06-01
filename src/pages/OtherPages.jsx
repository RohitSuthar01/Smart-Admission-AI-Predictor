import { useState, useMemo } from 'react';

// ═══════════════════════════════════════════════════════
// CAREER GUIDANCE — Full detailed with tabs
// ═══════════════════════════════════════════════════════

const CAREERS_FULL = [
  {
    icon:'💻', title:'Software Engineer', category:'Tech',
    india_min:8, india_max:45, us_min:90, us_max:200,
    growth:25, demand:'Very High', demandColor:'#00e5b4',
    companies:['Google','Microsoft','Amazon','Flipkart','Swiggy','Zepto','Razorpay'],
    skills:['Data Structures & Algorithms','System Design','Python / Java / C++','SQL & Databases','Git & DevOps'],
    desc:'Build and maintain scalable software systems. Highest-hiring role in global tech. India saw 400k+ SWE hires in 2024.',
    roadmap:['Learn DSA (6 months)','Build 2-3 projects','Master one backend language','Competitive programming (LeetCode 150+)','System design basics'],
    exams:['GATE CS (for PSU)','Campus placement drives','Off-campus: LinkedIn, Naukri'],
    fresher: '₹3.5–25 LPA', senior: '₹25–80 LPA',
  },
  {
    icon:'🧠', title:'AI / ML Engineer', category:'Tech',
    india_min:12, india_max:60, us_min:120, us_max:250,
    growth:38, demand:'Very High', demandColor:'#00e5b4',
    companies:['Google DeepMind','OpenAI','Meta AI','Nvidia','Anthropic','Sarvam AI','Krutrim'],
    skills:['Python','TensorFlow / PyTorch','Mathematics (Linear Algebra, Stats)','ML Algorithms','MLOps & Cloud'],
    desc:'Design AI systems and deploy ML models at scale. Fastest growing field globally. India AI market: $8 billion by 2026.',
    roadmap:['Python + NumPy + Pandas','Scikit-learn basics','Deep Learning (fast.ai)','Kaggle competitions','Build end-to-end ML project'],
    exams:['GATE DA (Data Science)','IIT/IISc M.Tech AI','MS abroad (GRE + TOEFL)'],
    fresher: '₹8–30 LPA', senior: '₹40–1.5 Cr LPA',
  },
  {
    icon:'📊', title:'Data Scientist', category:'Tech',
    india_min:10, india_max:50, us_min:100, us_max:200,
    growth:29, demand:'High', demandColor:'#6c63ff',
    companies:['Amazon','Netflix','Zomato','CRED','Meesho','PhonePe','Walmart Labs'],
    skills:['Python & R','SQL & Spark','Statistics & Probability','Tableau / Power BI','Machine Learning'],
    desc:'Extract business insights from massive datasets. Every major company needs data scientists. 97k+ jobs posted in India 2024.',
    roadmap:['SQL mastery (2 months)','Python for Data Science','Statistics fundamentals','Tableau / visualization','End-to-end case study project'],
    exams:['IBM Data Science Cert','Google Data Analytics','AWS Data Analytics'],
    fresher: '₹6–18 LPA', senior: '₹25–70 LPA',
  },
  {
    icon:'🔒', title:'Cybersecurity Analyst', category:'Tech',
    india_min:6, india_max:35, us_min:80, us_max:160,
    growth:32, demand:'High', demandColor:'#6c63ff',
    companies:['Palo Alto Networks','CrowdStrike','IBM Security','CERT-In (Govt)','Wipro CyberSec','Quick Heal'],
    skills:['Networking (TCP/IP, OSI)','Ethical Hacking & VAPT','Linux & Python scripting','SIEM tools','CEH / CISSP certifications'],
    desc:'Protect organizations from cyber threats. Critical skill shortage: 3.4 million unfilled cybersecurity jobs globally in 2024.',
    roadmap:['CompTIA Security+','Networking basics (CCNA)','Kali Linux & ethical hacking','Bug bounty practice','CEH certification'],
    exams:['CEH (Certified Ethical Hacker)','CISSP','CompTIA Security+','OSCP'],
    fresher: '₹4–12 LPA', senior: '₹20–55 LPA',
  },
  {
    icon:'☁️', title:'Cloud Architect', category:'Tech',
    india_min:15, india_max:70, us_min:130, us_max:280,
    growth:27, demand:'Very High', demandColor:'#00e5b4',
    companies:['AWS','Google Cloud','Microsoft Azure','Accenture','TCS Cloud','Infosys Cloud'],
    skills:['AWS / GCP / Azure','Kubernetes & Docker','Terraform (IaC)','DevOps & CI/CD','Microservices Architecture'],
    desc:'Design enterprise cloud infrastructure. Cloud market in India: $17 billion by 2027. Premium salaries for certified architects.',
    roadmap:['AWS Cloud Practitioner (free)','AWS Solutions Architect Associate','Terraform basics','Build multi-tier cloud project','Professional certification'],
    exams:['AWS SAA-C03','Google Cloud Professional','Azure Solutions Architect','DevOps certifications'],
    fresher: '₹8–20 LPA', senior: '₹35–1 Cr LPA',
  },
  {
    icon:'📱', title:'Product Manager', category:'Management',
    india_min:18, india_max:80, us_min:140, us_max:300,
    growth:22, demand:'High', demandColor:'#6c63ff',
    companies:['Google','Amazon','Swiggy','PhonePe','Paytm','Nykaa','Dream11'],
    skills:['Product Strategy & Roadmapping','Data Analysis & SQL','User Research & UX','Agile / Scrum','Communication & Leadership'],
    desc:'Lead product vision from ideation to launch. Highest-paid non-technical role in tech. Usually requires 2-3 years experience first.',
    roadmap:['Work as SWE / Analyst (2-3 yrs)','Product case studies','MBA or APM programs','Build personal projects','Product management certifications'],
    exams:['IIM MBA (CAT)','ISB PGP','APM programs (Google, Microsoft)'],
    fresher: '₹12–25 LPA', senior: '₹40–1.5 Cr LPA',
  },
  {
    icon:'📈', title:'Quantitative Analyst', category:'Finance',
    india_min:15, india_max:80, us_min:120, us_max:300,
    growth:20, demand:'Medium', demandColor:'#ffb830',
    companies:['Goldman Sachs','JP Morgan','Jane Street','Citadel','D.E. Shaw','WorldQuant','Optiver'],
    skills:['Advanced Mathematics','Statistics & Probability','Python & C++','Financial Modeling','Stochastic Calculus'],
    desc:'Apply math and CS to financial markets. Among the highest-paid roles globally. Jane Street freshers earn $200k+ in USA.',
    roadmap:['Strong math foundation (probability, stats)','Python for finance','Competitive programming','Internship at finance firm','Quantitative research projects'],
    exams:['CFA (Chartered Financial Analyst)','FRM','IIT/IISc M.Tech (for quant prep)'],
    fresher: '₹12–35 LPA', senior: '₹50–5 Cr LPA',
  },
  {
    icon:'⚡', title:'VLSI / Embedded Engineer', category:'Core Engg',
    india_min:5, india_max:25, us_min:70, us_max:150,
    growth:24, demand:'High', demandColor:'#6c63ff',
    companies:['Qualcomm','Intel','Samsung','MediaTek','Texas Instruments','ISRO','STMicroelectronics'],
    skills:['Verilog & VHDL','C / Embedded C','ARM Microcontrollers','PCB Design','FPGA Programming'],
    desc:'Design chips and embedded systems. India semiconductor mission: ₹76,000 Cr investment. Massive demand surge from 2025.',
    roadmap:['C programming mastery','Microcontroller projects (Arduino/STM32)','Verilog / VHDL basics','FPGA projects','Industry internship'],
    exams:['GATE ECE (for PSU/M.Tech)','ISRO recruitment exam','DRDO CEPTAM'],
    fresher: '₹4–10 LPA', senior: '₹18–40 LPA',
  },
  {
    icon:'🤖', title:'Robotics / Automation Engineer', category:'Core Engg',
    india_min:6, india_max:30, us_min:90, us_max:180,
    growth:24, demand:'High', demandColor:'#6c63ff',
    companies:['Boston Dynamics','Tesla','ISRO','Ola Electric','ABB Robotics','Bosch','Tata Motors'],
    skills:['ROS (Robot Operating System)','Python & C++','Computer Vision & OpenCV','Control Systems','Mechanical Design (SolidWorks)'],
    desc:'Build autonomous robots and automation systems. Booming with EV revolution and Industry 4.0. ISRO and defence sector hiring heavily.',
    roadmap:['ROS fundamentals','Computer vision with OpenCV','Control theory basics','Build a robotics project','Participate in competitions (Robocon)'],
    exams:['GATE ME/EE/ECE','ISRO Scientist exam','Defence R&D recruitment'],
    fresher: '₹5–12 LPA', senior: '₹20–45 LPA',
  },
  {
    icon:'🏥', title:'Biomedical Engineer', category:'Healthcare',
    india_min:4, india_max:20, us_min:60, us_max:130,
    growth:18, demand:'Medium', demandColor:'#ffb830',
    companies:['GE Healthcare','Siemens Healthineers','Philips','AIIMS R&D','Tata Medical','Narayana Health'],
    skills:['Medical Device Design','Signal Processing','MATLAB & Python','Anatomy & Physiology','FDA Regulations'],
    desc:'Design medical devices and healthcare technology. Growing field with India\'s expanding healthcare sector. Good for PCB + engineering combo.',
    roadmap:['Biology + engineering fundamentals','Medical device regulations','Signal processing projects','Research publications','MS/M.Tech for senior roles'],
    exams:['GATE BM','GATE EC / ME','GRE for abroad MS'],
    fresher: '₹3.5–8 LPA', senior: '₹15–35 LPA',
  },
];

const CATEGORIES = ['All','Tech','Finance','Management','Core Engg','Healthcare'];

export function CareerGuidance({ onNavigate }) {
  const [activeCat,   setActiveCat]   = useState('All');
  const [activeCard,  setActiveCard]  = useState(null);
  const [sortBy,      setSortBy]      = useState('growth');
  const [showIndia,   setShowIndia]   = useState(true); // India vs Global salary toggle

  const filtered = useMemo(() => {
    let list = activeCat === 'All' ? CAREERS_FULL : CAREERS_FULL.filter(c => c.category === activeCat);
    if (sortBy === 'growth')       list = [...list].sort((a,b) => b.growth - a.growth);
    if (sortBy === 'salary_india') list = [...list].sort((a,b) => b.india_max - a.india_max);
    if (sortBy === 'salary_us')    list = [...list].sort((a,b) => b.us_max - a.us_max);
    return list;
  }, [activeCat, sortBy]);

  const maxSal = showIndia
    ? Math.max(...CAREERS_FULL.map(c => c.india_max))
    : Math.max(...CAREERS_FULL.map(c => c.us_max));

  return (
    <div className="page-wrapper animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">🚀 Career Guidance</h1>
          <p className="page-subtitle">10 career paths · Real 2025 salary data · India + Global</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => onNavigate('chatbot')}>Ask AI Counselor ↗</button>
      </div>

      {/* Controls */}
      <div className="flex gap-8 mb-16" style={{ flexWrap:'wrap', alignItems:'center' }}>
        {CATEGORIES.map(c => (
          <button key={c} className={`btn btn-sm ${activeCat===c?'btn-primary':'btn-ghost'}`} onClick={()=>setActiveCat(c)}>{c}</button>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          <select className="form-select" style={{ width:160, padding:'6px 12px', fontSize:'0.78rem' }} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="growth">Sort: Growth %</option>
            <option value="salary_india">Sort: India Salary</option>
            <option value="salary_us">Sort: Global Salary</option>
          </select>
        </div>
      </div>

      {/* Career Cards Grid */}
      <div className="grid-3 mb-24">
        {filtered.map((c, i) => (
          <div key={i} className="career-card animate-in" style={{ cursor:'pointer', border: activeCard?.title===c.title ? '1px solid var(--accent-primary)' : undefined }}
            onClick={() => setActiveCard(activeCard?.title===c.title ? null : c)}>
            <div className="flex justify-between items-start mb-8">
              <div className="career-card-icon" style={{ marginBottom:0 }}>{c.icon}</div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                <span style={{ fontSize:'0.68rem', fontWeight:700, color:c.demandColor, background:`${c.demandColor}15`, padding:'2px 8px', borderRadius:'var(--r-full)', border:`1px solid ${c.demandColor}40` }}>{c.demand}</span>
                <span style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>↑{c.growth}%/yr</span>
              </div>
            </div>

            <div className="career-card-title">{c.title}</div>
            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:6 }}>{c.category}</div>

            {/* Salary row — India + Global */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10, padding:'8px', background:'var(--bg-overlay)', borderRadius:'var(--r-sm)' }}>
              <div>
                <div style={{ fontSize:'0.6rem', color:'var(--text-muted)', marginBottom:2 }}>🇮🇳 India</div>
                <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--accent-success)' }}>₹{c.india_min}–{c.india_max} LPA</div>
              </div>
              <div>
                <div style={{ fontSize:'0.6rem', color:'var(--text-muted)', marginBottom:2 }}>🌍 Global</div>
                <div style={{ fontSize:'0.8rem', fontWeight:700, color:'#00b4d8' }}>${c.us_min}k–{c.us_max}k</div>
              </div>
            </div>

            <div className="career-card-desc" style={{ marginBottom:10 }}>{c.desc}</div>

            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', borderTop:'1px solid var(--border-subtle)', paddingTop:8 }}>
              <strong style={{ color:'var(--text-secondary)' }}>Top Companies: </strong>
              {c.companies.slice(0,4).join(' · ')}
            </div>

            {activeCard?.title === c.title && (
              <div style={{ marginTop:12, padding:12, background:'var(--bg-overlay)', borderRadius:'var(--r-md)', border:'1px solid var(--border-subtle)' }}>
                <div style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-accent)', marginBottom:8 }}>📋 How to Get There</div>
                {c.roadmap.map((step,j) => (
                  <div key={j} style={{ display:'flex', gap:8, padding:'4px 0', fontSize:'0.75rem', color:'var(--text-secondary)', borderBottom: j<c.roadmap.length-1?'1px solid var(--border-subtle)':'' }}>
                    <span style={{ color:'var(--accent-primary)', fontWeight:700, flexShrink:0 }}>{j+1}.</span>
                    {step}
                  </div>
                ))}
                <div style={{ marginTop:10 }}>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:6 }}>💰 Salary Stages:</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                    <div style={{ padding:'6px 10px', background:'var(--bg-elevated)', borderRadius:'var(--r-sm)' }}>
                      <div style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>Fresher (0-2 yrs)</div>
                      <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--accent-success)' }}>{c.fresher}</div>
                    </div>
                    <div style={{ padding:'6px 10px', background:'var(--bg-elevated)', borderRadius:'var(--r-sm)' }}>
                      <div style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>Senior (5+ yrs)</div>
                      <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--accent-warn)' }}>{c.senior}</div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop:8, fontSize:'0.7rem', color:'var(--text-muted)' }}>
                  <strong style={{ color:'var(--text-secondary)' }}>Key Skills: </strong>
                  {c.skills.join(', ')}
                </div>
              </div>
            )}

            <div style={{ marginTop:8, fontSize:'0.68rem', color:'var(--accent-primary)', textAlign:'center' }}>
              {activeCard?.title===c.title ? '▲ Click to collapse' : '▼ Click for full roadmap'}
            </div>
          </div>
        ))}
      </div>

      {/* Salary Comparison Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">💰 Salary Comparison 2025 — Max Package</div>
          <div style={{ display:'flex', gap:6 }}>
            <button className={`btn btn-sm ${showIndia?'btn-primary':'btn-ghost'}`} onClick={()=>setShowIndia(true)}>🇮🇳 India (LPA)</button>
            <button className={`btn btn-sm ${!showIndia?'btn-primary':'btn-ghost'}`} onClick={()=>setShowIndia(false)}>🌍 Global (USD k)</button>
          </div>
        </div>
        <div className="bar-chart-wrap" style={{ height:180, marginTop:8 }}>
          {CAREERS_FULL.map(c => {
            const val = showIndia ? c.india_max : c.us_max;
            return (
              <div key={c.title} className="bar-col" title={c.title}>
                <div className="bar-val" style={{ fontSize:'0.6rem' }}>{showIndia ? `₹${val}L` : `$${val}k`}</div>
                <div className="bar-rect" style={{ height:`${(val/maxSal)*155}px`, background:`linear-gradient(to top, var(--accent-primary), ${c.demandColor})` }} />
                <div className="bar-label" style={{ fontSize:'0.6rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:52 }}>{c.icon}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display:'flex', justifyContent:'space-around', marginTop:4 }}>
          {CAREERS_FULL.map(c => (
            <div key={c.title} style={{ fontSize:'0.58rem', color:'var(--text-muted)', textAlign:'center', flex:1 }}>{c.title.split('/')[0].split(' ').slice(0,2).join(' ')}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COURSE RECOMMENDER — Working filters + Enroll link
// ═══════════════════════════════════════════════════════

const ALL_COURSES = [
  { icon:'🤖', title:'Machine Learning A-Z', platform:'Udemy', duration:'40 hrs', level:'Beginner', rating:4.8, priceNum:499, topic:'AI/ML', badge:'Bestseller', badgeColor:'badge-primary', url:'https://www.udemy.com/course/machinelearning/', desc:'Hands-on ML with Python, Scikit-learn, TensorFlow. #1 rated ML course.' },
  { icon:'🌐', title:'Full Stack Web Dev Bootcamp', platform:'Coursera', duration:'6 months', level:'Intermediate', rating:4.7, priceNum:1999, topic:'Web Dev', badge:'Popular', badgeColor:'badge-success', url:'https://www.coursera.org/professional-certificates/meta-full-stack-developer', desc:'React, Node.js, MongoDB, Express. Meta certificate included.' },
  { icon:'📊', title:'Data Science with Python', platform:'edX', duration:'3 months', level:'Beginner', rating:4.6, priceNum:0, topic:'Data Science', badge:'Free', badgeColor:'badge-warn', url:'https://www.edx.org/learn/python/harvard-university-using-python-for-research', desc:'Harvard course. Pandas, NumPy, Matplotlib, intro ML. Completely free.' },
  { icon:'☁️', title:'AWS Cloud Practitioner', platform:'AWS Training', duration:'20 hrs', level:'Beginner', rating:4.9, priceNum:0, topic:'Cloud', badge:'Free', badgeColor:'badge-warn', url:'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', desc:'Official AWS course. Foundation for all AWS certifications. Free on AWS Skill Builder.' },
  { icon:'🔒', title:'Ethical Hacking Complete', platform:'Udemy', duration:'35 hrs', level:'Intermediate', rating:4.5, priceNum:649, topic:'Cybersecurity', badge:'Hot', badgeColor:'badge-danger', url:'https://www.udemy.com/course/learn-ethical-hacking-from-scratch/', desc:'Kali Linux, network hacking, web app attacks, WiFi hacking. Very practical.' },
  { icon:'📱', title:'React Native — Build Apps', platform:'Udemy', duration:'28 hrs', level:'Intermediate', rating:4.6, priceNum:499, topic:'Mobile Dev', badge:'New', badgeColor:'badge-primary', url:'https://www.udemy.com/course/the-complete-react-native-and-redux-course/', desc:'Build iOS & Android apps with React Native. Redux, Hooks, Navigation.' },
  { icon:'🧠', title:'Deep Learning Specialization', platform:'Coursera', duration:'4 months', level:'Advanced', rating:4.9, priceNum:3500, topic:'AI/ML', badge:'Top Rated', badgeColor:'badge-success', url:'https://www.coursera.org/specializations/deep-learning', desc:'Andrew Ng\'s legendary course. Neural networks, CNNs, RNNs, Transformers.' },
  { icon:'📐', title:'DSA for Placements', platform:'Coding Ninjas', duration:'60 hrs', level:'Intermediate', rating:4.8, priceNum:4999, topic:'CS Fundamentals', badge:'Placement', badgeColor:'badge-primary', url:'https://www.naukri.com/code360/courses/dsa-in-python', desc:'Arrays, Linked Lists, Trees, Graphs, DP. Placement-focused with 200+ problems.' },
  { icon:'🎨', title:'Google UX Design', platform:'Coursera', duration:'6 months', level:'Beginner', rating:4.7, priceNum:1999, topic:'Design', badge:'Google Cert', badgeColor:'badge-success', url:'https://www.coursera.org/professional-certificates/google-ux-design', desc:'User research, wireframing, Figma prototyping. Google certificate for resume.' },
  { icon:'⛓️', title:'Blockchain & Web3 Dev', platform:'Udemy', duration:'22 hrs', level:'Intermediate', rating:4.4, priceNum:799, topic:'Blockchain', badge:'Trending', badgeColor:'badge-warn', url:'https://www.udemy.com/course/blockchain-developer/', desc:'Solidity, Ethereum, Smart Contracts, DApps. Emerging high-demand skill.' },
  { icon:'🎯', title:'GATE CS Preparation', platform:'NPTEL', duration:'6 months', level:'Advanced', rating:4.6, priceNum:0, topic:'GATE', badge:'Free', badgeColor:'badge-warn', url:'https://nptel.ac.in/', desc:'IIT professors teach Data Structures, OS, DBMS, Computer Networks. Completely free.' },
  { icon:'📣', title:'Digital Marketing Complete', platform:'Google', duration:'40 hrs', level:'Beginner', rating:4.5, priceNum:0, topic:'Marketing', badge:'Free', badgeColor:'badge-warn', url:'https://skillshop.google.com/', desc:'SEO, SEM, Social Media, Analytics. Google certificate. 100% free on Google Skillshop.' },
  { icon:'🐍', title:'Python Bootcamp 2025', platform:'Udemy', duration:'22 hrs', level:'Beginner', rating:4.7, priceNum:499, topic:'CS Fundamentals', badge:'Bestseller', badgeColor:'badge-primary', url:'https://www.udemy.com/course/complete-python-bootcamp/', desc:'Start from scratch. 100+ exercises, OOP, Files, APIs. Best Python starter.' },
  { icon:'📉', title:'Statistics for Data Science', platform:'Coursera', duration:'3 months', level:'Beginner', rating:4.6, priceNum:1999, topic:'Data Science', badge:'Essential', badgeColor:'badge-success', url:'https://www.coursera.org/learn/statistics-for-data-science-python', desc:'Probability, hypothesis testing, regression. Foundation for ML and data analysis.' },
  { icon:'🎮', title:'Game Dev with Unity', platform:'Udemy', duration:'45 hrs', level:'Beginner', rating:4.7, priceNum:699, topic:'Game Dev', badge:'Fun', badgeColor:'badge-warn', url:'https://www.udemy.com/course/unitycourse/', desc:'Build 2D & 3D games with Unity and C#. Portfolio-ready game projects.' },
  { icon:'🔧', title:'DevOps & CI/CD Complete', platform:'Udemy', duration:'30 hrs', level:'Intermediate', rating:4.5, priceNum:849, topic:'Cloud', badge:'In Demand', badgeColor:'badge-primary', url:'https://www.udemy.com/course/learn-devops-ci-cd-with-jenkins-using-pipelines-and-docker/', desc:'Jenkins, Docker, Kubernetes, GitHub Actions. DevOps engineer role readiness.' },
];

const TOPICS    = ['All Topics','AI/ML','Web Dev','Data Science','Cybersecurity','Cloud','Mobile Dev','CS Fundamentals','Design','Blockchain','GATE','Marketing','Game Dev'];
const PLATFORMS = ['All Platforms','Udemy','Coursera','edX','AWS Training','NPTEL','Google','Coding Ninjas'];
const LEVELS    = ['All Levels','Beginner','Intermediate','Advanced'];

export function CourseRecommender() {
  const [topic,    setTopic]    = useState('All Topics');
  const [platform, setPlatform] = useState('All Platforms');
  const [level,    setLevel]    = useState('All Levels');
  const [price,    setPrice]    = useState('Any');
  const [search,   setSearch]   = useState('');
  const [sort,     setSort]     = useState('rating');

  const filtered = useMemo(() => {
    let list = [...ALL_COURSES];
    if (topic    !== 'All Topics')    list = list.filter(c => c.topic === topic);
    if (platform !== 'All Platforms') list = list.filter(c => c.platform === platform);
    if (level    !== 'All Levels')    list = list.filter(c => c.level === level);
    if (price === 'Free')             list = list.filter(c => c.priceNum === 0);
    if (price === 'Paid')             list = list.filter(c => c.priceNum > 0);
    if (price === 'Under ₹500')       list = list.filter(c => c.priceNum > 0 && c.priceNum < 500);
    if (price === '₹500–₹2000')       list = list.filter(c => c.priceNum >= 500 && c.priceNum <= 2000);
    if (price === '₹2000+')           list = list.filter(c => c.priceNum > 2000);
    if (search.trim())                list = list.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.topic.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'rating')            list = [...list].sort((a,b) => b.rating - a.rating);
    if (sort === 'price_low')         list = [...list].sort((a,b) => a.priceNum - b.priceNum);
    if (sort === 'price_high')        list = [...list].sort((a,b) => b.priceNum - a.priceNum);
    return list;
  }, [topic, platform, level, price, search, sort]);

  const reset = () => { setTopic('All Topics'); setPlatform('All Platforms'); setLevel('All Levels'); setPrice('Any'); setSearch(''); setSort('rating'); };

  const freeCount = ALL_COURSES.filter(c => c.priceNum === 0).length;

  return (
    <div className="page-wrapper animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">📚 Course Recommender</h1>
          <p className="page-subtitle">{filtered.length} courses · {freeCount} free · Click Enroll to open course</p>
        </div>
        <span className="badge badge-success">{filtered.length} found</span>
      </div>

      {/* Filters */}
      <div className="card mb-24">
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr', gap:10, marginBottom:12 }}>
          <div className="form-group">
            <label className="form-label">🔍 Search</label>
            <input className="form-input" placeholder="Course name or topic…" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Topic</label>
            <select className="form-select" value={topic} onChange={e=>setTopic(e.target.value)}>
              {TOPICS.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Platform</label>
            <select className="form-select" value={platform} onChange={e=>setPlatform(e.target.value)}>
              {PLATFORMS.map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Level</label>
            <select className="form-select" value={level} onChange={e=>setLevel(e.target.value)}>
              {LEVELS.map(l=><option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Price</label>
            <select className="form-select" value={price} onChange={e=>setPrice(e.target.value)}>
              {['Any','Free','Paid','Under ₹500','₹500–₹2000','₹2000+'].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sort By</label>
            <select className="form-select" value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>
        <div className="flex gap-8">
          <button className="btn btn-ghost btn-sm" onClick={reset}>Reset All</button>
          {/* Quick topic pills */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {['AI/ML','Web Dev','Free','Beginner'].map(q => (
              <button key={q} className="btn btn-ghost btn-sm" style={{ fontSize:'0.7rem', padding:'4px 10px' }}
                onClick={() => { if(q==='Free') setPrice('Free'); else if(q==='Beginner') setLevel('Beginner'); else setTopic(q); }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="card" style={{ textAlign:'center', padding:'40px' }}>
          <div style={{ fontSize:36, marginBottom:12 }}>📭</div>
          <h3 style={{ fontFamily:'var(--font-display)', marginBottom:8 }}>No courses match</h3>
          <button className="btn btn-primary btn-sm" onClick={reset}>Reset Filters</button>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid-3">
        {filtered.map((c, i) => (
          <div key={i} className="course-card">
            <div className="course-icon">{c.icon}</div>
            <div style={{ marginBottom:6 }}><span className={`badge ${c.badgeColor}`}>{c.badge}</span></div>
            <div className="course-title">{c.title}</div>
            <div className="course-meta">{c.platform} · {c.duration} · {c.level}</div>
            <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', margin:'6px 0 10px', lineHeight:1.5 }}>{c.desc}</div>
            <div className="course-footer">
              <span className="course-rating">⭐ {c.rating}</span>
              <span className="course-price" style={{ color: c.priceNum===0 ? 'var(--accent-success)' : 'var(--text-primary)', fontWeight:700 }}>
                {c.priceNum===0 ? 'FREE' : `₹${c.priceNum.toLocaleString()}`}
              </span>
            </div>
            <button
              className="btn btn-success btn-sm btn-full"
              style={{ marginTop:12 }}
              onClick={() => window.open(c.url, '_blank')}
            >
              Enroll Now →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PERFORMANCE ANALYTICS
// ═══════════════════════════════════════════════════════
import { SUBJECTS, MONTHLY_PROGRESS } from '../data';

export function PerformanceAnalytics() {
  const maxMonth = Math.max(...MONTHLY_PROGRESS.map(m => m.score));

  return (
    <div className="page-wrapper animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">📈 Performance Analytics</h1>
          <p className="page-subtitle">Track progress, identify weak areas, optimize study plan</p>
        </div>
        <span className="badge badge-success">● Updated Today</span>
      </div>

      <div className="grid-4 mb-24">
        {[
          { label:'Overall Score', value:'88%', sub:'Strong performer', icon:'🏆', color:'#00e5b4', accent:'#00e5b4' },
          { label:'Weak Subjects', value:'2',   sub:'Math, Chemistry',  icon:'⚠️', color:'#ffb830', accent:'#ffb830' },
          { label:'Mock Tests',    value:'18',  sub:'This month',       icon:'📝', color:'#6c63ff', accent:'#6c63ff' },
          { label:'Study Hours',   value:'142h',sub:'This month',       icon:'⏱️', color:'#a855f7', accent:'#a855f7' },
        ].map((s,i) => (
          <div key={i} className={`stat-card animate-in delay-${i+1}`} style={{ '--card-accent':s.accent, '--card-color':s.color }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-24">
        <div className="card">
          <div className="card-header"><div className="card-title">📊 Subject Performance</div></div>
          {SUBJECTS.map(s => (
            <div key={s.name} style={{ marginBottom:14 }}>
              <div className="flex justify-between" style={{ marginBottom:5 }}>
                <span style={{ fontSize:'0.85rem', display:'flex', alignItems:'center', gap:8 }}>
                  {s.name}
                  {s.weak && <span className="badge badge-danger" style={{ fontSize:'0.6rem' }}>Weak</span>}
                </span>
                <span style={{ fontSize:'0.85rem', fontWeight:700, color:s.color }}>{s.score}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width:`${s.score}%`, background:s.color }}/>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">📅 Monthly Progress</div></div>
          <div className="bar-chart-wrap" style={{ height:150 }}>
            {MONTHLY_PROGRESS.map((m,i) => (
              <div key={m.month} className="bar-col">
                <div className="bar-val">{m.score}%</div>
                <div className="bar-rect" style={{ height:`${(m.score/maxMonth)*120}px`, background:i>=4?'#00e5b4':'#6c63ff' }}/>
                <div className="bar-label">{m.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">⚠️ Weak Area Analysis</div>
          <span className="badge badge-warn">Action Required</span>
        </div>
        <div className="grid-3">
          {SUBJECTS.filter(s=>s.weak).map(s => (
            <div key={s.name} style={{ padding:16, background:`${s.color}08`, borderRadius:'var(--r-md)', borderLeft:`3px solid ${s.color}` }}>
              <div style={{ fontSize:'0.9rem', fontWeight:700, marginBottom:6 }}>{s.name}</div>
              <div className="text-xs text-muted" style={{ marginBottom:10 }}>
                {s.name==='Mathematics'?'Integral Calculus, Differential Equations':'Organic Reactions, Electrochemistry'}
              </div>
              <div className="progress-track" style={{ marginBottom:8 }}>
                <div className="progress-fill" style={{ width:`${s.score}%`, background:s.color }}/>
              </div>
              <div className="text-xs text-muted">Score: {s.score}% · Target: {s.name==='Mathematics'?80:85}%+</div>
              <div style={{ marginTop:10, padding:'8px 12px', background:'var(--bg-overlay)', borderRadius:'var(--r-sm)', fontSize:'0.76rem', color:'var(--text-secondary)' }}>
                💡 {s.name==='Mathematics'?'Practice 5 integration problems daily. Revise D/I method.':'Focus on named organic reactions. Make a reactions flowchart.'}
              </div>
            </div>
          ))}
          <div style={{ padding:16, background:'rgba(0,229,180,0.06)', borderRadius:'var(--r-md)', borderLeft:'3px solid #00e5b4' }}>
            <div style={{ fontSize:'0.9rem', fontWeight:700, marginBottom:6 }}>Physics ⭐</div>
            <div className="text-xs text-muted" style={{ marginBottom:10 }}>Strong performer — Keep the momentum!</div>
            <div className="progress-track" style={{ marginBottom:8 }}>
              <div className="progress-fill" style={{ width:'91%', background:'#00e5b4' }}/>
            </div>
            <div className="text-xs text-muted">Score: 91% · Excellent</div>
            <div style={{ marginTop:10, padding:'8px 12px', background:'var(--bg-overlay)', borderRadius:'var(--r-sm)', fontSize:'0.76rem', color:'var(--text-secondary)' }}>
              🚀 Attempt JEE Advanced level problems to push beyond 95%.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
