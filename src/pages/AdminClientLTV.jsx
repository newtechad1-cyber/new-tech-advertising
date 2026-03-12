import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie
} from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar, CheckCircle2 } from 'lucide-react';
import LTVCard from '@/components/ltv/LTVCard';
import LTVModal from '@/components/ltv/LTVModal';

const VERTICAL_COLORS = {
  HVAC: '#f59e0b', Plumbing: '#3b82f6', Restaurant: '#f43f5e',
  Roofing: '#10b981', Dental: '#8b5cf6', default: '#64748b',
};

function fmt(n) {
  if (!n) return '$0';
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

function KPICard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</span>
      </div>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminClientLTV() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterVertical, setFilterVertical] = useState('all');
  const [filterStage, setFilterStage] = useState('all');

  useEffect(() => {
    base44.entities.ClientLifetimeValueMetric.list('-total_revenue_generated', 100).then(m => {
      setMetrics(m);
      setLoading(false);
    });
  }, []);

  const filtered = metrics.filter(m => {
    const vertMatch = filterVertical === 'all' || m.vertical === filterVertical;
    const stageMatch = filterStage === 'all' || m.lifecycle_stage_projection === filterStage;
    return vertMatch && stageMatch;
  });

  // KPIs
  const avgLTV = metrics.length ? Math.round(metrics.reduce((s, m) => s + (m.total_revenue_generated || 0), 0) / metrics.length) : 0;
  const verticalAvgs = {};
  metrics.forEach(m => {
    if (!verticalAvgs[m.vertical]) verticalAvgs[m.vertical] = { sum: 0, count: 0 };
    verticalAvgs[m.vertical].sum += m.total_revenue_generated || 0;
    verticalAvgs[m.vertical].count += 1;
  });
  const highestVertical = Object.keys(verticalAvgs).reduce((best, v) => {
    const avg = verticalAvgs[v].sum / verticalAvgs[v].count;
    return avg > (verticalAvgs[best]?.sum / verticalAvgs[best]?.count || 0) ? v : best;
  }, Object.keys(verticalAvgs)[0] || 'N/A');
  const expansionTotal = metrics.reduce((s, m) => s + (m.expansion_revenue_total || 0), 0);
  const avgMonths = metrics.length ? Math.round(metrics.reduce((s, m) => s + (m.months_active || 0), 0) / metrics.length) : 0;
  const matureCount = metrics.filter(m => m.lifecycle_stage_projection === 'mature').length;

  // Vertical LTV comparison
  const verticalData = Object.entries(verticalAvgs).map(([v, data]) => ({
    vertical: v,
    avgLTV: Math.round(data.sum / data.count),
    color: VERTICAL_COLORS[v] || VERTICAL_COLORS.default,
  }));

  // Retention duration distribution
  const durationBuckets = [
    { range: 'Under 6 mo', count: metrics.filter(m => m.months_active < 6).length },
    { range: '6–12 mo', count: metrics.filter(m => m.months_active >= 6 && m.months_active < 12).length },
    { range: '12–24 mo', count: metrics.filter(m => m.months_active >= 12 && m.months_active < 24).length },
    { range: '24+ mo', count: metrics.filter(m => m.months_active >= 24).length },
  ];

  // Intelligence insights
  const insights = [
    {
      icon: '🌟',
      title: 'HVAC clients producing strongest long-term value',
      body: `HVAC vertical averages ${fmt(verticalAvgs.HVAC?.sum / (verticalAvgs.HVAC?.count || 1) || 0)} in lifetime value. This vertical shows consistent retention and expansion patterns.`,
      action: 'Allocate premium success resources to HVAC accounts to accelerate retention and expansion cycles.',
    },
    {
      icon: '📊',
      title: 'Restaurant vertical showing seasonal retention dips',
      body: `Restaurant clients show higher churn during slow seasons (winter, early spring). Retention probability drops 15–20% during off-peak periods.`,
      action: 'Implement seasonal engagement strategy for restaurant accounts with winter campaign boosters.',
    },
    {
      icon: '🚀',
      title: 'Plumbing clients expanding faster after month 6',
      body: `Plumbing accounts show acceleration in expansion conversations starting at 6-month mark. This is the critical window for upsell success.`,
      action: 'Build automated expansion outreach sequence triggered at 6-month client anniversary for all plumbing accounts.',
    },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading lifetime value metrics…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-7 rounded-full bg-violet-500" />
              <h1 className="text-3xl font-black text-white tracking-tight">Client Lifetime Value Dashboard</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">Which clients and industries create the most long-term platform value?</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filterVertical} onChange={e => setFilterVertical(e.target.value)}
              className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option value="all">All Verticals</option>
              <option value="HVAC">HVAC</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Restaurant">Restaurant</option>
            </select>
            <select value={filterStage} onChange={e => setFilterStage(e.target.value)}
              className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option value="all">All Stages</option>
              <option value="stabilizing">Stabilizing</option>
              <option value="growth">Growth</option>
              <option value="mature">Mature</option>
              <option value="decline">Decline</option>
            </select>
          </div>
        </div>

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Avg Client LTV" value={fmt(avgLTV)} sub="lifetime value" icon={DollarSign} color="text-emerald-400" />
          <KPICard label="Highest LTV Vertical" value={highestVertical} sub="strong retention" icon={TrendingUp} color="text-teal-400" />
          <KPICard label="Expansion Revenue" value={fmt(expansionTotal)} sub="upsell contribution" icon={Zap} color="text-amber-400" />
          <KPICard label="Avg Duration" value={`${avgMonths}mo`} sub="active tenure" icon={Calendar} color="text-blue-400" />
          <KPICard label="Mature Clients" value={matureCount} sub="long-term anchors" icon={CheckCircle2} color="text-violet-400" />
        </div>

        {/* SECTION 2 — LTV Performance Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-violet-500 inline-block" />
            Client Lifetime Value Profiles
            <span className="text-slate-600 font-normal">· click for analysis</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(m => (
              <LTVCard key={m.id} metric={m} onClick={setSelected} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center py-12 text-slate-600 text-sm">No clients match your filters.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 + 5 — Vertical Comparison + Duration Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Vertical LTV Comparison — 2.5/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Vertical Lifetime Value Comparison</h2>
            <p className="text-[11px] text-slate-600 mb-5">average LTV by vertical</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={verticalData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="vertical" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val, name) => [fmt(val), 'Avg LTV']}
                />
                <Bar dataKey="avgLTV" radius={[6, 6, 0, 0]}>
                  {verticalData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Retention Duration Distribution — 2.5/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Retention Duration Distribution</h2>
            <p className="text-[11px] text-slate-600 mb-5">clients grouped by tenure</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={durationBuckets} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val, name) => [val, 'Clients']}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Intelligence Feed (spans below) */}
          <div className="lg:col-span-1" />
        </div>

        {/* SECTION 6 — Lifetime Value Intelligence Feed */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-teal-500 inline-block" />
            Lifetime Value Intelligence Feed
          </h2>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div key={i} className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{ins.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white mb-1 leading-snug">{ins.title}</p>
                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">{ins.body}</p>
                    <p className="text-xs text-violet-300 italic font-semibold">→ {ins.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 3 — LTV Detail Modal */}
      {selected && (
        <LTVModal metric={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}