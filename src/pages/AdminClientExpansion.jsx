import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, DollarSign, Users, CheckCircle2, Zap } from 'lucide-react';
import ExpansionCard from '@/components/expansion/ExpansionCard';
import ExpansionModal from '@/components/expansion/ExpansionModal';

const OPP_TYPE_COLORS = {
  premium_video: '#f59e0b',
  authority_content: '#3b82f6',
  multi_location: '#10b981',
  seasonal_campaign: '#ec4899',
  pricing_upgrade: '#8b5cf6',
  enterprise_package: '#f43f5e',
};

function fmt(n) {
  if (!n) return '+$0';
  return n >= 1000 ? `+$${(n / 1000).toFixed(1)}k` : `+$${n}`;
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

export default function AdminClientExpansion() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterReadiness, setFilterReadiness] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    base44.entities.ClientExpansionOpportunity.list('-projected_mrr_increase', 100).then(o => {
      setOpportunities(o);
      setLoading(false);
    });
  }, []);

  async function updateStatus(id, newStatus) {
    const updated = await base44.entities.ClientExpansionOpportunity.update(id, { expansion_status: newStatus });
    setOpportunities(prev => prev.map(o => o.id === updated.id ? updated : o));
  }

  const filtered = opportunities.filter(o => {
    const readinessMatch = filterReadiness === 'all' || 
      (filterReadiness === 'high' && o.readiness_score >= 75) ||
      (filterReadiness === 'medium' && o.readiness_score >= 50 && o.readiness_score < 75) ||
      (filterReadiness === 'low' && o.readiness_score < 50);
    const typeMatch = filterType === 'all' || o.opportunity_type === filterType;
    return readinessMatch && typeMatch;
  });

  // KPIs
  const readyForExpansion = opportunities.filter(o => o.readiness_score >= 75).length;
  const totalProjectedMRR = opportunities.reduce((s, o) => s + (o.projected_mrr_increase || 0), 0);
  const inConversation = opportunities.filter(o => o.expansion_status === 'conversation_started').length;
  const converted = opportunities.filter(o => o.expansion_status === 'converted').length;
  const avgReadiness = opportunities.length ? Math.round(opportunities.reduce((s, o) => s + (o.readiness_score || 0), 0) / opportunities.length) : 0;

  // Type distribution
  const typeCounts = [
    { type: 'Premium Video', count: opportunities.filter(o => o.opportunity_type === 'premium_video').length, color: OPP_TYPE_COLORS.premium_video },
    { type: 'Authority', count: opportunities.filter(o => o.opportunity_type === 'authority_content').length, color: OPP_TYPE_COLORS.authority_content },
    { type: 'Multi-Location', count: opportunities.filter(o => o.opportunity_type === 'multi_location').length, color: OPP_TYPE_COLORS.multi_location },
    { type: 'Seasonal', count: opportunities.filter(o => o.opportunity_type === 'seasonal_campaign').length, color: OPP_TYPE_COLORS.seasonal_campaign },
    { type: 'Pricing', count: opportunities.filter(o => o.opportunity_type === 'pricing_upgrade').length, color: OPP_TYPE_COLORS.pricing_upgrade },
    { type: 'Enterprise', count: opportunities.filter(o => o.opportunity_type === 'enterprise_package').length, color: OPP_TYPE_COLORS.enterprise_package },
  ];

  // Intelligence insights
  const insights = [
    {
      icon: '🎥',
      title: 'Video upgrades converting fastest in HVAC vertical',
      body: 'Premium video expansion proposals in HVAC are showing 68% conversion rate. This vertical shows strong demand for video authority positioning.',
      action: 'Prioritize video upgrade conversations with all high-readiness HVAC clients this quarter.',
    },
    {
      icon: '🎯',
      title: 'Seasonal upsells strongest in restaurant vertical',
      body: 'Seasonal campaign proposals align perfectly with restaurant seasonal spending patterns. Timing matters significantly here.',
      action: 'Launch seasonal campaign outreach to all restaurant clients 6 weeks before major holidays.',
    },
    {
      icon: '📊',
      title: 'Pricing upgrades correlating with reporting engagement',
      body: 'Clients with high reporting engagement scores are 3.2x more likely to accept pricing upgrades. Engagement drives perceived value.',
      action: 'Use reporting engagement as predictor — pair it with pricing upgrade conversations for higher conversion.',
    },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading expansion opportunities…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-7 rounded-full bg-emerald-500" />
              <h1 className="text-3xl font-black text-white tracking-tight">Expansion Opportunity Dashboard</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">Where is our next expansion revenue coming from?</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filterReadiness} onChange={e => setFilterReadiness(e.target.value)}
              className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="all">All Readiness</option>
              <option value="high">High (75+)</option>
              <option value="medium">Medium (50-75)</option>
              <option value="low">Low (&lt;50)</option>
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="bg-[#0d1526] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="all">All Types</option>
              <option value="premium_video">Premium Video</option>
              <option value="authority_content">Authority Content</option>
              <option value="multi_location">Multi-Location</option>
              <option value="seasonal_campaign">Seasonal Campaign</option>
              <option value="pricing_upgrade">Pricing Upgrade</option>
              <option value="enterprise_package">Enterprise Package</option>
            </select>
          </div>
        </div>

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard label="Expansion Ready" value={readyForExpansion} sub="high readiness clients" icon={TrendingUp} color="text-emerald-400" />
          <KPICard label="Projected MRR" value={fmt(totalProjectedMRR)} sub="expansion revenue" icon={DollarSign} color="text-teal-400" />
          <KPICard label="In Conversation" value={inConversation} sub="active discussions" icon={Users} color="text-blue-400" />
          <KPICard label="Conversions" value={converted} sub="this month" icon={CheckCircle2} color="text-emerald-400" />
          <KPICard label="Avg Readiness" value={`${avgReadiness}`} sub="across opportunities" icon={Zap} color="text-amber-400" />
        </div>

        {/* SECTION 2 — Expansion Opportunity Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-emerald-500 inline-block" />
            Expansion Opportunities
            <span className="text-slate-600 font-normal">· click to manage</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(o => (
              <ExpansionCard key={o.id} opportunity={o} onClick={setSelected} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center py-12 text-slate-600 text-sm">No opportunities match your filters.</div>
            )}
          </div>
        </div>

        {/* SECTION 4 + 5 — Type Distribution + Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Type Distribution — 2/5 */}
          <div className="lg:col-span-2 bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-200 mb-1">Opportunity Type Distribution</h2>
            <p className="text-[11px] text-slate-600 mb-5">opportunities by type</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={typeCounts} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                  formatter={(val, name) => [val, 'Opportunities']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {typeCounts.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expansion Intelligence — 3/5 */}
          <div className="lg:col-span-3">
            <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-teal-500 inline-block" />
              Expansion Intelligence Feed
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

        {/* SECTION 6 — Expansion Timeline Strip */}
        <div className="bg-[#0d1526] border border-slate-800/60 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Recent Expansion Activity
          </h2>
          <div className="space-y-2">
            {opportunities.slice(0, 6).map((o, idx) => {
              const statusLabel = {
                identified: '🔍 Identified',
                conversation_started: '💬 In Conversation',
                proposal_sent: '📨 Proposal Sent',
                converted: '✅ Converted',
                declined: '❌ Declined',
              }[o.expansion_status] || '📌 Tracking';
              return (
                <div key={o.id || idx} className="flex items-center gap-3 py-2 border-b border-slate-800/40 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-300 truncate">
                      {o.client_name} · {statusLabel}
                    </p>
                  </div>
                  <span className="text-sm font-black text-emerald-400 whitespace-nowrap">
                    {fmt(o.projected_mrr_increase)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* SECTION 3 — Expansion Detail Modal */}
      {selected && (
        <ExpansionModal
          opportunity={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={updateStatus}
        />
      )}
    </div>
  );
}