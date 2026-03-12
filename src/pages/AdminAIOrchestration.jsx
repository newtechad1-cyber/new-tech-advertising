import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

const CATEGORY_CONFIG = {
  content_batch: { label: 'Content Batch', emoji: '📝', color: '#3b82f6' },
  video_batch: { label: 'Video Batch', emoji: '🎬', color: '#ef4444' },
  campaign_setup: { label: 'Campaign Setup', emoji: '🎯', color: '#8b5cf6' },
  report_generation: { label: 'Reporting', emoji: '📊', color: '#f59e0b' },
  lead_analysis: { label: 'Lead Analysis', emoji: '🔍', color: '#10b981' },
  funnel_test: { label: 'Funnel Test', emoji: '⚡', color: '#ec4899' },
  retention_scan: { label: 'Retention Scan', emoji: '🛡️', color: '#06b6d4' },
  expansion_scan: { label: 'Expansion Scan', emoji: '🚀', color: '#6366f1' },
};

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'bg-slate-100', textColor: 'text-slate-600', dot: 'bg-slate-400' },
  medium: { label: 'Medium', color: 'bg-blue-100', textColor: 'text-blue-600', dot: 'bg-blue-500' },
  high: { label: 'High', color: 'bg-orange-100', textColor: 'text-orange-600', dot: 'bg-orange-500' },
  urgent: { label: 'Urgent', color: 'bg-red-100', textColor: 'text-red-600', dot: 'bg-red-500' },
};

const STATUS_COLORS = {
  queued: 'border-l-4 border-slate-400 bg-slate-800/50',
  running: 'border-l-4 border-blue-500 bg-slate-800/50',
  review_required: 'border-l-4 border-amber-500 bg-slate-800/50',
  completed: 'border-l-4 border-emerald-500 bg-slate-800/50',
  failed: 'border-l-4 border-rose-500 bg-slate-800/50',
};

