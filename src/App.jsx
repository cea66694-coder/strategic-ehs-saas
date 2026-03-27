
import React, { useMemo, useState } from 'react';
import { hasEnv } from './supabase.js';

const demoUsers = [
  { email:'admin@strategicehs.com', password:'admin123', role:'strategic_admin', companyId:null, name:'Strategic Admin' },
  { email:'client@demo.com', password:'client123', role:'client_admin', companyId:'angio', name:'Client Demo' }
];

const seed = [
  {
    id:'angio', name:'AngioDynamics',
    incidents:[
      {date:'2026-03-03',type:'Near Miss',status:'Open',summary:'Pallet jack struck rack upright.'},
      {date:'2026-02-18',type:'First Aid',status:'Closed',summary:'Laceration on hand from box cutter.'},
      {date:'2026-02-05',type:'Property Damage',status:'Closed',summary:'Forklift clipped warehouse door frame.'},
      {date:'2026-01-22',type:'Near Miss',status:'Open',summary:'Chemical spill near mixing station — contained.'},
    ],
    training:[
      {employee:'Jamie Carter',course:'HazCom',status:'Current'},
      {employee:'Marcus Reed',course:'Forklift Certification',status:'Current'},
      {employee:'Priya Singh',course:'Fire Safety',status:'Overdue'},
      {employee:'Tom Wells',course:'First Aid/CPR',status:'Due Soon'},
      {employee:'Lisa Nguyen',course:'Machine Guarding',status:'Current'},
    ],
    actions:[
      {title:'Install eyewash tags',owner:'Maintenance',status:'Open'},
      {title:'Update HazCom binder',owner:'EHS Manager',status:'Closed'},
      {title:'Repair dock leveler',owner:'Facilities',status:'Open'},
      {title:'Conduct Q1 fire drill',owner:'Safety Officer',status:'Open'},
    ],
    inspections:[
      {date:'2026-03-05',area:'Production',status:'Open'},
      {date:'2026-02-20',area:'Warehouse',status:'Closed'},
      {date:'2026-02-10',area:'Loading Dock',status:'Closed'},
      {date:'2026-01-15',area:'Chemical Storage',status:'Closed'},
    ],
    documents:[
      {name:'OSHA 300 Log 2026',status:'Current'},
      {name:'Emergency Action Plan',status:'Current'},
      {name:'Chemical Inventory',status:'Needs Review'},
      {name:'Forklift SOP',status:'Current'},
      {name:'Contractor Safety Requirements',status:'Current'},
    ],
    reports:[
      {name:'Monthly EHS Summary — March 2026',status:'Generated'},
      {name:'Incident Trend Report Q1 2026',status:'Generated'},
      {name:'Training Compliance Report',status:'Generated'},
    ]
  },
  {
    id:'north', name:'North River Plant',
    incidents:[
      {date:'2026-03-01',type:'Property Damage',status:'Open',summary:'Guard panel removed and not reinstalled.'},
      {date:'2026-02-25',type:'Near Miss',status:'Closed',summary:'Worker slipped on wet floor near press.'},
      {date:'2026-02-10',type:'First Aid',status:'Closed',summary:'Strain from improper lifting — heat applied.'},
      {date:'2026-01-30',type:'Near Miss',status:'Open',summary:'Overhead crane swung unexpectedly during load.'},
    ],
    training:[
      {employee:'Tara Green',course:'Machine Guarding',status:'Overdue'},
      {employee:'Derek Hall',course:'Confined Space Entry',status:'Current'},
      {employee:'Ann Morris',course:'HazCom',status:'Current'},
      {employee:'Carlos Diaz',course:'Overhead Crane',status:'Due Soon'},
      {employee:'Fiona Walsh',course:'First Aid/CPR',status:'Current'},
    ],
    actions:[
      {title:'Replace missing guards on press #3',owner:'Engineering',status:'Open'},
      {title:'Install wet-floor signage',owner:'Facilities',status:'Closed'},
      {title:'Update confined space permit procedure',owner:'EHS Manager',status:'Open'},
      {title:'Crane operator re-qualification',owner:'HR',status:'Open'},
    ],
    inspections:[
      {date:'2026-03-02',area:'Fabrication',status:'Open'},
      {date:'2026-02-15',area:'Paint Line',status:'Closed'},
      {date:'2026-01-28',area:'Maintenance Shop',status:'Closed'},
      {date:'2026-01-10',area:'Crane Bay',status:'Closed'},
    ],
    documents:[
      {name:'LOTO Program',status:'Current'},
      {name:'Confined Space Entry Permit',status:'Needs Review'},
      {name:'Crane Inspection Records',status:'Current'},
      {name:'OSHA 300 Log 2026',status:'Current'},
      {name:'Spill Response Plan',status:'Current'},
    ],
    reports:[
      {name:'Incident Trend Report Q1 2026',status:'Generated'},
      {name:'Open Actions Report',status:'Generated'},
      {name:'Monthly EHS Summary — March 2026',status:'Generated'},
    ]
  }
];

const tabs = ['overview','incidents','training','actions','inspections','documents','reports','backend'];

