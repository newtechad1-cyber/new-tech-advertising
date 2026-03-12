import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, X, Plus, ChevronRight, Zap, Star } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

// ── Demo Data ─────────────────────────────────────────────────────────────────
const VERTICALS = [
  { id:'v1', name:'HVAC', emoji:'🌡️', description:'Heating, ventilation, and air conditioning services for residential and commercial clients.', active_client_count:14, total_mrr:18620, growth_velocity_score:88, retention_score:84, authority_score:79, demand_trend:'rising', primary_regions:'Chicago North, Suburbs, Midwest', notes:'Spring demand surge underway. Multiple expansion signals detected.' },
  { id:'v2', name:'Restaurant', emoji:'🍽️', description:'Full-service and quick-serve restaurants, cafes, and food establishments.', active_client_count:9, total_mrr:8973, growth_velocity_score:62, retention_score:71, authority_score:65, demand_trend:'stable', primary_regions:'Downtown, River North, Lincoln Park', notes:'Seasonal engagement patterns. Holiday campaigns perform best.' },
  { id:'v3', name:'Plumbing', emoji:'🔧', description:'Residential and commercial plumbing services and emergency repair.', active_client_count:7, total_mrr:6979, growth_velocity_score:74, retention_score:78, authority_score:71, demand_trend:'rising', primary_regions:'North Shore, West Suburbs', notes:'Emergency service demand consistent year-round.' },
  { id:'v4', name:'Roofing', emoji:'🏠', description:'Residential and commercial roofing installation, repair, and inspection.', active_client_count:5, total_mrr:4985, growth_velocity_score:55, retention_score:66, authority_score:58, demand_trend:'stable', primary_regions:'Chicagoland', notes:'Strong spring-fall seasonal cycle.' },
  { id:'v5', name:'Home Services', emoji:'🔨', description:'General home improvement, remodeling, and handyman services.', active_client_count:8, total_mrr:7984, growth_velocity_score:69, retention_score:73, authority_score:64, demand_trend:'stable', primary_regions:'Metro Chicago, Naperville, Evanston', notes:'Growing interest in bundled service packages.' },
  { id:'v6', name:'Medical', emoji:'🏥', description:'Healthcare practices including dental, chiropractic, and medical clinics.', active_client_count:6, total_mrr:7182, growth_velocity_score:71, retention_score:82, authority_score:76, demand_trend:'rising', primary_regions:'Metro, North Shore', notes:'High retention. Authority content drives referrals.' },
  { id:'v7', name:'Legal', emoji:'⚖️', description:'Law firms, solo practitioners, and legal service providers.', active_client_count:4, total_mrr:3988, growth_velocity_score:38, retention_score:61, authority_score:55, demand_trend:'declining', primary_regions:'Downtown Chicago', notes:'Slower acquisition cycle. Needs dedicated strategy push.' },
  { id:'v8', name:'Multi-Location Franchise', emoji:'🏢', description:'Enterprise franchise brands with multiple regional locations.', active_client_count:3, total_mrr:12963, growth_velocity_score:91, retention_score:88, authority_score:83, demand_trend:'rising', primary_regions:'Nationwide', notes:'Highest MRR per client. Expansion pipeline is strong.' },
];

const MOCK_CHART = [
  { m:'Oct', mrr:0.7 }, { m:'Nov', mrr:0.75 }, { m:'Dec', mrr:0.8 },
  { m:'Jan', mrr:0.85 }, { m:'Feb', mrr:0.9 }, { m:'Mar', mrr:1 },
];

const TP = { background:'#0f172a', border:'none', borderRadius:8, fontSize:11, color:'#e2e8f0' };

const TREND_CONFIG = {
  rising:   { label:'Rising',   icon:TrendingUp,   badge:'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', color:'text-emerald-400' },
  stable:   { label:'Stable',   icon:Minus,        badge:'bg-amber-500/20 text-amber-400 border border-amber-500/30',     color:'text-amber-400' },
  declining:{ label:'Declining',icon:TrendingDown, badge:'bg-red-500/20 text-red-400 border border-red-500/30',           color:'text-red-400' },
};

const velColor = s => s >= 70 ? 'bg-emerald-500' : s >= 40 ? 'bg-amber-500' : 'bg-red-500';
const velRing  = s => s >= 70 ? 'border-emerald-500/30 hover:border-emerald-500/60' : s >= 40 ? 'border-amber-500/30 hover:border-amber-500/60' : 'border-red-500/30 hover:border-red-500/60';

// ── Score Meter ───────────────────────────────────────────────────────────────
const ScoreMeter = ({ label, value, color = 'bg-blue-500' }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-[10px] text-slate-400 font-bold uppercase">{label}</span>
      <span className="text-xs font-black text-white">{value}/100</span>
    </div>
    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width:`${value}%` }} />
    </div>
  </div>
);

