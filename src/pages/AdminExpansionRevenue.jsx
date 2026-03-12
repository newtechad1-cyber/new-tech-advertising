import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  DollarSign, TrendingUp, Users, Clock, Star,
  AlertTriangle, Flag, ChevronUp, ChevronDown, ChevronsUpDown
} from 'lucide-react';

const TERRITORY_COLORS = {
  'North Iowa HVAC Territory':        '#6366f1',
  'Des Moines Restaurant Growth Zone':'#f59e0b',
  'Twin Cities Plumbing Expansion':   '#10b981',
};
const DEFAULT_COLORS = ['#8b5cf6', '#14b8a6', '#ec4899', '#3b82f6'];

const STAGE_CONFIG = {
  early:    { label: 'Early',    color: '#64748b', dot: '#64748b' },
  traction: { label: 'Traction', color: '#3b82f6', dot: '#3b82f6' },
  scaling:  { label: 'Scaling',  color: '#f59e0b', dot: '#f59e0b' },
  mature:   { label: 'Mature',   color: '#10b981', dot: '#10b981' },
};

const MONTHS_LABELS = ['Nov', 'Dec', 'Jan', 'Feb'];
const MONTHS_KEYS   = ['2025-11-01', '2025-12-01', '2026-01-01', '2026-02-01'];

const ROI_INSIGHTS = [
  { territory: 'North Iowa HVAC Territory',        text: 'HVAC expansion generating fastest early traction — 4 new clients in Month 1 with sub-20 day sales cycle outperforms all other territory launches.',         action: 'Accelerate rep allocation to North Iowa for Q2',      urgency: 'high'   },
  { territory: 'Des Moines Restaurant Growth Zone', text: 'Restaurant territory showing slower conversion cycles (+34 days avg) — longer consideration window typical for dining clients; pipeline is building.',  action: 'Introduce ROI calculator to shorten decision timeline', urgency: 'medium' },
  { territory: 'Twin Cities Plumbing Expansion',    text: 'Plumbing premium pricing improving cumulative MRR — territory is now mature and generating highest revenue density per city of any expansion zone.',       action: 'Use as case study for new territory pitch decks',      urgency: 'low'    },
];

