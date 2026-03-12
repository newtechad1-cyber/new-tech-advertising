import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  MapPin, TrendingUp, DollarSign, Users, AlertTriangle,
  ChevronUp, ChevronDown, ChevronsUpDown, X, Flag,
  Target, BarChart2, Zap
} from 'lucide-react';

const STATUS_CONFIG = {
  dominated:       { label: 'Dominated',       color: 'text-emerald-400', bg: 'bg-emerald-900/40', border: 'border-emerald-700', dot: '#10b981' },
  gaining_traction:{ label: 'Gaining Traction', color: 'text-blue-400',   bg: 'bg-blue-900/30',    border: 'border-blue-700',    dot: '#3b82f6' },
  active:          { label: 'Active',           color: 'text-amber-400',  bg: 'bg-amber-900/30',   border: 'border-amber-700',   dot: '#f59e0b' },
  planned:         { label: 'Planned',          color: 'text-slate-400',  bg: 'bg-slate-800',      border: 'border-slate-700',   dot: '#64748b' },
};

const VERTICAL_COLORS = {
  HVAC:       '#6366f1',
  Restaurant: '#f59e0b',
  Plumbing:   '#10b981',
  default:    '#8b5cf6',
};

const INSIGHTS = [
  { vertical: 'HVAC',       text: 'Secondary Midwest cities showing 3× higher inbound click rates vs Q4 — seasonal demand accelerating ahead of projection.', action: 'Accelerate content deployment in IA, MO', urgency: 'high' },
  { vertical: 'Restaurant', text: 'Urban cluster campaign traction improving — Des Moines engagement up 41% this month across social and local search.', action: 'Assign dedicated outreach rep to metro zone', urgency: 'medium' },
  { vertical: 'Plumbing',   text: 'Suburban outbound success rate increasing — Twin Cities territory showing strongest lead-to-call ratio in network.', action: 'Expand target city count by 8 additional suburbs', urgency: 'medium' },
];

function fmt(n) {
  if (!n) return '$0';
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

function ScoreBar({ value, color = '#6366f1' }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-6 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.planned;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      {cfg.label}
    </span>
  );
}

