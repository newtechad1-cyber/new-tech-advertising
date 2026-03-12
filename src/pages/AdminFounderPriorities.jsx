import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  AlertTriangle, TrendingUp, DollarSign, CheckCircle2,
  BarChart2, Zap, ChevronRight, Circle, Flag, Filter
} from 'lucide-react';

const TYPE_CONFIG = {
  revenue_risk:          { label: 'Revenue Risk',      color: 'text-rose-400',    border: 'border-rose-800',   bg: 'bg-rose-950/30',   bar: '#f43f5e', dot: '#f43f5e' },
  expansion_opportunity: { label: 'Expansion',         color: 'text-violet-400',  border: 'border-violet-800', bg: 'bg-violet-950/30', bar: '#8b5cf6', dot: '#8b5cf6' },
  sales_acceleration:    { label: 'Sales Acceleration',color: 'text-emerald-400', border: 'border-emerald-800',bg: 'bg-emerald-950/30',bar: '#10b981', dot: '#10b981' },
  pricing_shift:         { label: 'Pricing Shift',     color: 'text-amber-400',   border: 'border-amber-800',  bg: 'bg-amber-950/30',  bar: '#f59e0b', dot: '#f59e0b' },
  vertical_growth:       { label: 'Vertical Growth',   color: 'text-blue-400',    border: 'border-blue-800',   bg: 'bg-blue-950/30',   bar: '#3b82f6', dot: '#3b82f6' },
  retention_alert:       { label: 'Retention Alert',   color: 'text-orange-400',  border: 'border-orange-800', bg: 'bg-orange-950/30', bar: '#f97316', dot: '#f97316' },
};

const URGENCY_THRESHOLDS = [
  { min: 80, label: 'Critical',  color: 'text-rose-400',   barColor: '#f43f5e' },
  { min: 60, label: 'High',      color: 'text-amber-400',  barColor: '#f59e0b' },
  { min: 40, label: 'Medium',    color: 'text-blue-400',   barColor: '#3b82f6' },
  { min: 0,  label: 'Low',       color: 'text-slate-500',  barColor: '#64748b' },
];

function getUrgencyConfig(score) {
  return URGENCY_THRESHOLDS.find(t => score >= t.min) || URGENCY_THRESHOLDS[3];
}

