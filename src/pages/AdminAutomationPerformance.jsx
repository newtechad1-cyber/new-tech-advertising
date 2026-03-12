import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend, ComposedChart, Area, AreaChart
} from 'recharts';

const OPTIMIZATION_CONFIG = {
  healthy: { label: 'Healthy', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', color: '#10b981' },
  monitor: { label: 'Monitor', badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500', color: '#f59e0b' },
  optimize: { label: 'Optimize', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500', color: '#f97316' },
  underperforming: { label: 'Underperforming', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500', color: '#ef4444' },
};

const CATEGORY_COLORS = {
  sales: '#3b82f6',
  retention: '#10b981',
  expansion: '#f59e0b',
  funnel: '#ef4444',
  production: '#8b5cf6',
  reporting: '#06b6d4',
  ai_routing: '#ec4899',
};

export default function AdminAutomationPerformance() {
  const [metrics, setMetrics] = useState([]);
  const [rules, setRules] = useState([]);
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    Promise.all([
      base44.entities.AutomationPerformanceMetric.list('-business_impact_score', 100),
      base44.entities.AutomationRule.list('rule_name', 100),
      base44.entities.AutomationFlow.list('flow_name', 100),
    ]).then(([metricsData, rulesData, flowsData]) => {
      setMetrics(metricsData);
      setRules(rulesData);
      setFlows(flowsData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading automation performance…</div>
      </div>
    );
  }

  // Get name and category for rule or flow
  const getNameAndCategory = (metric) => {
    if (metric.automation_rule) {
      const rule = rules.find(r => r.id === metric.automation_rule);
      return {
        name: rule ? rule.rule_name : 'Unlinked Rule',
        category: rule ? rule.rule_category : 'unknown',
        type: 'rule',
      };
    }
    if (metric.automation_flow) {
      const flow = flows.find(f => f.id === metric.automation_flow);
      return {
        name: flow ? flow.flow_name : 'Unlinked Flow',
        category: flow ? flow.flow_category : 'unknown',
        type: 'flow',
      };
    }
    return { name: 'Unknown', category: 'unknown', type: 'unknown' };
  };

  // Filter metrics
  const filtered = metrics.filter(m => {
    if (filterStatus !== 'all' && m.optimization_status !== filterStatus) return false;
    if (filterType !== 'all' && getNameAndCategory(m).type !== filterType) return false;
    return true;
  });

  // KPIs
  const totalExecutions = metrics.reduce((sum, m) => sum + (m.executions_count || 0), 0);
  const avgSuccessRate = metrics.length > 0
    ? Math.round(metrics.reduce((sum, m) => sum + (m.success_rate_percent || 0), 0) / metrics.length)
    : 0;
  const highestImpactMetric = metrics.length > 0
    ? metrics.reduce((max, m) => (m.business_impact_score || 0) > (max.business_impact_score || 0) ? m : max)
    : null;
  const underperformingCount = metrics.filter(m => m.optimization_status === 'underperforming').length;
  const avgResponseTime = metrics.length > 0
    ? Math.round(metrics.reduce((sum, m) => sum + (m.avg_response_time_seconds || 0), 0) / metrics.length)
    : 0;

  // Success vs Impact matrix data
  const matrixData = filtered.map(m => ({
    ...m,
    ...getNameAndCategory(m),
    x: m.success_rate_percent || 0,
    y: m.business_impact_score || 0,
  }));

  // Trend data (mock based on recent metrics)
  const trendData = [
    { period: 'Mar 1', responseTime: 2.3, failureRate: 4.2 },
    { period: 'Mar 8', responseTime: 2.1, failureRate: 3.8 },
    { period: 'Mar 12', responseTime: 1.9, failureRate: 3.2 },
  ];

  // Category distribution
  const categoryData = Object.entries(CATEGORY_COLORS).map(([cat, color]) => {
    const metricsInCat = metrics.filter(m => getNameAndCategory(m).category === cat);
    return {
      name: cat.replace(/_/g, ' ').toUpperCase(),
      avgSuccessRate: metricsInCat.length > 0
        ? Math.round(metricsInCat.reduce((sum, m) => sum + (m.success_rate_percent || 0), 0) / metricsInCat.length)
        : 0,
      avgImpact: metricsInCat.length > 0
        ? Math.round(metricsInCat.reduce((sum, m) => sum + (m.business_impact_score || 0), 0) / metricsInCat.length)
        : 0,
      color,
      count: metricsInCat.length,
    };
  }).filter(item => item.count > 0);

  // Insights
  const insights = [];

  const retentionMetrics = metrics.filter(m => getNameAndCategory(m).category === 'retention_recovery');
  const highImpactRetention = retentionMetrics.filter(m => (m.business_impact_score || 0) > 80);
  if (highImpactRetention.length > 0) {
    const slowRetention = highImpactRetention.filter(m => (m.avg_response_time_seconds || 0) > 2);
    if (slowRetention.length > 0) {
      insights.push({
        type: 'alert',
        title: 'Retention Automation High Impact but Slower Response Time',
        description: `${slowRetention.length} retention automation(s) showing strong impact (80%+) but response time >2s. Optimization opportunity.`,
        action: '⚡ Profile response time bottlenecks; prioritize async processing improvements',
      });
    }
  }

  const funnelMetrics = metrics.filter(m => getNameAndCategory(m).category === 'funnel_to_sales');
  const lowImpactFunnel = funnelMetrics.filter(m => (m.business_impact_score || 0) < 50 && (m.executions_count || 0) > 10);
  if (lowImpactFunnel.length > 0) {
    insights.push({
      type: 'alert',
      title: `Funnel Automation Firing Often With Low Impact (${lowImpactFunnel.length})`,
      description: 'Funnel experiment automations executing frequently but not driving meaningful business outcomes.',
      action: '📊 Audit funnel automation triggers; consider consolidating low-impact experiments',
    });
  }

  const roiMetrics = metrics.filter(m => getNameAndCategory(m).category === 'roi_to_expansion');
  const strongRoi = roiMetrics.filter(m => (m.business_impact_score || 0) > 85 && (m.success_rate_percent || 0) > 90);
  if (strongRoi.length > 0) {
    insights.push({
      type: 'positive',
      title: 'ROI-Expansion Automations Producing Strong Outcomes—Ready to Scale',
      description: `${strongRoi.length} ROI-expansion automation(s) showing 85%+ impact and 90%+ success rate. High-confidence scaling opportunity.`,
      action: '🚀 Increase trigger frequency for ROI-expansion flows in top-performing verticals',
    });
  }

  const slaMetrics = metrics.filter(m => getNameAndCategory(m).category === 'production_trigger');
  const prioritySla = slaMetrics.filter(m => (m.business_impact_score || 0) > 80);
  if (prioritySla.length > 0) {
    insights.push({
      type: 'positive',
      title: 'SLA Escalation Automations High Value—Maintain Priority Protection',
      description: `${prioritySla.length} SLA escalation automation(s) showing 80%+ business impact. Critical to operations.`,
      action: '🛡️ SLA automations remain protected tier; monitor failure rate closely',
    });
  }

  const underperforming = metrics.filter(m => m.optimization_status === 'underperforming');
  if (underperforming.length > 2) {
    insights.push({
      type: 'alert',
      title: `${underperforming.length} Underperforming Automations—Review for Optimization or Deprecation`,
      description: 'Multiple automations flagged as underperforming. Plan remediation or sunset strategy.',
      action: '🔍 Schedule review meeting; prioritize high-cost underperforming automations for audit',
    });
  }

  const handleStatusUpdate = async (metricId, newStatus) => {
    await base44.entities.AutomationPerformanceMetric.update(metricId, { optimization_status: newStatus });
    setMetrics(metrics.map(m => m.id === metricId ? { ...m, optimization_status: newStatus } : m));
    setSelectedMetric(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">📊</div>
            <h1 className="text-3xl font-black text-white">Automation Performance Dashboard</h1>
          </div>
          <p className="text-slate-400 text-sm">Track effectiveness, reliability, and business impact across all automation rules and flows</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Executions</p>
            <p className="text-3xl font-black text-blue-400">{totalExecutions.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-2">Monthly volume</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Success Rate</p>
            <p className="text-3xl font-black text-emerald-400">{avgSuccessRate}%</p>
            <p className="text-xs text-slate-400 mt-2">All automations</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Highest Impact</p>
            <p className="text-xl font-black text-amber-400 truncate">
              {highestImpactMetric ? getNameAndCategory(highestImpactMetric).name : '—'}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {highestImpactMetric ? `${highestImpactMetric.business_impact_score}% impact` : 'No data'}
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Underperforming</p>
            <p className="text-3xl font-black text-red-400">{underperformingCount}</p>
            <p className="text-xs text-slate-400 mt-2">Need optimization</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Response Time</p>
            <p className="text-3xl font-black text-purple-400">{avgResponseTime}s</p>
            <p className="text-xs text-slate-400 mt-2">Execution speed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="monitor">Monitor</option>
            <option value="optimize">Optimize</option>
            <option value="underperforming">Underperforming</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg"
          >
            <option value="all">All Types</option>
            <option value="rule">Rules Only</option>
            <option value="flow">Flows Only</option>
          </select>
        </div>

        {/* SECTION 2 — Performance Grid */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Automation Performance Grid</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(metric => {
              const info = getNameAndCategory(metric);
              const optConfig = OPTIMIZATION_CONFIG[metric.optimization_status];
              return (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric)}
                  className={`rounded-xl p-5 text-left transition-all hover:shadow-lg ${optConfig.color === '#10b981' ? 'border-l-4 border-emerald-500' : optConfig.color === '#f59e0b' ? 'border-l-4 border-yellow-500' : optConfig.color === '#f97316' ? 'border-l-4 border-orange-500' : 'border-l-4 border-red-500'} bg-slate-800/60 backdrop-blur`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{info.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 capitalize">{info.type} • {info.category}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${optConfig.badge} capitalize flex-shrink-0`}>
                      {metric.optimization_status}
                    </span>
                  </div>

                  {/* Executions */}
                  <div className="mb-3 pb-3 border-b border-slate-700">
                    <p className="text-xs text-slate-400">{metric.executions_count || 0} executions</p>
                  </div>

                  {/* Success rate bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-400">Success</span>
                      <span className="text-sm font-bold text-emerald-400">{metric.success_rate_percent || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${metric.success_rate_percent || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Impact meter */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-400">Impact</span>
                      <span className="text-sm font-bold text-amber-400">{metric.business_impact_score || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${metric.business_impact_score || 0}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Success vs Impact Matrix */}
        {matrixData.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Success Rate vs Business Impact Matrix</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis type="number" dataKey="x" name="Success Rate %" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis type="number" dataKey="y" name="Business Impact %" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(val) => [Math.round(val), 'Score']}
                />
                <Scatter name="Automations" data={matrixData} fill="#3b82f6">
                  {matrixData.map((entry, index) => (
                    <Cell key={index} fill={OPTIMIZATION_CONFIG[entry.optimization_status].color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-400 mt-4 text-center">Higher right = High success & high impact (scale). Upper left = Low success but high impact (fix).</p>
          </div>
        )}

        {/* SECTION 5 — Failure & Response Time Trend */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Response Time & Failure Rate Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }} />
              <Legend />
              <Line type="monotone" dataKey="responseTime" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} name="Avg Response Time (s)" />
              <Line type="monotone" dataKey="failureRate" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} name="Failure Rate (%)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* SECTION 6 — Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Performance Intelligence & Optimization</h3>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className={`border rounded-xl p-5 ${
                  insight.type === 'positive'
                    ? 'bg-emerald-950/40 border-emerald-700'
                    : 'bg-rose-950/40 border-rose-700'
                } backdrop-blur`}>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">
                      {insight.type === 'positive' ? '✓' : '⚠️'}
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

        {/* SECTION 7 — Category Distribution */}
        {categoryData.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Performance by Automation Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  formatter={(val) => [Math.round(val) + '%', 'Avg Success']}
                />
                <Legend />
                <Bar dataKey="avgSuccessRate" fill="#10b981" radius={[6, 6, 0, 0]} name="Avg Success Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedMetric && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                  {getNameAndCategory(selectedMetric).type.toUpperCase()}
                </p>
                <h3 className="text-2xl font-black text-white mt-1">{getNameAndCategory(selectedMetric).name}</h3>
              </div>
              <button onClick={() => setSelectedMetric(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-slate-700">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Executions</p>
                  <p className="text-2xl font-black text-blue-400">{selectedMetric.executions_count || 0}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Success Rate</p>
                  <p className="text-2xl font-black text-emerald-400">{selectedMetric.success_rate_percent || 0}%</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Confidence</p>
                  <p className="text-2xl font-black text-amber-400">{selectedMetric.avg_confidence_score || 0}%</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Response Time</p>
                  <p className="text-2xl font-black text-purple-400">{selectedMetric.avg_response_time_seconds || 0}s</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Impact Score</p>
                  <p className="text-2xl font-black text-amber-400">{selectedMetric.business_impact_score || 0}%</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Failure Rate</p>
                  <p className="text-2xl font-black text-red-400">{selectedMetric.failure_rate_percent || 0}%</p>
                </div>
              </div>

              {/* Period info */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Metric Period</p>
                <p className="text-sm text-slate-300">{selectedMetric.metric_period_start}</p>
              </div>
            </div>

            {/* Status Actions */}
            <div className="space-y-2">
              {selectedMetric.optimization_status === 'healthy' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedMetric.id, 'monitor')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⚠️ Move to Monitor
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedMetric.id, 'optimize')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🔧 Mark for Optimization
                  </button>
                </>
              )}
              {selectedMetric.optimization_status === 'monitor' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedMetric.id, 'healthy')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Mark Healthy
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedMetric.id, 'optimize')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🔧 Mark for Optimization
                  </button>
                </>
              )}
              {selectedMetric.optimization_status === 'optimize' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedMetric.id, 'healthy')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Optimized—Mark Healthy
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedMetric.id, 'underperforming')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⛔ Mark Underperforming
                  </button>
                </>
              )}
              {selectedMetric.optimization_status === 'underperforming' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedMetric.id, 'optimize')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🔧 Attempt Optimization
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