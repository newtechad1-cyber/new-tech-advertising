import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, Zap } from 'lucide-react';

const OPPORTUNITY_TYPE_CONFIG = {
  traffic_push: { label: 'Traffic Push', emoji: '📈', color: '#3b82f6' },
  messaging_update: { label: 'Messaging', emoji: '💬', color: '#8b5cf6' },
  pricing_adjustment: { label: 'Pricing', emoji: '💰', color: '#f59e0b' },
  demo_focus: { label: 'Demo Focus', emoji: '🎯', color: '#10b981' },
  trial_incentive: { label: 'Trial Incentive', emoji: '🎁', color: '#ec4899' },
  page_layout: { label: 'Layout', emoji: '🎨', color: '#06b6d4' },
  video_emphasis: { label: 'Video', emoji: '🎬', color: '#ef4444' },
};

const STATUS_CONFIG = {
  identified: { label: 'Identified', color: 'bg-slate-100', textColor: 'text-slate-600' },
  planning: { label: 'Planning', color: 'bg-blue-100', textColor: 'text-blue-600' },
  executing: { label: 'Executing', color: 'bg-amber-100', textColor: 'text-amber-600' },
  completed: { label: 'Completed', color: 'bg-emerald-100', textColor: 'text-emerald-600' },
};

function urgencyColor(level) {
  if (level === 'critical') return 'bg-red-100 text-red-600';
  if (level === 'high') return 'bg-orange-100 text-orange-600';
  if (level === 'medium') return 'bg-amber-100 text-amber-600';
  return 'bg-slate-100 text-slate-600';
}

function urgencyDot(level) {
  if (level === 'critical') return 'bg-red-500';
  if (level === 'high') return 'bg-orange-500';
  if (level === 'medium') return 'bg-amber-500';
  return 'bg-slate-400';
}

