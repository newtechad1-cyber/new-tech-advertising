import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, DollarSign, BarChart2, Zap, AlertTriangle, Filter } from 'lucide-react';
import ScenarioCard from '@/components/founder-scenarios/ScenarioCard';
import ScenarioModal from '@/components/founder-scenarios/ScenarioModal';

const SCENARIO_COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6', '#ec4899'];

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

function buildProjectionLine(scenario, index) {
  const base  = scenario.projected_total_mrr_6_months || 0;
  const start = (scenario.projected_new_mrr_90_days || 0) * 0.3;
  return MONTHS.map((m, i) => {
    const progress = (i + 1) / MONTHS.length;
    const curve    = start + (base - start) * Math.pow(progress, 0.7);
    return { month: m, [scenario.scenario_name]: Math.round(curve) };
  });
}

function mergeChartData(scenarios) {
  const base = MONTHS.map(m => ({ month: m }));
  scenarios.forEach(s => {
    const line = buildProjectionLine(s);
    line.forEach((pt, i) => { base[i][s.scenario_name] = pt[s.scenario_name]; });
  });
  return base;
}

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

const STRATEGIC_INSIGHTS = [
  {
    icon: '💰',
    title: 'Pricing optimization showing highest margin lift',
    body: 'Premium Pricing Tier scenario projects the highest revenue-per-client ratio with relatively low execution risk. This lever is underutilized.',
    action: 'Pilot pricing increase on 5 new proposals this week and track close rate carefully.',
  },
  {
    icon: '🚀',
    title: 'HVAC expansion showing fastest early MRR growth',
    body: 'The Aggressive HVAC Midwest scenario projects the steepest 90-day MRR curve. Territory is primed — delay has compounding cost.',
    action: 'Allocate second rep to Midwest territory immediately and begin active outreach.',
  },
  {
    icon: '🤝',
    title: 'Partner channel: longer payoff, largest ceiling',
    body: 'Partner Channel Acceleration has a longer ramp but the highest 6-month total MRR projection. The ceiling is significantly above all other scenarios.',
    action: 'Begin partner agreement this week so ramp starts now — do not push to next quarter.',
  },
];

const IMPACT_DATA = [
  { lever: 'Pricing',   avg: 0 },
  { lever: 'Sales',     avg: 0 },
  { lever: 'Marketing', avg: 0 },
];

