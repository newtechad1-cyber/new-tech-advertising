import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter } from 'recharts';

const ISSUE_CONFIG = {
  feature_overlap: { label: 'Feature Overlap', color: '#ef4444', emoji: '📋' },
  feature_gap: { label: 'Feature Gap', color: '#f59e0b', emoji: '⚠️' },
  tier_confusion: { label: 'Tier Confusion', color: '#f97316', emoji: '❓' },
  upgrade_barrier: { label: 'Upgrade Barrier', color: '#ec4899', emoji: '🚧' },
  bundle_opportunity: { label: 'Bundle Opportunity', color: '#10b981', emoji: '📦' },
  value_misalignment: { label: 'Value Misalignment', color: '#8b5cf6', emoji: '💎' },
};

const STATUS_CONFIG = {
  healthy: { label: 'Healthy', badge: 'bg-emerald-100 text-emerald-700', color: '#10b981' },
  review: { label: 'Review', badge: 'bg-yellow-100 text-yellow-700', color: '#eab308' },
  redesign: { label: 'Redesign', badge: 'bg-orange-100 text-orange-700', color: '#f97316' },
  testing: { label: 'Testing', badge: 'bg-blue-100 text-blue-700', color: '#3b82f6' },
};

export default function AdminPricingPackaging() {
  const [signals, setSignals] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterIssue, setFilterIssue] = useState('all');

  useEffect(() => {
    Promise.all([
      base44.entities.PackagingStructureSignal.list('-upgrade_friction_score', 100),
      base44.entities.PricingPlanPerformance.list('pricing_plan_name', 100),
    ]).then(([signalsData, plansData]) => {
      setSignals(signalsData);
      setPlans(plansData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading packaging analytics…</div>
      </div>
    );
  }

  const getPlanName = (planId) => {
    if (!planId) return null;
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.pricing_plan_name : null;
  };

  // Filter signals
  const filtered = signals.filter(s => {
    if (filterStatus !== 'all' && s.packaging_status !== filterStatus) return false;
    if (filterIssue !== 'all' && s.packaging_issue_type !== filterIssue) return false;
    return true;
  });

  // KPIs
  const plansWithIssues = new Set(signals.filter(s => s.packaging_status !== 'healthy').map(s => s.pricing_plan)).size;
  const highestFrictionSignal = signals.length > 0
    ? signals.reduce((max, s) => (s.upgrade_friction_score || 0) > (max.upgrade_friction_score || 0) ? s : max)
    : null;
  const avgClarity = signals.length > 0
    ? Math.round(signals.reduce((sum, s) => sum + (s.clarity_score || 0), 0) / signals.length)
    : 0;
  const bundleOpportunities = signals.filter(s => s.packaging_issue_type === 'bundle_opportunity').length;
  const totalRevenueImpact = signals.reduce((sum, s) => sum + (s.revenue_impact_estimate || 0), 0);

  // Issue distribution
  const issueDistribution = Object.keys(ISSUE_CONFIG).map(issue => ({
    name: ISSUE_CONFIG[issue].label,
    count: signals.filter(s => s.packaging_issue_type === issue).length,
    color: ISSUE_CONFIG[issue].color,
  })).filter(item => item.count > 0);

  // Matrix data
  const matrixData = filtered.map(s => ({
    x: s.clarity_score || 0,
    y: s.upgrade_friction_score || 0,
    name: s.packaging_signal_title,
    status: s.packaging_status,
    color: STATUS_CONFIG[s.packaging_status].color,
  }));

  // Insights
  const insights = [];

  const bundlePlans = signals.filter(s => s.packaging_issue_type === 'bundle_opportunity');
  if (bundlePlans.length > 0) {
    insights.push({
      type: 'positive',
      title: `${bundlePlans.length} Bundle Opportunity Identified`,
      description: `${bundlePlans.map(s => s.packaging_signal_title).join(', ')}. Bundling premium features increases perceived value and close rates.`,
      action: '📦 Test combined feature bundles; measure upgrade lift vs. bundled offering',
    });
  }

  const highFrictionSignals = signals.filter(s => (s.upgrade_friction_score || 0) > 70);
  if (highFrictionSignals.length > 0) {
    insights.push({
      type: 'alert',
      title: `${highFrictionSignals.length} Upgrade Friction Barrier(s) Impacting Tier Progression`,
      description: `High friction scores indicate pricing jumps or feature confusion blocking upgrades. ${highFrictionSignals.map(s => s.packaging_signal_title).slice(0, 2).join(', ')}.`,
      action: '🚧 Add stepping stones (intermediate tiers) or reduce pricing jump between tiers',
    });
  }

  const featureGaps = signals.filter(s => s.packaging_issue_type === 'feature_gap' && s.packaging_status !== 'healthy');
  if (featureGaps.length > 0) {
    insights.push({
      type: 'alert',
      title: `${featureGaps.length} Feature Gap(s) Creating Value Perception Issues`,
      description: `Missing features in lower tiers may be limiting growth tier appeal. Evaluate feature roadmap prioritization.`,
      action: '💡 Add high-demand features to growth tier; communicate value lift in marketing',
    });
  }

  const featureOverlaps = signals.filter(s => s.packaging_issue_type === 'feature_overlap');
  if (featureOverlaps.length > 0) {
    insights.push({
      type: 'alert',
      title: `${featureOverlaps.length} Feature Overlap Reducing Differentiation`,
      description: `Overlapping features between tiers confuses purchase decisions and limits upgrade urgency.`,
      action: '🔄 Redistribute features across tiers; create clear capability progression path',
    });
  }

  const lowClaritySignals = signals.filter(s => (s.clarity_score || 0) < 50);
  if (lowClaritySignals.length > 1) {
    insights.push({
      type: 'alert',
      title: `${lowClaritySignals.length} Signals Show Poor Packaging Clarity`,
      description: 'Low clarity scores indicate customers struggle to understand tier positioning. Messaging needs strengthening.',
      action: '📝 Simplify feature descriptions; create side-by-side tier comparison table',
    });
  }

  const healthySignals = signals.filter(s => s.packaging_status === 'healthy' && s.packaging_issue_type === 'value_misalignment');
  if (healthySignals.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Packaging Value Alignment Resonating Well',
      description: 'Pricing and feature distribution clearly communicate value. Customers understand what they\'re paying for.',
      action: '✓ Maintain positioning; document as packaging template for new feature rollouts',
    });
  }

  const handleStatusUpdate = async (signalId, newStatus) => {
    await base44.entities.PackagingStructureSignal.update(signalId, { packaging_status: newStatus });
    setSignals(signals.map(s => s.id === signalId ? { ...s, packaging_status: newStatus } : s));
    setSelectedSignal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">📦</div>
            <h1 className="text-3xl font-black text-slate-900">Packaging Optimization</h1>
          </div>
          <p className="text-slate-600 text-sm">Evaluate packaging clarity, feature distribution, bundle attractiveness, and upgrade pathway effectiveness</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Plans With Issues</p>
            <p className="text-3xl font-black text-orange-600">{plansWithIssues}</p>
            <p className="text-xs text-slate-600 mt-2">Needing attention</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Highest Friction</p>
            <p className="text-sm font-black text-slate-900 truncate">{highestFrictionSignal?.packaging_signal_title || '—'}</p>
            <p className="text-xs text-slate-600 mt-2">{highestFrictionSignal?.upgrade_friction_score || 0}% friction</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Avg Clarity</p>
            <p className="text-3xl font-black text-blue-600">{avgClarity}%</p>
            <p className="text-xs text-slate-600 mt-2">Packaging clarity</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Bundle Opportunities</p>
            <p className="text-3xl font-black text-emerald-600">{bundleOpportunities}</p>
            <p className="text-xs text-slate-600 mt-2">Identified</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Revenue Impact Potential</p>
            <p className="text-3xl font-black text-purple-600">${totalRevenueImpact}k</p>
            <p className="text-xs text-slate-600 mt-2">Estimated upside</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="review">Review</option>
            <option value="redesign">Redesign</option>
            <option value="testing">Testing</option>
          </select>
          <select
            value={filterIssue}
            onChange={(e) => setFilterIssue(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
          >
            <option value="all">All Issues</option>
            <option value="feature_overlap">Feature Overlap</option>
            <option value="feature_gap">Feature Gap</option>
            <option value="tier_confusion">Tier Confusion</option>
            <option value="upgrade_barrier">Upgrade Barrier</option>
            <option value="bundle_opportunity">Bundle Opportunity</option>
            <option value="value_misalignment">Value Misalignment</option>
          </select>
        </div>

        {/* SECTION 2 — Packaging Signal Grid */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Packaging Signals Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(signal => {
              const issueConfig = ISSUE_CONFIG[signal.packaging_issue_type];
              const statusConfig = STATUS_CONFIG[signal.packaging_status];
              const planName = getPlanName(signal.pricing_plan);
              return (
                <button
                  key={signal.id}
                  onClick={() => setSelectedSignal(signal)}
                  className="rounded-xl p-5 text-left transition-all hover:shadow-lg bg-white border border-slate-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{signal.packaging_signal_title}</h4>
                      {planName && <p className="text-xs text-slate-600 mt-1">Plan: {planName}</p>}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0`} style={{ background: issueConfig.color + '20', color: issueConfig.color }}>
                      {issueConfig.emoji} {issueConfig.label}
                    </span>
                  </div>

                  {/* Clarity bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Clarity</span>
                      <span className="text-sm font-bold text-slate-700">{signal.clarity_score || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${signal.clarity_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Friction meter */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Friction</span>
                      <span className={`text-sm font-bold ${(signal.upgrade_friction_score || 0) > 60 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {signal.upgrade_friction_score || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${(signal.upgrade_friction_score || 0) > 60 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${signal.upgrade_friction_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Revenue impact and status */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-600">${signal.revenue_impact_estimate || 0}k potential</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${statusConfig.badge}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Issue Type Distribution */}
        {issueDistribution.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Packaging Issue Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={issueDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, color: '#1e293b' }}
                  formatter={(val) => [val, 'Signals']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {issueDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 5 — Clarity vs Friction Matrix */}
        {matrixData.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Clarity vs Upgrade Friction Matrix</h3>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Clarity Score"
                  label={{ value: 'Clarity Score →', position: 'insideBottomRight', offset: -5 }}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Friction Score"
                  label={{ value: '← Friction Score', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12 }}
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(val) => Math.round(val) + '%'}
                />
                <Scatter name="Packaging Signals" data={matrixData} fill="#8884d8">
                  {matrixData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                <p className="font-bold text-emerald-900">✓ Clear & Frictionless</p>
                <p className="text-emerald-800 mt-1">High clarity + Low friction</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <p className="font-bold text-orange-900">⚠️ Clear But Barriers</p>
                <p className="text-orange-800 mt-1">High clarity + High friction</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="font-bold text-yellow-900">❓ Unclear & Smooth</p>
                <p className="text-yellow-800 mt-1">Low clarity + Low friction</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="font-bold text-red-900">🚧 Problem Zone</p>
                <p className="text-red-800 mt-1">Low clarity + High friction</p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6 — Strategy Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Packaging Strategy Intelligence</h3>
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
      {selectedSignal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ background: ISSUE_CONFIG[selectedSignal.packaging_issue_type].color + '20', color: ISSUE_CONFIG[selectedSignal.packaging_issue_type].color }} className="text-xs font-bold px-2 py-1 rounded">
                    {ISSUE_CONFIG[selectedSignal.packaging_issue_type].emoji} {ISSUE_CONFIG[selectedSignal.packaging_issue_type].label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${STATUS_CONFIG[selectedSignal.packaging_status].badge}`}>
                    {STATUS_CONFIG[selectedSignal.packaging_status].label}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedSignal.packaging_signal_title}</h3>
              </div>
              <button onClick={() => setSelectedSignal(null)} className="text-slate-400 hover:text-slate-600 text-2xl flex-shrink-0">×</button>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-slate-200">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-100 rounded-lg p-4">
                  <p className="text-2xl font-black text-slate-900">{selectedSignal.clarity_score || 0}%</p>
                  <p className="text-xs text-slate-600 mt-1">Clarity Score</p>
                </div>
                <div className="bg-slate-100 rounded-lg p-4">
                  <p className="text-2xl font-black text-slate-900">{selectedSignal.upgrade_friction_score || 0}%</p>
                  <p className="text-xs text-slate-600 mt-1">Friction Score</p>
                </div>
                <div className="bg-slate-100 rounded-lg p-4">
                  <p className="text-2xl font-black text-slate-900">${selectedSignal.revenue_impact_estimate || 0}k</p>
                  <p className="text-xs text-slate-600 mt-1">Revenue Potential</p>
                </div>
              </div>

              {/* Plan reference */}
              {getPlanName(selectedSignal.pricing_plan) && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Related Plan</p>
                  <p className="text-sm font-semibold text-blue-900">{getPlanName(selectedSignal.pricing_plan)}</p>
                </div>
              )}

              {/* Friction reasoning */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Upgrade Friction Explanation</p>
                <p className="text-sm text-slate-700">
                  {selectedSignal.upgrade_friction_score >= 70
                    ? 'High friction score indicates significant barriers to customer upgrades. This may be due to pricing jumps, unclear value differentiation, or confusing feature distribution.'
                    : selectedSignal.upgrade_friction_score >= 40
                    ? 'Moderate friction; customers show some hesitation during upgrade consideration. Review tier positioning and feature communication.'
                    : 'Low friction; customers move smoothly between tiers. Maintain current positioning strategy.'}
                </p>
              </div>

              {/* Packaging adjustment */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Recommended Adjustment</p>
                <p className="text-sm text-slate-700">{selectedSignal.recommended_packaging_adjustment || 'No specific adjustment documented'}</p>
              </div>
            </div>

            {/* Status Actions */}
            <div className="space-y-2">
              {selectedSignal.packaging_status === 'healthy' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedSignal.id, 'review')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    👀 Mark for Review
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                    🧪 Convert to Experiment
                  </button>
                </>
              )}
              {selectedSignal.packaging_status === 'review' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedSignal.id, 'healthy')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Confirm Healthy
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedSignal.id, 'redesign')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🔧 Mark for Redesign
                  </button>
                </>
              )}
              {selectedSignal.packaging_status === 'redesign' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedSignal.id, 'testing')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🧪 Move to Testing
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedSignal.id, 'review')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ↩️ Back to Review
                  </button>
                </>
              )}
              {selectedSignal.packaging_status === 'testing' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedSignal.id, 'healthy')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Approve & Implement
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedSignal.id, 'redesign')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ↩️ Back to Redesign
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