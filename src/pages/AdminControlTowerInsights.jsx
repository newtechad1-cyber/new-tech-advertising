import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { AlertCircle, TrendingUp, Zap } from 'lucide-react';
import ExecutiveInsightCard from '@/components/control-tower/ExecutiveInsightCard';
import ExecutiveInsightModal from '@/components/control-tower/ExecutiveInsightModal';

const CATEGORY_LABELS = {
  revenue: 'Revenue',
  sales: 'Sales',
  lifecycle: 'Lifecycle',
  expansion: 'Expansion',
  operations: 'Operations',
  vertical_strategy: 'Vertical',
};

const CATEGORY_COLORS = {
  revenue: '#3b82f6',
  sales: '#10b981',
  lifecycle: '#8b5cf6',
  expansion: '#f59e0b',
  operations: '#64748b',
  vertical_strategy: '#06b6d4',
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

export default function AdminControlTowerInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    base44.entities.ExecutiveInsightPanel.list('-impact_score', 100).then(i => {
      setInsights(i);
      setLoading(false);
    });
  }, []);

  const filtered = insights.filter(i => {
    const urgencyMatch = filterUrgency === 'all' || i.urgency_level === filterUrgency;
    const categoryMatch = filterCategory === 'all' || i.insight_category === filterCategory;
    return urgencyMatch && categoryMatch;
  }).sort((a, b) => (b.impact_score || 0) - (a.impact_score || 0));

  // KPIs
  const highImpact = insights.filter(i => i.impact_score >= 75).length;
  const urgentCount = insights.filter(i => i.urgency_level === 'high').length;
  const reviewedCount = insights.filter(i => i.status === 'reviewed').length;
  const actionPlanned = insights.filter(i => i.status === 'action_planned').length;
  const avgImpact = insights.length > 0 ? Math.round(insights.reduce((sum, i) => sum + (i.impact_score || 0), 0) / insights.length) : 0;

  // Category distribution
  const categoryData = Object.keys(CATEGORY_LABELS).map(cat => ({
    name: CATEGORY_LABELS[cat],
    count: insights.filter(i => i.insight_category === cat).length,
    color: CATEGORY_COLORS[cat],
  }));

  // Timeline insights (mock)
  const timeline = [
    { date: 'Today', action: 'Restaurant vertical revenue slowdown detected' },
    { date: 'Yesterday', action: 'HVAC expansion territories gaining traction signal' },
    { date: '2 days ago', action: 'Video production capacity alert escalated' },
  ];

  // Opportunity highlights
  const highlights = [
    {
      icon: '📊',
      title: 'Strongest Vertical Growth: HVAC',
      body: 'HVAC generating 18% MRR growth this quarter. Recommend increasing sales and marketing allocation.',
    },
    {
      icon: '🚀',
      title: 'Highest ROI Playbook: Enterprise Package',
      body: 'Enterprise expansion showing 45% close rate and $8.5k ACV. Priority for next quarter.',
    },
    {
      icon: '⚡',
      title: 'Efficiency Opportunity: Video Automation',
      body: 'Video production automation could free 20+ hours/month. Start pilot with template-driven workflows.',
    },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading executive insights…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-7 rounded-full bg-slate-500" />
              <h1 className="text-3xl font-black text-white tracking-tight">Drilldown Intelligence</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">Strategic insight analysis & leadership decision support</p>
          </div>
          <div className="flex gap-2">
            <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)}
              className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500">
              <option value="all">All Urgency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500">
              <option value="all">All Categories</option>
              <option value="revenue">Revenue</option>
              <option value="sales">Sales</option>
              <option value="lifecycle">Lifecycle</option>
              <option value="expansion">Expansion</option>
              <option value="operations">Operations</option>
              <option value="vertical_strategy">Vertical</option>
            </select>
          </div>
        </div>

        {/* SECTION 1 — Strategic KPI Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="High Impact" value={highImpact} sub="critical insights" icon={AlertCircle} color="text-rose-400" />
          <KPICard label="Urgent" value={urgentCount} sub="requires attention" icon={Zap} color="text-amber-400" />
          <KPICard label="Reviewed" value={reviewedCount} sub="by leadership" icon={TrendingUp} color="text-blue-400" />
          <KPICard label="Actions Planned" value={actionPlanned} sub="in execution" icon={TrendingUp} color="text-emerald-400" />
          <KPICard label="Avg Impact" value={avgImpact} sub="insight score" icon={TrendingUp} color="text-slate-400" />
        </div>

        {/* SECTION 2 — Ranked Insight Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-slate-500 inline-block" />
            Strategic Insights
            <span className="text-slate-600 font-normal">· {filtered.length} panels</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(i => (
              <ExecutiveInsightCard key={i.id} insight={i} onClick={setSelected} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-12 text-slate-600 text-sm">No insights match your filters.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 + 5 — Category Distribution + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Category Distribution — 2.5/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Insight Distribution</h2>
            <p className="text-[11px] text-slate-600 mb-5">by category</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val) => [val, 'Insights']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Leadership Signal Timeline — 2.5/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-4">Leadership Signal Timeline</h2>
            <div className="space-y-3">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-slate-500" />
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

          {/* Spacer */}
          <div className="lg:col-span-1" />
        </div>

        {/* SECTION 6 — Executive Opportunity Highlights */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-emerald-500 inline-block" />
            Executive Opportunity Highlights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {highlights.map((hl, i) => (
              <div key={i} className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-5">
                <span className="text-2xl block mb-2">{hl.icon}</span>
                <p className="text-sm font-bold text-white mb-1 leading-snug">{hl.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{hl.body}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 3 — Insight Detail Modal */}
      {selected && (
        <ExecutiveInsightModal insight={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}