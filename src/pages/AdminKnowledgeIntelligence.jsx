import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';

const CATEGORY_CONFIG = {
  sales_process: { label: 'Sales Process', emoji: '🎯', color: '#3b82f6' },
  onboarding: { label: 'Onboarding', emoji: '🚀', color: '#10b981' },
  production: { label: 'Production', emoji: '📹', color: '#f59e0b' },
  expansion: { label: 'Expansion', emoji: '📈', color: '#ef4444' },
  automation: { label: 'Automation', emoji: '🤖', color: '#8b5cf6' },
  reporting: { label: 'Reporting', emoji: '📊', color: '#06b6d4' },
  partner_training: { label: 'Partner Training', emoji: '🤝', color: '#ec4899' },
};

const RISK_CONFIG = {
  critical: { label: 'Critical', badge: 'bg-red-100 text-red-700', color: '#ef4444', border: 'border-l-4 border-red-500' },
  high: { label: 'High', badge: 'bg-orange-100 text-orange-700', color: '#f97316', border: 'border-l-4 border-orange-500' },
  medium: { label: 'Medium', badge: 'bg-yellow-100 text-yellow-700', color: '#eab308', border: 'border-l-4 border-yellow-500' },
  low: { label: 'Low', badge: 'bg-slate-100 text-slate-700', color: '#94a3b8', border: 'border-l-4 border-slate-500' },
};

const STATUS_CONFIG = {
  identified: { label: 'Identified', badge: 'bg-slate-200 text-slate-700' },
  documenting: { label: 'Documenting', badge: 'bg-blue-200 text-blue-700' },
  training_rollout: { label: 'Training Rollout', badge: 'bg-amber-200 text-amber-700' },
  resolved: { label: 'Resolved', badge: 'bg-emerald-200 text-emerald-700' },
};