function fmt(n) {
  if (!n) return '$0';
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

const STRATEGIC_SUGGESTIONS = [
  {
    icon: '🚀',
    title: 'Expansion signals clustering',
    body: 'Multiple territories showing simultaneous traction — this is a compounding moment. Concentrate rep allocation before competitors notice.',
    action: 'Schedule territory acceleration sprint this week',
    types: ['expansion_opportunity', 'vertical_growth'],
    urgency: 'high',
  },
  {
    icon: '💰',
    title: 'Pricing signals trending upward',
    body: 'Premium-tier pricing resistance is dropping across HVAC and Plumbing verticals. Window to increase average contract value is open now.',
    action: 'Pilot 15% price increase on new HVAC proposals immediately',
    types: ['pricing_shift'],
    urgency: 'medium',
  },
  {
    icon: '⚠️',
    title: 'Retention risk cluster emerging',
    body: 'Restaurant vertical engagement dip signals early churn risk. Intervene before it compounds into revenue loss.',
    action: 'Assign CSM to proactive outreach for restaurant accounts this week',
    types: ['retention_alert', 'revenue_risk'],
    urgency: 'critical',
  },
];

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

function SignalCard({ signal, onUpdate }) {
  const typeCfg = TYPE_CONFIG[signal.signal_type] || TYPE_CONFIG.expansion_opportunity;
  const urgCfg  = getUrgencyConfig(signal.urgency_score || 0);
  const [acting, setActing] = useState(false);

  async function setStatus(status) {
    setActing(true);
    const updated = await base44.entities.FounderPrioritySignal.update(signal.id, { status });
    onUpdate(updated);
    setActing(false);
  }

  return (
    <div className={`border rounded-2xl p-5 transition-all ${typeCfg.border} ${typeCfg.bg}`}>
      <div className="flex items-start gap-3">
        <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: typeCfg.dot }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${typeCfg.color} ${typeCfg.border}`} style={{ background: typeCfg.dot + '20' }}>
              {typeCfg.label}
            </span>
            {signal.related_vertical && (
              <span className="text-[10px] text-slate-500 font-semibold">{signal.related_vertical}</span>
            )}
            <span className={`text-[10px] font-bold ml-auto flex-shrink-0 ${urgCfg.color}`}>
              {urgCfg.label} · {signal.urgency_score}/100
            </span>
          </div>

          <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">{signal.signal_title}</h3>

          {signal.recommended_action && (
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">→ {signal.recommended_action}</p>
          )}

          {/* Urgency bar */}
          <div className="mb-3">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${signal.urgency_score || 0}%`, background: urgCfg.barColor }} />
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-black text-emerald-400">{fmt(signal.projected_revenue_impact)} impact</span>
            <div className="flex items-center gap-2">
              {signal.status === 'new' && (
                <button disabled={acting} onClick={() => setStatus('acknowledged')}
                  className="text-[11px] px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 font-semibold transition-colors">
                  Acknowledge
                </button>
              )}
              {signal.status !== 'actioned' && (
                <button disabled={acting} onClick={() => setStatus('actioned')}
                  className="text-[11px] px-3 py-1 bg-violet-700 hover:bg-violet-600 rounded-lg text-white font-semibold transition-colors flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Actioned
                </button>
              )}
              {signal.status === 'actioned' && (
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Actioned
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminFounderPriorities() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    base44.entities.FounderPrioritySignal.list('-urgency_score', 100).then(s => {
      setSignals(s);
      setLoading(false);
    });
  }, []);

  function handleUpdate(updated) {
    setSignals(prev => prev.map(s => s.id === updated.id ? updated : s));
  }

  const filtered = filterType === 'all' ? signals : signals.filter(s => s.signal_type === filterType);
  const sorted   = [...filtered].sort((a, b) => (b.urgency_score || 0) - (a.urgency_score || 0));

  // KPIs
  const highUrgency  = signals.filter(s => (s.urgency_score || 0) >= 70).length;
  const revenueOpps  = signals.filter(s => ['expansion_opportunity', 'sales_acceleration', 'pricing_shift', 'vertical_growth'].includes(s.signal_type)).length;
  const riskSignals  = signals.filter(s => ['revenue_risk', 'retention_alert'].includes(s.signal_type)).length;
  const actioned     = signals.filter(s => s.status === 'actioned').length;
  const avgImpact    = signals.length ? Math.round(signals.reduce((s, r) => s + (r.urgency_score || 0), 0) / signals.length) : 0;

  // Bar chart data
  const chartData = Object.entries(TYPE_CONFIG).map(([key, cfg]) => ({
    name: cfg.label.split(' ')[0],
    count: signals.filter(s => s.signal_type === key).length,
    fill: cfg.bar,
  }));

  // Timeline: last 10 by created_date
  const timeline = [...signals]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 8);

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading priority signals…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-7 rounded-full bg-rose-500" />
              <h1 className="text-3xl font-black text-white tracking-tight">Priority Intelligence</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">Ranked strategic signals · what matters most right now</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option value="all">All Signal Types</option>
              {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="High Urgency"      value={highUrgency}  sub="score ≥ 70"      icon={AlertTriangle} color="text-rose-400"    />
          <KPICard label="Revenue Opps"      value={revenueOpps}  sub="growth signals"  icon={TrendingUp}    color="text-emerald-400" />
          <KPICard label="Risk Signals"      value={riskSignals}  sub="need attention"  icon={Zap}           color="text-amber-400"   />
          <KPICard label="Actioned"          value={actioned}     sub="this session"    icon={CheckCircle2}  color="text-blue-400"    />
          <KPICard label="Avg Urgency"       value={`${avgImpact}`} sub="/ 100"         icon={BarChart2}     color="text-violet-400"  />
        </div>

        {/* SECTION 2 — Ranked Priority Feed */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-rose-500 inline-block" />
            Ranked Priority Feed
            <span className="text-slate-600 font-normal">· sorted by urgency</span>
          </h2>
          <div className="space-y-3">
            {sorted.map(s => (
              <SignalCard key={s.id} signal={s} onUpdate={handleUpdate} />
            ))}
            {sorted.length === 0 && (
              <div className="text-center py-12 text-slate-600 text-sm">No signals match this filter.</div>
            )}
          </div>
        </div>

        {/* SECTION 3 — Type Distribution Chart */}
        <div className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-300 mb-5">Signal Type Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: '#1e293b' }}
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SECTION 4 — Strategic Action Suggestions */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-amber-500 inline-block" />
            Strategic Action Suggestions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STRATEGIC_SUGGESTIONS.map((s, i) => {
              const urgBorder = s.urgency === 'critical' ? 'border-rose-800' : s.urgency === 'high' ? 'border-amber-800' : 'border-slate-700';
              const urgBg     = s.urgency === 'critical' ? 'bg-rose-950/20' : s.urgency === 'high' ? 'bg-amber-950/10' : 'bg-slate-900/30';
              const urgText   = s.urgency === 'critical' ? 'text-rose-400' : s.urgency === 'high' ? 'text-amber-400' : 'text-slate-400';
              return (
                <div key={i} className={`border rounded-2xl p-5 ${urgBorder} ${urgBg}`}>
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <p className="text-sm font-bold text-white mb-2 leading-snug">{s.title}</p>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">{s.body}</p>
                  <p className={`text-xs font-semibold italic ${urgText}`}>→ {s.action}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5 — Priority Timeline Strip */}
        <div className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-300 mb-5">Signal Timeline</h2>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-800" />
            <div className="space-y-4">
              {timeline.map((s, i) => {
                const typeCfg = TYPE_CONFIG[s.signal_type] || TYPE_CONFIG.expansion_opportunity;
                const statusColor = s.status === 'actioned' ? 'text-emerald-400' : s.status === 'acknowledged' ? 'text-blue-400' : 'text-slate-500';
                const statusLabel = s.status === 'actioned' ? 'Actioned' : s.status === 'acknowledged' ? 'Acknowledged' : 'New';
                return (
                  <div key={s.id || i} className="flex items-start gap-4 pl-8 relative">
                    <div className="absolute left-1.5 w-3 h-3 rounded-full border-2 border-slate-900 flex-shrink-0"
                      style={{ background: typeCfg.dot }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-white truncate">{s.signal_title}</span>
                        <span className={`text-[10px] font-bold flex-shrink-0 ${statusColor}`}>{statusLabel}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] ${typeCfg.color} font-semibold`}>{typeCfg.label}</span>
                        {s.created_date && (
                          <span className="text-[10px] text-slate-600">
                            {new Date(s.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-400 flex-shrink-0">{fmt(s.projected_revenue_impact)}</span>
                  </div>
                );
              })}
              {timeline.length === 0 && (
                <p className="text-slate-600 text-sm text-center py-4">No signals yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}