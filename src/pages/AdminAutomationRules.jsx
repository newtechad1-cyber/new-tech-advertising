import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, CheckCircle, ToggleRight } from 'lucide-react';

const CATEGORY_CONFIG = {
  sales_trigger: { label: 'Sales Trigger', emoji: '💰', color: '#3b82f6' },
  retention_trigger: { label: 'Retention Trigger', emoji: '🛡️', color: '#10b981' },
  expansion_trigger: { label: 'Expansion Trigger', emoji: '🚀', color: '#f59e0b' },
  funnel_trigger: { label: 'Funnel Trigger', emoji: '⚡', color: '#ec4899' },
  production_trigger: { label: 'Production Trigger', emoji: '⚙️', color: '#8b5cf6' },
  reporting_trigger: { label: 'Reporting Trigger', emoji: '📊', color: '#06b6d4' },
  ai_routing_trigger: { label: 'AI Routing Trigger', emoji: '🤖', color: '#ef4444' },
};

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: 'bg-red-100', textColor: 'text-red-700', dot: 'bg-red-500' },
  high: { label: 'High', color: 'bg-orange-100', textColor: 'text-orange-700', dot: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'bg-yellow-100', textColor: 'text-yellow-700', dot: 'bg-yellow-500' },
  low: { label: 'Low', color: 'bg-slate-100', textColor: 'text-slate-700', dot: 'bg-slate-400' },
};

const STATUS_CONFIG = {
  active: { label: 'Active', badge: 'bg-emerald-100 text-emerald-700', border: 'border-l-4 border-emerald-500' },
  paused: { label: 'Paused', badge: 'bg-amber-100 text-amber-700', border: 'border-l-4 border-amber-500' },
  testing: { label: 'Testing', badge: 'bg-blue-100 text-blue-700', border: 'border-l-4 border-blue-500' },
  deprecated: { label: 'Deprecated', badge: 'bg-slate-100 text-slate-700', border: 'border-l-4 border-slate-500' },
};