export default function AdminKnowledgeIntelligence() {
  const [gaps, setGaps] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGap, setSelectedGap] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  useEffect(() => {
    Promise.all([
      base44.entities.KnowledgeGapSignal.list('-operational_impact_estimate', 100),
      base44.entities.SOPWorkflow.list('workflow_name', 100),
    ]).then(([gapsData, workflowsData]) => {
      setGaps(gapsData);
      setWorkflows(workflowsData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading knowledge intelligence…</div>
      </div>
    );
  }

  // Get workflow name by id
  const getWorkflowName = (workflowId) => {
    if (!workflowId) return null;
    const workflow = workflows.find(w => w.id === workflowId);
    return workflow ? workflow.workflow_name : null;
  };

  // Filter gaps
  const filtered = gaps.filter(g => {
    if (filterCategory !== 'all' && g.gap_category !== filterCategory) return false;
    if (filterRisk !== 'all' && g.risk_level !== filterRisk) return false;
    return true;
  });

  // KPIs
  const criticalGaps = gaps.filter(g => g.risk_level === 'critical').length;
  const underDocumentation = gaps.filter(g => g.resolution_status === 'identified' || g.resolution_status === 'documenting').length;
  const trainingRollouts = gaps.filter(g => g.resolution_status === 'training_rollout').length;
  const avgCoverage = gaps.length > 0
    ? Math.round(gaps.reduce((sum, g) => sum + (g.coverage_score || 0), 0) / gaps.length)
    : 0;
  const riskIndex = gaps.length > 0
    ? Math.round(gaps.filter(g => g.risk_level === 'critical' || g.risk_level === 'high').length / gaps.length * 100)
    : 0;

  // Category distribution
  const categoryDistribution = Object.keys(CATEGORY_CONFIG).map(cat => ({
    name: CATEGORY_CONFIG[cat].label,
    count: gaps.filter(g => g.gap_category === cat).length,
    color: CATEGORY_CONFIG[cat].color,
  })).filter(item => item.count > 0);

  // Matrix data for scatter plot
  const matrixData = gaps.map(g => ({
    x: g.coverage_score || 0,
    y: g.operational_impact_estimate || 0,
    name: g.gap_title,
    risk: g.risk_level,
    color: RISK_CONFIG[g.risk_level].color,
  }));

  // Insights
  const insights = [];

  const expansionGaps = gaps.filter(g => g.gap_category === 'expansion' && (g.risk_level === 'critical' || g.risk_level === 'high'));
  if (expansionGaps.length > 0) {
    insights.push({
      type: 'alert',
      title: 'Expansion Knowledge Gaps Could Slow Territory Domination',
      description: `${expansionGaps.length} critical/high-risk expansion gaps identified. Territory playbook clarity impacts growth velocity.`,
      action: '📈 Prioritize expansion SOP documentation; schedule territory onboarding playbook finalization',
    });
  }

  const partnerGaps = gaps.filter(g => g.gap_category === 'partner_training' && (g.risk_level === 'critical' || g.risk_level === 'high'));
  if (partnerGaps.length > 0) {
    insights.push({
      type: 'alert',
      title: 'Partner Training Documentation Critical for White-Label Scaling',
      description: `${partnerGaps.length} partner training gaps present. Missing partner onboarding SOPs limit channel expansion.`,
      action: '🤝 Build partner certification training materials; establish white-label onboarding playbook',
    });
  }

  const automationGaps = gaps.filter(g => g.gap_category === 'automation' && g.resolution_status === 'documenting');
  if (automationGaps.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Automation SOP Coverage Improving Execution Consistency',
      description: `${automationGaps.length} automation gaps actively being documented. Process clarity improving operational reliability.`,
      action: '🤖 Continue automation SOP rollout; prioritize highest-impact automation processes first',
    });
  }

  const resolvedGaps = gaps.filter(g => g.resolution_status === 'resolved');
  if (resolvedGaps.length > 2) {
    insights.push({
      type: 'positive',
      title: `${resolvedGaps.length} Knowledge Gaps Already Resolved`,
      description: 'Closed gaps show proactive knowledge documentation. Momentum building on coverage improvements.',
      action: '✓ Document lessons learned from resolved gaps; codify into operational playbooks',
    });
  }

  const lowCoverageHighImpact = gaps.filter(g => (g.coverage_score || 0) < 50 && (g.operational_impact_estimate || 0) > 75);
  if (lowCoverageHighImpact.length > 2) {
    insights.push({
      type: 'alert',
      title: `${lowCoverageHighImpact.length} High-Impact Gaps with Low Coverage`,
      description: 'Highest risk zone: critical operations with minimal documentation. Immediate action required.',
      action: '⚠️ Escalate high-impact, low-coverage gaps to leadership; allocate dedicated documentation resources',
    });
  }

  const handleStatusUpdate = async (gapId, newStatus) => {
    await base44.entities.KnowledgeGapSignal.update(gapId, { resolution_status: newStatus });
    setGaps(gaps.map(g => g.id === gapId ? { ...g, resolution_status: newStatus } : g));
    setSelectedGap(null);
  };

  const getCoverageColor = (coverage) => {
    if (coverage >= 80) return 'bg-emerald-500';
    if (coverage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🔍</div>
            <h1 className="text-3xl font-black text-slate-900">Knowledge Intelligence</h1>
          </div>
          <p className="text-slate-600 text-sm">Identify coverage gaps, training weaknesses, and operational risk signals from missing SOP clarity</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Critical Gaps</p>
            <p className="text-3xl font-black text-red-600">{criticalGaps}</p>
            <p className="text-xs text-slate-600 mt-2">Immediate attention</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Under Documentation</p>
            <p className="text-3xl font-black text-orange-600">{underDocumentation}</p>
            <p className="text-xs text-slate-600 mt-2">In progress</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Training Rollouts</p>
            <p className="text-3xl font-black text-blue-600">{trainingRollouts}</p>
            <p className="text-xs text-slate-600 mt-2">Active deployments</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Avg Coverage</p>
            <p className="text-3xl font-black text-slate-900">{avgCoverage}%</p>
            <p className="text-xs text-slate-600 mt-2">Overall score</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Knowledge Risk</p>
            <p className="text-3xl font-black text-rose-600">{riskIndex}%</p>
            <p className="text-xs text-slate-600 mt-2">Critical/High ratio</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* SECTION 2 — Knowledge Gap Grid */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Knowledge Gap Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(gap => {
              const categoryConfig = CATEGORY_CONFIG[gap.gap_category];
              const riskConfig = RISK_CONFIG[gap.risk_level];
              const statusConfig = STATUS_CONFIG[gap.resolution_status];
              return (
                <button
                  key={gap.id}
                  onClick={() => setSelectedGap(gap)}
                  className={`rounded-xl p-5 text-left transition-all hover:shadow-lg bg-white border border-slate-200 ${riskConfig.border}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{gap.gap_title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{categoryConfig.emoji} {categoryConfig.label}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${riskConfig.badge} capitalize flex-shrink-0`}>
                      {riskConfig.label}
                    </span>
                  </div>

                  {/* Coverage bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Coverage</span>
                      <span className="text-sm font-bold text-slate-700">{gap.coverage_score || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getCoverageColor(gap.coverage_score || 0)}`}
                        style={{ width: `${gap.coverage_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Impact meter */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Operational Impact</span>
                      <span className="text-sm font-bold text-slate-700">{gap.operational_impact_estimate || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${gap.operational_impact_estimate || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="text-xs">
                    <span className={`inline-block px-2 py-1 rounded font-semibold ${statusConfig.badge}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Category Distribution */}
        {categoryDistribution.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Gap Distribution by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, color: '#1e293b' }}
                  formatter={(val) => [val, 'Gaps']}
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

        {/* SECTION 5 — Coverage vs Impact Matrix */}
        {matrixData.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Coverage vs Operational Impact Matrix</h3>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Coverage Score"
                  label={{ value: 'Coverage Score →', position: 'insideBottomRight', offset: -5 }}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Operational Impact"
                  label={{ value: '← Impact Score', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12 }}
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(val) => Math.round(val)}
                />
                <Scatter name="Knowledge Gaps" data={matrixData} fill="#8884d8">
                  {matrixData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="font-bold text-red-900">⚠️ High Priority Zone</p>
                <p className="text-red-800 mt-1">Low Coverage + High Impact</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <p className="font-bold text-slate-900">✓ Low Priority Zone</p>
                <p className="text-slate-700 mt-1">Low Coverage + Low Impact</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <p className="font-bold text-orange-900">🎯 Active Priority</p>
                <p className="text-orange-800 mt-1">High Coverage + High Impact</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                <p className="font-bold text-emerald-900">✨ Maintenance Zone</p>
                <p className="text-emerald-800 mt-1">High Coverage + Low Impact</p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6 — Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Knowledge Strategy Intelligence</h3>
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
      {selectedGap && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    {CATEGORY_CONFIG[selectedGap.gap_category].emoji} {CATEGORY_CONFIG[selectedGap.gap_category].label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${RISK_CONFIG[selectedGap.risk_level].badge} capitalize`}>
                    {RISK_CONFIG[selectedGap.risk_level].label}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedGap.gap_title}</h3>
              </div>
              <button onClick={() => setSelectedGap(null)} className="text-slate-400 hover:text-slate-600 text-2xl flex-shrink-0">×</button>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-slate-200">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Coverage Score</p>
                  <p className="text-2xl font-black text-slate-900">{selectedGap.coverage_score || 0}%</p>
                  <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getCoverageColor(selectedGap.coverage_score || 0)}`}
                      style={{ width: `${selectedGap.coverage_score || 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Operational Impact</p>
                  <p className="text-2xl font-black text-slate-900">{selectedGap.operational_impact_estimate || 0}%</p>
                  <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${selectedGap.operational_impact_estimate || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Linked workflow */}
              {selectedGap.related_workflow && (
                <div className="bg-slate-100 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Related Workflow</p>
                  <p className="text-sm font-semibold text-slate-900">🔄 {getWorkflowName(selectedGap.related_workflow) || 'Workflow'}</p>
                </div>
              )}

              {/* Documentation focus */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Recommended Documentation Focus</p>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedGap.recommended_documentation_focus || 'No specific focus documented'}</p>
              </div>

              {/* Risk explanation */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Operational Risk Explanation</p>
                <p className="text-sm text-slate-700">
                  This knowledge gap has a {RISK_CONFIG[selectedGap.risk_level].label.toLowerCase()} risk level with {selectedGap.coverage_score || 0}% documentation coverage. 
                  {selectedGap.operational_impact_estimate >= 75 
                    ? ' The gap significantly impacts operational execution and should be prioritized.'
                    : ' Coverage and documentation are recommended to improve process clarity.'}
                </p>
              </div>

              {/* Status badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Resolution Status</span>
                <span className={`text-xs font-bold px-3 py-1 rounded ${STATUS_CONFIG[selectedGap.resolution_status].badge}`}>
                  {STATUS_CONFIG[selectedGap.resolution_status].label}
                </span>
              </div>
            </div>

            {/* Status Actions */}
            <div className="space-y-2">
              {selectedGap.resolution_status === 'identified' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedGap.id, 'documenting')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    📝 Mark as Documenting
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedGap.id, 'training_rollout')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🎓 Move to Training Rollout
                  </button>
                </>
              )}
              {selectedGap.resolution_status === 'documenting' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedGap.id, 'training_rollout')}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    🎓 Begin Training Rollout
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedGap.id, 'resolved')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Mark Resolved
                  </button>
                </>
              )}
              {selectedGap.resolution_status === 'training_rollout' && (
                <button
                  onClick={() => handleStatusUpdate(selectedGap.id, 'resolved')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ✓ Mark Resolved
                </button>
              )}
              {selectedGap.resolution_status === 'resolved' && (
                <button
                  onClick={() => handleStatusUpdate(selectedGap.id, 'identified')}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ↩️ Reopen Gap
                </button>
              )}
              <button className="w-full bg-red-200 hover:bg-red-300 text-red-900 text-sm font-bold py-2 rounded-lg transition-colors">
                ⚠️ Escalate Risk
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}