export default function AdminFunnelOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    base44.entities.FunnelOpportunitySignal.list('-opportunity_score', 100).then(o => {
      setOpportunities(o);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading opportunity radar…</div>
      </div>
    );
  }

  // Filter opportunities
  const filtered = opportunities.filter(o => {
    if (filterUrgency !== 'all' && o.urgency_level !== filterUrgency) return false;
    if (filterType !== 'all' && o.opportunity_type !== filterType) return false;
    return true;
  });

  // KPIs
  const highImpact = opportunities.filter(o => (o.opportunity_score || 0) >= 75).length;
  const criticalUrgency = opportunities.filter(o => o.urgency_level === 'critical').length;
  const totalLift = opportunities.reduce((sum, o) => sum + (o.projected_conversion_lift || 0), 0);
  const inExecution = opportunities.filter(o => o.implementation_status === 'executing').length;
  const momentumIndex = opportunities.length > 0
    ? Math.round((filtered.filter(o => o.urgency_level === 'critical' || o.urgency_level === 'high').length / opportunities.length) * 100)
    : 0;

  // Type distribution
  const typeDistribution = Object.keys(OPPORTUNITY_TYPE_CONFIG).map(type => ({
    name: OPPORTUNITY_TYPE_CONFIG[type].label,
    count: opportunities.filter(o => o.opportunity_type === type).length,
    color: OPPORTUNITY_TYPE_CONFIG[type].color,
  })).filter(item => item.count > 0);

  // Matrix data
  const matrixData = opportunities.map(o => ({
    x: o.projected_conversion_lift || 0,
    y: o.traffic_volume_impact || 0,
    title: o.opportunity_title,
    urgency: o.urgency_level,
    fill: o.urgency_level === 'critical' ? '#ef4444' : o.urgency_level === 'high' ? '#f97316' : o.urgency_level === 'medium' ? '#eab308' : '#94a3b8',
  }));

  // Insights
  const insights = [];
  
  const videoOpps = opportunities.filter(o => o.opportunity_type === 'video_emphasis' && o.implementation_status === 'identified');
  if (videoOpps.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Video-Focused Pages Showing Strongest Lift Potential',
      description: `${videoOpps.length} video opportunity identified with avg ${Math.round(videoOpps.reduce((s, o) => s + (o.projected_conversion_lift || 0), 0) / videoOpps.length)}% projected lift.`,
      action: '🎬 Prioritize video implementation across demo & trial pages',
    });
  }

  const pricingOpps = opportunities.filter(o => o.opportunity_type === 'pricing_adjustment' && o.implementation_status !== 'completed');
  if (pricingOpps.length > 0) {
    const avgLift = Math.round(pricingOpps.reduce((s, o) => s + (o.projected_conversion_lift || 0), 0) / pricingOpps.length);
    insights.push({
      type: 'positive',
      title: 'Pricing Reassurance Improving Demo Completion',
      description: `Pricing messaging adjustments could deliver ${avgLift}% lift to demo engagement and trial conversion.`,
      action: '💰 Launch pricing page reassurance messaging test immediately',
    });
  }

  const trafficOpps = opportunities.filter(o => o.urgency_level === 'critical' && (o.traffic_volume_impact || 0) > 500);
  if (trafficOpps.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Traffic Spikes Creating Acceleration Windows',
      description: `Critical urgency opportunities now have high traffic impact potential—timing matters.`,
      action: '⚡ Execute critical opportunities in next 48 hours to capture traffic momentum',
    });
  }

  const identified = opportunities.filter(o => o.implementation_status === 'identified').length;
  if (identified > 5) {
    insights.push({
      type: 'alert',
      title: 'Execution Backlog Building',
      description: `${identified} opportunities identified but not yet in planning. Risk of momentum loss.`,
      action: '📋 Schedule weekly prioritization meeting to move opportunities to execution',
    });
  }

  const handleStatusUpdate = async (oppId, newStatus) => {
    await base44.entities.FunnelOpportunitySignal.update(oppId, { implementation_status: newStatus });
    setOpportunities(opportunities.map(o => o.id === oppId ? { ...o, implementation_status: newStatus } : o));
    setSelectedOpp(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-black text-white">Funnel Opportunity Radar</h1>
          <p className="text-slate-400 text-sm mt-1">Strategic conversion growth opportunities powered by funnel performance signals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">High Impact</p>
            <p className="text-3xl font-black text-emerald-400">{highImpact}</p>
            <p className="text-xs text-slate-400 mt-2">Score 75+</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Critical Urgency</p>
            <p className="text-3xl font-black text-red-400">{criticalUrgency}</p>
            <p className="text-xs text-slate-400 mt-2">Act now signals</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Projected Lift</p>
            <p className="text-3xl font-black text-amber-400">+{totalLift}%</p>
            <p className="text-xs text-slate-400 mt-2">If all executed</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">In Execution</p>
            <p className="text-3xl font-black text-blue-400">{inExecution}</p>
            <p className="text-xs text-slate-400 mt-2">Currently active</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Momentum Index</p>
            <p className="text-3xl font-black text-purple-400">{momentumIndex}%</p>
            <p className="text-xs text-slate-400 mt-2">Urgency distribution</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg"
          >
            <option value="all">All Urgency Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg"
          >
            <option value="all">All Opportunity Types</option>
            {Object.entries(OPPORTUNITY_TYPE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        {/* SECTION 2 — Opportunity Grid */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Growth Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(opp => {
              const typeConfig = OPPORTUNITY_TYPE_CONFIG[opp.opportunity_type];
              const statusConfig = STATUS_CONFIG[opp.implementation_status];
              return (
                <button
                  key={opp.id}
                  onClick={() => setSelectedOpp(opp)}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-left hover:border-slate-600 hover:bg-slate-750 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-white">{opp.opportunity_title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{opp.target_page}</p>
                    </div>
                    <span className="text-lg">{typeConfig.emoji}</span>
                  </div>

                  {/* Urgency dot and score */}
                  <div className="mb-3 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${urgencyDot(opp.urgency_level)}`} />
                    <span className="text-xs text-slate-400 capitalize">{opp.urgency_level} Urgency</span>
                  </div>

                  {/* Opportunity score */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">Score</span>
                      <span className="text-sm font-bold text-blue-400">{opp.opportunity_score || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${opp.opportunity_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Conversion lift */}
                  <div className="mb-4 pb-4 border-b border-slate-700">
                    <p className="text-xs text-slate-400 mb-1">Projected Lift</p>
                    <p className="text-lg font-black text-emerald-400">+{opp.projected_conversion_lift || 0}%</p>
                  </div>

                  {/* Status and type */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${statusConfig.color} ${statusConfig.textColor}`}>
                      {statusConfig.label}
                    </span>
                    <span className="text-xs text-slate-400">{typeConfig.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Type Distribution */}
        {typeDistribution.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Opportunity Type Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={typeDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  formatter={(val) => [val, 'Count']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {typeDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 5 — Conversion vs Traffic Impact Matrix */}
        {matrixData.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Conversion Lift vs Traffic Impact</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis
                  dataKey="x"
                  name="Conversion Lift %"
                  label={{ value: 'Projected Conversion Lift (%)', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis
                  dataKey="y"
                  name="Traffic Impact"
                  label={{ value: 'Traffic Volume Impact', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  cursor={{ strokeDasharray: '3 3', stroke: '#64748b' }}
                  formatter={(value) => [value, 'Value']}
                />
                <Scatter name="Opportunities" data={matrixData}>
                  {matrixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-400 mt-4 text-center">
              Top-right quadrant = High lift + High traffic impact (prioritize first)
            </p>
          </div>
        )}

        {/* SECTION 6 — Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Growth Intelligence Feed</h3>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className={`border rounded-xl p-5 ${
                  insight.type === 'positive'
                    ? 'bg-emerald-950 border-emerald-700'
                    : 'bg-rose-950 border-rose-700'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">
                      {insight.type === 'positive' ? '🎯' : '⚠️'}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-black ${insight.type === 'positive' ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {insight.title}
                      </h4>
                      <p className="text-sm text-slate-300 mt-1">{insight.description}</p>
                      <div className={`mt-3 text-xs font-bold ${insight.type === 'positive' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {insight.action}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{OPPORTUNITY_TYPE_CONFIG[selectedOpp.opportunity_type].label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{selectedOpp.opportunity_title}</h3>
              </div>
              <button onClick={() => setSelectedOpp(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
              {/* Page */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Target Page</p>
                <p className="text-sm text-slate-300">{selectedOpp.target_page}</p>
              </div>

              {/* Opportunity & Performance */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Score</p>
                  <p className="text-2xl font-black text-blue-400">{selectedOpp.opportunity_score || 0}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Projected Lift</p>
                  <p className="text-2xl font-black text-emerald-400">+{selectedOpp.projected_conversion_lift || 0}%</p>
                </div>
              </div>

              {/* Traffic Impact */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Traffic Impact</p>
                <p className="text-lg font-black text-purple-400">{selectedOpp.traffic_volume_impact || 0} visitors</p>
              </div>

              {/* Urgency & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Urgency</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded capitalize ${urgencyColor(selectedOpp.urgency_level)}`}>
                    {selectedOpp.urgency_level}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Status</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${STATUS_CONFIG[selectedOpp.implementation_status].color} ${STATUS_CONFIG[selectedOpp.implementation_status].textColor}`}>
                    {STATUS_CONFIG[selectedOpp.implementation_status].label}
                  </span>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Recommended Action</p>
                <p className="text-sm text-slate-300">{selectedOpp.recommended_action}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {selectedOpp.implementation_status === 'identified' && (
                <button
                  onClick={() => handleStatusUpdate(selectedOpp.id, 'planning')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  📋 Move to Planning
                </button>
              )}
              {(selectedOpp.implementation_status === 'identified' || selectedOpp.implementation_status === 'planning') && (
                <button
                  onClick={() => handleStatusUpdate(selectedOpp.id, 'executing')}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ⚡ Start Execution
                </button>
              )}
              {selectedOpp.implementation_status === 'executing' && (
                <button
                  onClick={() => handleStatusUpdate(selectedOpp.id, 'completed')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ✓ Mark Complete
                </button>
              )}
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                🧪 Convert to Experiment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}