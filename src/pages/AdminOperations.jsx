import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { AlertCircle, Zap, Clock, CheckCircle2, Layers } from 'lucide-react';
import ProductionCard from '@/components/operations/ProductionCard';
import ProductionModal from '@/components/operations/ProductionModal';

const JOB_TYPE_CONFIG = {
  content: { label: 'Content', color: '#3b82f6' },
  video: { label: 'Video', color: '#f59e0b' },
  campaign: { label: 'Campaign', color: '#ec4899' },
  authority_batch: { label: 'Authority', color: '#8b5cf6' },
  reporting: { label: 'Reporting', color: '#10b981' },
  onboarding_setup: { label: 'Onboarding', color: '#06b6d4' },
};

const PRIORITY_COLORS = {
  urgent: '#ef4444', high: '#f97316', medium: '#eab308', low: '#64748b',
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

export default function AdminOperations() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterJobType, setFilterJobType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    base44.entities.ProductionJob.list('-priority_level', 100).then(j => {
      setJobs(j);
      setLoading(false);
    });
  }, []);

  async function updateStatus(id, newStatus) {
    const updated = await base44.entities.ProductionJob.update(id, { job_status: newStatus });
    setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
  }

  const filtered = jobs.filter(j => {
    const typeMatch = filterJobType === 'all' || j.job_type === filterJobType;
    const priorityMatch = filterPriority === 'all' || j.priority_level === filterPriority;
    return typeMatch && priorityMatch;
  });

  // KPIs
  const queued = jobs.filter(j => j.job_status === 'queued').length;
  const inProgress = jobs.filter(j => j.job_status === 'in_progress').length;
  const review = jobs.filter(j => j.job_status === 'review').length;
  const urgent = jobs.filter(j => j.priority_level === 'urgent').length;
  const totalEstimatedHours = jobs.reduce((s, j) => s + (j.estimated_hours || 0), 0);
  const avgHoursPerJob = jobs.length ? Math.round(totalEstimatedHours / jobs.length) : 0;
  const capacityPercent = Math.min(100, Math.round((inProgress / Math.max(jobs.length, 1)) * 100));

  // Status distribution
  const statusCounts = [
    { status: 'Queued', count: queued, color: '#64748b' },
    { status: 'In Progress', count: inProgress, color: '#3b82f6' },
    { status: 'Review', count: review, color: '#f59e0b' },
    { status: 'Completed', count: jobs.filter(j => j.job_status === 'completed').length, color: '#10b981' },
    { status: 'Blocked', count: jobs.filter(j => j.job_status === 'blocked').length, color: '#ef4444' },
  ];

  // Intelligence insights
  const insights = [
    {
      icon: '⚡',
      title: 'Video production backlog forming',
      body: `${jobs.filter(j => j.job_type === 'video' && j.job_status === 'queued').length} video jobs queued. Consider allocating additional resources to video team this week.`,
      action: 'Increase video team capacity or defer non-urgent video jobs.',
    },
    {
      icon: '🚀',
      title: 'Onboarding jobs increasing',
      body: `${jobs.filter(j => j.job_type === 'onboarding_setup').length} active onboarding jobs. This reflects strong sales pipeline momentum.`,
      action: 'Ensure onboarding team has adequate staffing for upcoming client launches.',
    },
    {
      icon: '✅',
      title: 'Campaign fulfillment improving',
      body: `${jobs.filter(j => j.job_type === 'campaign' && j.job_status === 'completed').length} campaign jobs completed this cycle. Steady execution.`,
      action: 'Maintain current campaign production velocity — this is optimal output.',
    },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading production jobs…</div>
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
              <h1 className="text-3xl font-black text-white tracking-tight">Operations Command</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">What work is happening and where are the bottlenecks?</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filterJobType} onChange={e => setFilterJobType(e.target.value)}
              className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="all">All Types</option>
              <option value="content">Content</option>
              <option value="video">Video</option>
              <option value="campaign">Campaign</option>
              <option value="authority_batch">Authority</option>
              <option value="reporting">Reporting</option>
              <option value="onboarding_setup">Onboarding</option>
            </select>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
              className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Jobs Queued" value={queued} sub="waiting to start" icon={Clock} color="text-slate-400" />
          <KPICard label="In Progress" value={inProgress} sub="currently active" icon={Zap} color="text-blue-400" />
          <KPICard label="Awaiting Review" value={review} sub="quality check" icon={AlertCircle} color="text-amber-400" />
          <KPICard label="Urgent Jobs" value={urgent} sub="high priority" icon={AlertCircle} color="text-red-400" />
          <KPICard label="Production Load" value={`${capacityPercent}%`} sub={`${totalEstimatedHours}h total`} icon={Layers} color="text-cyan-400" />
        </div>

        {/* SECTION 2 — Production Job Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-cyan-500 inline-block" />
            Production Jobs
            <span className="text-slate-600 font-normal">· {filtered.length} jobs</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(j => (
              <ProductionCard key={j.id} job={j} onClick={setSelected} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center py-12 text-slate-600 text-sm">No jobs match your filters.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 + 5 — Status Distribution + Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Status Distribution — 2/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Production Status Distribution</h2>
            <p className="text-[11px] text-slate-600 mb-5">jobs by workflow stage</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={statusCounts} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="status" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val, name) => [val, 'Jobs']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusCounts.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Intelligence Feed — 3/5 */}
          <div className="lg:col-span-3">
            <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-teal-500 inline-block" />
              Operations Intelligence
            </h2>
            <div className="space-y-3">
              {insights.map((ins, i) => (
                <div key={i} className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{ins.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white mb-1 leading-snug">{ins.title}</p>
                      <p className="text-xs text-slate-400 mb-2 leading-relaxed">{ins.body}</p>
                      <p className="text-xs text-cyan-300 italic font-semibold">→ {ins.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 3 — Production Detail Modal */}
      {selected && (
        <ProductionModal
          job={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={updateStatus}
        />
      )}
    </div>
  );
}