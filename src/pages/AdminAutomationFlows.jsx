import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowRight } from 'lucide-react';

const CATEGORY_CONFIG = {
  sales_to_onboarding: { label: 'Sales → Onboarding', emoji: '🎯', color: '#3b82f6' },
  retention_recovery: { label: 'Retention Recovery', emoji: '🛡️', color: '#10b981' },
  roi_to_expansion: { label: 'ROI → Expansion', emoji: '🚀', color: '#f59e0b' },
  funnel_to_sales: { label: 'Funnel → Sales', emoji: '⚡', color: '#ef4444' },
  ops_escalation: { label: 'Ops Escalation', emoji: '⚙️', color: '#8b5cf6' },
  ai_routing_sequence: { label: 'AI Routing', emoji: '🤖', color: '#06b6d4' },
  expansion_activation: { label: 'Expansion Activation', emoji: '📈', color: '#ec4899' },
};

const STATUS_CONFIG = {
  active: { label: 'Active', badge: 'bg-emerald-100 text-emerald-700', border: 'border-l-4 border-emerald-500' },
  testing: { label: 'Testing', badge: 'bg-blue-100 text-blue-700', border: 'border-l-4 border-blue-500' },
  paused: { label: 'Paused', badge: 'bg-amber-100 text-amber-700', border: 'border-l-4 border-amber-500' },
  deprecated: { label: 'Deprecated', badge: 'bg-slate-100 text-slate-700', border: 'border-l-4 border-slate-500' },
};

const FLOW_SEQUENCES = {
  sales_to_onboarding: ['Sales Deal Closed', 'Onboarding Job Created', 'Portal Provisioning', 'Client Launch'],
  retention_recovery: ['Churn Risk Detected', 'Intervention Triggered', 'Manager Notification', 'Strategy Review'],
  roi_to_expansion: ['ROI Milestone Hit', 'Expansion Signal', 'Success Manager Alerted', 'Proposal Queued'],
  funnel_to_sales: ['Drop-off Detected', 'Experiment Created', 'CTA Review Task', 'Sales Follow-up'],
  ops_escalation: ['SLA Overdue', 'Priority Escalated', 'Team Notified', 'Client Success Alert'],
  ai_routing_sequence: ['Task Received', 'Agent Routed', 'Execution Started', 'Results Logged'],
  expansion_activation: ['Vertical Opportunity', 'Playbook Activated', 'Campaign Launched', 'Lead Nurture'],
};