// ── Vertical Modal ────────────────────────────────────────────────────────────
const VerticalModal = ({ v, onClose }) => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState(v.notes ? [{ text:v.notes, author:'System', date:'Mar 12' }] : []);
  const [priority, setPriority] = useState(false);
  const tCfg = TREND_CONFIG[v.demand_trend];
  const chartData = MOCK_CHART.map(d => ({ ...d, mrr: Math.round(v.total_mrr * d.mrr) }));

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(n => [{ text:note, author:'Leadership', date:'Mar 12' }, ...n]);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{v.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-black text-white">{v.name}</p>
                {priority && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
              </div>
              <p className="text-[11px] text-slate-500">{v.active_client_count} clients · ${v.total_mrr.toLocaleString()}/mo MRR</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${tCfg.badge}`}>
              <tCfg.icon className="w-3 h-3" /> {tCfg.label}
            </span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><X className="w-4 h-4 text-slate-400" /></button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Revenue chart */}
          <div className="bg-slate-800 rounded-2xl p-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">MRR Trend — Oct to Mar</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="m" tick={{ fontSize:9, fill:'#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={TP} formatter={v => [`$${v.toLocaleString()}`, 'MRR']} />
                <Area type="monotone" dataKey="mrr" stroke="#10b981" fill="url(#mg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Score meters */}
          <div className="bg-slate-800 rounded-2xl p-4 space-y-3">
            <ScoreMeter label="Growth Velocity" value={v.growth_velocity_score} color={velColor(v.growth_velocity_score)} />
            <ScoreMeter label="Retention Score" value={v.retention_score} color="bg-blue-500" />
            <ScoreMeter label="Authority Score" value={v.authority_score} color="bg-violet-500" />
          </div>

          {/* Regions */}
          <div className="bg-slate-800 rounded-2xl p-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Regions Served</p>
            <div className="flex flex-wrap gap-2">
              {(v.primary_regions || '').split(',').map(r => (
                <span key={r} className="text-[11px] bg-slate-700 text-slate-300 px-3 py-1 rounded-full">{r.trim()}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setPriority(p => !p)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${priority ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400' : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'}`}>
              <Star className="w-3.5 h-3.5" /> {priority ? 'Strategic Priority ✓' : 'Mark as Strategic Priority'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-500/30 transition-colors">
              <Zap className="w-3.5 h-3.5" /> Trigger Campaign Planning
            </button>
          </div>

          {/* Notes */}
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">Leadership Notes</p>
            <div className="flex gap-2 mb-3">
              <input value={note} onChange={e => setNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addNote()}
                placeholder="Add a note about this vertical..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              <button onClick={addNote} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {notes.map((n, i) => (
                <div key={i} className="bg-slate-800 rounded-xl px-4 py-3">
                  <p className="text-sm text-slate-200">{n.text}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{n.author} · {n.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminVerticalIntelligence() {
  const [selected, setSelected] = useState(null);
  const [trendFilter, setTrendFilter] = useState('all');
  const [globalNotes, setGlobalNotes] = useState([
    { text:'HVAC demand accelerating ahead of spring season', author:'Leadership', date:'Mar 12', vertical:'HVAC' },
    { text:'Restaurant engagement shows seasonal dip in Feb — recovery expected', author:'Leadership', date:'Mar 8', vertical:'Restaurant' },
    { text:'Franchise vertical expanding — 2 new enterprise accounts in pipeline', author:'Sales', date:'Mar 5', vertical:'Multi-Location Franchise' },
  ]);
  const [newNote, setNewNote] = useState('');
  const [noteVertical, setNoteVertical] = useState('HVAC');

  const topMRR = [...VERTICALS].sort((a,b) => b.total_mrr - a.total_mrr)[0];
  const topGrowth = [...VERTICALS].sort((a,b) => b.growth_velocity_score - a.growth_velocity_score)[0];
  const avgRetention = Math.round(VERTICALS.reduce((s,v) => s + v.retention_score, 0) / VERTICALS.length);
  const avgAuthority = Math.round(VERTICALS.reduce((s,v) => s + v.authority_score, 0) / VERTICALS.length);
  const expansionCount = VERTICALS.filter(v => v.demand_trend === 'rising').length;

  const filtered = trendFilter === 'all' ? VERTICALS : VERTICALS.filter(v => v.demand_trend === trendFilter);

  const addGlobalNote = () => {
    if (!newNote.trim()) return;
    setGlobalNotes(n => [{ text:newNote, author:'Leadership', date:'Mar 12', vertical:noteVertical }, ...n]);
    setNewNote('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Page Title */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-white">Vertical Intelligence</h1>
            <p className="text-slate-400 text-sm mt-1">Industry performance, growth signals, and strategic opportunities</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">{expansionCount} Verticals Rising</span>
          </div>
        </div>

        {/* S1 — KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label:'Active Verticals', value:VERTICALS.length, color:'text-white' },
            { label:'Top Revenue', value:topMRR.name, sub:`$${topMRR.total_mrr.toLocaleString()}/mo`, color:'text-emerald-400' },
            { label:'Fastest Growing', value:topGrowth.name, sub:`${topGrowth.growth_velocity_score}/100 velocity`, color:'text-blue-400' },
            { label:'Avg Retention', value:`${avgRetention}/100`, color: avgRetention > 75 ? 'text-emerald-400' : 'text-amber-400' },
            { label:'Authority Coverage', value:`${avgAuthority}/100`, color:'text-violet-400' },
            { label:'Expansion Signals', value:`${expansionCount} Rising`, color:'text-teal-400' },
          ].map(k => (
            <div key={k.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <p className="text-[9px] text-slate-500 font-bold uppercase mb-2">{k.label}</p>
              <p className={`text-lg font-black leading-tight ${k.color}`}>{k.value}</p>
              {k.sub && <p className="text-[10px] text-slate-500 mt-1">{k.sub}</p>}
            </div>
          ))}
        </div>

        {/* S2 — Vertical Grid */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-base font-black text-white">Vertical Performance</h2>
            <div className="flex gap-1.5">
              {[['all','All'],['rising','Rising'],['stable','Stable'],['declining','Declining']].map(([v,l]) => (
                <button key={v} onClick={() => setTrendFilter(v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${trendFilter===v?'bg-slate-200 text-slate-900':'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(v => {
              const tCfg = TREND_CONFIG[v.demand_trend];
              return (
                <div key={v.id} onClick={() => setSelected(v)}
                  className={`bg-slate-900 border rounded-2xl p-5 cursor-pointer hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 transition-all ${velRing(v.growth_velocity_score)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{v.emoji}</span>
                      <p className="font-black text-white">{v.name}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${tCfg.badge}`}>
                      <tCfg.icon className="w-2.5 h-2.5" /> {tCfg.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-800 rounded-xl p-2.5">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Clients</p>
                      <p className="text-sm font-black text-white">{v.active_client_count}</p>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-2.5">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">MRR</p>
                      <p className="text-sm font-black text-emerald-400">${(v.total_mrr/1000).toFixed(1)}k</p>
                    </div>
                  </div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Growth Velocity</span>
                    <span className="text-[9px] font-black text-slate-300">{v.growth_velocity_score}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div className={`h-full ${velColor(v.growth_velocity_score)} rounded-full`} style={{ width:`${v.growth_velocity_score}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">Retention: <span className="font-bold text-slate-300">{v.retention_score}/100</span></span>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* S4 — Demand Trend Summary */}
        <div>
          <h2 className="text-base font-black text-white mb-4">Demand Trend Summary</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            {(['rising','stable','declining']).map(trend => {
              const items = VERTICALS.filter(v => v.demand_trend === trend);
              const cfg = TREND_CONFIG[trend];
              const pct = Math.round((items.length / VERTICALS.length) * 100);
              return (
                <div key={trend} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-24 flex-shrink-0">
                    <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                    <span className={`text-xs font-bold capitalize ${cfg.color}`}>{trend}</span>
                  </div>
                  <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${trend==='rising'?'bg-emerald-500':trend==='stable'?'bg-amber-500':'bg-red-500'}`} style={{ width:`${pct}%` }} />
                  </div>
                  <span className="text-xs font-black text-slate-300 w-12 text-right">{items.length} vert.</span>
                  <span className="text-[11px] text-slate-500 w-32 hidden sm:block truncate">{items.map(i=>i.name).join(', ')}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* S5 — Leadership Notes Feed */}
        <div>
          <h2 className="text-base font-black text-white mb-4">Leadership Insight Notes</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex gap-2 flex-wrap">
              <input value={newNote} onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addGlobalNote()}
                placeholder="Add a leadership insight..."
                className="flex-1 min-w-[200px] bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              <select value={noteVertical} onChange={e => setNoteVertical(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none">
                {VERTICALS.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>
              <button onClick={addGlobalNote} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Note
              </button>
            </div>
            <div className="space-y-2">
              {globalNotes.map((n, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-800 rounded-xl px-4 py-3">
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-300 flex-shrink-0 mt-0.5">{n.author[0]}</div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">{n.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500">{n.author} · {n.date}</span>
                      <span className="text-[9px] bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">{n.vertical}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {selected && <VerticalModal v={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}