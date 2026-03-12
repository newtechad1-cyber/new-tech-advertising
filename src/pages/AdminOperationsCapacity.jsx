import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { AlertCircle, Users, TrendingUp, Clock } from 'lucide-react';
import CapacityCard from '@/components/operations/CapacityCard';
import CapacityModal from '@/components/operations/CapacityModal';

const ROLE_ICON_MAP = {
  'Content Strategist': '📝',
  'Video Producer': '🎬',
  'Campaign Manager': '🎯',
  'Onboarding Specialist': '🚀',
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

export default function AdminOperationsCapacity() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterRisk, setFilterRisk] = useState('all');

  useEffect(() => {
    base44.entities.ProductionCapacityProfile.list('-capacity_utilization_percent', 100).then(p => {
      setProfiles(p);
      setLoading(false);
    });
  }, []);

  const filtered = profiles.filter(p => {
    const riskMatch = filterRisk === 'all' || p.burnout_risk_level === filterRisk;
    return riskMatch;
  });

  // KPIs
  const totalAssigned = profiles.reduce((s, p) => s + (p.assigned_hours_week || 0), 0);
  const totalAvailable = profiles.reduce((s, p) => s + (p.total_available_hours_week || 0), 0);
  const avgUtil = profiles.length ? Math.round((totalAssigned / totalAvailable) * 100) : 0;
  const highUtil = profiles.filter(p => p.capacity_utilization_percent >= 85).length;
  const totalBacklog = profiles.reduce((s, p) => s + (p.backlog_hours || 0), 0);
  const avgEfficiency = profiles.length ? Math.round(profiles.reduce((s, p) => s + (p.efficiency_score || 0), 0) / profiles.length) : 0;

  // Load distribution chart data
  const chartData = profiles.map(p => ({
    role: p.team_role,
    assigned: p.assigned_hours_week || 0,
    backlog: p.backlog_hours || 0,
  }));

  // Capacity alerts
  const videoProducers = profiles.filter(p => p.team_role.includes('Video')).map(p => ({
    role: p.team_role,
    util: p.capacity_utilization_percent,
  }));
  const highVideoUtil = videoProducers.some(vp => vp.util >= 85);

  const onboardingTeam = profiles.filter(p => p.team_role.includes('Onboarding')).map(p => ({
    role: p.team_role,
    backlog: p.backlog_hours,
  }));
  const onboardingBacklog = onboardingTeam.reduce((s, o) => s + o.backlog, 0);

  const contentTeam = profiles.filter(p => p.team_role.includes('Content')).map(p => ({
    role: p.team_role,
    util: p.capacity_utilization_percent,
  }));
  const contentStable = contentTeam.every(c => c.util < 75);

  const alerts = [
    highVideoUtil && {
      icon: '⚡',
      title: 'Video production capacity nearing limit',
      body: `Video producer(s) at ${Math.max(...videoProducers.map(vp => vp.util))}% capacity. Consider deferring non-urgent video jobs or adding capacity.`,
      action: 'Reallocate video work or hire additional producer.',
    },
    onboardingBacklog > 8 && {
      icon: '📈',
      title: 'Onboarding demand rising sharply',
      body: `${onboardingBacklog}h onboarding backlog accumulating. Strong sales pipeline is creating fulfillment pressure.`,
      action: 'Increase onboarding team hours or defer non-critical onboarding tasks.',
    },
    contentStable && {
      icon: '✅',
      title: 'Content workload stabilizing',
      body: `Content team operating at sustainable utilization levels. Quality output likely remains high.`,
      action: 'Maintain current content production velocity.',
    },
  ].filter(Boolean);

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading capacity profiles…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-7 rounded-full bg-purple-500" />
              <h1 className="text-3xl font-black text-white tracking-tight">Production Capacity Planning</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">Can we deliver everything currently promised without breaking the team?</p>
          </div>
          <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)}
            className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="all">All Roles</option>
            <option value="low">Low Risk</option>
            <option value="moderate">Moderate Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Total Hours Assigned" value={totalAssigned} sub="across team" icon={Clock} color="text-purple-400" />
          <KPICard label="Avg Utilization" value={`${avgUtil}%`} sub="team-wide capacity" icon={TrendingUp} color="text-blue-400" />
          <KPICard label="High Util. Roles" value={highUtil} sub="85%+ capacity" icon={AlertCircle} color="text-rose-400" />
          <KPICard label="Backlog Hours" value={totalBacklog} sub="work pending" icon={Clock} color="text-amber-400" />
          <KPICard label="Efficiency Trend" value={`${avgEfficiency}`} sub="team productivity score" icon={TrendingUp} color="text-emerald-400" />
        </div>

        {/* SECTION 2 — Team Capacity Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-purple-500 inline-block" />
            Team Capacity Profiles
            <span className="text-slate-600 font-normal">· click for detailed workload</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <CapacityCard key={p.id} profile={p} onClick={setSelected} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center py-12 text-slate-600 text-sm">No roles match your filters.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 + 5 — Load Distribution + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Production Load Distribution — 2/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Production Load by Role</h2>
            <p className="text-[11px] text-slate-600 mb-5">assigned vs. backlog hours</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="role" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val, name) => [val, name === 'assigned' ? 'Assigned' : 'Backlog']}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                <Bar dataKey="assigned" fill="#8b5cf6" />
                <Bar dataKey="backlog" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Capacity Pressure Alerts — 3/5 */}
          <div className="lg:col-span-3">
            <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-teal-500 inline-block" />
              Capacity Pressure Alerts
            </h2>
            <div className="space-y-3">
              {alerts.length > 0 ? alerts.map((alert, i) => (
                <div key={i} className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{alert.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white mb-1 leading-snug">{alert.title}</p>
                      <p className="text-xs text-slate-400 mb-2 leading-relaxed">{alert.body}</p>
                      <p className="text-xs text-purple-300 italic font-semibold">→ {alert.action}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-600 text-sm">No critical capacity alerts. Team workload is healthy.</div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 3 — Capacity Detail Modal */}
      {selected && (
        <CapacityModal profile={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}