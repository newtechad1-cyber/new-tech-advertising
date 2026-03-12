import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  TrendingUp, DollarSign, Layers, Zap, BarChart2,
  MapPin, Clock, ChevronRight, X, Target, PlayCircle,
  CheckCircle2, ArrowUpRight, StickyNote
} from 'lucide-react';

const VERTICAL_COLORS = {
  HVAC: '#6366f1', Restaurant: '#f59e0b', Plumbing: '#10b981',
  'Home Services': '#ec4899', General: '#8b5cf6'
};

const TYPE_CONFIG = {
  geographic: { label: 'Geographic', color: '#6366f1' },
  vertical_domination: { label: 'Vertical Domination', color: '#8b5cf6' },
  enterprise: { label: 'Enterprise', color: '#ec4899' },
  partner_channel: { label: 'Partner Channel', color: '#14b8a6' },
};

const STATUS_CONFIG = {
  planning: { label: 'Planning', bg: 'bg-slate-800', text: 'text-slate-400', bar: '#475569' },
  active: { label: 'Active', bg: 'bg-blue-900/50', text: 'text-blue-300', bar: '#3b82f6' },
  scaling: { label: 'Scaling', bg: 'bg-emerald-900/50', text: 'text-emerald-300', bar: '#10b981' },
  completed: { label: 'Completed', bg: 'bg-slate-900', text: 'text-slate-500', bar: '#334155' },
};

const PLANNING_NOTES = [
  { playbook: 'HVAC Midwest Expansion', author: 'Jordan M.', date: 'Mar 10', note: 'Secondary city TAM estimated at $280k ARR. Suggest piloting 3 cities before full rollout.' },
  { playbook: 'Restaurant Authority Push', author: 'Alex R.', date: 'Mar 8', note: 'Q2 seasonal window opens April 1. Content production must begin no later than March 20.' },
  { playbook: 'Plumbing Pricing Expansion', author: 'Casey T.', date: 'Mar 6', note: 'Two existing clients already upgraded without objection. Strong signal for broader rollout.' },
  { playbook: 'Franchise Enterprise Entry', author: 'Jordan M.', date: 'Mar 4', note: 'Target franchise groups with 5+ locations first. Case study from existing multi-location client is the key sales asset.' },
];

