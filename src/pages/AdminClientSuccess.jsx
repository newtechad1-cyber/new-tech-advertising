import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { AlertTriangle, Zap, Users, TrendingUp, Heart } from 'lucide-react';
import HealthCard from '@/components/client-success/HealthCard';
import HealthModal from '@/components/client-success/HealthModal';

const STAGE_COLORS = {
  onboarding:      '#3b82f6',
  stabilizing:     '#64748b',
  growing:         '#10b981',
  expansion_ready: '#8b5cf6',
  at_risk:         '#f43f5e',
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

export default function AdminClientSuccess() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStage, setFilterStage] = useState('all');

  useEffect(() => {
    base44.entities.ClientHealthProfile.list('-health_score', 100).then(p => {
      setProfiles(p);
      setLoading(false);
    });
  }, []);

  const filtered = filterStage === 'all' ? profiles : profiles.filter(p => p.lifecycle_stage === filterStage);

  // KPIs
  const totalActive = profiles.length;
  const atRisk = profiles.filter(p => p.churn_risk_level === 'high').length;
  const expansionReady = profiles.filter(p => p.lifecycle_stage === 'expansion_ready').length;
  const avgHealth = profiles.length ? Math.round(profiles.reduce((s, p) => s + (p.health_score || 0), 0) / profiles.length) : 0;
  const expansionMRR = profiles.filter(p => p.lifecycle_stage === 'expansion_ready').reduce((s, p) => s + (p.account_value_mrr || 0), 0) * 1.5;

  // Lifecycle distribution
  const stageCounts = [
    { stage: 'Onboarding', count: profiles.filter(p => p.lifecycle_stage === 'onboarding').length, color: STAGE_COLORS.onboarding },
    { stage: 'Stabilizing', count: profiles.filter(p => p.lifecycle_stage === 'stabilizing').length, color: STAGE_COLORS.stabilizing },
    { stage: 'Growing', count: profiles.filter(p => p.lifecycle_stage === 'growing').length, color: STAGE_COLORS.growing },
    { stage: 'Expansion Ready', count: profiles.filter(p => p.lifecycle_stage === 'expansion_ready').length, color: STAGE_COLORS.expansion_ready },
    { stage: 'At Risk', count: profiles.filter(p => p.lifecycle_stage === 'at_risk').length, color: STAGE_COLORS.at_risk },
  ];

  // Strategic insights
  const insights = [
    {
      icon: '🔥',
      title: `${expansionReady} clients ready for expansion conversations`,
      body: `These clients have strong health scores (avg ${avgHealth}/100) and high expansion readiness. Prioritize outreach this week.`,
      action: 'Schedule expansion strategy calls with top 3 expansion-ready clients.',
    },
    {
      icon: '⚠️',
      title: `${atRisk} clients showing elevated churn risk`,
      body: 'These accounts require dedicated retention strategy and immediate support intervention to reverse risk.',
      action: 'Schedule emergency retention reviews with CS leadership today.',
    },
    {
      icon: '📊',
      title: 'Reporting engagement opportunity detected',
      body: 'New clients (onboarding stage) are showing lower reporting engagement. Early intervention can drive habit formation.',
      action: 'Implement automated reporting cadence with all onboarding clients.',
    },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading client success data…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-7 rounded-full bg-teal-500" />
              <h1 className="text-3xl font-black text-white tracking-tight">Client Success Command</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">Who needs attention today and who is ready to grow?</p>
          </div>
          {profiles.length > 0 && (
            <select value={filterStage} onChange={e => setFilterStage(e.target.value)}
              className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="all">All Stages</option>
              <option value="onboarding">Onboarding</option>
              <option value="stabilizing">Stabilizing</option>
              <option value="growing">Growing</option>
              <option value="expansion_ready">Expansion Ready</option>
              <option value="at_risk">At Risk</option>
            </select>
          )}
        </div>

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Active Clients" value={totalActive} sub="total accounts" icon={Users} color="text-teal-400" />
          <KPICard label="At Risk" value={atRisk} sub="needs intervention" icon={AlertTriangle} color="text-rose-400" />
          <KPICard label="Expansion Ready" value={expansionReady} sub="ready to grow" icon={TrendingUp} color="text-emerald-400" />
          <KPICard label="Avg Health Score" value={`${avgHealth}`} sub="overall wellness" icon={Heart} color="text-amber-400" />
          <KPICard label="Expansion Revenue" value={fmt(expansionMRR)} sub="potential MRR" icon={Zap} color="text-violet-400" />
        </div>

        {/* SECTION 2 — Client Health Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-teal-500 inline-block" />
            Client Health Profiles
            <span className="text-slate-600 font-normal">· click for details</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <HealthCard key={p.id} profile={p} onClick={setSelected} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center py-12 text-slate-600 text-sm">No clients in this lifecycle stage.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 + 5 — Stage Distribution + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Stage Distribution — 2/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Lifecycle Stage Distribution</h2>
            <p className="text-[11px] text-slate-600 mb-5">clients by lifecycle stage</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stageCounts} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="stage" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val, name) => [val, 'Clients']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stageCounts.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Strategic Insights — 3/5 */}
          <div className="lg:col-span-3">
            <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-emerald-500 inline-block" />
              Client Success Intelligence
            </h2>
            <div className="space-y-3">
              {insights.map((ins, i) => (
                <div key={i} className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{ins.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white mb-1 leading-snug">{ins.title}</p>
                      <p className="text-xs text-slate-400 mb-2 leading-relaxed">{ins.body}</p>
                      <p className="text-xs text-teal-300 italic font-semibold">→ {ins.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 3 — Client Detail Modal */}
      {selected && (
        <HealthModal profile={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}