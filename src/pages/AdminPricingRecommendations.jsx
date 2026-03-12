import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter } from 'recharts';

const TYPE_CONFIG = {
  price_increase: { label: 'Price Increase', color: '#ef4444', emoji: '📈' },
  price_decrease: { label: 'Price Decrease', color: '#3b82f6', emoji: '📉' },
  bundle_offer: { label: 'Bundle Offer', color: '#10b981', emoji: '📦' },
  tier_simplification: { label: 'Tier Simplification', color: '#f59e0b', emoji: '🎯' },
  premium_reposition: { label: 'Premium Reposition', color: '#8b5cf6', emoji: '👑' },
  upgrade_incentive: { label: 'Upgrade Incentive', color: '#06b6d4', emoji: '🚀' },
};

const STATUS_CONFIG = {
  identified: { label: 'Identified', badge: 'bg-slate-100 text-slate-700', color: '#94a3b8' },
  reviewing: { label: 'Reviewing', badge: 'bg-yellow-100 text-yellow-700', color: '#eab308' },
  implementing: { label: 'Implementing', badge: 'bg-blue-100 text-blue-700', color: '#3b82f6' },
  completed: { label: 'Completed', badge: 'bg-emerald-100 text-emerald-700', color: '#10b981' },
};

export default function AdminPricingRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRec, setSelectedRec] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    Promise.all([
      base44.entities.PricingRecommendationSignal.list('-revenue_growth_potential_score', 100),
      base44.entities.PricingPlanPerformance.list('pricing_plan_name', 100),
    ]).then(([recsData, plansData]) => {
      setRecommendations(recsData);
      setPlans(plansData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading pricing recommendations…</div>
      </div>
    );
  }

  const getPlanName = (planId) => {
    if (!planId) return null;
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.pricing_plan_name : null;
  };

  // Filter recommendations
  const filtered = recommendations.filter(r => {
    if (filterType !== 'all' && r.recommendation_type !== filterType) return false;
    if (filterStatus !== 'all' && r.recommendation_status !== filterStatus) return false;
    return true;
  });

  // KPIs
  const highRevenueRecs = recommendations.filter(r => (r.revenue_growth_potential_score || 0) >= 75).length;
  const marginOpportunities = recommendations.filter(r => (r.margin_improvement_score || 0) >= 70).length;
  const implementing = recommendations.filter(r => r.recommendation_status === 'implementing').length;
  const avgConfidence = recommendations.length > 0
    ? Math.round(recommendations.reduce((sum, r) => sum + (r.confidence_level || 0), 0) / recommendations.length)
    : 0;
  const completed = recommendations.filter(r => r.recommendation_status === 'completed').length;
  const momentum = recommendations.length > 0
    ? Math.round((implementing + completed) / recommendations.length * 100)
    : 0;

  // Type distribution
  const typeDistribution = Object.keys(TYPE_CONFIG).map(type => ({
    name: TYPE_CONFIG[type].label,
    count: recommendations.filter(r => r.recommendation_type === type).length,
    color: TYPE_CONFIG[type].color,
  })).filter(item => item.count > 0);

  // Matrix data
  const matrixData = filtered.map(r => ({
    x: r.revenue_growth_potential_score || 0,
    y: r.margin_improvement_score || 0,
    name: r.recommendation_title,
    status: r.recommendation_status,
    color: STATUS_CONFIG[r.recommendation_status].color,
  }));

  // Insights
  const insights = [];

  const premiumRepos = recommendations.filter(r => r.recommendation_type === 'premium_reposition' && r.recommendation_status !== 'completed');
  if (premiumRepos.length > 0) {
    const avgConfidencePremium = Math.round(premiumRepos.reduce((sum, r) => sum + (r.confidence_level || 0), 0) / premiumRepos.length);
    insights.push({
      type: 'positive',
      title: `Premium Repositioning Could Significantly Improve Perceived Value`,
      description: `${premiumRepos.length} reposition recommendation(s) identified with ${avgConfidencePremium}% confidence. Market ready for premium tier elevation.`,
      action: '👑 Lock in premium positioning; use to anchor value hierarchy and margin protection',
    });
  }

  const bundleRecs = recommendations.filter(r => r.recommendation_type === 'bundle_offer' && r.recommendation_status === 'completed');
  if (bundleRecs.length > 0) {
    const avgGrowth = Math.round(bundleRecs.reduce((sum, r) => sum + (r.revenue_growth_potential_score || 0), 0) / bundleRecs.length);
    insights.push({
      type: 'positive',
      title: `Bundled Offerings Accelerating Mid-Tier Expansion`,
      description: `${bundleRecs.length} bundle offer(s) completed with avg ${avgGrowth}% revenue potential. Customers value integrated solutions.`,
      action: '📦 Expand bundle strategy; test additional feature combinations for upgrade acceleration',
    });
  }

  const increaseRecs = recommendations.filter(r => r.recommendation_type === 'price_increase' && (r.confidence_level || 0) >= 70);
  if (increaseRecs.length > 0) {
    insights.push({
      type: 'positive',
      title: `Selective Price Increases Sustainable in High-Momentum Accounts`,
      description: `${increaseRecs.length} price increase recommendation(s) showing ${Math.round(increaseRecs.reduce((sum, r) => sum + (r.confidence_level || 0), 0) / increaseRecs.length)}% confidence. Low elasticity + strong positioning = safe increases.`,
      action: '📈 Prioritize price increases in high-value verticals; use annual contracts to lock in gains',
    });
  }

  const churnRisks = recommendations.filter(r => (r.churn_risk_impact_score || 0) > 60);
  if (churnRisks.length > 0) {
    insights.push({
      type: 'alert',
      title: `${churnRisks.length} Recommendations Present Churn Risk If Not Managed Carefully`,
      description: 'These moves could trigger churn if customer communication and value messaging is weak. Phased rollout recommended.',
      action: '⚠️ Develop customer communication strategy before implementation; phase rollout by account segment',
    });
  }

  const highConfidenceAll = recommendations.filter(r => (r.confidence_level || 0) >= 85);
  if (highConfidenceAll.length > 0) {
    insights.push({
      type: 'positive',
      title: `${highConfidenceAll.length} High-Confidence Recommendations Ready for Quick Implementation`,
      description: 'These moves are data-backed with strong signal support. Ready for immediate action.',
      action: '✓ Fast-track implementation; expect predictable revenue and margin impact',
    });
  }

  const handleStatusUpdate = async (recId, newStatus) => {
    await base44.entities.PricingRecommendationSignal.update(recId, { recommendation_status: newStatus });
    setRecommendations(recommendations.map(r => r.id === recId ? { ...r, recommendation_status: newStatus } : r));
    setSelectedRec(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">💡</div>
            <h1 className="text-3xl font-black text-slate-900">Pricing Recommendations</h1>
          </div>
          <p className="text-slate-600 text-sm">Strategic pricing and packaging recommendations based on plan performance, elasticity patterns, and revenue potential</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">High Revenue Potential</p>
            <p className="text-3xl font-black text-emerald-600">{highRevenueRecs}</p>
            <p className="text-xs text-slate-600 mt-2">Scoring ≥75%</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Margin Expansion</p>
            <p className="text-3xl font-black text-purple-600">{marginOpportunities}</p>
            <p className="text-xs text-slate-600 mt-2">Opportunities</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">In Implementation</p>
            <p className="text-3xl font-black text-blue-600">{implementing}</p>
            <p className="text-xs text-slate-600 mt-2">Active rollouts</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Confidence Index</p>
            <p className="text-3xl font-black text-orange-600">{avgConfidence}%</p>
            <p className="text-xs text-slate-600 mt-2">Avg signal strength</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Optimization Momentum</p>
            <p className="text-3xl font-black text-slate-900">{momentum}%</p>
            <p className="text-xs text-slate-600 mt-2">Active + completed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
          >
            <option value="all">All Types</option>
            <option value="price_increase">Price Increase</option>
            <option value="price_decrease">Price Decrease</option>
            <option value="bundle_offer">Bundle Offer</option>
            <option value="tier_simplification">Tier Simplification</option>
            <option value="premium_reposition">Premium Reposition</option>
            <option value="upgrade_incentive">Upgrade Incentive</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="identified">Identified</option>
            <option value="reviewing">Reviewing</option>
            <option value="implementing">Implementing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* SECTION 2 — Recommendation Grid */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Strategic Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(rec => {
              const typeConfig = TYPE_CONFIG[rec.recommendation_type];
              const statusConfig = STATUS_CONFIG[rec.recommendation_status];
              const planName = getPlanName(rec.target_pricing_plan);
              return (
                <button
                  key={rec.id}
                  onClick={() => setSelectedRec(rec)}
                  className="rounded-xl p-5 text-left transition-all hover:shadow-lg bg-white border border-slate-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{rec.recommendation_title}</h4>
                      {planName && <p className="text-xs text-slate-600 mt-1">Plan: {planName}</p>}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0`} style={{ background: typeConfig.color + '20', color: typeConfig.color }}>
                      {typeConfig.emoji}
                    </span>
                  </div>

                  {/* Revenue growth */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Revenue Growth</span>
                      <span className="text-sm font-bold text-slate-700">{rec.revenue_growth_potential_score || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${rec.revenue_growth_potential_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Margin improvement */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Margin Gain</span>
                      <span className="text-sm font-bold text-slate-700">{rec.margin_improvement_score || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${rec.margin_improvement_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Churn risk indicator */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Churn Risk</span>
                      <span className={`text-sm font-bold ${(rec.churn_risk_impact_score || 0) > 60 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {rec.churn_risk_impact_score || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${(rec.churn_risk_impact_score || 0) > 60 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${rec.churn_risk_impact_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Confidence and status */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-600">Confidence: {rec.confidence_level || 0}%</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${statusConfig.badge}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Recommendation Type Distribution */}
        {typeDistribution.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Recommendation Portfolio by Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={typeDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, color: '#1e293b' }}
                  formatter={(val) => [val, 'Recommendations']}
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

        {/* SECTION 5 — Revenue vs Margin Opportunity Matrix */}
        {matrixData.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Revenue vs Margin Opportunity Matrix</h3>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Revenue Growth Potential"
                  label={{ value: 'Revenue Growth Potential →', position: 'insideBottomRight', offset: -5 }}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Margin Improvement"
                  label={{ value: '← Margin Improvement', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12 }}
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(val) => Math.round(val) + '%'}
                />
                <Scatter name="Recommendations" data={matrixData} fill="#8884d8">
                  {matrixData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                <p className="font-bold text-emerald-900">💎 High Revenue + High Margin</p>
                <p className="text-emerald-800 mt-1">Unicorn opportunities; prioritize immediately</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="font-bold text-blue-900">📈 High Revenue + Low Margin</p>
                <p className="text-blue-800 mt-1">Volume plays; balance growth with profitability</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <p className="font-bold text-purple-900">💰 Low Revenue + High Margin</p>
                <p className="text-purple-800 mt-1">Margin protection; selective premium moves</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <p className="font-bold text-slate-900">⚠️ Low Revenue + Low Margin</p>
                <p className="text-slate-700 mt-1">Reconsider or refine execution approach</p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6 — Strategy Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Pricing Strategy Intelligence</h3>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className={`border rounded-xl p-5 ${
                  insight.type === 'positive'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">
                      {insight.type === 'positive' ? '✓' : '⚠️'}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-black ${insight.type === 'positive' ? 'text-emerald-900' : 'text-rose-900'}`}>
                        {insight.title}
                      </h4>
                      <p className={`text-sm mt-1 ${insight.type === 'positive' ? 'text-emerald-800' : 'text-rose-800'}`}>
                        {insight.description}
                      </p>
                      <div className={`mt-3 text-xs font-bold ${insight.type === 'positive' ? 'text-emerald-700' : 'text-rose-700'}`}>
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
      {selectedRec && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ background: TYPE_CONFIG[selectedRec.recommendation_type].color + '20', color: TYPE_CONFIG[selectedRec.recommendation_type].color }} className="text-xs font-bold px-2 py-1 rounded">
                    {TYPE_CONFIG[selectedRec.recommendation_type].emoji} {TYPE_CONFIG[selectedRec.recommendation_type].label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${STATUS_CONFIG[selectedRec.recommendation_status].badge}`}>
                    {STATUS_CONFIG[selectedRec.recommendation_status].label}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedRec.recommendation_title}</h3>
              </div>
              <button onClick={() => setSelectedRec(null)} className="text-slate-400 hover:text-slate-600 text-2xl flex-shrink-0">×</button>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-slate-200">
              {/* Opportunity scores */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Opportunity Scoring</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <p className="text-2xl font-black text-emerald-600">{selectedRec.revenue_growth_potential_score || 0}%</p>
                    <p className="text-xs text-emerald-700 mt-1">Revenue Growth</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-2xl font-black text-purple-600">{selectedRec.margin_improvement_score || 0}%</p>
                    <p className="text-xs text-purple-700 mt-1">Margin Gain</p>
                  </div>
                  <div className={`rounded-lg p-4 border ${(selectedRec.churn_risk_impact_score || 0) > 60 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <p className={`text-2xl font-black ${(selectedRec.churn_risk_impact_score || 0) > 60 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {selectedRec.churn_risk_impact_score || 0}%
                    </p>
                    <p className={`text-xs mt-1 ${(selectedRec.churn_risk_impact_score || 0) > 60 ? 'text-red-700' : 'text-emerald-700'}`}>
                      Churn Risk
                    </p>
                  </div>
                </div>
              </div>

              {/* Confidence level */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Confidence Level</p>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">Signal Strength</span>
                      <span className="text-lg font-black text-slate-900">{selectedRec.confidence_level || 0}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${selectedRec.confidence_level || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className={`text-sm font-bold px-3 py-1 rounded ${(selectedRec.confidence_level || 0) >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {(selectedRec.confidence_level || 0) >= 80 ? 'High' : 'Moderate'}
                  </div>
                </div>
              </div>

              {/* Plan reference */}
              {getPlanName(selectedRec.target_pricing_plan) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Target Plan</p>
                  <p className="text-sm font-semibold text-blue-900">{getPlanName(selectedRec.target_pricing_plan)}</p>
                </div>
              )}

              {/* Strategic reasoning */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Strategic Reasoning</p>
                <p className="text-sm text-slate-700">{selectedRec.recommended_action_summary || 'No summary available'}</p>
              </div>

              {/* Risk mitigation */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Risk Assessment</p>
                <p className="text-sm text-slate-700">
                  {(selectedRec.churn_risk_impact_score || 0) > 70
                    ? '⚠️ High churn risk detected. Requires careful phased rollout with strong customer communication.'
                    : (selectedRec.churn_risk_impact_score || 0) > 40
                    ? '📌 Moderate churn risk. Monitor customer feedback during implementation. Prepare mitigation messaging.'
                    : '✓ Low churn risk. Safe to proceed with confident rollout. Market ready for this change.'}
                </p>
              </div>
            </div>

            {/* Status Actions */}
            <div className="space-y-2">
              {selectedRec.recommendation_status === 'identified' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedRec.id, 'reviewing')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    👀 Start Review
                  </button>
                  <button className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                    🧪 Convert to Pricing Experiment
                  </button>
                </>
              )}
              {selectedRec.recommendation_status === 'reviewing' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedRec.id, 'implementing')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🚀 Begin Implementation
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedRec.id, 'identified')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ↩️ Back to Identified
                  </button>
                </>
              )}
              {selectedRec.recommendation_status === 'implementing' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedRec.id, 'completed')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Mark Completed
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedRec.id, 'reviewing')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ↩️ Back to Review
                  </button>
                </>
              )}
              {selectedRec.recommendation_status === 'completed' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedRec.id, 'implementing')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🔄 Relaunch Implementation
                  </button>
                  <button className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                    📊 View Performance Metrics
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}