export default function AdminAutomationFlows() {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    base44.entities.AutomationFlow.list('-avg_operational_impact_score', 100)
      .then((data) => {
        setFlows(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading automation flows…</div>
      </div>
    );
  }

  // Filter flows
  const filtered = flows.filter(f => {
    if (filterCategory !== 'all' && f.flow_category !== filterCategory) return false;
    if (filterStatus !== 'all' && f.flow_status !== filterStatus) return false;
    return true;
  });

  // KPIs
  const activeFlows = flows.filter(f => f.flow_status === 'active').length;
  const testingFlows = flows.filter(f => f.flow_status === 'testing').length;
  const multiSystemFlows = flows.filter(f => (f.systems_involved || '').split(',').length > 2).length;
  const avgImpact = flows.length > 0
    ? Math.round(flows.reduce((sum, f) => sum + (f.avg_operational_impact_score || 0), 0) / flows.length)
    : 0;
  const monthlyVolume = flows.reduce((sum, f) => sum + (f.estimated_execution_frequency_monthly || 0), 0);

  // Category distribution
  const categoryDistribution = Object.keys(CATEGORY_CONFIG).map(cat => ({
    name: CATEGORY_CONFIG[cat].label,
    count: flows.filter(f => f.flow_category === cat).length,
    color: CATEGORY_CONFIG[cat].color,
  })).filter(item => item.count > 0);

  // Insights
  const insights = [];

  const roiFlows = flows.filter(f => f.flow_category === 'roi_to_expansion' && f.flow_status === 'active');
  const strongRoi = roiFlows.filter(f => (f.avg_operational_impact_score || 0) > 80);
  if (strongRoi.length > 0) {
    insights.push({
      type: 'positive',
      title: 'ROI-to-Expansion Flows Driving Strongest Upsell Momentum',
      description: `${strongRoi.length} active ROI-expansion flow(s) with 80%+ impact. Autonomous expansion velocity increasing.`,
      action: '📈 Monitor ROI flow execution; consider increasing trigger frequency for high-impact verticals',
    });
  }

  const funnelFlows = flows.filter(f => f.flow_category === 'funnel_to_sales' && f.flow_status === 'active');
  if (funnelFlows.length > 0) {
    const highFreq = funnelFlows.filter(f => (f.estimated_execution_frequency_monthly || 0) > 15);
    if (highFreq.length > 0) {
      insights.push({
        type: 'positive',
        title: 'Funnel-to-Sales Flows Improving Trial Conversion Follow-up Speed',
        description: `${highFreq.length} funnel-sales flow(s) executing 15%+ times monthly. Fast sales engagement on conversion dips.`,
        action: '⚡ Ensure funnel flow sequences stay synchronized with demo completion timing',
      });
    }
  }

  const opsFlows = flows.filter(f => f.flow_category === 'ops_escalation' && f.flow_status === 'active');
  if (opsFlows.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Ops-Escalation Flows Protecting SLA Compliance',
      description: `${opsFlows.length} ops-escalation flow(s) active. Proactive SLA management preventing overdue issues.`,
      action: '⚙️ Review escalation thresholds monthly; maintain SLA compliance rate above 95%',
    });
  }

  const pausedCount = flows.filter(f => f.flow_status === 'paused').length;
  if (pausedCount > 1) {
    insights.push({
      type: 'alert',
      title: `${pausedCount} Paused Flows—Review for Reactivation or Deprecation`,
      description: 'Paused flows may represent automation gaps. Monthly audit recommended.',
      action: '📋 Schedule flow status review; prioritize reactivation of high-impact flows',
    });
  }

  const testingCount = flows.filter(f => f.flow_status === 'testing').length;
  if (testingCount > 2) {
    insights.push({
      type: 'alert',
      title: `${testingCount} Flows in Testing—Plan Graduation Timeline`,
      description: 'Testing flows need clear graduation path. Avoid indefinite testing phases.',
      action: '🚀 Graduate high-confidence flows to active; deprecate low-impact ones',
    });
  }

  const handleStatusUpdate = async (flowId, newStatus) => {
    await base44.entities.AutomationFlow.update(flowId, { flow_status: newStatus });
    setFlows(flows.map(f => f.id === flowId ? { ...f, flow_status: newStatus } : f));
    setSelectedFlow(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🔗</div>
            <h1 className="text-3xl font-black text-white">Automation Flow Designer</h1>
          </div>
          <p className="text-slate-400 text-sm">Multi-step automation orchestration and cross-system flow management</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Flows</p>
            <p className="text-3xl font-black text-emerald-400">{activeFlows}</p>
            <p className="text-xs text-slate-400 mt-2">Running orchestrations</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">In Testing</p>
            <p className="text-3xl font-black text-blue-400">{testingFlows}</p>
            <p className="text-xs text-slate-400 mt-2">Validation phase</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Cross-System Flows</p>
            <p className="text-3xl font-black text-cyan-400">{multiSystemFlows}</p>
            <p className="text-xs text-slate-400 mt-2">Multi-integration sequences</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Impact Score</p>
            <p className="text-3xl font-black text-amber-400">{avgImpact}%</p>
            <p className="text-xs text-slate-400 mt-2">Operational significance</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Monthly Volume</p>
            <p className="text-3xl font-black text-purple-400">{monthlyVolume}</p>
            <p className="text-xs text-slate-400 mt-2">Flow executions</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
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
        </div>

        {/* SECTION 2 — Flow Registry Grid */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Automation Flow Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(flow => {
              const categoryConfig = CATEGORY_CONFIG[flow.flow_category];
              const statusConfig = STATUS_CONFIG[flow.flow_status];
              return (
                <button
                  key={flow.id}
                  onClick={() => setSelectedFlow(flow)}
                  className={`rounded-xl p-5 text-left transition-all hover:shadow-lg ${statusConfig.border} bg-slate-800/60 backdrop-blur`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{flow.flow_name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{flow.step_count || 0} steps</p>
                    </div>
                    <span className="text-lg flex-shrink-0">{categoryConfig.emoji}</span>
                  </div>

                  {/* Category badge */}
                  <div className="mb-3 pb-3 border-b border-slate-700">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-300">
                      {categoryConfig.label}
                    </span>
                  </div>

                  {/* Systems involved */}
                  <div className="mb-3">
                    <p className="text-xs text-slate-400 mb-1">Systems: <span className="text-slate-200 font-semibold">{flow.systems_involved}</span></p>
                  </div>

                  {/* Impact bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">Impact</span>
                      <span className="text-sm font-bold text-amber-400">{flow.avg_operational_impact_score || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${flow.avg_operational_impact_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Frequency and status */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{flow.estimated_execution_frequency_monthly || 0}x/month</span>
                    <span className={`font-bold px-2 py-1 rounded ${statusConfig.badge} capitalize`}>
                      {flow.flow_status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Category Distribution */}
        {categoryDistribution.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Flow Category Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  formatter={(val) => [val, 'Flows']}
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

        {/* SECTION 5 — Cross-System Flow Map */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Cross-System Flow Architecture</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.slice(0, 4).map(flow => {
              const sequence = FLOW_SEQUENCES[flow.flow_category] || ['Trigger', 'Action', 'Complete'];
              return (
                <div key={flow.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 backdrop-blur">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{flow.flow_name}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {sequence.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex-1 min-w-max bg-slate-700/50 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 text-center">
                          {step}
                        </div>
                        {idx < sequence.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 6 — Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Flow Architecture Intelligence</h3>
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
      {selectedFlow && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{CATEGORY_CONFIG[selectedFlow.flow_category].label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{selectedFlow.flow_name}</h3>
              </div>
              <button onClick={() => setSelectedFlow(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
              {/* Start Trigger */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Start Trigger</p>
                <p className="text-sm text-slate-300">{selectedFlow.start_trigger}</p>
              </div>

              {/* Flow Summary */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Flow Summary</p>
                <p className="text-sm text-slate-300">{selectedFlow.flow_summary}</p>
              </div>

              {/* Systems Involved */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Systems Involved</p>
                <p className="text-sm text-slate-300">{selectedFlow.systems_involved}</p>
              </div>

              {/* Flow Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Steps</p>
                  <p className="text-lg font-black text-blue-400">{selectedFlow.step_count || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Frequency</p>
                  <p className="text-lg font-black text-cyan-400">{selectedFlow.estimated_execution_frequency_monthly || 0}x/mo</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Impact</p>
                  <p className="text-lg font-black text-amber-400">{selectedFlow.avg_operational_impact_score || 0}%</p>
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Flow Impact Explanation</p>
                <p className="text-sm text-slate-300">This flow automates {selectedFlow.step_count || 0} sequential steps across {(selectedFlow.systems_involved || '').split(',').length} systems. Operating at {selectedFlow.avg_operational_impact_score || 0}% effectiveness level.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {selectedFlow.flow_status === 'active' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedFlow.id, 'testing')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🔬 Move to Testing
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedFlow.id, 'paused')}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⏸️ Pause Flow
                  </button>
                </>
              )}
              {selectedFlow.flow_status === 'paused' && (
                <button
                  onClick={() => handleStatusUpdate(selectedFlow.id, 'active')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ▶️ Activate Flow
                </button>
              )}
              {selectedFlow.flow_status === 'testing' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedFlow.id, 'active')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Graduate to Active
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedFlow.id, 'deprecated')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⛔ Deprecate Flow
                  </button>
                </>
              )}
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                📋 Duplicate Flow
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}