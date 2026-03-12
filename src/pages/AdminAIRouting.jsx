import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, Zap } from 'lucide-react';

const REASON_CONFIG = {
  revenue_impact: { label: 'Revenue Impact', emoji: '💰', color: '#ef4444' },
  client_risk: { label: 'Client Risk', emoji: '⚠️', color: '#f97316' },
  expansion_opportunity: { label: 'Expansion', emoji: '🚀', color: '#10b981' },
  workload_balance: { label: 'Workload Balance', emoji: '⚙️', color: '#3b82f6' },
  confidence_match: { label: 'Confidence Match', emoji: '✓', color: '#8b5cf6' },
  sla_pressure: { label: 'SLA Pressure', emoji: '⏰', color: '#f59e0b' },
};

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: 'bg-red-100', textColor: 'text-red-600', dot: 'bg-red-500' },
  elevated: { label: 'Elevated', color: 'bg-orange-100', textColor: 'text-orange-600', dot: 'bg-orange-500' },
  normal: { label: 'Normal', color: 'bg-blue-100', textColor: 'text-blue-600', dot: 'bg-blue-500' },
  deferred: { label: 'Deferred', color: 'bg-slate-100', textColor: 'text-slate-600', dot: 'bg-slate-400' },
};

const STATUS_CONFIG = {
  proposed: { label: 'Proposed', color: 'border-slate-500' },
  approved: { label: 'Approved', color: 'border-blue-500' },
  queued: { label: 'Queued', color: 'border-amber-500' },
  executed: { label: 'Executed', color: 'border-emerald-500' },
};