export default function AdminAIOrchestration() {
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    Promise.all([
      base44.entities.AIAgentTask.list('-priority_level', 100),
      base44.entities.AIAgentProfile.list('agent_name', 100),
    ]).then(([tasksData, agentsData]) => {
      setTasks(tasksData);
      setAgents(agentsData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading orchestration dashboard…</div>
      </div>
    );
  }

  // Get agent name by id
  const getAgentName = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.agent_name : 'Unassigned';
  };

  // KPIs
  const taskQueued = tasks.filter(t => t.execution_status === 'queued').length;
  const taskRunning = tasks.filter(t => t.execution_status === 'running').length;
  const taskCompleted = tasks.filter(t => t.execution_status === 'completed').length;
  const taskReview = tasks.filter(t => t.execution_status === 'review_required').length;
  const throughputScore = tasks.length > 0
    ? Math.round(((taskCompleted + taskRunning) / tasks.length) * 100)
    : 0;

  // Status columns
  const statusColumns = {
    queued: tasks.filter(t => t.execution_status === 'queued'),
    running: tasks.filter(t => t.execution_status === 'running'),
    review_required: tasks.filter(t => t.execution_status === 'review_required'),
    completed: tasks.filter(t => t.execution_status === 'completed'),
    failed: tasks.filter(t => t.execution_status === 'failed'),
  };

  // Category distribution
  const categoryDistribution = Object.keys(CATEGORY_CONFIG).map(cat => ({
    name: CATEGORY_CONFIG[cat].label,
    count: tasks.filter(t => t.task_category === cat).length,
    color: CATEGORY_CONFIG[cat].color,
  })).filter(item => item.count > 0);

  // Insights
  const insights = [];

  const funnelTasks = tasks.filter(t => t.task_category === 'funnel_test');
  if (funnelTasks.length > 3) {
    insights.push({
      type: 'positive',
      title: 'Funnel Optimization Tasks Increasing',
      description: `${funnelTasks.length} funnel test tasks in queue. High conversion optimization activity signal.`,
      action: '⚡ Prioritize funnel test execution; impact is high',
    });
  }

  const campaignTasks = tasks.filter(t => t.task_category === 'campaign_setup');
  if (campaignTasks.length > 2 && campaignTasks.some(t => t.execution_status !== 'completed')) {
    insights.push({
      type: 'alert',
      title: 'Campaign Setup Automation Load Rising',
      description: `${campaignTasks.filter(t => t.execution_status !== 'completed').length} campaign tasks pending. May indicate bottleneck.`,
      action: '📋 Review campaign setup priorities and timeline',
    });
  }

  const retentionTasks = tasks.filter(t => t.task_category === 'retention_scan');
  const highImpactRetention = retentionTasks.filter(t => (t.impact_score || 0) > 75);
  if (highImpactRetention.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Retention Scans Producing High Impact Signals',
      description: `${highImpactRetention.length} retention scan(s) with 75%+ impact potential identified.`,
      action: '🛡️ Integrate retention insights into expansion strategy',
    });
  }

  const failedTasks = tasks.filter(t => t.execution_status === 'failed');
  if (failedTasks.length > 0) {
    insights.push({
      type: 'alert',
      title: `${failedTasks.length} Task(s) Failed and Need Attention`,
      description: `Failed tasks require review and retry. Risk of automation gaps.`,
      action: '🔧 Review failed task root causes and retry',
    });
  }

  const handleStatusMove = async (taskId, newStatus) => {
    await base44.entities.AIAgentTask.update(taskId, { execution_status: newStatus });
    setTasks(tasks.map(t => t.id === taskId ? { ...t, execution_status: newStatus } : t));
    setSelectedTask(null);
  };

  // Render task card
  const TaskCard = ({ task, onSelect }) => {
    const categoryConfig = CATEGORY_CONFIG[task.task_category];
    const priorityConfig = PRIORITY_CONFIG[task.priority_level];
    
    return (
      <button
        onClick={() => onSelect(task)}
        className={`rounded-lg p-4 text-left transition-all hover:shadow-lg ${STATUS_COLORS[task.execution_status]}`}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{task.task_title}</h4>
            <p className="text-xs text-slate-400 mt-1">{getAgentName(task.assigned_agent)}</p>
          </div>
          <span className="text-lg flex-shrink-0">{categoryConfig.emoji}</span>
        </div>

        <div className="mb-3 pb-3 border-b border-slate-700">
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs font-bold px-2 py-1 rounded ${priorityConfig.color} ${priorityConfig.textColor}`}>
              {priorityConfig.label}
            </span>
            <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-300">
              {categoryConfig.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-slate-500 mb-1">Confidence</p>
            <p className="font-bold text-emerald-400">{task.confidence_score || 0}%</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Impact</p>
            <p className="font-bold text-amber-400">{task.impact_score || 0}%</p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">⚙️</div>
            <h1 className="text-3xl font-black text-white">Agent Task Orchestration</h1>
          </div>
          <p className="text-slate-400 text-sm">Real-time automation workflow management and bottleneck detection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Tasks Queued</p>
            <p className="text-3xl font-black text-blue-400">{taskQueued}</p>
            <p className="text-xs text-slate-400 mt-2">Awaiting execution</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Running Now</p>
            <p className="text-3xl font-black text-purple-400">{taskRunning}</p>
            <p className="text-xs text-slate-400 mt-2">Active processing</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Completed Today</p>
            <p className="text-3xl font-black text-emerald-400">{taskCompleted}</p>
            <p className="text-xs text-slate-400 mt-2">Finished successfully</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Needs Review</p>
            <p className="text-3xl font-black text-amber-400">{taskReview}</p>
            <p className="text-xs text-slate-400 mt-2">QA/approval required</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Throughput Score</p>
            <p className="text-3xl font-black text-cyan-400">{throughputScore}%</p>
            <p className="text-xs text-slate-400 mt-2">Operational efficiency</p>
          </div>
        </div>

        {/* SECTION 2 — Kanban Board */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Orchestration Workflow</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Queued */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 backdrop-blur">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                <h4 className="text-sm font-black text-slate-300">Queued</h4>
                <span className="text-xs font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded">{statusColumns.queued.length}</span>
              </div>
              <div className="space-y-3">
                {statusColumns.queued.map(task => (
                  <TaskCard key={task.id} task={task} onSelect={setSelectedTask} />
                ))}
              </div>
            </div>

            {/* Running */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 backdrop-blur">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                <h4 className="text-sm font-black text-blue-300">Running</h4>
                <span className="text-xs font-bold bg-blue-700 text-blue-300 px-2 py-1 rounded">{statusColumns.running.length}</span>
              </div>
              <div className="space-y-3">
                {statusColumns.running.map(task => (
                  <TaskCard key={task.id} task={task} onSelect={setSelectedTask} />
                ))}
              </div>
            </div>

            {/* Review Required */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 backdrop-blur">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                <h4 className="text-sm font-black text-amber-300">Review</h4>
                <span className="text-xs font-bold bg-amber-700 text-amber-300 px-2 py-1 rounded">{statusColumns.review_required.length}</span>
              </div>
              <div className="space-y-3">
                {statusColumns.review_required.map(task => (
                  <TaskCard key={task.id} task={task} onSelect={setSelectedTask} />
                ))}
              </div>
            </div>

            {/* Completed */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 backdrop-blur">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                <h4 className="text-sm font-black text-emerald-300">Completed</h4>
                <span className="text-xs font-bold bg-emerald-700 text-emerald-300 px-2 py-1 rounded">{statusColumns.completed.length}</span>
              </div>
              <div className="space-y-3">
                {statusColumns.completed.map(task => (
                  <TaskCard key={task.id} task={task} onSelect={setSelectedTask} />
                ))}
              </div>
            </div>

            {/* Failed */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 backdrop-blur">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                <h4 className="text-sm font-black text-rose-300">Failed</h4>
                <span className="text-xs font-bold bg-rose-700 text-rose-300 px-2 py-1 rounded">{statusColumns.failed.length}</span>
              </div>
              <div className="space-y-3">
                {statusColumns.failed.map(task => (
                  <TaskCard key={task.id} task={task} onSelect={setSelectedTask} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 — Category Load Distribution */}
        {categoryDistribution.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Task Category Load Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  formatter={(val) => [val, 'Tasks']}
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

        {/* SECTION 5 — Bottleneck Alerts */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Orchestration Intelligence</h3>
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
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{CATEGORY_CONFIG[selectedTask.task_category].label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{selectedTask.task_title}</h3>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
              {/* Assignment */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Assigned Agent</p>
                <p className="text-sm text-slate-300">{getAgentName(selectedTask.assigned_agent)}</p>
              </div>

              {/* Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Status</p>
                  <p className="text-sm font-bold text-white capitalize">{selectedTask.execution_status.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Priority</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${PRIORITY_CONFIG[selectedTask.priority_level].color} ${PRIORITY_CONFIG[selectedTask.priority_level].textColor}`}>
                    {PRIORITY_CONFIG[selectedTask.priority_level].label}
                  </span>
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Confidence</p>
                  <p className="text-2xl font-black text-emerald-400">{selectedTask.confidence_score || 0}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Impact</p>
                  <p className="text-2xl font-black text-amber-400">{selectedTask.impact_score || 0}%</p>
                </div>
              </div>

              {/* Processing Time */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Est. Processing</p>
                <p className="text-lg font-bold text-purple-400">{selectedTask.estimated_processing_time_minutes || 0} minutes</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {selectedTask.execution_status === 'queued' && (
                <button
                  onClick={() => handleStatusMove(selectedTask.id, 'running')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ▶️ Start Execution
                </button>
              )}
              {selectedTask.execution_status === 'running' && (
                <button
                  onClick={() => handleStatusMove(selectedTask.id, 'review_required')}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  👁️ Send to Review
                </button>
              )}
              {selectedTask.execution_status === 'review_required' && (
                <button
                  onClick={() => handleStatusMove(selectedTask.id, 'completed')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ✓ Mark Approved
                </button>
              )}
              {(selectedTask.execution_status === 'failed' || selectedTask.execution_status === 'queued') && (
                <button
                  onClick={() => handleStatusMove(selectedTask.id, 'queued')}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  🔄 Retry Task
                </button>
              )}
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                📌 Escalate Priority
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                👤 Reassign Agent
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}