export default function AdminAutomationRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    base44.entities.AutomationRule.list('-priority_level', 100)
      .then((data) => {
        setRules(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading automation rules…</div>
      </div>
    );
  }

  // Filter rules
  const filtered = rules.filter(r => {
    if (filterStatus !== 'all' && r.rule_status !== filterStatus) return false;
    if (filterCategory !== 'all' && r.rule_category !== filterCategory) return false;
    return true;
  });

  // KPIs
  const activeRules = rules.filter(r => r.rule_status === 'active').length;
  const criticalRules = rules.filter(r => r.priority_level === 'critical').length;
  const executedThisMonth = rules.reduce((sum, r) => sum + (r.execution_frequency_monthly || 0), 0);
  const avgConfidence = rules.length > 0
    ? Math.round(rules.reduce((sum, r) => sum + (r.automation_confidence || 0), 0) / rules.length)
    : 0;
  const impactIndex = rules.length > 0
    ? Math.round(rules.reduce((sum, r) => sum + (r.operational_impact_score || 0), 0) / rules.length)
    : 0;

  // Category distribution
  const categoryDistribution = Object.keys(CATEGORY_CONFIG).map(cat => ({
    name: CATEGORY_CONFIG[cat].label,
    count: rules.filter(r => r.rule_category === cat).length,
    color: CATEGORY_CONFIG[cat].color,
  })).filter(item => item.count > 0);

  // Insights
  const insights = [];

  const retentionRules = rules.filter(r => r.rule_category === 'retention_trigger' && r.rule_status === 'active');
  const strongRetention = retentionRules.filter(r => (r.operational_impact_score || 0) > 75);
  if (strongRetention.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Retention-Trigger Rules Producing Strong Revenue Protection',
      description: `${strongRetention.length} retention rule(s) with 75%+ operational impact. Proactive churn prevention active.`,
      action: '🛡️ Monitor retention rule execution frequency; consider increasing trigger sensitivity',
    });
  }

  const funnelRules = rules.filter(r => r.rule_category === 'funnel_trigger' && r.rule_status === 'active');
  if (funnelRules.length > 0) {
    const highVelocity = funnelRules.filter(r => (r.execution_frequency_monthly || 0) > 20);
    if (highVelocity.length > 0) {
      insights.push({
        type: 'positive',
        title: 'Funnel-Trigger Rules Increasing Experiment Velocity',
        description: `${highVelocity.length} funnel rule(s) executing 20%+ times monthly. Fast feedback loop active.`,
        action: '⚡ Ensure funnel rules are fed into A/B test scheduler for continuous optimization',
      });
    }
  }

  const aiRules = rules.filter(r => r.rule_category === 'ai_routing_trigger' && r.rule_status === 'active');
  if (aiRules.length > 0) {
    const highConfidence = aiRules.filter(r => (r.automation_confidence || 0) > 80);
    if (highConfidence.length > 0) {
      insights.push({
        type: 'positive',
        title: 'AI Routing Rules Improving Automation Throughput',
        description: `${highConfidence.length} AI routing rule(s) with 80%+ confidence. Intelligent task assignment working well.`,
        action: '🤖 Increase AI routing rule priority; allocate more tasks to high-confidence flows',
      });
    }
  }

  const pausedCount = rules.filter(r => r.rule_status === 'paused').length;
  if (pausedCount > 2) {
    insights.push({
      type: 'alert',
      title: `${pausedCount} Paused Rules—Review and Reactivate Soon`,
      description: 'Paused rules represent potential automation gaps. Monthly review recommended.',
      action: '⚠️ Schedule rule status review; determine reactivation or deprecation timeline',
    });
  }

  const testingRules = rules.filter(r => r.rule_status === 'testing');
  if (testingRules.length > 3) {
    insights.push({
      type: 'alert',
      title: `${testingRules.length} Rules in Testing Phase—Plan Graduation`,
      description: 'Testing rules need graduation to active or deprecation. Testing phase should be time-boxed.',
      action: '📋 Review testing rules; promote high-confidence ones to active status',
    });
  }

  const handleStatusUpdate = async (ruleId, newStatus) => {
    await base44.entities.AutomationRule.update(ruleId, { rule_status: newStatus });
    setRules(rules.map(r => r.id === ruleId ? { ...r, rule_status: newStatus } : r));
    setSelectedRule(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">⚙️</div>
            <h1 className="text-3xl font-black text-white">Automation Rules Governance</h1>
          </div>
          <p className="text-slate-400 text-sm">Centralized control of platform automation workflows, triggers, and actions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Rules</p>
            <p className="text-3xl font-black text-emerald-400">{activeRules}</p>
            <p className="text-xs text-slate-400 mt-2">Currently enforced</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Critical Rules</p>
            <p className="text-3xl font-black text-red-400">{criticalRules}</p>
            <p className="text-xs text-slate-400 mt-2">High priority</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Monthly Executions</p>
            <p className="text-3xl font-black text-cyan-400">{executedThisMonth}</p>
            <p className="text-xs text-slate-400 mt-2">All rules combined</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Confidence</p>
            <p className="text-3xl font-black text-blue-400">{avgConfidence}%</p>
            <p className="text-xs text-slate-400 mt-2">Automation reliability</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Impact Index</p>
            <p className="text-3xl font-black text-amber-400">{impactIndex}%</p>
            <p className="text-xs text-slate-400 mt-2">Operational significance</p>
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
            <option value="active">Active</option>
            <option value="testing">Testing</option>
            <option value="paused">Paused</option>
            <option value="deprecated">Deprecated</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        {/* SECTION 2 — Rule Registry Grid */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Automation Rule Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(rule => {
              const categoryConfig = CATEGORY_CONFIG[rule.rule_category];
              const priorityConfig = PRIORITY_CONFIG[rule.priority_level];
              const statusConfig = STATUS_CONFIG[rule.rule_status];
              return (
                <button
                  key={rule.id}
                  onClick={() => setSelectedRule(rule)}
                  className={`rounded-xl p-5 text-left transition-all hover:shadow-lg ${statusConfig.border} bg-slate-800/60 backdrop-blur`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{rule.rule_name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{rule.execution_frequency_monthly || 0}x/month</p>
                    </div>
                    <span className="text-lg flex-shrink-0">{categoryConfig.emoji}</span>
                  </div>

                  {/* Category and priority badges */}
                  <div className="mb-3 pb-3 border-b border-slate-700">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-300">
                        {categoryConfig.label}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${priorityConfig.color} ${priorityConfig.textColor}`}>
                        {priorityConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">Confidence</span>
                      <span className="text-sm font-bold text-blue-400">{rule.automation_confidence || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${rule.automation_confidence || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className={`text-xs font-bold px-2 py-1 rounded ${statusConfig.badge} capitalize`}>
                    {rule.rule_status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Category Distribution */}
        {categoryDistribution.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Rule Category Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  formatter={(val) => [val, 'Rules']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 6 — Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Automation Governance Intelligence</h3>
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

      </div>

      {/* Detail Modal */}
      {selectedRule && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{CATEGORY_CONFIG[selectedRule.rule_category].label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{selectedRule.rule_name}</h3>
              </div>
              <button onClick={() => setSelectedRule(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
              {/* Trigger Event */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Trigger Event</p>
                <p className="text-sm text-slate-300">{selectedRule.trigger_event}</p>
              </div>

              {/* Action Summary */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Action Summary</p>
                <p className="text-sm text-slate-300">{selectedRule.action_summary}</p>
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Priority</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${PRIORITY_CONFIG[selectedRule.priority_level].color} ${PRIORITY_CONFIG[selectedRule.priority_level].textColor}`}>
                    {PRIORITY_CONFIG[selectedRule.priority_level].label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Status</p>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-300 capitalize">
                    {selectedRule.rule_status}
                  </span>
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Confidence</p>
                  <p className="text-lg font-black text-blue-400">{selectedRule.automation_confidence || 0}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Impact</p>
                  <p className="text-lg font-black text-amber-400">{selectedRule.operational_impact_score || 0}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Monthly</p>
                  <p className="text-lg font-black text-cyan-400">{selectedRule.execution_frequency_monthly || 0}x</p>
                </div>
              </div>

              {/* Confidence explanation */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Confidence Reasoning</p>
                <p className="text-sm text-slate-300">This rule has {selectedRule.automation_confidence || 0}% confidence based on historical execution success rate, trigger event accuracy, and action outcome quality.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {selectedRule.rule_status === 'active' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedRule.id, 'testing')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🔬 Move to Testing
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedRule.id, 'paused')}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⏸️ Pause Rule
                  </button>
                </>
              )}
              {selectedRule.rule_status === 'paused' && (
                <button
                  onClick={() => handleStatusUpdate(selectedRule.id, 'active')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ▶️ Activate Rule
                </button>
              )}
              {selectedRule.rule_status === 'testing' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedRule.id, 'active')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Promote to Active
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedRule.id, 'deprecated')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⛔ Deprecate
                  </button>
                </>
              )}
              {selectedRule.rule_status !== 'deprecated' && (
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                  ✏️ Edit Rule
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}