function TerritoryModal({ territory, playbooks, onClose, onUpdate }) {
  const pb = playbooks.find(p => p.id === territory.playbook_id);
  const vColor = VERTICAL_COLORS[territory.vertical_focus] || VERTICAL_COLORS.default;

  async function advance() {
    const next = { planned: 'active', active: 'gaining_traction', gaining_traction: 'dominated', dominated: 'dominated' };
    const newStatus = next[territory.activation_status];
    await base44.entities.ExpansionTerritory.update(territory.id, { activation_status: newStatus });
    onUpdate(territory.id, { activation_status: newStatus });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-[#0f1729] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ background: vColor }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: vColor }}>{territory.vertical_focus}</span>
            </div>
            <h2 className="text-lg font-black text-white">{territory.territory_name}</h2>
            <p className="text-slate-400 text-sm mt-0.5">{territory.region}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Opportunity Score', value: `${territory.opportunity_score}/100` },
              { label: 'Expected MRR', value: fmt(territory.expected_mrr_goal) },
              { label: 'Active Leads', value: territory.active_leads || 0 },
              { label: 'Target Cities', value: territory.target_city_count || 0 },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-900 rounded-xl p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-lg font-black text-white">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Opportunity Score</p>
            <ScoreBar value={territory.opportunity_score || 0} color={vColor} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Assigned Sales Rep</p>
              <p className="text-sm font-semibold text-white">{territory.assigned_sales_rep || '— Unassigned'}</p>
            </div>
            <StatusBadge status={territory.activation_status} />
          </div>

          {pb && (
            <div className="bg-slate-900 rounded-xl p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Linked Playbook</p>
              <p className="text-sm font-medium text-slate-300">{pb.name}</p>
            </div>
          )}
        </div>
        <div className="p-6 pt-0 flex gap-3">
          {territory.activation_status !== 'dominated' && (
            <button onClick={advance}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold text-white transition-colors">
              Advance Status →
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-semibold text-slate-300 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminExpansionTerritories() {
  const [territories, setTerritories] = useState([]);
  const [playbooks, setPlaybooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterVertical, setFilterVertical] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortKey, setSortKey] = useState('opportunity_score');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.ExpansionTerritory.list('-opportunity_score', 100),
      base44.entities.ExpansionPlaybook.list('-created_date', 50),
    ]).then(([t, p]) => { setTerritories(t); setPlaybooks(p); setLoading(false); });
  }, []);

  function onUpdate(id, patch) {
    setTerritories(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  }

  const verticals = ['All', ...Array.from(new Set(territories.map(t => t.vertical_focus).filter(Boolean)))];
  const statuses  = ['All', 'planned', 'active', 'gaining_traction', 'dominated'];

  const filtered = territories.filter(t =>
    (filterVertical === 'All' || t.vertical_focus === filterVertical) &&
    (filterStatus === 'All' || t.activation_status === filterStatus)
  );

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey] ?? 0;
    const bv = b[sortKey] ?? 0;
    return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  function SortIcon({ k }) {
    if (sortKey !== k) return <ChevronsUpDown className="w-3 h-3 text-slate-600" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-violet-400" /> : <ChevronDown className="w-3 h-3 text-violet-400" />;
  }

  // KPIs
  const active = territories.filter(t => t.activation_status === 'active').length;
  const traction = territories.filter(t => t.activation_status === 'gaining_traction').length;
  const totalMRR = territories.reduce((s, t) => s + (t.expected_mrr_goal || 0), 0);
  const avgScore = territories.length ? Math.round(territories.reduce((s, t) => s + (t.opportunity_score || 0), 0) / territories.length) : 0;
  const noRep = territories.filter(t => !t.assigned_sales_rep).length;

  // Funnel
  const stageOrder = ['planned', 'active', 'gaining_traction', 'dominated'];
  const stageCounts = stageOrder.map(s => ({ status: s, count: territories.filter(t => t.activation_status === s).length }));
  const maxStage = Math.max(...stageCounts.map(s => s.count), 1);

  const KPI = ({ label, value, sub, icon: Icon, color }) => (
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
      <div className="text-slate-400 text-sm animate-pulse">Loading territory data…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080f1e] text-white">
      {selected && (
        <TerritoryModal territory={selected} playbooks={playbooks} onClose={() => setSelected(null)} onUpdate={onUpdate} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-6 rounded-full bg-cyan-400" />
              <h1 className="text-2xl font-black text-white">Territory Activation</h1>
            </div>
            <p className="text-slate-400 text-sm ml-5">Geographic sales zones tied to expansion initiatives · city-by-city domination</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filterVertical} onChange={e => setFilterVertical(e.target.value)}
              className="bg-[#0f1729] border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
              {verticals.map(v => <option key={v}>{v}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="bg-[#0f1729] border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
              {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : STATUS_CONFIG[s]?.label || s}</option>)}
            </select>
          </div>
        </div>

        {/* SECTION 1 — KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPI label="Active Territories" value={active} icon={MapPin} color="text-cyan-400" />
          <KPI label="Gaining Traction" value={traction} icon={TrendingUp} color="text-blue-400" />
          <KPI label="Total MRR Goal" value={fmt(totalMRR)} icon={DollarSign} color="text-emerald-400" />
          <KPI label="Avg Opportunity" value={`${avgScore}/100`} icon={Target} color="text-violet-400" />
          <KPI label="Unassigned Reps" value={noRep} sub={noRep > 0 ? 'need assignment' : 'all assigned'} icon={Users} color={noRep > 0 ? 'text-rose-400' : 'text-slate-400'} />
        </div>

        {/* SECTION 2 — Territory Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4">Territory Opportunity Grid</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(t => {
              const cfg = STATUS_CONFIG[t.activation_status] || STATUS_CONFIG.planned;
              const vColor = VERTICAL_COLORS[t.vertical_focus] || VERTICAL_COLORS.default;
              return (
                <div key={t.id} onClick={() => setSelected(t)}
                  className={`bg-[#0f1729] border rounded-2xl p-5 cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-0.5 ${cfg.border}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: vColor }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: vColor }}>{t.vertical_focus}</span>
                    </div>
                    <StatusBadge status={t.activation_status} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 leading-snug">{t.territory_name}</h3>
                  <p className="text-[11px] text-slate-500 mb-4">{t.region}</p>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span>Opportunity Score</span>
                    </div>
                    <ScoreBar value={t.opportunity_score || 0} color={vColor} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="text-emerald-400 font-black">{fmt(t.expected_mrr_goal)}</p>
                      <p className="text-[10px] text-slate-500">MRR Goal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400 font-black">{t.active_leads || 0}</p>
                      <p className="text-[10px] text-slate-500">Active Leads</p>
                    </div>
                  </div>
                  {!t.assigned_sales_rep && (
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span className="text-[10px] text-amber-400 font-medium">Rep unassigned</span>
                    </div>
                  )}
                  {t.assigned_sales_rep && (
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <span className="text-[10px] text-slate-400">{t.assigned_sales_rep}</span>
                    </div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center text-slate-600 py-12 text-sm">No territories match current filters.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 — Activation Funnel */}
        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-300 mb-5">Territory Activation Funnel</h2>
          <div className="space-y-4">
            {stageCounts.map(({ status, count }) => {
              const cfg = STATUS_CONFIG[status];
              const pct = Math.round((count / territories.length) * 100) || 0;
              return (
                <div key={status} className="flex items-center gap-4">
                  <div className="w-28 flex-shrink-0 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
                    <span className="text-xs font-semibold" style={{ color: cfg.dot }}>{cfg.label}</span>
                  </div>
                  <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.round((count / maxStage) * 100)}%`, background: cfg.dot + 'cc' }} />
                  </div>
                  <div className="flex items-center gap-3 w-20 flex-shrink-0 text-right">
                    <span className="text-xs font-black" style={{ color: cfg.dot }}>{count}</span>
                    <span className="text-[10px] text-slate-600">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5 — Priority Leaderboard */}
        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-300">Territory Priority Leaderboard</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/60">
                <tr>
                  {[
                    { label: 'Territory', key: 'territory_name' },
                    { label: 'Vertical', key: 'vertical_focus' },
                    { label: 'Opp. Score', key: 'opportunity_score' },
                    { label: 'MRR Goal', key: 'expected_mrr_goal' },
                    { label: 'Leads', key: 'active_leads' },
                    { label: 'Rep', key: 'assigned_sales_rep' },
                    { label: 'Status', key: 'activation_status' },
                  ].map(col => (
                    <th key={col.key} onClick={() => toggleSort(col.key)}
                      className="px-4 py-3 text-left cursor-pointer select-none group">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-300 transition-colors">{col.label}</span>
                        <SortIcon k={col.key} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {sorted.map(t => {
                  const vColor = VERTICAL_COLORS[t.vertical_focus] || VERTICAL_COLORS.default;
                  return (
                    <tr key={t.id} onClick={() => setSelected(t)}
                      className="hover:bg-slate-800/30 transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm text-white font-medium">{t.territory_name}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: vColor + '22', color: vColor }}>{t.vertical_focus}</span>
                      </td>
                      <td className="px-4 py-3 w-32">
                        <ScoreBar value={t.opportunity_score || 0} color={vColor} />
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-emerald-400">{fmt(t.expected_mrr_goal)}</td>
                      <td className="px-4 py-3 text-sm text-blue-400 font-bold">{t.active_leads || 0}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{t.assigned_sales_rep || <span className="text-amber-400">Unassigned</span>}</td>
                      <td className="px-4 py-3"><StatusBadge status={t.activation_status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 6 — Intelligence Feed */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4">Territory Expansion Intelligence</h2>
          <div className="space-y-3">
            {INSIGHTS.map((ins, i) => {
              const vColor = VERTICAL_COLORS[ins.vertical] || VERTICAL_COLORS.default;
              const urgBg = ins.urgency === 'high' ? 'border-rose-800 bg-rose-950/20' : 'border-amber-800 bg-amber-950/10';
              const urgColor = ins.urgency === 'high' ? 'text-rose-400 bg-rose-900' : 'text-amber-400 bg-amber-900';
              return (
                <div key={i} className={`border rounded-2xl p-4 flex items-start gap-4 ${urgBg}`}>
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: vColor }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-black" style={{ color: vColor }}>{ins.vertical}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${urgColor}`}>{ins.urgency}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{ins.text}</p>
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <p className="text-xs text-slate-500 italic">Recommended: {ins.action}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[11px] text-slate-300 font-semibold transition-colors flex-shrink-0">
                    <Flag className="w-3 h-3" /> Flag
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}