import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, AlertCircle, Play } from 'lucide-react';
import StrategicActionCard from '@/components/control-tower/StrategicActionCard';
import StrategicActionModal from '@/components/control-tower/StrategicActionModal';

const CATEGORY_LABELS = {
  expansion_activation: 'Expansion',
  sales_push: 'Sales',
  retention_intervention: 'Retention',
  pricing_adjustment: 'Pricing',
  operational_optimization: 'Operations',
  campaign_acceleration: 'Campaign',
};

const CATEGORY_COLORS = {
  expansion_activation: '#06b6d4',
  sales_push: '#10b981',
  retention_intervention: '#3b82f6',
  pricing_adjustment: '#f59e0b',
  operational_optimization: '#64748b',
  campaign_acceleration: '#8b5cf6',
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

export default function AdminControlTowerActions() {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    base44.entities.StrategicActionInitiative.list('-projected_revenue_impact', 100).then(i => {
      setInitiatives(i);
      setLoading(false);
    });
  }, []);

  const filtered = initiatives.filter(i => {
    const categoryMatch = filterCategory === 'all' || i.action_category === filterCategory;
    return categoryMatch;
  }).sort((a, b) => {
    const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return urgencyOrder[a.urgency_level || 'medium'] - urgencyOrder[b.urgency_level || 'medium'];
  });

  // KPIs
  const activeCount = initiatives.filter(i => ['planned', 'launched', 'in_progress'].includes(i.execution_status)).length;
  const criticalCount = initiatives.filter(i => i.urgency_level === 'critical').length;
  const totalImpact = initiatives.reduce((sum, i) => sum + (i.projected_revenue_impact || 0), 0);
  const launchedThisMonth = initiatives.filter(i => i.execution_status !== 'planned').length;
  const completedCount = initiatives.filter(i => i.execution_status === 'completed').length;
  const completionRate = initiatives.length > 0 ? Math.round((completedCount / initiatives.length) * 100) : 0;

  // Category distribution
  const categoryData = Object.keys(CATEGORY_LABELS).map(cat => ({
    name: CATEGORY_LABELS[cat],
    count: initiatives.filter(i => i.action_category === cat).length,
    color: CATEGORY_COLORS[cat],
  }));

  // Timeline (mock)
  const timeline = [
    { date: 'Today', action: 'Launched HVAC secondary city sales push initiative' },
    { date: 'Yesterday', action: 'Marked restaurant engagement recovery campaign in progress' },
    { date: '2 days ago', action: 'Completed video production workflow optimization' },
    { date: 'Mar 9', action: 'Initiated premium pricing pilot program' },
  ];

  // Execution insights
  const insights = [
    initiatives.some(i => i.action_category === 'expansion_activation' && i.execution_status !== 'completed') && {
      icon: '🚀',
      title: 'Expansion initiatives driving strongest impact',
      body: 'HVAC and restaurant expansion activations projected to generate $24k combined MRR. Focus execution resources here.',
      action: 'Increase sales rep allocation to expansion-focused territories.',
    },
    initiatives.some(i => i.action_category === 'retention_intervention' && i.execution_status !== 'completed') && {
      icon: '🛡️',
      title: 'Retention interventions reducing churn probability',
      body: 'Restaurant engagement recovery campaign could reduce monthly churn by 2-3 clients. Critical for Q2 revenue stability.',
      action: 'Schedule executive calls with top 5 restaurant clients this week.',
    },
    initiatives.some(i => i.action_category === 'operational_optimization' && i.execution_status !== 'completed') && {
      icon: '⚡',
      title: 'Operational optimizations improving fulfillment speed',
      body: 'Video production workflow automation expected to reduce SLA delays by 40% and free 20+ hours/month.',
      action: 'Fast-track video automation implementation to production.',
    },
  ].filter(Boolean);

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading strategic initiatives…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-7 rounded-full bg-blue-500" />
              <h1 className="text-3xl font-black text-white tracking-tight">Strategic Action Launcher</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">Leadership execution command center for active initiatives</p>
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Categories</option>
            <option value="expansion_activation">Expansion</option>
            <option value="sales_push">Sales Push</option>
            <option value="retention_intervention">Retention</option>
            <option value="pricing_adjustment">Pricing</option>
            <option value="operational_optimization">Operations</option>
            <option value="campaign_acceleration">Campaign</option>
          </select>
        </div>

        {/* SECTION 1 — Strategic Action KPI Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Active Initiatives" value={activeCount} sub="in flight" icon={Play} color="text-blue-400" />
          <KPICard label="Critical Urgency" value={criticalCount} sub="high priority" icon={AlertCircle} color="text-rose-400" />
          <KPICard label="Revenue Impact" value={`$${(totalImpact / 1000).toFixed(0)}k`} sub="projected MRR" icon={TrendingUp} color="text-emerald-400" />
          <KPICard label="Launched" value={launchedThisMonth} sub="this month" icon={Play} color="text-cyan-400" />
          <KPICard label="Completion Rate" value={`${completionRate}%`} sub="of all initiatives" icon={TrendingUp} color="text-slate-400" />
        </div>

        {/* SECTION 2 — Strategic Initiative Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-blue-500 inline-block" />
            Active Strategic Initiatives
            <span className="text-slate-600 font-normal">· {filtered.length} initiatives</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(i => (
              <StrategicActionCard key={i.id} initiative={i} onClick={setSelected} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-12 text-slate-600 text-sm">No initiatives match your filters.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 + 5 — Category Distribution + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Category Distribution — 2/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Initiative Distribution</h2>
            <p className="text-[11px] text-slate-600 mb-5">by action category</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val) => [val, 'Initiatives']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Strategic Execution Timeline — 3/5 */}
          <div className="lg:col-span-3 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-4">Execution Timeline</h2>
            <div className="space-y-3">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    {i < timeline.length - 1 && <div className="w-0.5 h-6 bg-slate-800" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{item.date}</p>
                    <p className="text-xs text-slate-300 mt-1">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SECTION 6 — Leadership Execution Intelligence Feed */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-emerald-500 inline-block" />
            Execution Intelligence Feed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {insights.length > 0 ? insights.map((insight, i) => (
              <div key={i} className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-5">
                <span className="text-2xl block mb-2">{insight.icon}</span>
                <p className="text-sm font-bold text-white mb-1 leading-snug">{insight.title}</p>
                <p className="text-xs text-slate-400 mb-2 leading-relaxed">{insight.body}</p>
                <p className="text-xs text-blue-400 font-semibold">→ {insight.action}</p>
              </div>
            )) : (
              <div className="col-span-3 text-center py-8 text-slate-600 text-sm">No active execution insights at this time.</div>
            )}
          </div>
        </div>

      </div>

      {/* SECTION 3 — Initiative Detail Modal */}
      {selected && (
        <StrategicActionModal initiative={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}