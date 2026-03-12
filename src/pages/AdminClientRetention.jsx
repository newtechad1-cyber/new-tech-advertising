import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { AlertTriangle, DollarSign, TrendingDown, CheckCircle2, Clock, AlertOctagon } from 'lucide-react';
import RetentionCard from '@/components/retention/RetentionCard';
import RetentionModal from '@/components/retention/RetentionModal';

const RISK_REASON_COLORS = {
  low_content_activity: '#3b82f6',
  slow_approvals: '#f59e0b',
  low_reporting_engagement: '#ec4899',
  performance_concern: '#ef4444',
  pricing_objection: '#8b5cf6',
  competitor_pressure: '#f43f5e',
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

export default function AdminClientRetention() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');

  useEffect(() => {
    base44.entities.RetentionIntervention.list('-projected_mrr_at_risk', 100).then(i => {
      setInterventions(i);
      setLoading(false);
    });
  }, []);

  async function updateStatus(id, newStatus) {
    const updated = await base44.entities.RetentionIntervention.update(id, { intervention_status: newStatus });
    setInterventions(prev => prev.map(i => i.id === updated.id ? updated : i));
  }

  const filtered = filterSeverity === 'all' ? interventions : interventions.filter(i => i.risk_severity === filterSeverity);

  // KPIs
  const totalInRisk = interventions.length;
  const totalMRRAtRisk = interventions.reduce((s, i) => s + (i.projected_mrr_at_risk || 0), 0);
  const critical = interventions.filter(i => i.risk_severity === 'critical').length;
  const resolved = interventions.filter(i => i.intervention_status === 'resolved').length;
  const avgSeverity = interventions.length
    ? Math.round(interventions.reduce((s, i) => {
        const val = { watch: 1, moderate: 2, high: 3, critical: 4 }[i.risk_severity] || 2;
        return s + val;
      }, 0) / interventions.length * 25)
    : 0;

  // Risk reason distribution
  const reasonCounts = [
    { reason: 'Content Activity', count: interventions.filter(i => i.risk_reason === 'low_content_activity').length, color: RISK_REASON_COLORS.low_content_activity },
    { reason: 'Approvals', count: interventions.filter(i => i.risk_reason === 'slow_approvals').length, color: RISK_REASON_COLORS.slow_approvals },
    { reason: 'Reporting', count: interventions.filter(i => i.risk_reason === 'low_reporting_engagement').length, color: RISK_REASON_COLORS.low_reporting_engagement },
    { reason: 'Pricing', count: interventions.filter(i => i.risk_reason === 'pricing_objection').length, color: RISK_REASON_COLORS.pricing_objection },
    { reason: 'Performance', count: interventions.filter(i => i.risk_reason === 'performance_concern').length, color: RISK_REASON_COLORS.performance_concern },
    { reason: 'Competition', count: interventions.filter(i => i.risk_reason === 'competitor_pressure').length, color: RISK_REASON_COLORS.competitor_pressure },
  ];

  // Recovery insights
  const insights = [
    {
      icon: '📝',
      title: 'Content Activity drives the most interventions',
      body: `${reasonCounts[0].count} accounts are at risk due to low content activity. Early content boost campaigns may prevent escalation.`,
      action: 'Launch targeted content acceleration for at-risk accounts with custom vertical angles.',
    },
    {
      icon: '💬',
      title: 'Approval delays correlating with perceived inactivity',
      body: 'Slow approval cycles are extending project timelines and creating engagement gaps. Communication clarity is critical.',
      action: 'Schedule approval workflow optimization call with top 3 approval-delayed accounts.',
    },
    {
      icon: '💰',
      title: 'Pricing objections represent largest MRR protection opportunity',
      body: `${interventions.filter(i => i.risk_reason === 'pricing_objection').length} accounts have pricing concerns. ROI clarity can move most negotiations.`,
      action: 'Prepare customized ROI reports showing content impact for each pricing-concerned client.',
    },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading retention interventions…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-7 rounded-full bg-rose-500" />
              <h1 className="text-3xl font-black text-white tracking-tight">Retention Risk Dashboard</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">Which accounts are at risk and what exact action is being taken?</p>
          </div>
          {interventions.length > 0 && (
            <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}
              className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500">
              <option value="all">All Severities</option>
              <option value="watch">Watch</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          )}
        </div>

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Clients in Risk" value={totalInRisk} sub="active interventions" icon={AlertTriangle} color="text-rose-400" />
          <KPICard label="Total MRR at Risk" value={fmt(totalMRRAtRisk)} sub="protection priority" icon={DollarSign} color="text-orange-400" />
          <KPICard label="Critical Accounts" value={critical} sub="immediate action" icon={AlertOctagon} color="text-red-400" />
          <KPICard label="Resolved This Month" value={resolved} sub="successful recoveries" icon={CheckCircle2} color="text-emerald-400" />
          <KPICard label="Avg Risk Level" value={`${avgSeverity}%`} sub="aggregate severity" icon={TrendingDown} color="text-amber-400" />
        </div>

        {/* SECTION 2 — Intervention Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-rose-500 inline-block" />
            Active Interventions
            <span className="text-slate-600 font-normal">· click to update status</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(i => (
              <RetentionCard key={i.id} intervention={i} onClick={setSelected} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center py-12 text-slate-600 text-sm">No interventions at this severity level.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 + 5 — Risk Distribution + Recovery Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Risk Distribution — 2/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Risk Reason Distribution</h2>
            <p className="text-[11px] text-slate-600 mb-5">interventions by risk category</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={reasonCounts} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="reason" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val, name) => [val, 'Interventions']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {reasonCounts.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recovery Insights — 3/5 */}
          <div className="lg:col-span-3">
            <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-emerald-500 inline-block" />
              Recovery Opportunity Panel
            </h2>
            <div className="space-y-3">
              {insights.map((ins, i) => (
                <div key={i} className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{ins.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white mb-1 leading-snug">{ins.title}</p>
                      <p className="text-xs text-slate-400 mb-2 leading-relaxed">{ins.body}</p>
                      <p className="text-xs text-emerald-300 italic font-semibold">→ {ins.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SECTION 6 — Timeline Strip (simplified) */}
        <div className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            Recent Intervention Activity
          </h2>
          <div className="space-y-2">
            {interventions.slice(0, 5).map((i, idx) => (
              <div key={i.id || idx} className="flex items-center gap-3 py-2 border-b border-slate-800/40 last:border-0">
                <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-300 truncate">
                    {i.client_name} · {i.risk_reason === 'low_content_activity' ? '📝' : i.risk_reason === 'slow_approvals' ? '⏱️' : i.risk_reason === 'low_reporting_engagement' ? '📊' : i.risk_reason === 'performance_concern' ? '📉' : i.risk_reason === 'pricing_objection' ? '💰' : '🎯'} {i.intervention_status}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                  i.risk_severity === 'critical' ? 'text-rose-400 bg-rose-600/20' :
                  i.risk_severity === 'high' ? 'text-orange-400 bg-orange-600/20' :
                  i.risk_severity === 'moderate' ? 'text-amber-400 bg-amber-600/20' :
                  'text-slate-400 bg-slate-600/20'
                }`}>
                  {fmt(i.projected_mrr_at_risk)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 3 — Intervention Detail Modal */}
      {selected && (
        <RetentionModal
          intervention={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={updateStatus}
        />
      )}
    </div>
  );
}