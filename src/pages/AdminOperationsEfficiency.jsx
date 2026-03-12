import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { AlertCircle, TrendingUp, Zap, Clock } from 'lucide-react';
import EfficiencyCard from '@/components/operations/EfficiencyCard';
import EfficiencyModal from '@/components/operations/EfficiencyModal';

const WORKFLOW_LABELS = {
  content_production: 'Content',
  video_production: 'Video',
  campaign_setup: 'Campaign',
  onboarding: 'Onboarding',
  reporting: 'Reporting',
  approvals: 'Approvals',
};

const WORKFLOW_COLORS = {
  content_production: '#8b5cf6',
  video_production: '#06b6d4',
  campaign_setup: '#ec4899',
  onboarding: '#10b981',
  reporting: '#f59e0b',
  approvals: '#3b82f6',
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

export default function AdminOperationsEfficiency() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterArea, setFilterArea] = useState('all');

  useEffect(() => {
    base44.entities.OperationalEfficiencySignal.list('-efficiency_gain_score', 100).then(s => {
      setSignals(s);
      setLoading(false);
    });
  }, []);

  const filtered = signals.filter(s => {
    const statusMatch = filterStatus === 'all' || s.implementation_status === filterStatus;
    const areaMatch = filterArea === 'all' || s.workflow_area === filterArea;
    return statusMatch && areaMatch;
  });

  // KPIs
  const total = signals.length;
  const deployed = signals.filter(s => s.implementation_status === 'deployed').length;
  const building = signals.filter(s => s.implementation_status === 'building').length;
  const planning = signals.filter(s => s.implementation_status === 'planning').length;
  const identified = signals.filter(s => s.implementation_status === 'identified').length;
  
  const totalHours = signals.reduce((sum, s) => sum + (s.manual_hours_reduction_estimate || 0), 0);
  const totalHoursMonthly = totalHours;
  const highImpact = signals.filter(s => s.efficiency_gain_score >= 75).length;
  const implemented = deployed + building;
  const implProgress = total > 0 ? Math.round((implemented / total) * 100) : 0;

  // Workflow distribution
  const workflowData = Object.keys(WORKFLOW_LABELS).map(area => ({
    name: WORKFLOW_LABELS[area],
    count: signals.filter(s => s.workflow_area === area).length,
    color: WORKFLOW_COLORS[area],
  }));

  // 6-month ROI projection (hours saved)
  const roiProjection = [
    { month: 'Month 1', hours: Math.round(totalHoursMonthly * 0.3) },
    { month: 'Month 2', hours: Math.round(totalHoursMonthly * 0.6) },
    { month: 'Month 3', hours: totalHoursMonthly },
    { month: 'Month 4', hours: totalHoursMonthly },
    { month: 'Month 5', hours: totalHoursMonthly },
    { month: 'Month 6', hours: totalHoursMonthly },
  ];

  // Insights
  const alerts = [
    signals.some(s => s.workflow_area === 'video_production' && s.efficiency_gain_score >= 75) && {
      icon: '🎬',
      title: 'Video workflow automation producing largest margin improvement',
      body: `Video production efficiency gains estimated at ${signals.filter(s => s.workflow_area === 'video_production').reduce((sum, s) => sum + (s.manual_hours_reduction_estimate || 0), 0)}+ hours/month. Recommend prioritizing video automation next quarter.`,
      action: 'Move video signal to building phase.',
    },
    signals.some(s => s.workflow_area === 'onboarding' && s.implementation_status === 'identified') && {
      icon: '🚀',
      title: 'Onboarding automation reducing SLA risk',
      body: `Checklist automation can eliminate 8+ hours/week of manual onboarding tasks. Directly supports capacity planning goals.`,
      action: 'Escalate onboarding automation to building phase.',
    },
    signals.some(s => s.workflow_area === 'campaign_setup' && s.efficiency_gain_score >= 65) && {
      icon: '🎯',
      title: 'Campaign batching improving throughput',
      body: `Automated campaign batch scheduling identified with ${signals.filter(s => s.workflow_area === 'campaign_setup').reduce((sum, s) => sum + (s.manual_hours_reduction_estimate || 0), 0)}h/month savings potential.`,
      action: 'Begin campaign automation pilot.',
    },
  ].filter(Boolean);

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading efficiency signals…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-7 rounded-full bg-cyan-500" />
              <h1 className="text-3xl font-black text-white tracking-tight">Operations Efficiency Dashboard</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">Where can we work smarter instead of harder?</p>
          </div>
          <div className="flex gap-2">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="all">All Status</option>
              <option value="deployed">Deployed</option>
              <option value="building">Building</option>
              <option value="planning">Planning</option>
              <option value="identified">Identified</option>
            </select>
            <select value={filterArea} onChange={e => setFilterArea(e.target.value)}
              className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="all">All Areas</option>
              <option value="content_production">Content</option>
              <option value="video_production">Video</option>
              <option value="campaign_setup">Campaign</option>
              <option value="onboarding">Onboarding</option>
              <option value="reporting">Reporting</option>
              <option value="approvals">Approvals</option>
            </select>
          </div>
        </div>

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Opportunities" value={total} sub="identified signals" icon={Zap} color="text-cyan-400" />
          <KPICard label="Hours Saved/Month" value={totalHoursMonthly} sub="estimated reduction" icon={Clock} color="text-emerald-400" />
          <KPICard label="Workflows Optimized" value={deployed} sub="currently deployed" icon={TrendingUp} color="text-blue-400" />
          <KPICard label="High Impact" value={highImpact} sub="75%+ efficiency gains" icon={AlertCircle} color="text-rose-400" />
          <KPICard label="Implementation" value={`${implProgress}%`} sub="progress to deployment" icon={TrendingUp} color="text-amber-400" />
        </div>

        {/* SECTION 2 — Efficiency Opportunity Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-cyan-500 inline-block" />
            Efficiency Opportunities
            <span className="text-slate-600 font-normal">· {filtered.length} signals</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(s => (
              <EfficiencyCard key={s.id} signal={s} onClick={setSelected} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center py-12 text-slate-600 text-sm">No efficiency signals match your filters.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 + 5 — Workflow Distribution + ROI Projection */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Workflow Distribution — 2.5/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Workflow Distribution</h2>
            <p className="text-[11px] text-slate-600 mb-5">signals by operational area</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workflowData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val) => [val, 'Signals']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {workflowData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ROI Projection — 2.5/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">6-Month Efficiency ROI</h2>
            <p className="text-[11px] text-slate-600 mb-5">estimated hours saved</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={roiProjection}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ stroke: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val) => [`${val}h`, 'Hours Saved']}
                />
                <Line type="monotone" dataKey="hours" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Spacer */}
          <div className="lg:col-span-1" />
        </div>

        {/* SECTION 6 — Operations Optimization Intelligence Feed */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-teal-500 inline-block" />
            Operations Intelligence
          </h2>
          <div className="space-y-3">
            {alerts.length > 0 ? alerts.map((alert, i) => (
              <div key={i} className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{alert.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white mb-1 leading-snug">{alert.title}</p>
                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">{alert.body}</p>
                    <p className="text-xs text-cyan-300 italic font-semibold">→ {alert.action}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-600 text-sm">No immediate optimization signals. Continue monitoring workflow metrics.</div>
            )}
          </div>
        </div>

      </div>

      {/* SECTION 3 — Efficiency Detail Modal */}
      {selected && (
        <EfficiencyModal signal={selected} onClose={() => setSelected(null)} onStatusUpdate={() => {}} />
      )}
    </div>
  );
}