function Metric({label,value}) {
  return <div className="card metric"><div className="small">{label}</div><div className="value">{value}</div></div>;
}
function Table({cols,rows}) {
  return <div className="tablewrap"><table><thead><tr>{cols.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{rows}</tbody></table></div>;
}

export default function App(){
  const [user,setUser] = useState(null);
  const [email,setEmail] = useState('admin@strategicehs.com');
  const [password,setPassword] = useState('admin123');
  const [error,setError] = useState('');
  const [tab,setTab] = useState('overview');
  const [companies] = useState(seed);
  const [companyId,setCompanyId] = useState('angio');

  const visibleCompanies = useMemo(()=>{
    if(!user) return [];
    return user.role === 'strategic_admin' ? companies : companies.filter(c=>c.id===user.companyId);
  },[user,companies]);

  const company = useMemo(()=>visibleCompanies.find(c=>c.id===companyId) || visibleCompanies[0], [visibleCompanies, companyId]);

  if(!user){
    const signIn = (u) => { setUser(u); setCompanyId(u.companyId || 'angio'); setError(''); };
    return (
      <div className="login">
        <div className="loginbox card">
          <div className="brand">Strategic <span>EHS</span></div>
          <div className="small" style={{margin:'8px 0 4px'}}>Full SaaS starter package</div>
          <div className="demo-banner">🎯 Demo mode — sample data, no backend required</div>
          <div className="demo-btns">
            <button className="demo-btn" onClick={()=>signIn(demoUsers[0])}>Try as Admin</button>
            <button className="demo-btn alt" onClick={()=>signIn(demoUsers[1])}>Try as Client</button>
          </div>
          <div className="divider"><span>or sign in</span></div>
          <div className="small">Email</div>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
          <div className="small" style={{marginTop:12}}>Password</div>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div style={{color:'#b91c1c',marginTop:10}}>{error}</div>}
          <div style={{marginTop:16,display:'flex',gap:10}}>
            <button onClick={()=>{
              const found = demoUsers.find(u=>u.email===email && u.password===password);
              if(!found){ setError('Invalid email or password.'); return; }
              signIn(found);
            }}>Sign In</button>
          </div>
        </div>
      </div>
    );
  }

  const metrics = {
    incidents: visibleCompanies.flatMap(c=>c.incidents).length,
    actions: visibleCompanies.flatMap(c=>c.actions).length,
    training: visibleCompanies.flatMap(c=>c.training).length,
    inspections: visibleCompanies.flatMap(c=>c.inspections).length
  };

  return (
    <div className="app">
      <div className="top">
        <div>
          <div className="brand">Strategic <span>EHS</span></div>
          <div className="small">{user.name} · {user.role}</div>
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
          <span className="demo-pill">Demo</span>
          <button className="alt" onClick={()=>setUser(null)}>Sign Out</button>
        </div>
      </div>

      <div className="grid hero">
        <div className="card">
          <h2 style={{margin:'0 0 10px'}}>Real SaaS starter</h2>
          <div className="small">React + Vite + Supabase scaffold. This is the package to keep building into your real product.</div>
        </div>
        <div className="card">
          <div className="small">Backend status</div>
          <div style={{fontSize:28,fontWeight:800,marginTop:8}}>{hasEnv ? 'Supabase ready' : 'Add .env values'}</div>
        </div>
      </div>

      <div className="grid metrics">
        <Metric label="Clients" value={visibleCompanies.length} />
        <Metric label="Incidents" value={metrics.incidents} />
        <Metric label="Actions" value={metrics.actions} />
        <Metric label="Training" value={metrics.training} />
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div className="toolbar">
          <div style={{minWidth:240}}>
            <div className="small">Active company</div>
            <select value={companyId} onChange={e=>setCompanyId(e.target.value)}>
              {visibleCompanies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t=><button key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</button>)}
      </div>

      {tab==='overview' && company && (
        <div className="grid two">
          <div className="card">
            <h3 style={{marginTop:0}}>Workspace summary</h3>
            <div className="small">Company: {company.name}</div>
            <div className="small">Incidents: {company.incidents.length}</div>
            <div className="small">Training: {company.training.length}</div>
            <div className="small">Actions: {company.actions.length}</div>
          </div>
          <div className="card">
            <h3 style={{marginTop:0}}>Next steps</h3>
            <div className="small">1. Add Supabase credentials</div>
            <div className="small">2. Replace demo auth with real auth</div>
            <div className="small">3. Persist incidents, training, actions, and reports</div>
          </div>
        </div>
      )}

      {tab==='incidents' && company && <div className="card"><Table cols={['Date','Type','Status','Summary']} rows={company.incidents.map((r,i)=><tr key={i}><td>{r.date}</td><td>{r.type}</td><td><span className="pill">{r.status}</span></td><td>{r.summary}</td></tr>)} /></div>}
      {tab==='training' && company && <div className="card"><Table cols={['Employee','Course','Status']} rows={company.training.map((r,i)=><tr key={i}><td>{r.employee}</td><td>{r.course}</td><td><span className="pill">{r.status}</span></td></tr>)} /></div>}
      {tab==='actions' && company && <div className="card"><Table cols={['Title','Owner','Status']} rows={company.actions.map((r,i)=><tr key={i}><td>{r.title}</td><td>{r.owner}</td><td><span className="pill">{r.status}</span></td></tr>)} /></div>}
      {tab==='inspections' && company && <div className="card"><Table cols={['Date','Area','Status']} rows={company.inspections.map((r,i)=><tr key={i}><td>{r.date}</td><td>{r.area}</td><td><span className="pill">{r.status}</span></td></tr>)} /></div>}
      {tab==='documents' && company && <div className="card"><Table cols={['Document','Status']} rows={company.documents.map((r,i)=><tr key={i}><td>{r.name}</td><td><span className="pill">{r.status}</span></td></tr>)} /></div>}
      {tab==='reports' && company && <div className="card"><Table cols={['Report','Status']} rows={company.reports.map((r,i)=><tr key={i}><td>{r.name}</td><td><span className="pill">{r.status}</span></td></tr>)} /></div>}
      {tab==='backend' && (
        <div className="card">
          <h3 style={{marginTop:0}}>Backend scaffold</h3>
          <div className="small">Supabase env detected: {String(hasEnv)}</div>
          <div className="small">Use the included .env.example and README to connect real auth and data.</div>
        </div>
      )}
    </div>
  );
}
