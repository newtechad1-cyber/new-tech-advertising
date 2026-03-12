import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter } from 'recharts';

const VARIATION_CONFIG = {
  increase: { label: 'Price Increase', color: '#ef4444', emoji: '📈' },
  decrease: { label: 'Price Decrease', color: '#3b82f6', emoji: '📉' },
  bundled_value: { label: 'Bundled Value', color: '#10b981', emoji: '📦' },
  limited_discount: { label: 'Limited Discount', color: '#f59e0b', emoji: '💰' },
  trial_extension: { label: 'Trial Extension', color: '#8b5cf6', emoji: '⏱️' },
  feature_addition: { label: 'Feature Addition', color: '#06b6d4', emoji: '✨' },
};

const STATUS_CONFIG = {
  planned: { label: 'Planned', badge: 'bg-slate-100 text-slate-700', color: '#94a3b8' },
  running: { label: 'Running', badge: 'bg-blue-100 text-blue-700', color: '#3b82f6' },
  completed: { label: 'Completed', badge: 'bg-emerald-100 text-emerald-700', color: '#10b981' },
  paused: { label: 'Paused', badge: 'bg-yellow-100 text-yellow-700', color: '#eab308' },
};

export default function AdminPricingExperiments() {
  const [experiments, setExperiments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVariation, setFilterVariation] = useState('all');

  useEffect(() => {
    Promise.all([
      base44.entities.PricingExperiment.list('-revenue_per_client_change_percent', 100),
      base44.entities.PricingPlanPerformance.list('pricing_plan_name', 100),
    ]).then(([experimentsData, plansData]) => {
      setExperiments(experimentsData);
      setPlans(plansData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading pricing experiments…</div>
      </div>
    );
  }

  const getPlanName = (planId) => {
    if (!planId) return null;
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.pricing_plan_name : null;
  };

  // Filter experiments
  const filtered = experiments.filter(e => {
    if (filterStatus !== 'all' && e.experiment_status !== filterStatus) return false;
    if (filterVariation !== 'all' && e.price_variation_type !== filterVariation) return false;
    return true;
  });

  // KPIs
  const activeExperiments = experiments.filter(e => e.experiment_status === 'running').length;
  const highestRevenueLiftExp = experiments.length > 0
    ? experiments.reduce((max, e) => (e.revenue_per_client_change_percent || 0) > (max.revenue_per_client_change_percent || 0) ? e : max)
    : null;
  const highestElasticityExp = experiments.length > 0
    ? experiments.reduce((max, e) => (e.elasticity_score || 0) > (max.elasticity_score || 0) ? e : max)
    : null;
  const completedThisMonth = experiments.filter(e => e.experiment_status === 'completed').length;
  const pricingConfidenceIndex = experiments.length > 0
    ? Math.round(experiments.filter(e => e.experiment_status === 'completed').length / experiments.length * 100)
    : 0;

  // Price variation distribution
  const variationDistribution = Object.keys(VARIATION_CONFIG).map(type => ({
    name: VARIATION_CONFIG[type].label,
    count: experiments.filter(e => e.price_variation_type === type).length,
    color: VARIATION_CONFIG[type].color,
  })).filter(item => item.count > 0);

  // Matrix data
  const matrixData = filtered.map(e => ({
    x: e.elasticity_score || 0,
    y: e.revenue_per_client_change_percent || 0,
    name: e.experiment_name,
    status: e.experiment_status,
    color: STATUS_CONFIG[e.experiment_status].color,
  }));

  // Insights
  const insights = [];

  const premiumTests = experiments.filter(e => {
    const planName = getPlanName(e.target_pricing_plan);
    return planName && planName.toLowerCase().includes('premium');
  });
  const strongPremiumTests = premiumTests.filter(e => (e.conversion_rate_change_percent || 0) > -5);
  if (strongPremiumTests.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Premium Positioning Maintaining Conversion Strength',
      description: `Premium tier tests showing resilient conversion rates (${strongPremiumTests.length} test(s)). Market willing to pay for premium positioning.`,
      action: '💎 Lock in premium price positioning; test additional feature add-ons',
    });
  }

  const bundleTests = experiments.filter(e => e.price_variation_type === 'bundled_value' && e.experiment_status === 'completed');
  const successfulBundles = bundleTests.filter(e => (e.revenue_per_client_change_percent || 0) > 5);
  if (successfulBundles.length > 0) {
    insights.push({
      type: 'positive',
      title: `Bundled Authority Content Increasing Perceived Value`,
      description: `${successfulBundles.length} bundle test(s) showing positive revenue lift. Customers value combined offerings.`,
      action: '📦 Roll out successful bundles to production; test additional bundle combinations',
    });
  }

  const discountTests = experiments.filter(e => e.price_variation_type === 'limited_discount');
  const negativeDiscounts = discountTests.filter(e => (e.revenue_per_client_change_percent || 0) < -8);
  if (negativeDiscounts.length > 0) {
    insights.push({
      type: 'alert',
      title: `Discount-Based Tests Reducing Long-Term Margin Strength`,
      description: `${negativeDiscounts.length} discount test(s) showing significant revenue decline. Discounting may train customers to wait for deals.`,
      action: '⚠️ Shift from discounts to value-add bundling; focus on conversion, not price cuts',
    });
  }

  const highElasticityTests = experiments.filter(e => (e.elasticity_score || 0) > 70);
  if (highElasticityTests.length > 1) {
    insights.push({
      type: 'alert',
      title: `${highElasticityTests.length} Highly Elastic Segments Detected`,
      description: 'Market shows high price sensitivity in certain segments. Volume gains from lower prices offset by margin loss.',
      action: '🎯 Target high-elasticity segments with value communication rather than price reductions',
    });
  }

  const increaseTests = experiments.filter(e => e.price_variation_type === 'increase');
  const successfulIncreases = increaseTests.filter(e => (e.conversion_rate_change_percent || 0) > -15);
  if (successfulIncreases.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Price Increases Sustainable With Strong Value Messaging',
      description: `${successfulIncreases.length} price increase test(s) maintained conversions. Market accepting premium positioning.`,
      action: '📈 Test larger price increases; correlate messaging quality with conversion resilience',
    });
  }

  const handleStatusUpdate = async (experimentId, newStatus) => {
    await base44.entities.PricingExperiment.update(experimentId, { experiment_status: newStatus });
    setExperiments(experiments.map(e => e.id === experimentId ? { ...e, experiment_status: newStatus } : e));
    setSelectedExperiment(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🧪</div>
            <h1 className="text-3xl font-black text-slate-900">Pricing Experiments</h1>
          </div>
          <p className="text-slate-600 text-sm">Track pricing tests, elasticity signals, price sensitivity indicators, and revenue response patterns</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Active Experiments</p>
            <p className="text-3xl font-black text-blue-600">{activeExperiments}</p>
            <p className="text-xs text-slate-600 mt-2">Currently running</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Highest Revenue Lift</p>
            <p className="text-sm font-black text-slate-900 truncate">{highestRevenueLiftExp?.experiment_name || '—'}</p>
            <p className="text-xs text-slate-600 mt-2">{highestRevenueLiftExp?.revenue_per_client_change_percent || 0}% lift</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Highest Elasticity</p>
            <p className="text-sm font-black text-slate-900 truncate">{highestElasticityExp?.experiment_name || '—'}</p>
            <p className="text-xs text-slate-600 mt-2">{highestElasticityExp?.elasticity_score || 0}% score</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Completed This Month</p>
            <p className="text-3xl font-black text-emerald-600">{completedThisMonth}</p>
            <p className="text-xs text-slate-600 mt-2">Finished tests</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Pricing Confidence</p>
            <p className="text-3xl font-black text-purple-600">{pricingConfidenceIndex}%</p>
            <p className="text-xs text-slate-600 mt-2">Test completion rate</p>
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
            <option value="planned">Planned</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
          <select
            value={filterVariation}
            onChange={(e) => setFilterVariation(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
          >
            <option value="all">All Variations</option>
            <option value="increase">Price Increase</option>
            <option value="decrease">Price Decrease</option>
            <option value="bundled_value">Bundled Value</option>
            <option value="limited_discount">Limited Discount</option>
            <option value="trial_extension">Trial Extension</option>
            <option value="feature_addition">Feature Addition</option>
          </select>
        </div>

        {/* SECTION 2 — Experiment Grid */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Experiment Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(exp => {
              const variationConfig = VARIATION_CONFIG[exp.price_variation_type];
              const statusConfig = STATUS_CONFIG[exp.experiment_status];
              const planName = getPlanName(exp.target_pricing_plan);
              const priceChange = ((exp.test_price - exp.baseline_price) / exp.baseline_price * 100).toFixed(1);
              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExperiment(exp)}
                  className="rounded-xl p-5 text-left transition-all hover:shadow-lg bg-white border border-slate-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{exp.experiment_name}</h4>
                      {planName && <p className="text-xs text-slate-600 mt-1">Plan: {planName}</p>}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0`} style={{ background: variationConfig.color + '20', color: variationConfig.color }}>
                      {variationConfig.emoji}
                    </span>
                  </div>

                  {/* Price comparison */}
                  <div className="mb-3 pb-3 border-b border-slate-200">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>${exp.baseline_price} → ${exp.test_price}</span>
                      <span className={`font-bold ${parseFloat(priceChange) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {parseFloat(priceChange) > 0 ? '+' : ''}{priceChange}%
                      </span>
                    </div>
                  </div>

                  {/* Conversion change */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Conversion Change</span>
                      <span className={`text-sm font-bold ${(exp.conversion_rate_change_percent || 0) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {(exp.conversion_rate_change_percent || 0) > 0 ? '+' : ''}{exp.conversion_rate_change_percent || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${(exp.conversion_rate_change_percent || 0) > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(Math.abs(exp.conversion_rate_change_percent || 0), 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Revenue change meter */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Revenue per Client</span>
                      <span className={`text-sm font-bold ${(exp.revenue_per_client_change_percent || 0) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {(exp.revenue_per_client_change_percent || 0) > 0 ? '+' : ''}{exp.revenue_per_client_change_percent || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${(exp.revenue_per_client_change_percent || 0) > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(Math.abs(exp.revenue_per_client_change_percent || 0), 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Elasticity and status */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-600">Elasticity: {exp.elasticity_score || 0}%</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${statusConfig.badge}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 5 — Price Variation Distribution */}
        {variationDistribution.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Experiment Distribution by Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={variationDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, color: '#1e293b' }}
                  formatter={(val) => [val, 'Tests']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {variationDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 4 — Elasticity vs Revenue Impact Matrix */}
        {matrixData.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Elasticity vs Revenue Impact Matrix</h3>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Elasticity Score"
                  label={{ value: 'Elasticity Score →', position: 'insideBottomRight', offset: -5 }}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Revenue Change %"
                  label={{ value: '← Revenue Change %', angle: -90, position: 'insideLeft' }}
                  domain={[-50, 50]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12 }}
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(val) => Math.round(val) + '%'}
                />
                <Scatter name="Pricing Tests" data={matrixData} fill="#8884d8">
                  {matrixData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                <p className="font-bold text-emerald-900">💎 Low Elasticity + High Lift</p>
                <p className="text-emerald-800 mt-1">Market insensitive to price; high margin gains</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="font-bold text-red-900">📉 High Elasticity + Low Lift</p>
                <p className="text-red-800 mt-1">Market price-sensitive; margin pressure</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="font-bold text-blue-900">🚀 High Elasticity + High Lift</p>
                <p className="text-blue-800 mt-1">Volume gains offset margin decline</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <p className="font-bold text-slate-900">⚠️ Low Elasticity + Low Lift</p>
                <p className="text-slate-700 mt-1">Test may lack sufficient differentiation</p>
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
      {selectedExperiment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ background: VARIATION_CONFIG[selectedExperiment.price_variation_type].color + '20', color: VARIATION_CONFIG[selectedExperiment.price_variation_type].color }} className="text-xs font-bold px-2 py-1 rounded">
                    {VARIATION_CONFIG[selectedExperiment.price_variation_type].emoji} {VARIATION_CONFIG[selectedExperiment.price_variation_type].label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${STATUS_CONFIG[selectedExperiment.experiment_status].badge}`}>
                    {STATUS_CONFIG[selectedExperiment.experiment_status].label}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedExperiment.experiment_name}</h3>
              </div>
              <button onClick={() => setSelectedExperiment(null)} className="text-slate-400 hover:text-slate-600 text-2xl flex-shrink-0">×</button>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-slate-200">
              {/* Pricing comparison */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Pricing Test</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-black text-slate-900">${selectedExperiment.baseline_price}</p>
                    <p className="text-xs text-slate-600 mt-1">Baseline</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-2xl">→</div>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-black text-blue-900">${selectedExperiment.test_price}</p>
                    <p className="text-xs text-blue-600 mt-1">Test Price</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-3">
                  Price adjustment: {selectedExperiment.test_price > selectedExperiment.baseline_price ? '+' : ''}{(((selectedExperiment.test_price - selectedExperiment.baseline_price) / selectedExperiment.baseline_price) * 100).toFixed(1)}%
                </p>
              </div>

              {/* Conversion & Revenue Impact */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Market Response</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">Conversion Rate Change</span>
                      <span className={`text-lg font-black ${(selectedExperiment.conversion_rate_change_percent || 0) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {(selectedExperiment.conversion_rate_change_percent || 0) > 0 ? '+' : ''}{selectedExperiment.conversion_rate_change_percent || 0}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${(selectedExperiment.conversion_rate_change_percent || 0) > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(Math.abs(selectedExperiment.conversion_rate_change_percent || 0), 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">Revenue per Client Change</span>
                      <span className={`text-lg font-black ${(selectedExperiment.revenue_per_client_change_percent || 0) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {(selectedExperiment.revenue_per_client_change_percent || 0) > 0 ? '+' : ''}{selectedExperiment.revenue_per_client_change_percent || 0}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${(selectedExperiment.revenue_per_client_change_percent || 0) > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(Math.abs(selectedExperiment.revenue_per_client_change_percent || 0), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Elasticity explanation */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Price Elasticity Score</p>
                <p className="text-3xl font-black text-slate-900 mb-2">{selectedExperiment.elasticity_score || 0}%</p>
                <p className="text-sm text-slate-700">
                  {selectedExperiment.elasticity_score >= 70
                    ? '📊 High elasticity: Market is very price-sensitive. Volume response outweighs margin impact.'
                    : selectedExperiment.elasticity_score >= 40
                    ? '📈 Moderate elasticity: Market shows reasonable price sensitivity. Balance pricing and positioning.'
                    : '💎 Low elasticity: Market shows price insensitivity. Value positioning can support premium pricing.'}
                </p>
              </div>

              {/* Pricing reasoning */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Experiment Insights</p>
                <p className="text-sm text-slate-700">
                  {selectedExperiment.revenue_per_client_change_percent >= 10
                    ? 'Strong revenue lift detected. This pricing strategy increased customer lifetime value.'
                    : selectedExperiment.revenue_per_client_change_percent >= 0
                    ? 'Positive revenue impact. Strategy maintains margin while preserving conversions.'
                    : selectedExperiment.conversion_rate_change_percent > -5
                    ? 'Acceptable tradeoff: Conversion resilience offset margin pressure.'
                    : 'Both conversion and margin declined. This pricing strategy needs adjustment.'}
                </p>
              </div>
            </div>

            {/* Status Actions */}
            <div className="space-y-2">
              {selectedExperiment.experiment_status === 'planned' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedExperiment.id, 'running')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🚀 Launch Experiment
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedExperiment.id, 'paused')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⏸️ Pause Experiment
                  </button>
                </>
              )}
              {selectedExperiment.experiment_status === 'running' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedExperiment.id, 'completed')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Complete Experiment
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedExperiment.id, 'paused')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⏸️ Pause Test
                  </button>
                </>
              )}
              {selectedExperiment.experiment_status === 'completed' && (
                <>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                    ✓ Mark Winning Price
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedExperiment.id, 'running')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🔄 Relaunch Test
                  </button>
                </>
              )}
              {selectedExperiment.experiment_status === 'paused' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedExperiment.id, 'running')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🚀 Resume Experiment
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedExperiment.id, 'planned')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ↩️ Revert to Planned
                  </button>
                </>
              )}
              <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 text-sm font-bold py-2 rounded-lg transition-colors">
                📋 Convert to Packaging Redesign
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}