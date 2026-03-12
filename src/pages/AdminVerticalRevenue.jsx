import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, Minus, DollarSign, AlertTriangle,
  Star, BarChart2, Filter, Flag
} from 'lucide-react';

const VERTICAL_COLORS = {
  HVAC: '#6366f1',
  Restaurant: '#f59e0b',
  Plumbing: '#10b981',
};

const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

function fmt(n) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="text-white font-bold">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminVerticalRevenue() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterVertical, setFilterVertical] = useState('All');

  useEffect(() => {
    base44.entities.VerticalRevenueMetric.list('-month', 100).then(d => {
      setMetrics(d);
      setLoading(false);
    });
  }, []);

  const verticals = ['All', ...Object.keys(VERTICAL_COLORS)];

  // Latest month per vertical
  const latestByVertical = {};
  Object.keys(VERTICAL_COLORS).forEach(v => {
    const rows = metrics.filter(m => m.vertical === v).sort((a, b) => b.month?.localeCompare(a.month));
    if (rows.length) latestByVertical[v] = rows[0];
  });

  // KPIs
  const totalMRR = Object.values(latestByVertical).reduce((s, r) => s + (r.total_mrr || 0), 0);
  const netNewMRR = Object.values(latestByVertical).reduce((s, r) => s + (r.new_mrr || 0) + (r.expansion_mrr || 0) - (r.churned_mrr || 0), 0);
  const highestGrowth = Object.entries(latestByVertical).sort((a, b) => (b[1].new_mrr + b[1].expansion_mrr) - (a[1].new_mrr + a[1].expansion_mrr))[0];
  const highestACV = Object.entries(latestByVertical).sort((a, b) => b[1].average_client_value - a[1].average_client_value)[0];
  const churnRisk = Object.entries(latestByVertical).sort((a, b) => b[1].churned_mrr - a[1].churned_mrr)[0];

  // Trend chart data — pivot by month label
  const trendData = MONTHS.map((label, i) => {
    const row = { month: label };
    Object.keys(VERTICAL_COLORS).forEach(v => {
      const all = metrics.filter(m => m.vertical === v).sort((a, b) => a.month?.localeCompare(b.month));
      row[v] = all[i]?.total_mrr || 0;
    });
    return row;
  });

  // Expansion vs churn chart
  const expandChurnData = Object.keys(VERTICAL_COLORS).map(v => ({
    vertical: v,
    Expansion: latestByVertical[v]?.expansion_mrr || 0,
    Churn: latestByVertical[v]?.churned_mrr || 0,
  }));

  // ACV grid — filtered
  const acvRows = Object.entries(latestByVertical)
    .filter(([v]) => filterVertical === 'All' || v === filterVertical)
    .map(([v, data]) => {
      const prevRows = metrics.filter(m => m.vertical === v).sort((a, b) => b.month?.localeCompare(a.month));
      const prev = prevRows[1];
      const trend = !prev ? 'stable' : data.average_client_value > prev.average_client_value ? 'rising' : data.average_client_value < prev.average_client_value ? 'declining' : 'stable';
      return { vertical: v, ...data, trend };
    });

  // Opportunity flags
  const flags = [];
  Object.entries(latestByVertical).forEach(([v, d]) => {
    if (d.expansion_mrr > 2000 && d.new_clients < 3) flags.push({ vertical: v, insight: 'High expansion MRR but low new client acquisition — pricing strategy may be under-optimized.', type: 'opportunity' });
    if (d.churned_mrr > d.new_mrr) flags.push({ vertical: v, insight: 'Churned MRR exceeds new MRR — this vertical requires immediate retention intervention.', type: 'risk' });
    if (d.average_client_value > 1200) flags.push({ vertical: v, insight: 'Premium ACV detected — candidates for authority or enterprise upsell packages.', type: 'premium' });
  });

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
      <div className="text-slate-400 text-sm animate-pulse">Loading revenue data…</div>
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
              <h1 className="text-2xl font-black text-white">Vertical Revenue Analytics</h1>
            </div>
            <p className="text-slate-400 text-sm ml-5">Financial performance visibility by industry vertical · last 6 months</p>
          </div>
          <select
            value={filterVertical}
            onChange={e => setFilterVertical(e.target.value)}
            className="bg-[#0f1729] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {verticals.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>

        {/* SECTION 1 — KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPI label="Total Vertical MRR" value={fmt(totalMRR)} icon={DollarSign} color="text-violet-400" />
          <KPI label="Net New MRR" value={netNewMRR >= 0 ? `+${fmt(netNewMRR)}` : fmt(netNewMRR)} icon={TrendingUp} color={netNewMRR >= 0 ? 'text-emerald-400' : 'text-red-400'} />
          <KPI label="Highest Growth" value={highestGrowth?.[0] || '—'} sub="by new + expansion MRR" icon={Star} color="text-amber-400" />
          <KPI label="Largest ACV" value={highestACV ? `${highestACV[0]} · ${fmt(highestACV[1].average_client_value)}` : '—'} icon={BarChart2} color="text-blue-400" />
          <KPI label="Churn Risk" value={churnRisk?.[0] || '—'} sub={churnRisk ? `$${churnRisk[1].churned_mrr?.toLocaleString()} churned` : ''} icon={AlertTriangle} color="text-rose-400" />
        </div>

        {/* SECTION 2 — MRR Trend */}
        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-300 mb-5">Total MRR Trend by Vertical</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              {Object.entries(VERTICAL_COLORS).map(([v, c]) => (
                <Line key={v} type="monotone" dataKey={v} stroke={c} strokeWidth={2.5}
                  dot={{ r: 4, fill: c, strokeWidth: 0 }} activeDot={{ r: 6 }}
                  animationDuration={800} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SECTION 3 — Expansion vs Churn */}
        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-300 mb-5">Expansion vs Churn MRR · Latest Month</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={expandChurnData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="vertical" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <Bar dataKey="Expansion" fill="#10b981" radius={[6, 6, 0, 0]} animationDuration={700} />
              <Bar dataKey="Churn" fill="#f43f5e" radius={[6, 6, 0, 0]} animationDuration={900} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SECTION 4 — ACV Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4">Average Client Value · Vertical Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {acvRows.map(row => {
              const TrendIcon = row.trend === 'rising' ? TrendingUp : row.trend === 'declining' ? TrendingDown : Minus;
              const trendColor = row.trend === 'rising' ? 'text-emerald-400' : row.trend === 'declining' ? 'text-rose-400' : 'text-slate-400';
              const color = VERTICAL_COLORS[row.vertical] || '#94a3b8';
              return (
                <div key={row.vertical} className="bg-[#0f1729] border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-sm font-bold text-white">{row.vertical}</span>
                    </div>
                    <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                  </div>
                  <p className="text-3xl font-black text-white mb-1">{fmt(row.average_client_value || 0)}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-4">Avg Client Value</p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <p className="text-emerald-400 font-bold">+{row.new_clients || 0}</p>
                      <p className="text-[10px] text-slate-500">New Clients</p>
                    </div>
                    <div>
                      <p className="text-rose-400 font-bold">-{row.lost_clients || 0}</p>
                      <p className="text-[10px] text-slate-500">Lost Clients</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5 — Opportunity Flags */}
        {flags.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-300 mb-4">Revenue Opportunity Flags</h2>
            <div className="space-y-3">
              {flags.map((f, i) => {
                const bgMap = { risk: 'border-rose-800 bg-rose-950/30', opportunity: 'border-amber-800 bg-amber-950/20', premium: 'border-emerald-800 bg-emerald-950/20' };
                const iconColor = { risk: 'text-rose-400', opportunity: 'text-amber-400', premium: 'text-emerald-400' };
                return (
                  <div key={i} className={`border rounded-2xl p-4 flex items-start gap-4 ${bgMap[f.type]}`}>
                    <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor[f.type]}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-white" style={{ color: VERTICAL_COLORS[f.vertical] }}>{f.vertical}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${f.type === 'risk' ? 'bg-rose-900 text-rose-300' : f.type === 'premium' ? 'bg-emerald-900 text-emerald-300' : 'bg-amber-900 text-amber-300'}`}>{f.type}</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{f.insight}</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[11px] text-slate-300 font-semibold transition-colors flex-shrink-0">
                      <Flag className="w-3 h-3" /> Flag for Review
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}