function fmt(n) {
  if (!n) return '—';
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

function vColor(v) { return VERTICAL_COLORS[v] || '#94a3b8'; }

function DifficultyMeter({ value }) {
  const color = value >= 70 ? '#f43f5e' : value >= 40 ? '#f59e0b' : '#10b981';
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-slate-500">Difficulty</span>
        <span className="text-[10px] font-bold" style={{ color }}>{value}/100</span>
      </div>
      <div className="bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function PlaybookModal({ playbook, onClose, onStatusChange }) {
  const sc = STATUS_CONFIG[playbook.status] || STATUS_CONFIG.planning;
  const tc = TYPE_CONFIG[playbook.expansion_type] || TYPE_CONFIG.geographic;
  const color = vColor(playbook.target_vertical);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0f1729] border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Top accent */}
        <div className="h-1 w-full" style={{ background: color }} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-xs font-bold" style={{ color }}>{playbook.target_vertical || 'General'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: tc.color + '22', color: tc.color }}>{tc.label}</span>
              </div>
              <h2 className="text-lg font-black text-white">{playbook.name}</h2>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {playbook.target_region && (
            <div className="flex items-center gap-1.5 mb-4">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-400">{playbook.target_region}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-slate-900/60 rounded-xl p-3 text-center">
              <p className="text-[10px] text-slate-500 mb-1">Proj. MRR</p>
              <p className="text-base font-black text-emerald-400">{fmt(playbook.projected_mrr_goal)}</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 text-center">
              <p className="text-[10px] text-slate-500 mb-1">Timeline</p>
              <p className="text-base font-black text-white">{playbook.timeline_weeks || '—'}<span className="text-xs text-slate-500 font-normal">w</span></p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 text-center">
              <p className="text-[10px] text-slate-500 mb-1">Status</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{sc.label}</span>
            </div>
          </div>

          <div className="mb-5">
            <DifficultyMeter value={playbook.difficulty_score || 0} />
          </div>

          {playbook.strategic_notes && (
            <div className="bg-slate-900/40 rounded-xl p-4 mb-5">
              <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-wider">Strategic Notes</p>
              <p className="text-sm text-slate-300 leading-relaxed">{playbook.strategic_notes}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {playbook.status === 'planning' && (
              <button onClick={() => onStatusChange(playbook.id, 'active')}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-700 rounded-xl text-xs text-blue-300 font-semibold transition-colors">
                <PlayCircle className="w-3.5 h-3.5" /> Mark Active
              </button>
            )}
            {playbook.status === 'active' && (
              <button onClick={() => onStatusChange(playbook.id, 'scaling')}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-700 rounded-xl text-xs text-emerald-300 font-semibold transition-colors">
                <TrendingUp className="w-3.5 h-3.5" /> Mark Scaling
              </button>
            )}
            {playbook.status === 'scaling' && (
              <button onClick={() => onStatusChange(playbook.id, 'completed')}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl text-xs text-slate-300 font-semibold transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
              </button>
            )}
            <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 font-semibold transition-colors">
              <Target className="w-3.5 h-3.5" /> Assign Owner
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 font-semibold transition-colors">
              <Layers className="w-3.5 h-3.5" /> Execution Steps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminExpansionPlaybook() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterVertical, setFilterVertical] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.ExpansionPlaybook.list('-created_date', 100).then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  async function handleStatusChange(id, newStatus) {
    await base44.entities.ExpansionPlaybook.update(id, { status: newStatus });
    setData(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setSelected(prev => prev?.id === id ? { ...prev, status: newStatus } : prev);
  }

  const verticals = ['All', ...Object.keys(VERTICAL_COLORS)];
  const types = ['All', ...Object.keys(TYPE_CONFIG)];

  const filtered = data.filter(r =>
    (filterVertical === 'All' || r.target_vertical === filterVertical) &&
    (filterType === 'All' || r.expansion_type === filterType)
  );

  // KPIs
  const active = data.filter(r => r.status === 'active').length;
  const planning = data.filter(r => r.status === 'planning').length;
  const scaling = data.filter(r => r.status === 'scaling').length;
  const totalMRR = data.reduce((s, r) => s + (r.projected_mrr_goal || 0), 0);
  const avgDiff = data.length ? Math.round(data.reduce((s, r) => s + (r.difficulty_score || 0), 0) / data.length) : 0;

  // Type distribution
  const typeDist = Object.keys(TYPE_CONFIG).map(t => ({
    type: t,
    count: data.filter(r => r.expansion_type === t).length,
  }));
  const maxCount = Math.max(...typeDist.map(t => t.count), 1);

  const KPI = ({ label, value, sub, Icon, color }) => (
    <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</span>
      </div>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#080f1e] flex items-center justify-center">
      <div className="text-slate-400 text-sm animate-pulse">Loading playbooks…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080f1e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-6 rounded-full bg-violet-400" />
              <h1 className="text-2xl font-black text-white">Expansion Playbook</h1>
            </div>
            <p className="text-slate-400 text-sm ml-5">Structured execution plans for entering new industries, regions, and enterprise segments</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filterVertical} onChange={e => setFilterVertical(e.target.value)}
              className="bg-[#0f1729] border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
              {verticals.map(v => <option key={v}>{v}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="bg-[#0f1729] border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
              {types.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : TYPE_CONFIG[t].label}</option>)}
            </select>
          </div>
        </div>

        {/* SECTION 1 — KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPI label="Active Initiatives" value={active} Icon={PlayCircle} color="text-blue-400" />
          <KPI label="Total Projected MRR" value={fmt(totalMRR)} sub="all playbooks" Icon={DollarSign} color="text-emerald-400" />
          <KPI label="In Planning" value={planning} Icon={Layers} color="text-slate-400" />
          <KPI label="Scaling" value={scaling} Icon={TrendingUp} color="text-violet-400" />
          <KPI label="Avg Difficulty" value={`${avgDiff}/100`} Icon={Zap} color={avgDiff > 60 ? 'text-rose-400' : 'text-amber-400'} />
        </div>

        {/* SECTION 2 — Playbook Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4">Expansion Initiatives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((pb, i) => {
              const sc = STATUS_CONFIG[pb.status] || STATUS_CONFIG.planning;
              const tc = TYPE_CONFIG[pb.expansion_type] || TYPE_CONFIG.geographic;
              const color = vColor(pb.target_vertical);
              return (
                <button key={i} onClick={() => setSelected(pb)}
                  className="bg-[#0f1729] border border-slate-800 rounded-2xl p-5 text-left hover:border-slate-600 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-200 group">
                  {/* Status bar top */}
                  <div className="h-0.5 w-full rounded-full mb-4" style={{ background: sc.bar }} />

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-[11px] font-bold" style={{ color }}>{pb.target_vertical || 'General'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{sc.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug mb-2">{pb.name}</h3>

                  {pb.target_region && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <MapPin className="w-3 h-3 text-slate-600" />
                      <span className="text-[11px] text-slate-500">{pb.target_region}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: tc.color + '22', color: tc.color }}>{tc.label}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />{pb.timeline_weeks || '?'}w
                      </div>
                      <span className="text-xs font-bold text-emerald-400">{fmt(pb.projected_mrr_goal)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center text-slate-600 text-sm py-12">No playbooks match current filters.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 — Type Distribution Strip */}
        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-300 mb-5">Expansion Type Distribution</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {typeDist.map(t => {
              const tc = TYPE_CONFIG[t.type];
              const pct = Math.round((t.count / maxCount) * 100);
              return (
                <div key={t.type} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{tc.label}</span>
                    <span className="text-xl font-black" style={{ color: tc.color }}>{t.count}</span>
                  </div>
                  <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: tc.color }} />
                  </div>
                  <span className="text-[10px] text-slate-500">{t.count} initiative{t.count !== 1 ? 's' : ''}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5 — Leadership Planning Notes */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <StickyNote className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-300">Leadership Planning Notes</h2>
          </div>
          <div className="space-y-3">
            {PLANNING_NOTES.map((note, i) => (
              <div key={i} className="bg-[#0f1729] border border-slate-800 rounded-2xl p-4 flex items-start gap-4 hover:border-slate-600 transition-all">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-black text-slate-300">{note.author.split(' ')[0][0]}{note.author.split(' ')[1]?.[0] || ''}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-violet-400">{note.playbook}</span>
                    <span className="text-[10px] text-slate-600">·</span>
                    <span className="text-[10px] text-slate-500">{note.author}</span>
                    <span className="text-[10px] text-slate-600">·</span>
                    <span className="text-[10px] text-slate-600">{note.date}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{note.note}</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal */}
      {selected && (
        <PlaybookModal
          playbook={selected}
          onClose={() => setSelected(null)}
          onStatusChange={async (id, status) => {
            await handleStatusChange(id, status);
          }}
        />
      )}
    </div>
  );
}