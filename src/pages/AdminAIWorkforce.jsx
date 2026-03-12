import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, TrendingUp, AlertCircle } from 'lucide-react';

const FUNCTION_CONFIG = {
  content_generation: { label: 'Content Gen', emoji: '📝', color: '#3b82f6' },
  video_creation: { label: 'Video', emoji: '🎬', color: '#ef4444' },
  campaign_planning: { label: 'Campaign', emoji: '🎯', color: '#8b5cf6' },
  reporting: { label: 'Reporting', emoji: '📊', color: '#f59e0b' },
  lead_scoring: { label: 'Lead Scoring', emoji: '🔍', color: '#10b981' },
  funnel_optimization: { label: 'Funnel', emoji: '⚡', color: '#ec4899' },
  retention_analysis: { label: 'Retention', emoji: '🛡️', color: '#06b6d4' },
  expansion_strategy: { label: 'Expansion', emoji: '🚀', color: '#6366f1' },
};

const WORKLOAD_CONFIG = {
  idle: { label: 'Idle', color: 'bg-slate-100', textColor: 'text-slate-600', dot: 'bg-slate-400' },
  active: { label: 'Active', color: 'bg-blue-100', textColor: 'text-blue-600', dot: 'bg-blue-500' },
  high_load: { label: 'High Load', color: 'bg-red-100', textColor: 'text-red-600', dot: 'bg-red-500' },
  throttled: { label: 'Throttled', color: 'bg-amber-100', textColor: 'text-amber-600', dot: 'bg-amber-500' },
};

