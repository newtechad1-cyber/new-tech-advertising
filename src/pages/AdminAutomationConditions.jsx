import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CONDITION_TYPE_CONFIG = {
  threshold: { label: 'Threshold', emoji: '📊', color: '#3b82f6' },
  status_change: { label: 'Status Change', emoji: '🔄', color: '#10b981' },
  metric_drop: { label: 'Metric Drop', emoji: '📉', color: '#ef4444' },
  metric_rise: { label: 'Metric Rise', emoji: '📈', color: '#f59e0b' },
  time_elapsed: { label: 'Time Elapsed', emoji: '⏰', color: '#8b5cf6' },
  multi_signal_match: { label: 'Multi-Signal', emoji: '🎯', color: '#06b6d4' },
};

const OPERATOR_CONFIG = {
  greater_than: '>',
  less_than: '<',
  equals: '=',
  not_equals: '≠',
  contains: '∋',
  between: '↔',
};

const PRIORITY_CONFIG = {
  high: { label: 'High', color: 'bg-red-100', textColor: 'text-red-700', dot: 'bg-red-500' },
  medium: { label: 'Medium', color: 'bg-yellow-100', textColor: 'text-yellow-700', dot: 'bg-yellow-500' },
  low: { label: 'Low', color: 'bg-slate-100', textColor: 'text-slate-700', dot: 'bg-slate-400' },
};

const STATUS_CONFIG = {
  active: { label: 'Active', badge: 'bg-emerald-100 text-emerald-700', border: 'border-l-4 border-emerald-500' },
  testing: { label: 'Testing', badge: 'bg-blue-100 text-blue-700', border: 'border-l-4 border-blue-500' },
  paused: { label: 'Paused', badge: 'bg-amber-100 text-amber-700', border: 'border-l-4 border-amber-500' },
};