export default function AdminFounderScenarios() {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [filterVertical, setFilterVertical] = useState('all');

  useEffect(() => {
    base44.entities.FounderGrowthScenario.list('-projected_new_mrr_90_days', 50).then(s => {
      setScenarios(s);
      setLoading(false);
    });
  }, []);

  async function togglePriority(scenario) {
    const updated = await base44.entities.FounderGrowthScenario.update(scenario.id, { is_priority: !scenario.is_priority });
    setScenarios(prev => prev.map(s => s.id === updated.id ? updated : s));
  }

  const verticals = [...new Set(scenarios.map(s => s.focus_vertical).filter(Boolean))];
  const filtered  = filterVertical === 'all' ? scenarios : scenarios.filter(s => s.focus_vertical === filterVertical);

  // KPIs
  const highest90  = scenarios.reduce((m, s) => Math.max(m, s.projected_new_mrr_90_days || 0), 0);
  const highest6m  = scenarios.reduce((m, s) => Math.max(m, s.projected_total_mrr_6_months || 0), 0);
  const avgConf    = scenarios.length ? Math.round(scenarios.reduce((s, r) => s + (r.confidence_score || 0), 0) / scenarios.length) : 0;
  const maxConf    = scenarios.reduce((m, s) => Math.max(m, s.confidence_score || 0), 0);
  const minConf    = scenarios.reduce((m, s) => Math.min(m, s.confidence_score || 100), 100);
  const volatility = scenarios.length >= 2 ? maxConf - minConf : 0;

  // Chart data
  const chartData = mergeChartData(filtered.slice(0, 5));

  // Impact bars
  const impactData = [
    { lever: 'Pricing',   avg: Math.round(scenarios.reduce((s, r) => s + Math.abs(r.pricing_adjustment_percent || 0), 0) / (scenarios.length || 1)) },
    { lever: 'Sales',     avg: Math.round(scenarios.reduce((s, r) => s + Math.abs(r.sales_velocity_change_percent || 0), 0) / (scenarios.length || 1)) },
    { lever: 'Marketing', avg: Math.round(scenarios.reduce((s, r) => s + Math.abs(r.marketing_intensity_change_percent || 0), 0) / (scenarios.length || 1)) },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading growth scenarios…</div>
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
              <h1 className="text-3xl font-black text-white tracking-tight">Scenario Simulator</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">If we push here instead of there — what happens?</p>
          </div>
          {verticals.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select value={filterVertical} onChange={e => setFilterVertical(e.target.value)}
                className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="all">All Verticals</option>
                {verticals.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* SECTION 1 — KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Scenarios Modeled"  value={scenarios.length}      sub="active"           icon={BarChart2}    color="text-violet-400" />
          <KPICard label="Best 90-Day MRR"    value={fmt(highest90)}        sub="top scenario"     icon={TrendingUp}   color="text-emerald-400" />
          <KPICard label="Best 6-Month MRR"   value={fmt(highest6m)}        sub="ceiling"          icon={DollarSign}   color="text-teal-400" />
          <KPICard label="Avg Confidence"     value={`${avgConf}%`}         sub="across scenarios" icon={Zap}          color="text-amber-400" />
          <KPICard label="Impact Volatility"  value={`±${volatility}`}      sub="confidence spread" icon={AlertTriangle} color="text-rose-400" />
        </div>

        {/* SECTION 2 — Scenario Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-violet-500 inline-block" />
            Growth Scenarios
            <span className="text-slate-600 font-normal">· click to explore</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(s => (
              <ScenarioCard key={s.id} scenario={s} onClick={setSelected} onTogglePriority={togglePriority} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center py-12 text-slate-600 text-sm">No scenarios match this filter.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 — Revenue Projection Chart */}
        <div className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-200 mb-1">Revenue Projection Comparison</h2>
          <p className="text-[11px] text-slate-600 mb-5">6-month projected total MRR · all active scenarios</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                cursor={{ stroke: '#334155' }}
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(val, name) => [fmt(val), name]}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 12 }} />
              {filtered.slice(0, 5).map((s, i) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.scenario_name}
                  stroke={SCENARIO_COLORS[i % SCENARIO_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: SCENARIO_COLORS[i % SCENARIO_COLORS.length] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SECTION 5 + 6 — Impact Distribution + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Impact distribution — 2/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Scenario Lever Impact</h2>
            <p className="text-[11px] text-slate-600 mb-5">Average absolute change across all scenarios</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={impactData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="lever" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={v => [`${v}%`, 'Avg change']}
                />
                <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                  {impactData.map((_, i) => (
                    <Cell key={i} fill={['#8b5cf6', '#10b981', '#f59e0b'][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Strategic Insights — 3/5 */}
          <div className="lg:col-span-3">
            <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-amber-500 inline-block" />
              Strategic Scenario Insights
            </h2>
            <div className="space-y-3">
              {STRATEGIC_INSIGHTS.map((ins, i) => (
                <div key={i} className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">{ins.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white mb-1 leading-snug">{ins.title}</p>
                      <p className="text-xs text-slate-400 mb-2 leading-relaxed">{ins.body}</p>
                      <p className="text-xs text-amber-300 italic font-semibold">→ {ins.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 3 — Scenario Detail Modal */}
      {selected && (
        <ScenarioModal
          scenario={selected}
          onClose={() => setSelected(null)}
          onTogglePriority={s => { togglePriority(s); setSelected(prev => ({ ...prev, is_priority: !prev.is_priority })); }}
        />
      )}
    </div>
  );
}