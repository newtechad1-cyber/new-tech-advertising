import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { AlertCircle, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import SLACard from '@/components/operations/SLACard';
import SLAModal from '@/components/operations/SLAModal';

const DELAY_REASON_COLORS = {
  capacity: '#3b82f6',
  client_delay: '#f59e0b',
  revision_cycle: '#8b5cf6',
  priority_shift: '#ec4899',
  technical_issue: '#ef4444',
};

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

export default function AdminOperationsSLA() {
  const [slas, setSLAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    base44.entities.FulfillmentSLAMetric.list('-impact_score', 100).then(s => {
      setSLAs(s);
      setLoading(false);
    });
  }, []);

  const filtered = slas.filter(s => {
    const statusMatch = filterStatus === 'all' || s.sla_status === filterStatus;
    return statusMatch;
  });

  // KPIs
  const onTrack = slas.filter(s => s.sla_status === 'on_track').length;
  const atRisk = slas.filter(s => s.sla_status === 'at_risk').length;
  const overdue = slas.filter(s => s.sla_status === 'overdue').length;
  const delivered = slas.filter(s => s.sla_status === 'delivered').length;
  const total = slas.length;
  const complianceRate = total > 0 ? Math.round(((onTrack + delivered) / total) * 100) : 0;
  
  const overdueOnes = slas.filter(s => s.sla_status === 'overdue');
  const totalDelayDays = overdueOnes.reduce((sum, s) => {
    const days = Math.ceil((new Date() - new Date(s.sla_due_date)) / (1000 * 60 * 60 * 24));
    return sum + Math.max(0, days);
  }, 0);
  const avgDelay = overdueOnes.length > 0 ? Math.round(totalDelayDays / overdueOnes.length) : 0;

  // Delay reason distribution
  const delayReasons = [
    { reason: 'Capacity', count: slas.filter(s => s.delay_reason === 'capacity').length, color: DELAY_REASON_COLORS.capacity },
    { reason: 'Client Delay', count: slas.filter(s => s.delay_reason === 'client_delay').length, color: DELAY_REASON_COLORS.client_delay },
    { reason: 'Revision', count: slas.filter(s => s.delay_reason === 'revision_cycle').length, color: DELAY_REASON_COLORS.revision_cycle },
    { reason: 'Priority Shift', count: slas.filter(s => s.delay_reason === 'priority_shift').length, color: DELAY_REASON_COLORS.priority_shift },
    { reason: 'Technical', count: slas.filter(s => s.delay_reason === 'technical_issue').length, color: DELAY_REASON_COLORS.technical_issue },
  ];

  // Compliance trend (mock weekly data)
  const complianceTrend = [
    { week: 'Week 1', compliance: 92 },
    { week: 'Week 2', compliance: 88 },
    { week: 'Week 3', compliance: 85 },
    { week: 'Week 4', compliance: complianceRate },
  ];

  // Risk alerts
  const alerts = [
    overdue > 0 && {
      icon: '🚨',
      title: `Video production delays impacting ${Math.ceil(overdue / 2)} clients`,
      body: `${overdue} jobs overdue. Multiple video production delays due to capacity constraints. Recommend immediate team reallocation.`,
      action: 'Escalate to ops leadership for capacity rebalancing.',
    },
    atRisk >= 3 && {
      icon: '⚠️',
      title: 'Approval cycle slowing campaign launches',
      body: `${atRisk} jobs at risk, primarily campaigns. Client approval delays extending timelines by 3-5 days on average.`,
      action: 'Implement streamlined approval workflow or expedite client review process.',
    },
    complianceRate < 85 && {
      icon: '📉',
      title: 'SLA compliance trending downward',
      body: `Compliance rate at ${complianceRate}% vs. 92% last week. Indicate increasing fulfillment pressure.`,
      action: 'Assess team workload and consider temporary resource augmentation.',
    },
  ].filter(Boolean);

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading SLA metrics…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-7 rounded-full bg-indigo-500" />
              <h1 className="text-3xl font-black text-white tracking-tight">SLA Fulfillment Dashboard</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">Which deliverables are at risk right now?</p>
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Statuses</option>
            <option value="on_track">On Track</option>
            <option value="at_risk">At Risk</option>
            <option value="overdue">Overdue</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Jobs On Track" value={onTrack} sub="on schedule" icon={CheckCircle2} color="text-emerald-400" />
          <KPICard label="At Risk" value={atRisk} sub="monitoring required" icon={AlertCircle} color="text-amber-400" />
          <KPICard label="Overdue" value={overdue} sub="immediate action" icon={AlertCircle} color="text-rose-400" />
          <KPICard label="SLA Compliance" value={`${complianceRate}%`} sub="delivery rate" icon={TrendingUp} color="text-blue-400" />
          <KPICard label="Avg Delay" value={`${avgDelay}d`} sub="overdue jobs" icon={Clock} color="text-orange-400" />
        </div>

        {/* SECTION 2 — SLA Status Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-indigo-500 inline-block" />
            SLA Fulfillment Status
            <span className="text-slate-600 font-normal">· {filtered.length} jobs</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(s => (
              <SLACard key={s.id} sla={s} onClick={setSelected} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center py-12 text-slate-600 text-sm">No SLAs match your filters.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 + 5 — Compliance Trend + Delay Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Compliance Trend — 2.5/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">SLA Compliance Trend</h2>
            <p className="text-[11px] text-slate-600 mb-5">weekly compliance percentage</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={complianceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  cursor={{ stroke: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val) => [`${val}%`, 'Compliance']}
                />
                <Line type="monotone" dataKey="compliance" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Delay Reason Distribution — 2.5/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Delay Reason Distribution</h2>
            <p className="text-[11px] text-slate-600 mb-5">root causes of delays</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={delayReasons} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="reason" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val) => [val, 'Delays']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {delayReasons.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Alerts (spans 1/5) */}
          <div className="lg:col-span-1" />
        </div>

        {/* SECTION 6 — Fulfillment Risk Alerts */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-teal-500 inline-block" />
            Fulfillment Risk Alerts
          </h2>
          <div className="space-y-3">
            {alerts.length > 0 ? alerts.map((alert, i) => (
              <div key={i} className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{alert.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white mb-1 leading-snug">{alert.title}</p>
                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">{alert.body}</p>
                    <p className="text-xs text-indigo-300 italic font-semibold">→ {alert.action}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-600 text-sm">No critical SLA alerts. Fulfillment performance is healthy.</div>
            )}
          </div>
        </div>

      </div>

      {/* SECTION 3 — SLA Detail Modal */}
      {selected && (
        <SLAModal sla={selected} onClose={() => setSelected(null)} onStatusUpdate={() => {}} />
      )}
    </div>
  );
}