export default function AdminAutomationConditions() {
  const [conditions, setConditions] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    Promise.all([
      base44.entities.AutomationCondition.list('-condition_priority', 100),
      base44.entities.AutomationRule.list('rule_name', 100),
    ]).then(([conditionsData, rulesData]) => {
      setConditions(conditionsData);
      setRules(rulesData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading trigger conditions…</div>
      </div>
    );
  }

  // Get rule name by id
  const getRuleName = (ruleId) => {
    const rule = rules.find(r => r.id === ruleId);
    return rule ? rule.rule_name : 'Unlinked Rule';
  };

  // Filter conditions
  const filtered = conditions.filter(c => {
    if (filterType !== 'all' && c.condition_type !== filterType) return false;
    if (filterStatus !== 'all' && c.condition_status !== filterStatus) return false;
    return true;
  });

  // KPIs
  const activeConditions = conditions.filter(c => c.condition_status === 'active').length;
  const highPriorityConditions = conditions.filter(c => c.condition_priority === 'high').length;
  const testingConditions = conditions.filter(c => c.condition_status === 'testing').length;
  const multiSignalConditions = conditions.filter(c => c.condition_type === 'multi_signal_match').length;
  const precisionScore = conditions.length > 0
    ? Math.round((activeConditions + multiSignalConditions) / conditions.length * 100)
    : 0;

  // Type distribution
  const typeDistribution = Object.keys(CONDITION_TYPE_CONFIG).map(type => ({
    name: CONDITION_TYPE_CONFIG[type].label,
    count: conditions.filter(c => c.condition_type === type).length,
    color: CONDITION_TYPE_CONFIG[type].color,
  })).filter(item => item.count > 0);

  // Insights
  const insights = [];

  const churnConditions = conditions.filter(c => 
    (c.monitored_metric || '').toLowerCase().includes('churn') && c.condition_status === 'active'
  );
  if (churnConditions.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Churn-Based Conditions Driving Strong Retention Actions',
      description: `${churnConditions.length} active churn condition(s) configured. Proactive retention triggering working well.`,
      action: '🛡️ Review churn thresholds quarterly; consider sensitivity adjustments based on false positives',
    });
  }

  const timeElapsedConditions = conditions.filter(c => c.condition_type === 'time_elapsed');
  const activeTimeConditions = timeElapsedConditions.filter(c => c.condition_status === 'active');
  if (timeElapsedConditions.length > 0 && activeTimeConditions.length === 0) {
    insights.push({
      type: 'alert',
      title: 'Time-Elapsed Rules May Be Underused in Trial Workflows',
      description: `${timeElapsedConditions.length} time-elapsed condition(s) exist but none are active. Trial conversion timing automation could be stronger.`,
      action: '⏰ Activate time-based trial reminder sequences; set escalation at days 3, 7, 14',
    });
  }

  const workloadConditions = conditions.filter(c => 
    (c.monitored_metric || '').toLowerCase().includes('workload') && c.condition_status === 'active'
  );
  if (workloadConditions.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Workload Threshold Conditions Protecting Ops',
      description: `${workloadConditions.length} workload condition(s) active. Load-based automation triggers preventing bottlenecks.`,
      action: '⚙️ Tune workload thresholds to balance team capacity; monitor false positive rate',
    });
  }

  const pausedCount = conditions.filter(c => c.condition_status === 'paused').length;
  if (pausedCount > 2) {
    insights.push({
      type: 'alert',
      title: `${pausedCount} Paused Conditions—Clean Up or Reactivate`,
      description: 'Paused conditions should either be removed or reactivated. Stale configurations create confusion.',
      action: '📋 Audit paused conditions; remove deprecated ones; reactivate if still needed',
    });
  }

  const multiSignalActive = conditions.filter(c => c.condition_type === 'multi_signal_match' && c.condition_status === 'active');
  if (multiSignalActive.length === 0 && multiSignalConditions > 0) {
    insights.push({
      type: 'alert',
      title: 'Multi-Signal Conditions Not Yet Active',
      description: 'Multi-signal conditions provide better accuracy but need validation before activation.',
      action: '🎯 Graduate high-confidence multi-signal conditions from testing to active',
    });
  }

  const handleStatusUpdate = async (conditionId, newStatus) => {
    await base44.entities.AutomationCondition.update(conditionId, { condition_status: newStatus });
    setConditions(conditions.map(c => c.id === conditionId ? { ...c, condition_status: newStatus } : c));
    setSelectedCondition(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🔧</div>
            <h1 className="text-3xl font-black text-white">Trigger Condition Builder</h1>
          </div>
          <p className="text-slate-400 text-sm">Configure automation rule trigger conditions and threshold logic</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Conditions</p>
            <p className="text-3xl font-black text-emerald-400">{activeConditions}</p>
            <p className="text-xs text-slate-400 mt-2">Currently monitoring</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">High Priority</p>
            <p className="text-3xl font-black text-red-400">{highPriorityConditions}</p>
            <p className="text-xs text-slate-400 mt-2">Critical triggers</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">In Testing</p>
            <p className="text-3xl font-black text-blue-400">{testingConditions}</p>
            <p className="text-xs text-slate-400 mt-2">Validation phase</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Multi-Signal</p>
            <p className="text-3xl font-black text-cyan-400">{multiSignalConditions}</p>
            <p className="text-xs text-slate-400 mt-2">Composite conditions</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Precision Score</p>
            <p className="text-3xl font-black text-purple-400">{precisionScore}%</p>
            <p className="text-xs text-slate-400 mt-2">Condition coverage</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg"
          >
            <option value="all">All Types</option>
            {Object.entries(CONDITION_TYPE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="testing">Testing</option>
            <option value="paused">Paused</option>
          </select>
        </div>

        {/* SECTION 2 — Condition Registry Grid */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Condition Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(condition => {
              const typeConfig = CONDITION_TYPE_CONFIG[condition.condition_type];
              const priorityConfig = PRIORITY_CONFIG[condition.condition_priority];
              const statusConfig = STATUS_CONFIG[condition.condition_status];
              const opSymbol = OPERATOR_CONFIG[condition.operator];
              return (
                <button
                  key={condition.id}
                  onClick={() => setSelectedCondition(condition)}
                  className={`rounded-xl p-5 text-left transition-all hover:shadow-lg ${statusConfig.border} bg-slate-800/60 backdrop-blur`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{condition.condition_name}</h4>
                      <p className="text-xs text-slate-400 mt-1 truncate">{getRuleName(condition.automation_rule)}</p>
                    </div>
                    <span className="text-lg flex-shrink-0">{typeConfig.emoji}</span>
                  </div>

                  {/* Type and priority badges */}
                  <div className="mb-3 pb-3 border-b border-slate-700">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-300">
                        {typeConfig.label}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${priorityConfig.color} ${priorityConfig.textColor}`}>
                        {priorityConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Logic display */}
                  <div className="mb-3 space-y-2">
                    <p className="text-xs text-slate-400">Metric: <span className="font-bold text-slate-200">{condition.monitored_metric}</span></p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-blue-400">{opSymbol}</span>
                      <span className="text-slate-300">
                        {condition.target_value}
                        {condition.secondary_value && ` to ${condition.secondary_value}`}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className={`text-xs font-bold px-2 py-1 rounded ${statusConfig.badge} capitalize`}>
                    {condition.condition_status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Condition Type Distribution */}
        {typeDistribution.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Condition Type Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={typeDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  formatter={(val) => [val, 'Conditions']}
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

        {/* SECTION 5 — Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Trigger Logic Intelligence</h3>
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
      {selectedCondition && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{CONDITION_TYPE_CONFIG[selectedCondition.condition_type].label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{selectedCondition.condition_name}</h3>
              </div>
              <button onClick={() => setSelectedCondition(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
              {/* Linked Rule */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Linked Automation Rule</p>
                <p className="text-sm text-slate-300">{getRuleName(selectedCondition.automation_rule)}</p>
              </div>

              {/* Monitored Metric */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Monitored Metric</p>
                <p className="text-sm text-slate-300">{selectedCondition.monitored_metric}</p>
              </div>

              {/* Condition Logic */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Condition Logic</p>
                <div className="bg-slate-700/50 rounded-lg p-3 text-sm font-mono text-slate-200">
                  {selectedCondition.monitored_metric} {OPERATOR_CONFIG[selectedCondition.operator]} {selectedCondition.target_value}
                  {selectedCondition.secondary_value && ` AND ${selectedCondition.secondary_value}`}
                </div>
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Priority</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${PRIORITY_CONFIG[selectedCondition.condition_priority].color} ${PRIORITY_CONFIG[selectedCondition.condition_priority].textColor}`}>
                    {PRIORITY_CONFIG[selectedCondition.condition_priority].label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Status</p>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-300 capitalize">
                    {selectedCondition.condition_status}
                  </span>
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Condition Reasoning</p>
                <p className="text-sm text-slate-300">This condition monitors {selectedCondition.monitored_metric} and triggers when the value {OPERATOR_CONFIG[selectedCondition.operator]} {selectedCondition.target_value}. Precision-tuned to prevent false positives while ensuring timely automation activation.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {selectedCondition.condition_status === 'active' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedCondition.id, 'testing')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🔬 Move to Testing
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedCondition.id, 'paused')}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⏸️ Pause Condition
                  </button>
                </>
              )}
              {selectedCondition.condition_status === 'paused' && (
                <button
                  onClick={() => handleStatusUpdate(selectedCondition.id, 'active')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ▶️ Activate Condition
                </button>
              )}
              {selectedCondition.condition_status === 'testing' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedCondition.id, 'active')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Graduate to Active
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedCondition.id, 'paused')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⏸️ Pause for Review
                  </button>
                </>
              )}
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                📋 Duplicate Condition
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}