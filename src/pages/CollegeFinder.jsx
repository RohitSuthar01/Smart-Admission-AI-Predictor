import { useState, useMemo } from 'react';

const ALL_COLLEGES = [
  // IITs
  { id:1,  name:'IIT Bombay',                      loc:'Mumbai, Maharashtra',        state:'Maharashtra', stream:'Engineering', rating:4.9, fees:'₹2.5L/yr', feesNum:250000, avgPkg:28, maxPkg:150, cutoff:'JEE Adv: Top 1500', cutoffPct:96, nirf:3,  placed:95, website:'iitb.ac.in',         type:'IIT' },
  { id:2,  name:'IIT Delhi',                        loc:'New Delhi, Delhi',           state:'Delhi',       stream:'Engineering', rating:4.9, fees:'₹2.4L/yr', feesNum:240000, avgPkg:30, maxPkg:200, cutoff:'JEE Adv: Top 1000', cutoffPct:96, nirf:2,  placed:96, website:'iitd.ac.in',         type:'IIT' },
  { id:3,  name:'IIT Madras',                       loc:'Chennai, Tamil Nadu',        state:'Tamil Nadu',  stream:'Engineering', rating:4.9, fees:'₹2.3L/yr', feesNum:230000, avgPkg:27, maxPkg:180, cutoff:'JEE Adv: Top 2000', cutoffPct:95, nirf:1,  placed:94, website:'iitm.ac.in',         type:'IIT' },
  { id:4,  name:'IIT Kanpur',                       loc:'Kanpur, Uttar Pradesh',      state:'Uttar Pradesh',stream:'Engineering',rating:4.8, fees:'₹2.2L/yr', feesNum:220000, avgPkg:25, maxPkg:160, cutoff:'JEE Adv: Top 2500', cutoffPct:95, nirf:4,  placed:93, website:'iitk.ac.in',         type:'IIT' },
  { id:5,  name:'IIT Kharagpur',                    loc:'Kharagpur, West Bengal',     state:'West Bengal', stream:'Engineering', rating:4.8, fees:'₹2.1L/yr', feesNum:210000, avgPkg:24, maxPkg:150, cutoff:'JEE Adv: Top 3000', cutoffPct:94, nirf:5,  placed:92, website:'iitkgp.ac.in',       type:'IIT' },
  { id:6,  name:'IIT Roorkee',                      loc:'Roorkee, Uttarakhand',       state:'Uttarakhand', stream:'Engineering', rating:4.7, fees:'₹2.2L/yr', feesNum:220000, avgPkg:22, maxPkg:140, cutoff:'JEE Adv: Top 4000', cutoffPct:93, nirf:6,  placed:91, website:'iitr.ac.in',         type:'IIT' },
  // NITs
  { id:7,  name:'NIT Trichy',                       loc:'Tiruchirappalli, Tamil Nadu', state:'Tamil Nadu', stream:'Engineering', rating:4.6, fees:'₹1.5L/yr', feesNum:150000, avgPkg:14, maxPkg:60,  cutoff:'JEE Main: 98%ile',  cutoffPct:92, nirf:9,  placed:89, website:'nitt.edu',           type:'NIT' },
  { id:8,  name:'NIT Warangal',                     loc:'Warangal, Telangana',        state:'Telangana',   stream:'Engineering', rating:4.5, fees:'₹1.4L/yr', feesNum:140000, avgPkg:13, maxPkg:55,  cutoff:'JEE Main: 97%ile',  cutoffPct:91, nirf:12, placed:88, website:'nitw.ac.in',          type:'NIT' },
  { id:9,  name:'NIT Surathkal',                    loc:'Surathkal, Karnataka',       state:'Karnataka',   stream:'Engineering', rating:4.5, fees:'₹1.5L/yr', feesNum:150000, avgPkg:12, maxPkg:50,  cutoff:'JEE Main: 96%ile',  cutoffPct:90, nirf:10, placed:87, website:'nitk.ac.in',          type:'NIT' },
  { id:10, name:'MNIT Jaipur',                      loc:'Jaipur, Rajasthan',          state:'Rajasthan',   stream:'Engineering', rating:4.3, fees:'₹1.5L/yr', feesNum:150000, avgPkg:10, maxPkg:45,  cutoff:'JEE Main: 93%ile',  cutoffPct:88, nirf:40, placed:83, website:'mnit.ac.in',          type:'NIT' },
  { id:11, name:'NIT Allahabad (MNNIT)',             loc:'Prayagraj, Uttar Pradesh',   state:'Uttar Pradesh',stream:'Engineering',rating:4.3, fees:'₹1.4L/yr', feesNum:140000, avgPkg:10, maxPkg:42,  cutoff:'JEE Main: 92%ile',  cutoffPct:87, nirf:45, placed:82, website:'mnnit.ac.in',        type:'NIT' },
  // IIITs
  { id:12, name:'IIIT Hyderabad',                   loc:'Hyderabad, Telangana',       state:'Telangana',   stream:'Engineering', rating:4.7, fees:'₹3.1L/yr', feesNum:310000, avgPkg:24, maxPkg:150, cutoff:'JEE Main: 98%ile',  cutoffPct:93, nirf:30, placed:93, website:'iiit.ac.in',          type:'IIIT' },
  { id:13, name:'IIIT Allahabad',                   loc:'Prayagraj, Uttar Pradesh',   state:'Uttar Pradesh',stream:'Engineering',rating:4.5, fees:'₹2.5L/yr', feesNum:250000, avgPkg:20, maxPkg:120, cutoff:'JEE Main: 96%ile',  cutoffPct:91, nirf:50, placed:91, website:'iiita.ac.in',        type:'IIIT' },
  // Deemed
  { id:14, name:'DTU Delhi',                        loc:'New Delhi, Delhi',           state:'Delhi',       stream:'Engineering', rating:4.5, fees:'₹1.8L/yr', feesNum:180000, avgPkg:18, maxPkg:80,  cutoff:'JEE Main: 95%ile',  cutoffPct:90, nirf:35, placed:85, website:'dtu.ac.in',           type:'State' },
  { id:15, name:'NSIT Delhi (NSUT)',                loc:'New Delhi, Delhi',           state:'Delhi',       stream:'Engineering', rating:4.4, fees:'₹1.5L/yr', feesNum:150000, avgPkg:14, maxPkg:70,  cutoff:'JEE Main: 90%ile',  cutoffPct:88, nirf:50, placed:83, website:'nsut.ac.in',          type:'State' },
  { id:16, name:'BITS Pilani',                      loc:'Pilani, Rajasthan',          state:'Rajasthan',   stream:'Engineering', rating:4.8, fees:'₹5.2L/yr', feesNum:520000, avgPkg:22, maxPkg:120, cutoff:'BITSAT: 340+',      cutoffPct:90, nirf:25, placed:90, website:'bits-pilani.ac.in',    type:'Deemed' },
  { id:17, name:'BITS Goa',                         loc:'Goa',                        state:'Goa',         stream:'Engineering', rating:4.6, fees:'₹5.0L/yr', feesNum:500000, avgPkg:18, maxPkg:100, cutoff:'BITSAT: 320+',      cutoffPct:88, nirf:28, placed:88, website:'bits-pilani.ac.in',    type:'Deemed' },
  { id:18, name:'VIT Vellore',                      loc:'Vellore, Tamil Nadu',        state:'Tamil Nadu',  stream:'Engineering', rating:4.3, fees:'₹2.2L/yr', feesNum:220000, avgPkg:7,  maxPkg:42,  cutoff:'VITEEE: Top 10k',   cutoffPct:75, nirf:11, placed:82, website:'vit.ac.in',           type:'Private' },
  { id:19, name:'VIT Chennai',                      loc:'Chennai, Tamil Nadu',        state:'Tamil Nadu',  stream:'Engineering', rating:4.2, fees:'₹2.0L/yr', feesNum:200000, avgPkg:6.5,maxPkg:38,  cutoff:'VITEEE: Top 15k',   cutoffPct:72, nirf:13, placed:80, website:'vit.ac.in',           type:'Private' },
  { id:20, name:'Manipal Institute of Technology',  loc:'Manipal, Karnataka',         state:'Karnataka',   stream:'Engineering', rating:4.2, fees:'₹3.8L/yr', feesNum:380000, avgPkg:6.5,maxPkg:35,  cutoff:'MET: Merit',        cutoffPct:70, nirf:55, placed:78, website:'manipal.edu',         type:'Private' },
  { id:21, name:'SRM Institute of Science',         loc:'Chennai, Tamil Nadu',        state:'Tamil Nadu',  stream:'Engineering', rating:4.0, fees:'₹3.0L/yr', feesNum:300000, avgPkg:5.8,maxPkg:28,  cutoff:'SRMJEEE: Merit',    cutoffPct:65, nirf:41, placed:75, website:'srmist.edu.in',       type:'Private' },
  { id:22, name:'Thapar Institute',                 loc:'Patiala, Punjab',            state:'Punjab',      stream:'Engineering', rating:4.3, fees:'₹3.2L/yr', feesNum:320000, avgPkg:10, maxPkg:45,  cutoff:'JEE Main: 85%ile',  cutoffPct:82, nirf:28, placed:86, website:'thapar.edu',          type:'Private' },
  { id:23, name:'COEP Pune',                        loc:'Pune, Maharashtra',          state:'Maharashtra', stream:'Engineering', rating:4.2, fees:'₹1.0L/yr', feesNum:100000, avgPkg:9,  maxPkg:40,  cutoff:'MHT-CET: 95%ile',   cutoffPct:85, nirf:45, placed:80, website:'coep.ac.in',          type:'State' },
  { id:24, name:'Jadavpur University',              loc:'Kolkata, West Bengal',       state:'West Bengal', stream:'Engineering', rating:4.6, fees:'₹0.3L/yr', feesNum:30000,  avgPkg:12, maxPkg:50,  cutoff:'WBJEE: Top 1000',   cutoffPct:88, nirf:17, placed:87, website:'jadavpur.edu',        type:'State' },
  { id:25, name:'PSG College of Technology',        loc:'Coimbatore, Tamil Nadu',     state:'Tamil Nadu',  stream:'Engineering', rating:4.1, fees:'₹0.8L/yr', feesNum:80000,  avgPkg:6,  maxPkg:30,  cutoff:'TNEA: Merit',       cutoffPct:78, nirf:60, placed:77, website:'psgtech.edu',         type:'Private' },
  { id:26, name:'JECRC University',                 loc:'Jaipur, Rajasthan',          state:'Rajasthan',   stream:'Engineering', rating:3.8, fees:'₹1.2L/yr', feesNum:120000, avgPkg:4,  maxPkg:18,  cutoff:'Direct Admission',  cutoffPct:50, nirf:0,  placed:65, website:'jecrc.com',           type:'Private' },
  { id:27, name:'Poornima College of Engineering',  loc:'Jaipur, Rajasthan',          state:'Rajasthan',   stream:'Engineering', rating:3.7, fees:'₹1.0L/yr', feesNum:100000, avgPkg:3.5,maxPkg:15,  cutoff:'Direct Admission',  cutoffPct:45, nirf:0,  placed:62, website:'poornima.org',        type:'Private' },
  { id:28, name:'Amity University Noida',           loc:'Noida, Uttar Pradesh',       state:'Uttar Pradesh',stream:'Engineering',rating:3.9, fees:'₹2.5L/yr', feesNum:250000, avgPkg:5,  maxPkg:25,  cutoff:'Merit Based',       cutoffPct:55, nirf:70, placed:72, website:'amity.edu',           type:'Private' },
  { id:29, name:'Chandigarh University',            loc:'Mohali, Punjab',             state:'Punjab',      stream:'Engineering', rating:4.1, fees:'₹2.0L/yr', feesNum:200000, avgPkg:6,  maxPkg:28,  cutoff:'CUCET: Merit',      cutoffPct:60, nirf:38, placed:74, website:'cuchd.in',            type:'Private' },
  { id:30, name:'Lovely Professional University',   loc:'Phagwara, Punjab',           state:'Punjab',      stream:'Engineering', rating:3.8, fees:'₹1.8L/yr', feesNum:180000, avgPkg:4.5,maxPkg:20,  cutoff:'Merit Based',       cutoffPct:50, nirf:52, placed:68, website:'lpu.in',              type:'Private' },
  { id:31, name:'Bennett University',               loc:'Greater Noida, Uttar Pradesh',state:'Uttar Pradesh',stream:'Engineering',rating:4.0,fees:'₹3.0L/yr', feesNum:300000, avgPkg:6,  maxPkg:30,  cutoff:'Bennett Entrance',  cutoffPct:60, nirf:0,  placed:70, website:'bennett.edu.in',      type:'Private' },
  { id:32, name:'Symbiosis Institute of Technology',loc:'Pune, Maharashtra',          state:'Maharashtra', stream:'Engineering', rating:4.0, fees:'₹3.5L/yr', feesNum:350000, avgPkg:6.5,maxPkg:32,  cutoff:'SET: Merit',        cutoffPct:65, nirf:0,  placed:73, website:'sitpune.edu.in',      type:'Private' },
  { id:33, name:'Arya College of Engineering',      loc:'Jaipur, Rajasthan',          state:'Rajasthan',   stream:'Engineering', rating:3.6, fees:'₹0.9L/yr', feesNum:90000,  avgPkg:3,  maxPkg:12,  cutoff:'Direct / RTU',      cutoffPct:45, nirf:0,  placed:58, website:'aryacollege.in',      type:'Private' },
  { id:34, name:'IIT BHU Varanasi',                 loc:'Varanasi, Uttar Pradesh',    state:'Uttar Pradesh',stream:'Engineering',rating:4.6, fees:'₹2.0L/yr', feesNum:200000, avgPkg:20, maxPkg:120, cutoff:'JEE Adv: Top 5000', cutoffPct:93, nirf:8,  placed:91, website:'iitbhu.ac.in',        type:'IIT' },
  { id:35, name:'NIT Calicut',                      loc:'Calicut, Kerala',            state:'Kerala',      stream:'Engineering', rating:4.5, fees:'₹1.4L/yr', feesNum:140000, avgPkg:11, maxPkg:48,  cutoff:'JEE Main: 95%ile',  cutoffPct:89, nirf:14, placed:86, website:'nitc.ac.in',          type:'NIT' },
];