export default function AdminAIRouting() {
  const [signals, setSignals] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterReason, setFilterReason] = useState('all');

  useEffect(() => {
    Promise.all([
      base44.entities.AutomationRoutingSignal.list('-urgency_score', 100),
      base44.entities.AIAgentProfile.list('agent_name', 100),
    ]).then(([signalsData, agentsData]) => {
      setSignals(signalsData);
      setAgents(agentsData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading routing intelligence…</div>
      </div>
    );
  }

  // Get agent name by id
  const getAgentName = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.agent_name : 'Unassigned';
  };

  // Filter signals
  const filtered = signals.filter(s => {
    if (filterPriority !== 'all' && s.routing_priority !== filterPriority) return false;
    if (filterReason !== 'all' && s.routing_reason !== filterReason) return false;
    return true;
  });

  // KPIs
  const criticalSignals = signals.filter(s => s.routing_priority === 'critical').length;
  const elevatedTasks = signals.filter(s => s.routing_priority === 'elevated').length;
  const executedSignals = signals.filter(s => s.routing_status === 'executed').length;
  const avgImpact = signals.length > 0
    ? Math.round(signals.reduce((sum, s) => sum + (s.impact_score || 0), 0) / signals.length)
    : 0;
  const avgConfidence = signals.length > 0
    ? Math.round(signals.filter(s => s.routing_status !== 'proposed').length / signals.length * 100)
    : 0;

  // Reason distribution
  const reasonDistribution = Object.keys(REASON_CONFIG).map(reason => ({
    name: REASON_CONFIG[reason].label,
    count: signals.filter(s => s.routing_reason === reason).length,
    color: REASON_CONFIG[reason].color,
  })).filter(item => item.count > 0);

  // Matrix data
  const matrixData = signals.map(s => ({
    x: s.urgency_score || 0,
    y: s.impact_score || 0,
    title: s.signal_title,
    priority: s.routing_priority,
    fill: s.routing_priority === 'critical' ? '#ef4444' : s.routing_priority === 'elevated' ? '#f97316' : s.routing_priority === 'normal' ? '#3b82f6' : '#64748b',
  }));

  // Insights
  const insights = [];

  const revenueSignals = signals.filter(s => s.routing_reason === 'revenue_impact' && s.routing_status !== 'executed');
  if (revenueSignals.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Revenue-Impact Tasks Should Be Prioritized Earlier',
      description: `${revenueSignals.length} revenue-impact signal(s) pending. These drive business outcomes—route immediately.`,
      action: '💰 Elevate revenue-impact signals to Critical priority',
    });
  }

  const workloadSignals = signals.filter(s => s.routing_reason === 'workload_balance');
  if (workloadSignals.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Workload Balancing Can Reduce Bottlenecks',
      description: `${workloadSignals.length} workload-balance routing opportunity identified. Strategic agent assignment prevents delays.`,
      action: '⚙️ Route to lower-utilized agents to flatten load',
    });
  }

  const riskSignals = signals.filter(s => s.routing_reason === 'client_risk');
  if (riskSignals.length > 0) {
    const highUrgencyRisk = riskSignals.filter(s => (s.urgency_score || 0) > 80);
    if (highUrgencyRisk.length > 0) {
      insights.push({
        type: 'alert',
        title: 'Client Risk Automations Need Faster Execution',
        description: `${highUrgencyRisk.length} client-risk signal(s) with 80%+ urgency. Churn prevention requires immediate attention.`,
        action: '🚨 Route all client-risk signals to highest-reliability agents',
      });
    }
  }

  const expansionSignals = signals.filter(s => s.routing_reason === 'expansion_opportunity');
  if (expansionSignals.length > 0) {
    const highImpact = expansionSignals.filter(s => (s.impact_score || 0) > 80);
    if (highImpact.length > 0) {
      insights.push({
        type: 'positive',
        title: 'High-Impact Expansion Automations Deserve Priority Weight',
        description: `${highImpact.length} expansion automation(s) with 80%+ impact. Unlocking new revenue streams.`,
        action: '🚀 Dedicate premium agent capacity to expansion automations',
      });
    }
  }

  const deferredCount = signals.filter(s => s.routing_status === 'proposed').length;
  if (deferredCount > 3) {
    insights.push({
      type: 'alert',
      title: `${deferredCount} Proposed Signals Awaiting Routing Decision`,
      description: `Decision backlog building. Delays compound—routing decisions need weekly review cycle.`,
      action: '📋 Schedule routing review meeting; approve/defer in batch',
    });
  }

  const handleStatusUpdate = async (signalId, newStatus) => {
    await base44.entities.AutomationRoutingSignal.update(signalId, { routing_status: newStatus });
    setSignals(signals.map(s => s.id === signalId ? { ...s, routing_status: newStatus } : s));
    setSelectedSignal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🎯</div>
            <h1 className="text-3xl font-black text-white">Priority Routing</h1>
          </div>
          <p className="text-slate-400 text-sm">Intelligent automation sequencing based on urgency, impact, and operational importance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Critical Signals</p>
            <p className="text-3xl font-black text-red-400">{criticalSignals}</p>
            <p className="text-xs text-slate-400 mt-2">Act now</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Elevated Priority</p>
            <p className="text-3xl font-black text-orange-400">{elevatedTasks}</p>
            <p className="text-xs text-slate-400 mt-2">High importance</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Executed Signals</p>
            <p className="text-3xl font-black text-emerald-400">{executedSignals}</p>
            <p className="text-xs text-slate-400 mt-2">Routing decisions completed</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Impact Score</p>
            <p className="text-3xl font-black text-amber-400">{avgImpact}%</p>
            <p className="text-xs text-slate-400 mt-2">Expected outcome value</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Decision Confidence</p>
            <p className="text-3xl font-black text-cyan-400">{avgConfidence}%</p>
            <p className="text-xs text-slate-400 mt-2">Routing conviction rate</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="elevated">Elevated</option>
            <option value="normal">Normal</option>
            <option value="deferred">Deferred</option>
          </select>
          <select
            value={filterReason}
            onChange={(e) => setFilterReason(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg"
          >
            <option value="all">All Reasons</option>
            {Object.entries(REASON_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        {/* SECTION 2 — Routing Signal Grid */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Routing Signals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(signal => {
              const reasonConfig = REASON_CONFIG[signal.routing_reason];
              const priorityConfig = PRIORITY_CONFIG[signal.routing_priority];
              const statusConfig = STATUS_CONFIG[signal.routing_status];
              return (
                <button
                  key={signal.id}
                  onClick={() => setSelectedSignal(signal)}
                  className={`rounded-xl p-5 text-left transition-all hover:shadow-lg border-l-4 bg-slate-800/60 backdrop-blur ${statusConfig.color}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{signal.signal_title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{getAgentName(signal.recommended_agent)}</p>
                    </div>
                    <span className="text-lg flex-shrink-0">{reasonConfig.emoji}</span>
                  </div>

                  {/* Reason and priority badges */}
                  <div className="mb-3 pb-3 border-b border-slate-700">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-300">
                        {reasonConfig.label}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${priorityConfig.color} ${priorityConfig.textColor}`}>
                        {priorityConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Urgency score */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">Urgency</span>
                      <span className="text-sm font-bold text-red-400">{signal.urgency_score || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${signal.urgency_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Impact score */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">Impact</span>
                      <span className="text-sm font-bold text-amber-400">{signal.impact_score || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${signal.impact_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-300 capitalize">
                    {signal.routing_status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Reason Distribution */}
        {reasonDistribution.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Routing Reason Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={reasonDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  formatter={(val) => [val, 'Signals']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {reasonDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 5 — Urgency vs Impact Matrix */}
        {matrixData.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Urgency vs Impact Routing Matrix</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis
                  dataKey="x"
                  name="Urgency Score"
                  label={{ value: 'Urgency Score', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis
                  dataKey="y"
                  name="Impact Score"
                  label={{ value: 'Impact Score', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  cursor={{ strokeDasharray: '3 3', stroke: '#64748b' }}
                />
                <Scatter name="Signals" data={matrixData}>
                  {matrixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-400 mt-4 text-center">
              Top-right = Critical (high urgency + high impact) · Top-left = Urgent but lower impact · Bottom-right = High impact but lower urgency
            </p>
          </div>
        )}

        {/* SECTION 6 — Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Routing Intelligence</h3>
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
      {selectedSignal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{REASON_CONFIG[selectedSignal.routing_reason].label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{selectedSignal.signal_title}</h3>
              </div>
              <button onClick={() => setSelectedSignal(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
              {/* Recommended Agent */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Recommended Agent</p>
                <p className="text-sm text-slate-300">{getAgentName(selectedSignal.recommended_agent)}</p>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Urgency</p>
                  <p className="text-2xl font-black text-red-400">{selectedSignal.urgency_score || 0}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Impact</p>
                  <p className="text-2xl font-black text-amber-400">{selectedSignal.impact_score || 0}%</p>
                </div>
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Priority</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${PRIORITY_CONFIG[selectedSignal.routing_priority].color} ${PRIORITY_CONFIG[selectedSignal.routing_priority].textColor}`}>
                    {PRIORITY_CONFIG[selectedSignal.routing_priority].label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Status</p>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-300 capitalize">
                    {selectedSignal.routing_status}
                  </span>
                </div>
              </div>

              {/* Routing Reason */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Routing Reason</p>
                <p className="text-sm text-slate-300">{REASON_CONFIG[selectedSignal.routing_reason].label}</p>
                <p className="text-sm text-slate-400 mt-2">Decision logic: Route based on {selectedSignal.routing_reason.replace(/_/g, ' ')} priority</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {selectedSignal.routing_status === 'proposed' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedSignal.id, 'approved')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Approve Routing
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedSignal.id, 'queued')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    📋 Queue for Execution
                  </button>
                </>
              )}
              {selectedSignal.routing_status === 'approved' && (
                <button
                  onClick={() => handleStatusUpdate(selectedSignal.id, 'queued')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  📋 Queue for Execution
                </button>
              )}
              {selectedSignal.routing_status === 'queued' && (
                <button
                  onClick={() => handleStatusUpdate(selectedSignal.id, 'executed')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  🚀 Mark Executed
                </button>
              )}
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                👤 Reassign Agent
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                ⬆️ Escalate Priority
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}