function fmt(n) {
  if (!n) return '$0';
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

function getColor(name, idx) {
  return TERRITORY_COLORS[name] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="text-white font-bold">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function StageBadge({ stage }) {
  const cfg = STAGE_CONFIG[stage] || STAGE_CONFIG.early;
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
      style={{ color: cfg.color, borderColor: cfg.color + '55', background: cfg.color + '18' }}>
      {cfg.label}
    </span>
  );
}

export default function AdminExpansionRevenue() {
  const [metrics, setMetrics] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTerritory, setFilterTerritory] = useState('All');
  const [sortKey, setSortKey] = useState('cumulative_mrr');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    Promise.all([
      base44.entities.ExpansionRevenueMetric.list('-month', 200),
      base44.entities.ExpansionTerritory.list('-opportunity_score', 50),
    ]).then(([m, t]) => { setMetrics(m); setTerritories(t); setLoading(false); });
  }, []);

  const territoryNames = ['All', ...Array.from(new Set(metrics.map(m => m.territory_name).filter(Boolean)))];

  const filtered = filterTerritory === 'All' ? metrics : metrics.filter(m => m.territory_name === filterTerritory);

  // Latest record per territory for KPIs / leaderboard
  const latestByTerritory = {};
  metrics.forEach(m => {
    if (!latestByTerritory[m.territory_name] || m.month > latestByTerritory[m.territory_name].month) {
      latestByTerritory[m.territory_name] = m;
    }
  });
  const latestRows = Object.values(latestByTerritory);

  // KPIs
  const totalMRR       = latestRows.reduce((s, r) => s + (r.cumulative_mrr || 0), 0);
  const newClientsThisMonth = latestRows.reduce((s, r) => s + (r.new_clients_acquired || 0), 0);
  const fastestScaling = [...latestRows].sort((a, b) => (a.sales_cycle_days_avg || 99) - (b.sales_cycle_days_avg || 99))[0];
  const avgSalesCycle  = latestRows.length ? Math.round(latestRows.reduce((s, r) => s + (r.sales_cycle_days_avg || 0), 0) / latestRows.length) : 0;
  const matureCount    = latestRows.filter(r => r.expansion_stage === 'mature').length;

  // Multi-line chart data
  const uniqTerritories = Array.from(new Set(metrics.map(m => m.territory_name).filter(Boolean)));
  const chartData = MONTHS_LABELS.map((label, i) => {
    const row = { month: label };
    uniqTerritories.forEach(name => {
      const match = metrics.find(m => m.territory_name === name && m.month === MONTHS_KEYS[i]);
      row[name] = match?.cumulative_mrr || 0;
    });
    return row;
  });

  // Stage distribution
  const stageCounts = Object.keys(STAGE_CONFIG).map(s => ({
    stage: s, count: latestRows.filter(r => r.expansion_stage === s).length
  }));
  const maxStage = Math.max(...stageCounts.map(s => s.count), 1);

  // Leaderboard
  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }
  function SortIcon({ k }) {
    if (sortKey !== k) return <ChevronsUpDown className="w-3 h-3 text-slate-600" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-violet-400" /> : <ChevronDown className="w-3 h-3 text-violet-400" />;
  }
  const leaderboard = [...latestRows]
    .filter(r => filterTerritory === 'All' || r.territory_name === filterTerritory)
    .sort((a, b) => {
      const av = a[sortKey] ?? 0; const bv = b[sortKey] ?? 0;
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  // Sales cycle intelligence
  const sortedByCycle = [...latestRows].sort((a, b) => (a.sales_cycle_days_avg || 99) - (b.sales_cycle_days_avg || 99));
  const fastest3 = sortedByCycle.slice(0, 2);
  const slowest  = sortedByCycle.slice(-1);
  const highOppLowRev = territories.filter(t => (t.opportunity_score || 0) >= 70 && !latestByTerritory[t.territory_name]);

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
      <div className="text-slate-400 text-sm animate-pulse">Loading expansion revenue data…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080f1e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-6 rounded-full bg-violet-500" />
              <h1 className="text-2xl font-black text-white">Expansion Revenue Analytics</h1>
            </div>
            <p className="text-slate-400 text-sm ml-5">Revenue performance tied to expansion territories · financial growth intelligence</p>
          </div>
          <select value={filterTerritory} onChange={e => setFilterTerritory(e.target.value)}
            className="bg-[#0f1729] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
            {territoryNames.map(n => <option key={n}>{n}</option>)}
          </select>
        </div>

        {/* SECTION 1 — KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPI label="Total Expansion MRR" value={fmt(totalMRR)} icon={DollarSign} color="text-violet-400" />
          <KPI label="New Clients" value={newClientsThisMonth} sub="latest month" icon={Users} color="text-emerald-400" />
          <KPI label="Fastest Scaling" value={fastestScaling?.territory_name?.split(' ').slice(0,2).join(' ') || '—'} sub={fastestScaling ? `${fastestScaling.sales_cycle_days_avg}d avg cycle` : ''} icon={Star} color="text-amber-400" />
          <KPI label="Avg Sales Cycle" value={`${avgSalesCycle}d`} icon={Clock} color="text-blue-400" />
          <KPI label="Mature Territories" value={matureCount} sub="at full capacity" icon={TrendingUp} color="text-teal-400" />
        </div>

        {/* SECTION 2 — Multi-line Growth Chart */}
        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-300 mb-5">Territory Cumulative MRR Growth · Last 4 Months</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 11 }} />
              {uniqTerritories.map((name, i) => (
                <Line key={name} type="monotone" dataKey={name} stroke={getColor(name, i)}
                  strokeWidth={2.5} dot={{ r: 4, fill: getColor(name, i), strokeWidth: 0 }}
                  activeDot={{ r: 6 }} animationDuration={800} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SECTION 3 — Stage Distribution */}
        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-300 mb-5">Expansion Stage Distribution</h2>
          <div className="space-y-4">
            {stageCounts.map(({ stage, count }) => {
              const cfg = STAGE_CONFIG[stage];
              const pct = latestRows.length ? Math.round((count / latestRows.length) * 100) : 0;
              return (
                <div key={stage} className="flex items-center gap-4">
                  <div className="w-24 flex-shrink-0 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
                    <span className="text-xs font-semibold" style={{ color: cfg.dot }}>{cfg.label}</span>
                  </div>
                  <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.round((count / maxStage) * 100)}%`, background: cfg.dot + 'cc' }} />
                  </div>
                  <div className="flex items-center gap-2 w-16 flex-shrink-0 text-right">
                    <span className="text-sm font-black" style={{ color: cfg.dot }}>{count}</span>
                    <span className="text-[10px] text-slate-600">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Leaderboard */}
        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-300">Territory Revenue Leaderboard</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/60">
                <tr>
                  {[
                    { label: 'Territory', key: 'territory_name' },
                    { label: 'New MRR', key: 'new_mrr_generated' },
                    { label: 'Cumulative MRR', key: 'cumulative_mrr' },
                    { label: 'New Clients', key: 'new_clients_acquired' },
                    { label: 'Sales Cycle', key: 'sales_cycle_days_avg' },
                    { label: 'Stage', key: 'expansion_stage' },
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
                {leaderboard.map((row, i) => {
                  const color = getColor(row.territory_name, i);
                  return (
                    <tr key={row.id || i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                          <span className="text-sm font-medium text-white">{row.territory_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-emerald-400">{fmt(row.new_mrr_generated)}</td>
                      <td className="px-4 py-3 text-sm font-black text-violet-400">{fmt(row.cumulative_mrr)}</td>
                      <td className="px-4 py-3 text-sm font-bold text-blue-400">{row.new_clients_acquired || 0}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{row.sales_cycle_days_avg || 0}d</td>
                      <td className="px-4 py-3"><StageBadge stage={row.expansion_stage} /></td>
                    </tr>
                  );
                })}
                {leaderboard.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-slate-600 text-sm py-10">No revenue data available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 5 — Sales Cycle Intelligence */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4">Sales Cycle Intelligence</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fastest3.map((r, i) => {
              const color = getColor(r.territory_name, i);
              return (
                <div key={r.id || i} className="bg-[#0f1729] border border-emerald-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Fast Close</span>
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{r.territory_name}</p>
                  <p className="text-2xl font-black text-emerald-400 mb-1">{r.sales_cycle_days_avg}d</p>
                  <p className="text-[10px] text-slate-500 mb-3">avg sales cycle</p>
                  <p className="text-xs text-slate-400">Replicate this rep's outreach sequence across new territories to accelerate pipeline velocity.</p>
                </div>
              );
            })}
            {slowest.map((r, i) => {
              const color = getColor(r.territory_name, i);
              return (
                <div key={r.id || i} className="bg-[#0f1729] border border-amber-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Slow Adoption</span>
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{r.territory_name}</p>
                  <p className="text-2xl font-black text-amber-400 mb-1">{r.sales_cycle_days_avg}d</p>
                  <p className="text-[10px] text-slate-500 mb-3">avg sales cycle</p>
                  <p className="text-xs text-slate-400">Introduce ROI calculator and case study assets to accelerate client decision timelines.</p>
                </div>
              );
            })}
            {highOppLowRev.map((t, i) => {
              const color = getColor(t.territory_name, i);
              return (
                <div key={t.id || i} className="bg-[#0f1729] border border-rose-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">High Opp · No Revenue</span>
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{t.territory_name}</p>
                  <p className="text-2xl font-black text-rose-400 mb-1">{t.opportunity_score}/100</p>
                  <p className="text-[10px] text-slate-500 mb-3">opportunity score · no metrics yet</p>
                  <p className="text-xs text-slate-400">Territory has strong market signal but no revenue tracked — assign rep and begin execution immediately.</p>
                </div>
              );
            })}
            {fastest3.length === 0 && slowest.length === 0 && highOppLowRev.length === 0 && (
              <div className="col-span-3 text-center text-slate-600 text-sm py-8">Seed revenue data to see intelligence cards.</div>
            )}
          </div>
        </div>

        {/* SECTION 6 — ROI Insight Feed */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4">Expansion ROI Intelligence Feed</h2>
          <div className="space-y-3">
            {ROI_INSIGHTS.map((ins, i) => {
              const color = getColor(ins.territory, i);
              const urgBg    = ins.urgency === 'high' ? 'border-rose-800 bg-rose-950/20' : ins.urgency === 'medium' ? 'border-amber-800 bg-amber-950/10' : 'border-slate-700 bg-slate-900/30';
              const urgBadge = ins.urgency === 'high' ? 'bg-rose-900 text-rose-300' : ins.urgency === 'medium' ? 'bg-amber-900 text-amber-300' : 'bg-slate-800 text-slate-400';
              return (
                <div key={i} className={`border rounded-2xl p-4 flex items-start gap-4 ${urgBg}`}>
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-black" style={{ color }}>{ins.territory.split(' ').slice(0, 3).join(' ')}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${urgBadge}`}>{ins.urgency}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{ins.text}</p>
                    <p className="text-xs text-slate-500 italic">→ {ins.action}</p>
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