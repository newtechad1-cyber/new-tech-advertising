import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell
} from 'recharts';
import { AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import PredictiveRiskCard from '@/components/control-tower/PredictiveRiskCard';
import PredictiveRiskModal from '@/components/control-tower/PredictiveRiskModal';

const CATEGORY_LABELS = {
  revenue: 'Revenue',
  churn: 'Churn',
  sales: 'Sales',
  operations: 'Operations',
  expansion: 'Expansion',
  pricing: 'Pricing',
};

const CATEGORY_COLORS = {
  revenue: '#3b82f6',
  churn: '#ef4444',
  sales: '#f59e0b',
  operations: '#64748b',
  expansion: '#06b6d4',
  pricing: '#10b981',
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

export default function AdminControlTowerRisk() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    base44.entities.PredictiveRiskSignal.list('-probability_score', 100).then(r => {
      setRisks(r);
      setLoading(false);
    });
  }, []);

  const filtered = risks.filter(r => {
    const categoryMatch = filterCategory === 'all' || r.risk_category === filterCategory;
    return categoryMatch;
  }).sort((a, b) => ((b.probability_score || 0) * (b.impact_severity || 0)) - ((a.probability_score || 0) * (a.impact_severity || 0)));

  // KPIs
  const highProb = risks.filter(r => r.probability_score >= 75).length;
  const highImpact = risks.filter(r => r.impact_severity >= 75).length;
  const intervention = risks.filter(r => r.monitoring_status === 'intervention').length;
  const stabilized = risks.filter(r => r.monitoring_status === 'stabilized').length;
  const compositeRisk = risks.length > 0 ? Math.round(risks.reduce((sum, r) => sum + ((r.probability_score || 0) * (r.impact_severity || 0) / 100), 0) / risks.length) : 0;

  // Category distribution
  const categoryData = Object.keys(CATEGORY_LABELS).map(cat => ({
    name: CATEGORY_LABELS[cat],
    count: risks.filter(r => r.risk_category === cat).length,
    color: CATEGORY_COLORS[cat],
  }));

  // Risk matrix data
  const matrixData = risks.map(r => ({
    x: r.probability_score || 50,
    y: r.impact_severity || 50,
    name: r.risk_title,
    category: r.risk_category,
  }));

  // Preventive insights
  const insights = [
    risks.some(r => r.risk_category === 'operations' && r.probability_score >= 70) && {
      icon: '⚡',
      title: 'Onboarding automation could reduce capacity risk',
      body: 'Video production backlog probability at 78%. Template-driven automation could free 20+ hours/month.',
      action: 'Initiate video automation pilot program.',
    },
    risks.some(r => r.risk_category === 'churn' && r.probability_score >= 70) && {
      icon: '💬',
      title: 'Pricing transparency may reduce churn cluster probability',
      body: 'Restaurant vertical churn risk at 72%. Transparent pricing and early renewal discussions recommended.',
      action: 'Implement proactive pricing review process for at-risk accounts.',
    },
    risks.some(r => r.risk_category === 'expansion' && r.probability_score >= 60) && {
      icon: '📊',
      title: 'Expansion pacing adjustment recommended',
      body: 'Sales velocity slowing in expansion territories (65% probability). Geographic saturation emerging.',
      action: 'Shift focus to new verticals or reduce market saturation in current territories.',
    },
  ].filter(Boolean);

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading risk signals…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-7 rounded-full bg-rose-500" />
              <h1 className="text-3xl font-black text-white tracking-tight">Predictive Risk Radar</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">Early warning system for emerging business risks</p>
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500">
            <option value="all">All Categories</option>
            <option value="revenue">Revenue</option>
            <option value="churn">Churn</option>
            <option value="sales">Sales</option>
            <option value="operations">Operations</option>
            <option value="expansion">Expansion</option>
            <option value="pricing">Pricing</option>
          </select>
        </div>

        {/* SECTION 1 — Risk Radar KPI Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="High Prob" value={highProb} sub="risks above 75%" icon={AlertTriangle} color="text-rose-400" />
          <KPICard label="High Impact" value={highImpact} sub="severity 75%+" icon={AlertTriangle} color="text-orange-400" />
          <KPICard label="Intervention" value={intervention} sub="active mitigation" icon={Shield} color="text-amber-400" />
          <KPICard label="Stabilized" value={stabilized} sub="risks contained" icon={TrendingUp} color="text-emerald-400" />
          <KPICard label="Composite Risk" value={compositeRisk} sub="overall index" icon={TrendingUp} color="text-slate-400" />
        </div>

        {/* SECTION 2 — Risk Signal Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-rose-500 inline-block" />
            Active Risk Signals
            <span className="text-slate-600 font-normal">· {filtered.length} identified</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(r => (
              <PredictiveRiskCard key={r.id} risk={r} onClick={setSelected} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-12 text-slate-600 text-sm">No risks match your filters.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 + 5 — Category Distribution + Risk Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Category Distribution — 2/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Risk Distribution</h2>
            <p className="text-[11px] text-slate-600 mb-5">by category</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val) => [val, 'Risks']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Matrix — 3/5 */}
          <div className="lg:col-span-3 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Probability vs Impact Matrix</h2>
            <p className="text-[11px] text-slate-600 mb-5">risk positioning</p>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="x" label={{ value: 'Probability →', position: 'right', offset: 10 }} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} type="number" domain={[0, 100]} />
                <YAxis dataKey="y" label={{ value: 'Impact ↑', angle: -90, position: 'insideLeft' }} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} type="number" domain={[0, 100]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val, name) => name === 'x' ? [`${val}%`, 'Probability'] : [`${val}`, 'Impact']}
                  labelFormatter={(label) => ''}
                />
                <Scatter name="Risks" data={matrixData}>
                  {matrixData.map((entry, index) => (
                    <Cell key={index} fill={CATEGORY_COLORS[entry.category]} />
                  ))}
                </Scatter>
                {/* Quadrant lines */}
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#1e293b" strokeDasharray="5 5" />
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#1e293b" strokeDasharray="5 5" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* SECTION 6 — Preventive Strategy Insights */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-emerald-500 inline-block" />
            Preventive Strategy Insights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {insights.length > 0 ? insights.map((insight, i) => (
              <div key={i} className="bg-[#0d1526] border border-emerald-800/40 rounded-2xl p-5">
                <span className="text-2xl block mb-2">{insight.icon}</span>
                <p className="text-sm font-bold text-white mb-1 leading-snug">{insight.title}</p>
                <p className="text-xs text-slate-400 mb-2 leading-relaxed">{insight.body}</p>
                <p className="text-xs text-emerald-400 font-semibold">→ {insight.action}</p>
              </div>
            )) : (
              <div className="col-span-3 text-center py-8 text-slate-600 text-sm">No immediate preventive insights. Risk situation stable.</div>
            )}
          </div>
        </div>

      </div>

      {/* SECTION 3 — Risk Detail Modal */}
      {selected && (
        <PredictiveRiskModal risk={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}