export default function AdminAIWorkforce() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [filterWorkload, setFilterWorkload] = useState('all');

  useEffect(() => {
    base44.entities.AIAgentProfile.list('-operational_impact_score', 100).then(a => {
      setAgents(a);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Initializing workforce control…</div>
      </div>
    );
  }

  // Filter agents
  const filtered = agents.filter(a => {
    if (filterWorkload !== 'all' && a.workload_status !== filterWorkload) return false;
    return true;
  });

  // KPIs
  const activeAgents = agents.filter(a => a.workload_status === 'active' || a.workload_status === 'high_load').length;
  const tasksThisWeek = agents.reduce((sum, a) => sum + (a.tasks_completed_this_week || 0), 0);
  const avgCoverage = agents.length > 0
    ? Math.round(agents.reduce((sum, a) => sum + (a.automation_coverage_percent || 0), 0) / agents.length)
    : 0;
  const operationalIndex = agents.length > 0
    ? Math.round(agents.reduce((sum, a) => sum + (a.operational_impact_score || 0), 0) / agents.length)
    : 0;
  const reliabilityTrend = agents.length > 0
    ? Math.round(agents.reduce((sum, a) => sum + (a.reliability_rating || 0), 0) / agents.length)
    : 0;

  // Coverage distribution by function
  const coverageDistribution = Object.keys(FUNCTION_CONFIG)
    .map(func => {
      const agentsWithFunc = agents.filter(a => a.agent_function === func);
      const avgCov = agentsWithFunc.length > 0
        ? Math.round(agentsWithFunc.reduce((sum, a) => sum + (a.automation_coverage_percent || 0), 0) / agentsWithFunc.length)
        : 0;
      return {
        name: FUNCTION_CONFIG[func].label,
        coverage: avgCov,
        color: FUNCTION_CONFIG[func].color,
      };
    })
    .filter(item => item.coverage > 0 || agents.some(a => a.agent_function === Object.keys(FUNCTION_CONFIG).find(k => FUNCTION_CONFIG[k].label === item.name)));

  // Insights
  const insights = [];

  const contentAgents = agents.filter(a => a.agent_function === 'content_generation');
  if (contentAgents.length > 0 && contentAgents[0]?.automation_coverage_percent > 70) {
    insights.push({
      type: 'positive',
      title: 'Content Automation Reducing Manual Workload',
      description: `Content generation agents at ${contentAgents[0]?.automation_coverage_percent || 0}% coverage, completing ${contentAgents.reduce((s, a) => s + (a.tasks_completed_this_week || 0), 0)} tasks/week.`,
      action: '📝 Expand content automation to social media scheduling',
    });
  }

  const videoAgent = agents.find(a => a.agent_function === 'video_creation' && a.workload_status === 'high_load');
  if (videoAgent) {
    insights.push({
      type: 'alert',
      title: 'Video Agent Nearing Capacity Limits',
      description: `${videoAgent.agent_name} at ${videoAgent.automation_coverage_percent || 0}% coverage with high load status. Risk of bottleneck.`,
      action: '⚠️ Consider load balancing or scaling video agent capacity',
    });
  }

  const retentionAgent = agents.find(a => a.agent_function === 'retention_analysis');
  if (retentionAgent && (retentionAgent.operational_impact_score || 0) > 75) {
    insights.push({
      type: 'positive',
      title: 'Retention Intelligence Improving Expansion Readiness',
      description: `Retention analysis driving ${retentionAgent.operational_impact_score || 0}% platform impact. Enabling proactive expansion signals.`,
      action: '🛡️ Integrate retention signals into expansion strategy agent',
    });
  }

  const throttledAgents = agents.filter(a => a.workload_status === 'throttled');
  if (throttledAgents.length > 0) {
    insights.push({
      type: 'alert',
      title: `${throttledAgents.length} Agent(s) Currently Throttled`,
      description: `Workload management active. Throttled agents: ${throttledAgents.map(a => a.agent_name).join(', ')}.`,
      action: '⏱️ Review throttling policy and consider capacity planning',
    });
  }

  const lowReliability = agents.filter(a => (a.reliability_rating || 0) < 75);
  if (lowReliability.length > 0) {
    insights.push({
      type: 'alert',
      title: 'Reliability Concerns on High-Impact Agents',
      description: `${lowReliability.length} agent(s) below 75% reliability threshold. Recommend performance review.`,
      action: '🔧 Schedule deep-dive on underperforming agents',
    });
  }

  const handleWorkloadUpdate = async (agentId, newStatus) => {
    await base44.entities.AIAgentProfile.update(agentId, { workload_status: newStatus });
    setAgents(agents.map(a => a.id === agentId ? { ...a, workload_status: newStatus } : a));
    setSelectedAgent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🤖</div>
            <h1 className="text-3xl font-black text-white">AI Workforce</h1>
          </div>
          <p className="text-slate-400 text-sm">Centralized automation governance and agent operational control</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Agents</p>
            <p className="text-3xl font-black text-blue-400">{activeAgents}</p>
            <p className="text-xs text-slate-400 mt-2">Now processing</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Tasks This Week</p>
            <p className="text-3xl font-black text-emerald-400">{tasksThisWeek.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-2">Automated completions</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Automation Coverage</p>
            <p className="text-3xl font-black text-purple-400">{avgCoverage}%</p>
            <p className="text-xs text-slate-400 mt-2">Average across workforce</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Impact Index</p>
            <p className="text-3xl font-black text-amber-400">{operationalIndex}%</p>
            <p className="text-xs text-slate-400 mt-2">Platform operational impact</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Reliability Trend</p>
            <p className="text-3xl font-black text-cyan-400">{reliabilityTrend}%</p>
            <p className="text-xs text-slate-400 mt-2">Fleet average rating</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'active', 'idle', 'high_load', 'throttled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterWorkload(status)}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
                filterWorkload === status
                  ? status === 'all'
                    ? 'bg-blue-600 text-white'
                    : `${WORKLOAD_CONFIG[status].color} ${WORKLOAD_CONFIG[status].textColor}`
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {status === 'all' ? 'All Agents' : WORKLOAD_CONFIG[status].label}
            </button>
          ))}
        </div>

        {/* SECTION 2 — Agent Grid */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Active Agent Fleet</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(agent => {
              const funcConfig = FUNCTION_CONFIG[agent.agent_function];
              const workloadConfig = WORKLOAD_CONFIG[agent.workload_status];
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 text-left hover:border-slate-600 hover:bg-slate-750 transition-all backdrop-blur"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-white">{agent.agent_name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{funcConfig.label}</p>
                    </div>
                    <span className="text-lg">{funcConfig.emoji}</span>
                  </div>

                  {/* Automation coverage */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">Automation</span>
                      <span className="text-sm font-bold text-blue-400">{agent.automation_coverage_percent || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${agent.automation_coverage_percent || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-700">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Tasks/Week</p>
                      <p className="text-sm font-bold text-white">{agent.tasks_completed_this_week || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Confidence</p>
                      <p className="text-sm font-bold text-emerald-400">{agent.avg_task_confidence_score || 0}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Impact</p>
                      <p className="text-sm font-bold text-amber-400">{agent.operational_impact_score || 0}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Reliability</p>
                      <p className="text-sm font-bold text-cyan-400">{agent.reliability_rating || 0}%</p>
                    </div>
                  </div>

                  {/* Workload status */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${workloadConfig.color} ${workloadConfig.textColor}`}>
                      {workloadConfig.label}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${workloadConfig.dot}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Coverage Distribution */}
        {coverageDistribution.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Automation Coverage by Function</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={coverageDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  formatter={(val) => [`${val}%`, 'Coverage']}
                />
                <Bar dataKey="coverage" radius={[6, 6, 0, 0]}>
                  {coverageDistribution.map((entry, i) => (
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
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Workforce Intelligence</h3>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className={`border rounded-xl p-5 ${
                  insight.type === 'positive'
                    ? 'bg-emerald-950/40 border-emerald-700'
                    : 'bg-rose-950/40 border-rose-700'
                } backdrop-blur`}>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">
                      {insight.type === 'positive' ? '⚡' : '⚠️'}
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
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{FUNCTION_CONFIG[selectedAgent.agent_function].label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{selectedAgent.agent_name}</h3>
              </div>
              <button onClick={() => setSelectedAgent(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
              {/* Operational Impact */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Operational Impact Score</p>
                <p className="text-3xl font-black text-amber-400">{selectedAgent.operational_impact_score || 0}%</p>
                <p className="text-sm text-slate-400 mt-1">Platform operational contribution and influence</p>
              </div>

              {/* Reliability */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Reliability Rating</p>
                <p className="text-3xl font-black text-cyan-400">{selectedAgent.reliability_rating || 0}%</p>
                <p className="text-sm text-slate-400 mt-1">Task completion accuracy and consistency</p>
              </div>

              {/* Automation Coverage */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Automation Coverage</p>
                <div className="mb-2">
                  <p className="text-2xl font-black text-blue-400">{selectedAgent.automation_coverage_percent || 0}%</p>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${selectedAgent.automation_coverage_percent || 0}%` }}
                  />
                </div>
                <p className="text-sm text-slate-400 mt-2">Percentage of function tasks automated vs manual</p>
              </div>

              {/* Workload */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Workload Status</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${WORKLOAD_CONFIG[selectedAgent.workload_status].color} ${WORKLOAD_CONFIG[selectedAgent.workload_status].textColor}`}>
                    {WORKLOAD_CONFIG[selectedAgent.workload_status].label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Tasks This Week</p>
                  <p className="text-lg font-black text-white">{selectedAgent.tasks_completed_this_week || 0}</p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div className="bg-slate-700/50 rounded p-3">
                  <p className="text-xs text-slate-400 mb-1">Confidence Score</p>
                  <p className="text-xl font-black text-emerald-400">{selectedAgent.avg_task_confidence_score || 0}%</p>
                </div>
                <div className="bg-slate-700/50 rounded p-3">
                  <p className="text-xs text-slate-400 mb-1">Function Type</p>
                  <p className="text-xs font-bold text-white mt-1">{FUNCTION_CONFIG[selectedAgent.agent_function].label}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {selectedAgent.workload_status === 'active' && (
                <button
                  onClick={() => handleWorkloadUpdate(selectedAgent.id, 'throttled')}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ⏱️ Throttle Workload
                </button>
              )}
              {selectedAgent.workload_status === 'throttled' && (
                <button
                  onClick={() => handleWorkloadUpdate(selectedAgent.id, 'active')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ▶️ Resume Full Capacity
                </button>
              )}
              {selectedAgent.workload_status === 'high_load' && (
                <button
                  onClick={() => handleWorkloadUpdate(selectedAgent.id, 'throttled')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  🚨 Emergency Throttle
                </button>
              )}
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                🔍 Flag Performance Review
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                ⭐ Mark Priority Agent
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}