const STREAMS  = ['All','Engineering','Medical','Management','Arts','Science','Commerce'];
const ALL_STATES_LIST = ['All States',...new Set(ALL_COLLEGES.map(c=>c.state))].sort();
const TYPES    = ['All Types','IIT','NIT','IIIT','State','Deemed','Private'];
const SORT_OPT = [['Best Match','match'],['Highest Rating','rating'],['Lowest Fees','fees'],['Best Package','package'],['NIRF Rank','nirf']];

export default function CollegeFinder() {
  const [search,  setSearch]  = useState('');
  const [stream,  setStream]  = useState('All');
  const [state,   setState]   = useState('All States');
  const [type,    setType]    = useState('All Types');
  const [minRating,setMinRating] = useState('');
  const [maxFees, setMaxFees] = useState('');
  const [sort,    setSort]    = useState('match');
  const [myP12,   setMyP12]   = useState('');
  const [showCount, setShowCount] = useState(12);

  const filtered = useMemo(() => {
    let list = [...ALL_COLLEGES];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.loc.toLowerCase().includes(q)  ||
        c.state.toLowerCase().includes(q)||
        c.type.toLowerCase().includes(q)
      );
    }
    if (stream && stream !== 'All')       list = list.filter(c => c.stream === stream);
    if (state  && state  !== 'All States')list = list.filter(c => c.state  === state);
    if (type   && type   !== 'All Types') list = list.filter(c => c.type   === type);
    if (minRating) list = list.filter(c => c.rating >= parseFloat(minRating));
    if (maxFees)   list = list.filter(c => c.feesNum <= parseInt(maxFees) * 100000);

    // Compute match
    list = list.map(c => {
      let match = Math.round(c.rating * 18);
      if (myP12) {
        const p12 = parseFloat(myP12);
        const gap = Math.max(0, c.cutoffPct - p12);
        match = Math.max(10, Math.min(98, Math.round(100 - gap * 2.5)));
      }
      return { ...c, match };
    });

    // Sort
    if (sort === 'match')   list.sort((a,b) => b.match   - a.match);
    if (sort === 'rating')  list.sort((a,b) => b.rating  - a.rating);
    if (sort === 'fees')    list.sort((a,b) => a.feesNum - b.feesNum);
    if (sort === 'package') list.sort((a,b) => b.avgPkg  - a.avgPkg);
    if (sort === 'nirf')    list.sort((a,b) => (a.nirf||999) - (b.nirf||999));

    return list;
  }, [search, stream, state, type, minRating, maxFees, sort, myP12]);

  const visible = filtered.slice(0, showCount);
  const reset = () => { setSearch(''); setStream('All'); setState('All States'); setType('All Types'); setMinRating(''); setMaxFees(''); setMyP12(''); setSort('match'); setShowCount(12); };

  const typeColor = { IIT:'#00e5b4', NIT:'#6c63ff', IIIT:'#a855f7', State:'#ffb830', Deemed:'#00b4d8', Private:'#ff4d6d' };

  return (
    <div className="page-wrapper animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">🏛️ College Finder</h1>
          <p className="page-subtitle">{filtered.length} colleges · {ALL_COLLEGES.length} total in database</p>
        </div>
        <span className="badge badge-success">● {filtered.length} results</span>
      </div>

      {/* Filters */}
      <div className="card mb-24">
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr', gap:10, marginBottom:12 }}>
          <div className="form-group">
            <label className="form-label">🔍 Search</label>
            <input className="form-input" placeholder="College name, city, state…" value={search} onChange={e=>{setSearch(e.target.value);setShowCount(12);}} />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={type} onChange={e=>{setType(e.target.value);setShowCount(12);}}>
              {TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">State</label>
            <select className="form-select" value={state} onChange={e=>{setState(e.target.value);setShowCount(12);}}>
              {ALL_STATES_LIST.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Min Rating</label>
            <select className="form-select" value={minRating} onChange={e=>setMinRating(e.target.value)}>
              <option value="">Any</option>
              <option value="4.5">4.5+</option>
              <option value="4.0">4.0+</option>
              <option value="3.5">3.5+</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Max Fees (L/yr)</label>
            <select className="form-select" value={maxFees} onChange={e=>setMaxFees(e.target.value)}>
              <option value="">Any</option>
              <option value="1">Under ₹1L</option>
              <option value="2">Under ₹2L</option>
              <option value="3">Under ₹3L</option>
              <option value="5">Under ₹5L</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sort By</label>
            <select className="form-select" value={sort} onChange={e=>setSort(e.target.value)}>
              {SORT_OPT.map(([l,v])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-8 items-center">
          <div className="form-group" style={{ flex:'0 0 180px' }}>
            <label className="form-label">Your 12th % (for match)</label>
            <input className="form-input" type="number" placeholder="e.g. 88" value={myP12} onChange={e=>setMyP12(e.target.value)} />
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop:20 }} onClick={reset}>Reset All</button>
          <div style={{ marginLeft:'auto', marginTop:20, display:'flex', gap:6, flexWrap:'wrap' }}>
            {Object.entries(typeColor).map(([t,c])=>(
              <span key={t} style={{ fontSize:'0.68rem', fontWeight:700, color:c, background:`${c}15`, padding:'3px 8px', borderRadius:'var(--r-full)', border:`1px solid ${c}40`, cursor:'pointer' }}
                onClick={()=>{setType(t);setShowCount(12);}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="card" style={{ textAlign:'center', padding:'40px 24px' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
          <h3 style={{ fontFamily:'var(--font-display)', marginBottom:8 }}>No colleges found</h3>
          <p className="text-muted text-sm">Try different filters or search terms</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop:16 }} onClick={reset}>Reset Filters</button>
        </div>
      )}

      {/* Grid */}
      <div className="grid-2" style={{ gap:16 }}>
        {visible.map(c => (
          <div key={c.id} className="college-card">
            <div className="college-card-header">
              <div style={{ flex:1, minWidth:0 }}>
                <div className="flex items-center gap-8 mb-4">
                  <span style={{ fontSize:'0.65rem', fontWeight:700, color: typeColor[c.type]||'#888', background:`${typeColor[c.type]||'#888'}15`, padding:'2px 8px', borderRadius:'var(--r-full)', border:`1px solid ${typeColor[c.type]||'#888'}40` }}>{c.type}</span>
                  {c.nirf > 0 && <span className="badge badge-muted" style={{ fontSize:'0.62rem' }}>NIRF #{c.nirf}</span>}
                </div>
                <div className="college-name">{c.name}</div>
                <div className="college-loc">📍 {c.loc}</div>
              </div>
              <span className={`badge ${c.match>=80?'badge-success':c.match>=65?'badge-primary':'badge-warn'}`}>{c.match}% match</span>
            </div>

            <div className="college-stats" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
              <div className="college-stat">
                <div className="college-stat-label">Rating</div>
                <div className="college-stat-value" style={{ color:'var(--accent-warn)' }}>★ {c.rating}</div>
              </div>
              <div className="college-stat">
                <div className="college-stat-label">Fees/yr</div>
                <div className="college-stat-value">{c.fees}</div>
              </div>
              <div className="college-stat">
                <div className="college-stat-label">Avg Pkg</div>
                <div className="college-stat-value" style={{ color:'var(--accent-success)' }}>₹{c.avgPkg} LPA</div>
              </div>
              <div className="college-stat">
                <div className="college-stat-label">Placed</div>
                <div className="college-stat-value">{c.placed}%</div>
              </div>
            </div>

            <div style={{ marginTop:8, padding:'6px 10px', background:'var(--bg-overlay)', borderRadius:'var(--r-sm)', fontSize:'0.72rem', color:'var(--text-muted)' }}>
              🎯 Cutoff: <strong style={{ color:'var(--text-secondary)' }}>{c.cutoff}</strong>
              &nbsp;·&nbsp;Max Pkg: <strong style={{ color:'#a855f7' }}>₹{c.maxPkg} LPA</strong>
            </div>

            <div className="flex gap-8" style={{ marginTop:10 }}>
              <button className="btn btn-ghost btn-sm" onClick={()=>window.open(`https://${c.website}`,'_blank')}>🌐 Website</button>
              <button className="btn btn-success btn-sm">+ Shortlist</button>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      {showCount < filtered.length && (
        <div style={{ textAlign:'center', marginTop:24 }}>
          <button className="btn btn-ghost" onClick={()=>setShowCount(n=>n+12)}>
            Load More ({filtered.length - showCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
