import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, Legend } from 'recharts';

const PACKAGING_CONFIG = {
  strong: { label: 'Strong', badge: 'bg-emerald-100 text-emerald-700', color: '#10b981' },
  monitor: { label: 'Monitor', badge: 'bg-yellow-100 text-yellow-700', color: '#eab308' },
  optimize: { label: 'Optimize', badge: 'bg-orange-100 text-orange-700', color: '#f97316' },
  reposition: { label: 'Reposition', badge: 'bg-red-100 text-red-700', color: '#ef4444' },
};

export default function AdminPricingIntelligence() {
  const [plans, setPlans] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVertical, setFilterVertical] = useState('all');

  useEffect(() => {
    Promise.all([
      base44.entities.PricingPlanPerformance.list('-average_monthly_revenue', 100),
      base44.entities.IndustryVertical?.list?.('vertical_name', 100).catch(() => []),
    ]).then(([plansData, verticalsData]) => {
      setPlans(plansData);
      setVerticals(verticalsData || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading pricing intelligence…</div>
      </div>
    );
  }

  const getVerticalName = (verticalId) => {
    if (!verticalId) return null;
    const vertical = verticals.find(v => v.id === verticalId);
    return vertical ? vertical.vertical_name : null;
  };

  // Filter plans
  const filtered = plans.filter(p => {
    if (filterStatus !== 'all' && p.packaging_status !== filterStatus) return false;
    if (filterVertical !== 'all' && p.target_vertical !== filterVertical) return false;
    return true;
  });

  // KPIs
  const activePlans = plans.length;
  const highestRevenuePlan = plans.length > 0
    ? plans.reduce((max, p) => (p.average_monthly_revenue || 0) > (max.average_monthly_revenue || 0) ? p : max)
    : null;
  const strongestMarginPlan = plans.length > 0
    ? plans.reduce((max, p) => (p.margin_strength_score || 0) > (max.margin_strength_score || 0) ? p : max)
    : null;
  const plansNeedingOptimization = plans.filter(p => p.packaging_status === 'optimize' || p.packaging_status === 'reposition').length;
  const avgPerceivedValue = plans.length > 0
    ? Math.round(plans.reduce((sum, p) => sum + (p.perceived_value_score || 0), 0) / plans.length)
    : 0;

  // Revenue distribution
  const revenueDistribution = filtered.map(p => ({
    name: p.pricing_plan_name,
    revenue: p.average_monthly_revenue || 0,
    clients: p.active_clients_count || 0,
  })).sort((a, b) => b.revenue - a.revenue);

  // Matrix data
  const matrixData = filtered.map(p => ({
    x: p.expansion_upgrade_rate_percent || 0,
    y: p.churn_rate_percent || 0,
    name: p.pricing_plan_name,
    status: p.packaging_status,
    color: PACKAGING_CONFIG[p.packaging_status].color,
  }));

  // Insights
  const insights = [];

  const strongPlans = plans.filter(p => p.packaging_status === 'strong');
  const maxValuePlan = strongPlans.length > 0
    ? strongPlans.reduce((max, p) => (p.perceived_value_score || 0) > (max.perceived_value_score || 0) ? p : max)
    : null;
  if (maxValuePlan) {
    insights.push({
      type: 'positive',
      title: `${maxValuePlan.pricing_plan_name} Showing Strongest Perceived Value`,
      description: `${maxValuePlan.pricing_plan_name} with ${maxValuePlan.perceived_value_score || 0}% perceived value and ${maxValuePlan.active_clients_count || 0} active clients. Market positioning resonating with target audience.`,
      action: '💎 Maintain strong positioning; use as template for other tier packaging',
    });
  }

  const starterPlan = plans.find(p => p.pricing_plan_name.toLowerCase().includes('starter'));
  if (starterPlan && (starterPlan.churn_rate_percent || 0) > 12) {
    insights.push({
      type: 'alert',
      title: 'Starter Plan Experiencing Higher Churn in Competitive Markets',
      description: `${starterPlan.pricing_plan_name} showing ${starterPlan.churn_rate_percent || 0}% churn. Competitive pressure may be driving downgrade or switch-out decisions.`,
      action: '📊 Review starter tier positioning; consider value-add features to reduce churn velocity',
    });
  }

  const highUpgradePlans = plans.filter(p => (p.expansion_upgrade_rate_percent || 0) > 25);
  if (highUpgradePlans.length > 0) {
    insights.push({
      type: 'positive',
      title: `${highUpgradePlans.length} Plan(s) Driving Strong Upgrade Velocity`,
      description: `${highUpgradePlans.map(p => p.pricing_plan_name).join(', ')} showing upgrade rates above 25%. Packaging is guiding customers toward higher-value tiers.`,
      action: '🚀 Accelerate expansion packaging strategy; increase go-to-market investment',
    });
  }

  const repositionPlans = plans.filter(p => p.packaging_status === 'reposition');
  if (repositionPlans.length > 0) {
    insights.push({
      type: 'alert',
      title: `${repositionPlans.length} Plan(s) Requiring Strategic Repositioning`,
      description: `${repositionPlans.map(p => p.pricing_plan_name).join(', ')} underperforming on value perception and retention. Market fit and positioning need reassessment.`,
      action: '⚠️ Conduct pricing strategy review; test messaging and packaging against competitor offerings',
    });
  }

  const totalMonthlyRevenue = plans.reduce((sum, p) => sum + (p.average_monthly_revenue || 0), 0);
  const topPlan = plans.length > 0
    ? plans.reduce((max, p) => (p.average_monthly_revenue || 0) > (max.average_monthly_revenue || 0) ? p : max)
    : null;
  if (topPlan) {
    const topRevenuePct = Math.round(((topPlan.average_monthly_revenue || 0) / totalMonthlyRevenue) * 100);
    if (topRevenuePct > 50) {
      insights.push({
        type: 'alert',
        title: `Revenue Concentration Risk: ${topPlan.pricing_plan_name} Dominates Portfolio`,
        description: `${topPlan.pricing_plan_name} represents ${topRevenuePct}% of total plan revenue. Concentration risk if this tier faces market headwinds.`,
        action: '💰 Diversify tier adoption; strengthen positioning of underperforming plans',
      });
    }
  }

  const handleStatusUpdate = async (planId, newStatus) => {
    await base44.entities.PricingPlanPerformance.update(planId, { packaging_status: newStatus });
    setPlans(plans.map(p => p.id === planId ? { ...p, packaging_status: newStatus } : p));
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">💰</div>
            <h1 className="text-3xl font-black text-slate-900">Pricing Intelligence</h1>
          </div>
          <p className="text-slate-600 text-sm">Analyze plan performance, adoption, revenue distribution, and packaging effectiveness</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Active Plans</p>
            <p className="text-3xl font-black text-blue-600">{activePlans}</p>
            <p className="text-xs text-slate-600 mt-2">Pricing tiers</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Highest Revenue</p>
            <p className="text-sm font-black text-slate-900 truncate">{highestRevenuePlan?.pricing_plan_name || '—'}</p>
            <p className="text-xs text-slate-600 mt-2">${highestRevenuePlan?.average_monthly_revenue || 0}/mo</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Strongest Margin</p>
            <p className="text-sm font-black text-slate-900 truncate">{strongestMarginPlan?.pricing_plan_name || '—'}</p>
            <p className="text-xs text-slate-600 mt-2">{strongestMarginPlan?.margin_strength_score || 0}%</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Needing Optimization</p>
            <p className="text-3xl font-black text-orange-600">{plansNeedingOptimization}</p>
            <p className="text-xs text-slate-600 mt-2">Optimize/Reposition</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Avg Perceived Value</p>
            <p className="text-3xl font-black text-purple-600">{avgPerceivedValue}%</p>
            <p className="text-xs text-slate-600 mt-2">Customer perception</p>
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
            <option value="strong">Strong</option>
            <option value="monitor">Monitor</option>
            <option value="optimize">Optimize</option>
            <option value="reposition">Reposition</option>
          </select>
          {verticals.length > 0 && (
            <select
              value={filterVertical}
              onChange={(e) => setFilterVertical(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
            >
              <option value="all">All Verticals</option>
              {verticals.map(v => (
                <option key={v.id} value={v.id}>{v.vertical_name}</option>
              ))}
            </select>
          )}
        </div>

        {/* SECTION 2 — Pricing Plan Grid */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Pricing Plan Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(plan => {
              const statusConfig = PACKAGING_CONFIG[plan.packaging_status];
              const verticalName = getVerticalName(plan.target_vertical);
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className="rounded-xl p-5 text-left transition-all hover:shadow-lg bg-white border border-slate-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{plan.pricing_plan_name}</h4>
                      {verticalName && <p className="text-xs text-slate-600 mt-1">{verticalName}</p>}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${statusConfig.badge} capitalize flex-shrink-0`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Clients and revenue */}
                  <div className="mb-3 pb-3 border-b border-slate-200">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>{plan.active_clients_count || 0} clients</span>
                      <span className="font-semibold text-slate-900">${plan.average_monthly_revenue || 0}/mo</span>
                    </div>
                  </div>

                  {/* Upgrade rate bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Upgrade Rate</span>
                      <span className="text-sm font-bold text-blue-600">{plan.expansion_upgrade_rate_percent || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.min(plan.expansion_upgrade_rate_percent || 0, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Churn indicator */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Churn Rate</span>
                      <span className={`text-sm font-bold ${(plan.churn_rate_percent || 0) > 15 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {plan.churn_rate_percent || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${(plan.churn_rate_percent || 0) > 15 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(plan.churn_rate_percent || 0, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Margin strength */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Margin</span>
                      <span className="text-sm font-bold text-slate-700">{plan.margin_strength_score || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${plan.margin_strength_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Value score */}
                  <div className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                    🎯 Value Score: <span className="font-bold text-slate-900">{plan.perceived_value_score || 0}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Revenue Distribution */}
        {revenueDistribution.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Revenue Distribution by Plan</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, color: '#1e293b' }}
                  formatter={(val) => ['$' + val.toLocaleString(), 'Monthly Revenue']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 5 — Upgrade vs Churn Matrix */}
        {matrixData.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Upgrade vs Churn Matrix</h3>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Upgrade Rate %"
                  label={{ value: 'Upgrade Rate % →', position: 'insideBottomRight', offset: -5 }}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Churn Rate %"
                  label={{ value: '← Churn Rate %', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12 }}
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(val) => Math.round(val) + '%'}
                />
                <Scatter name="Pricing Plans" data={matrixData} fill="#8884d8">
                  {matrixData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                <p className="font-bold text-emerald-900">✓ Ideal Zone</p>
                <p className="text-emerald-800 mt-1">High Upgrade + Low Churn</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="font-bold text-red-900">⚠️ At-Risk Zone</p>
                <p className="text-red-800 mt-1">Low Upgrade + High Churn</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <p className="font-bold text-orange-900">🔄 Growth Zone</p>
                <p className="text-orange-800 mt-1">High Upgrade + High Churn</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <p className="font-bold text-slate-900">📍 Stable Zone</p>
                <p className="text-slate-700 mt-1">Low Upgrade + Low Churn</p>
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
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${PACKAGING_CONFIG[selectedPlan.packaging_status].badge} capitalize`}>
                    {PACKAGING_CONFIG[selectedPlan.packaging_status].label}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedPlan.pricing_plan_name}</h3>
              </div>
              <button onClick={() => setSelectedPlan(null)} className="text-slate-400 hover:text-slate-600 text-2xl flex-shrink-0">×</button>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-slate-200">
              {/* Revenue summary */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Revenue Summary</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-100 rounded-lg p-4">
                    <p className="text-2xl font-black text-slate-900">${selectedPlan.average_monthly_revenue || 0}</p>
                    <p className="text-xs text-slate-600 mt-1">Monthly Revenue</p>
                  </div>
                  <div className="bg-slate-100 rounded-lg p-4">
                    <p className="text-2xl font-black text-slate-900">{selectedPlan.active_clients_count || 0}</p>
                    <p className="text-xs text-slate-600 mt-1">Active Clients</p>
                  </div>
                  <div className="bg-slate-100 rounded-lg p-4">
                    <p className="text-2xl font-black text-slate-900">${selectedPlan.average_monthly_revenue && selectedPlan.active_clients_count ? Math.round((selectedPlan.average_monthly_revenue || 0) / (selectedPlan.active_clients_count || 1)) : 0}</p>
                    <p className="text-xs text-slate-600 mt-1">ARPU</p>
                  </div>
                </div>
              </div>

              {/* Upgrade behavior */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Upgrade Behavior</p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">Expansion Upgrade Rate</span>
                    <span className="text-lg font-black text-blue-600">{selectedPlan.expansion_upgrade_rate_percent || 0}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(selectedPlan.expansion_upgrade_rate_percent || 0, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    {selectedPlan.expansion_upgrade_rate_percent >= 25
                      ? '✓ Strong upgrade velocity driving expansion revenue'
                      : 'Monitor upgrade funnel; opportunities to improve tier positioning'}
                  </p>
                </div>
              </div>

              {/* Churn signals */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Churn Signals</p>
                <div className={`rounded-lg p-4 ${(selectedPlan.churn_rate_percent || 0) > 15 ? 'bg-red-50' : 'bg-emerald-50'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">Churn Rate</span>
                    <span className={`text-lg font-black ${(selectedPlan.churn_rate_percent || 0) > 15 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {selectedPlan.churn_rate_percent || 0}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${(selectedPlan.churn_rate_percent || 0) > 15 ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(selectedPlan.churn_rate_percent || 0, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs mt-2" style={{ color: (selectedPlan.churn_rate_percent || 0) > 15 ? '#7f1d1d' : '#065f46' }}>
                    {(selectedPlan.churn_rate_percent || 0) > 15
                      ? '⚠️ Higher-than-normal churn suggests value communication or fit issues'
                      : '✓ Healthy retention; value proposition resonating with market'}
                  </p>
                </div>
              </div>

              {/* Margins and value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Margin Strength</p>
                  <p className="text-2xl font-black text-slate-900">{selectedPlan.margin_strength_score || 0}%</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Perceived Value</p>
                  <p className="text-2xl font-black text-slate-900">{selectedPlan.perceived_value_score || 0}%</p>
                </div>
              </div>

              {/* Positioning reasoning */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Pricing Positioning</p>
                <p className="text-sm text-slate-700">
                  {PACKAGING_CONFIG[selectedPlan.packaging_status].label} status tier with {selectedPlan.active_clients_count || 0} active clients generating ${selectedPlan.average_monthly_revenue || 0}/mo. 
                  {selectedPlan.perceived_value_score && selectedPlan.perceived_value_score > 75
                    ? ' Market perceives strong value; pricing strategy aligned with customer expectations.'
                    : ' Opportunity to strengthen value positioning or messaging.'}
                </p>
              </div>
            </div>

            {/* Status Actions */}
            <div className="space-y-2">
              {selectedPlan.packaging_status === 'strong' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedPlan.id, 'monitor')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    👀 Move to Monitor
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                    🧪 Flag Pricing Experiment
                  </button>
                </>
              )}
              {selectedPlan.packaging_status === 'monitor' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedPlan.id, 'strong')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Confirm Strong
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedPlan.id, 'optimize')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🔧 Move to Optimize
                  </button>
                </>
              )}
              {selectedPlan.packaging_status === 'optimize' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedPlan.id, 'monitor')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    👀 Back to Monitor
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedPlan.id, 'reposition')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🔄 Mark Reposition
                  </button>
                </>
              )}
              {selectedPlan.packaging_status === 'reposition' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedPlan.id, 'optimize')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ↩️ Back to Optimize
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                    🧪 Test New Positioning
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