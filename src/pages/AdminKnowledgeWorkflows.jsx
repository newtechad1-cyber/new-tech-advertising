import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowRight } from 'lucide-react';

const CATEGORY_CONFIG = {
  sales_process: { label: 'Sales Process', emoji: '🎯', color: '#3b82f6' },
  onboarding: { label: 'Onboarding', emoji: '🚀', color: '#10b981' },
  content_production: { label: 'Content Production', emoji: '📝', color: '#f59e0b' },
  campaign_launch: { label: 'Campaign Launch', emoji: '📢', color: '#ef4444' },
  retention_intervention: { label: 'Retention Intervention', emoji: '🛡️', color: '#8b5cf6' },
  expansion_execution: { label: 'Expansion Execution', emoji: '📈', color: '#06b6d4' },
  automation_flow: { label: 'Automation Flow', emoji: '🤖', color: '#ec4899' },
};

const STATUS_CONFIG = {
  active: { label: 'Active', badge: 'bg-emerald-100 text-emerald-700', border: 'border-l-4 border-emerald-500' },
  review_needed: { label: 'Review Needed', badge: 'bg-yellow-100 text-yellow-700', border: 'border-l-4 border-yellow-500' },
  deprecated: { label: 'Deprecated', badge: 'bg-slate-100 text-slate-700', border: 'border-l-4 border-slate-500' },
};

const FLOW_EXAMPLES = [
  {
    title: 'Sales Pipeline',
    steps: ['Lead Qualification', 'Demo Scheduled', 'Deal Room', 'Contract Negotiation', 'Close'],
  },
  {
    title: 'Onboarding Journey',
    steps: ['Portal Provisioned', 'Client Trained', 'Content Planning', 'First Campaign', 'Launch'],
  },
  {
    title: 'Expansion Sequence',
    steps: ['ROI Milestone Hit', 'Expansion Signal', 'Success Manager Alert', 'Proposal Generated', 'Upsell Closed'],
  },
];

export default function AdminKnowledgeWorkflows() {
  const [workflows, setWorkflows] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    Promise.all([
      base44.entities.SOPWorkflow.list('-operational_importance_score', 100),
      base44.entities.KnowledgeArticle.list('article_title', 100),
    ]).then(([workflowsData, articlesData]) => {
      setWorkflows(workflowsData);
      setArticles(articlesData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading workflow processes…</div>
      </div>
    );
  }

  // Get article name by id
  const getArticleName = (articleId) => {
    if (!articleId) return null;
    const article = articles.find(a => a.id === articleId);
    return article ? article.article_title : null;
  };

  // Filter workflows
  const filtered = workflows.filter(w => {
    if (filterCategory !== 'all' && w.workflow_category !== filterCategory) return false;
    if (filterStatus !== 'all' && w.workflow_status !== filterStatus) return false;
    return true;
  });

  // KPIs
  const activeWorkflows = workflows.filter(w => w.workflow_status === 'active').length;
  const reviewNeededWorkflows = workflows.filter(w => w.workflow_status === 'review_needed').length;
  const avgCompletionDays = workflows.length > 0
    ? Math.round(workflows.reduce((sum, w) => sum + (w.avg_completion_days || 0), 0) / workflows.length)
    : 0;
  const highImportanceWorkflows = workflows.filter(w => (w.operational_importance_score || 0) > 80).length;
  const documentationCoverage = workflows.length > 0
    ? Math.round((workflows.filter(w => w.related_article).length / workflows.length) * 100)
    : 0;

  // Category distribution
  const categoryDistribution = Object.keys(CATEGORY_CONFIG).map(cat => ({
    name: CATEGORY_CONFIG[cat].label,
    count: workflows.filter(w => w.workflow_category === cat).length,
    color: CATEGORY_CONFIG[cat].color,
  })).filter(item => item.count > 0);

  // Insights
  const insights = [];

  const onboardingWorkflows = workflows.filter(w => w.workflow_category === 'onboarding' && w.workflow_status === 'active');
  if (onboardingWorkflows.length > 0) {
    const documented = onboardingWorkflows.filter(w => w.related_article);
    if (documented.length > 0) {
      insights.push({
        type: 'positive',
        title: 'Onboarding Workflow Documentation Reducing Setup Delays',
        description: `${documented.length} onboarding workflow(s) documented. Clear SOPs accelerating new client launches.`,
        action: '🚀 Continue refining onboarding workflows based on actual client feedback',
      });
    }
  }

  const contentWorkflows = workflows.filter(w => w.workflow_category === 'content_production' && w.workflow_status === 'active');
  if (contentWorkflows.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Content Production Workflow Clarity Improving Output Consistency',
      description: `${contentWorkflows.length} content production workflow(s) active. Standardized processes improving quality and speed.`,
      action: '📝 Update content workflow monthly; document emerging best practices',
    });
  }

  const expansionWorkflows = workflows.filter(w => w.workflow_category === 'expansion_execution');
  const undocumentedExpansion = expansionWorkflows.filter(w => !w.related_article);
  if (undocumentedExpansion.length > 0) {
    insights.push({
      type: 'alert',
      title: 'Expansion Workflows Still Under-Documented',
      description: `${undocumentedExpansion.length} expansion workflow(s) lack documentation. Process inconsistency risk in territory activation.`,
      action: '📈 Document top 2 expansion workflows this month; create territory playbook',
    });
  }

  const deprecatedCount = workflows.filter(w => w.workflow_status === 'deprecated').length;
  if (deprecatedCount > 1) {
    insights.push({
      type: 'alert',
      title: `${deprecatedCount} Deprecated Workflows—Clean Up Knowledge Base`,
      description: 'Deprecated processes may still appear in searches. Archive or remove for clarity.',
      action: '🗑️ Remove deprecated workflows from knowledge base; consolidate into active processes',
    });
  }

  const lowDocumentation = workflows.filter(w => (w.operational_importance_score || 0) > 75 && !w.related_article);
  if (lowDocumentation.length > 1) {
    insights.push({
      type: 'alert',
      title: `${lowDocumentation.length} High-Importance Workflows Lack Documentation`,
      description: 'Critical workflows missing SOPs. Prioritize documentation to prevent execution gaps.',
      action: '⚠️ Create SOP articles for all workflows scoring 75%+ importance',
    });
  }

  const handleStatusUpdate = async (workflowId, newStatus) => {
    await base44.entities.SOPWorkflow.update(workflowId, { workflow_status: newStatus });
    setWorkflows(workflows.map(w => w.id === workflowId ? { ...w, workflow_status: newStatus } : w));
    setSelectedWorkflow(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🔄</div>
            <h1 className="text-3xl font-black text-slate-900">SOP Workflow Processes</h1>
          </div>
          <p className="text-slate-600 text-sm">Visualize operational workflows as structured step sequences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Active Workflows</p>
            <p className="text-3xl font-black text-emerald-600">{activeWorkflows}</p>
            <p className="text-xs text-slate-600 mt-2">Operating processes</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Needing Review</p>
            <p className="text-3xl font-black text-yellow-600">{reviewNeededWorkflows}</p>
            <p className="text-xs text-slate-600 mt-2">Update needed</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Avg Completion</p>
            <p className="text-3xl font-black text-blue-600">{avgCompletionDays}d</p>
            <p className="text-xs text-slate-600 mt-2">Average duration</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">High Importance</p>
            <p className="text-3xl font-black text-purple-600">{highImportanceWorkflows}</p>
            <p className="text-xs text-slate-600 mt-2">Critical workflows</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Doc Coverage</p>
            <p className="text-3xl font-black text-cyan-600">{documentationCoverage}%</p>
            <p className="text-xs text-slate-600 mt-2">SOP linked</p>
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="review_needed">Review Needed</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>

        {/* SECTION 2 — Workflow Grid */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Workflow Registry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(workflow => {
              const categoryConfig = CATEGORY_CONFIG[workflow.workflow_category];
              const statusConfig = STATUS_CONFIG[workflow.workflow_status];
              const articleName = getArticleName(workflow.related_article);
              return (
                <button
                  key={workflow.id}
                  onClick={() => setSelectedWorkflow(workflow)}
                  className={`rounded-xl p-5 text-left transition-all hover:shadow-lg ${statusConfig.border} bg-white border border-slate-200`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{workflow.workflow_name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{categoryConfig.emoji} {categoryConfig.label}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${statusConfig.badge} capitalize flex-shrink-0`}>
                      {workflow.workflow_status}
                    </span>
                  </div>

                  {/* Steps and time */}
                  <div className="mb-3 pb-3 border-b border-slate-200">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>{workflow.step_count || 0} steps</span>
                      <span>{workflow.avg_completion_days || 0} days</span>
                    </div>
                  </div>

                  {/* Importance bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Importance</span>
                      <span className="text-sm font-bold text-amber-600">{workflow.operational_importance_score || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${workflow.operational_importance_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Documentation link */}
                  {articleName && (
                    <div className="text-xs text-slate-600">
                      📄 <span className="font-semibold text-slate-700 line-clamp-1">{articleName}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Category Distribution */}
        {categoryDistribution.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Workflow Distribution by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, color: '#1e293b' }}
                  formatter={(val) => [val, 'Workflows']}
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

        {/* SECTION 5 — Cross-Department Flow Map */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Cross-Department Workflow Sequences</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {FLOW_EXAMPLES.map((example, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">{example.title}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {example.steps.map((step, stepIdx) => (
                    <React.Fragment key={stepIdx}>
                      <div className="flex-1 min-w-max bg-slate-100 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 text-center">
                        {step}
                      </div>
                      {stepIdx < example.steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6 — Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Workflow Optimization Intelligence</h3>
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
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    {CATEGORY_CONFIG[selectedWorkflow.workflow_category].emoji} {CATEGORY_CONFIG[selectedWorkflow.workflow_category].label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${STATUS_CONFIG[selectedWorkflow.workflow_status].badge} capitalize`}>
                    {selectedWorkflow.workflow_status}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedWorkflow.workflow_name}</h3>
              </div>
              <button onClick={() => setSelectedWorkflow(null)} className="text-slate-400 hover:text-slate-600 text-2xl flex-shrink-0">×</button>
            </div>

            <div className="space-y-6 mb-6 pb-6 border-b border-slate-200">
              {/* Step sequence */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Step Sequence</p>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedWorkflow.step_sequence_summary}</p>
              </div>

              {/* Linked article */}
              {getArticleName(selectedWorkflow.related_article) && (
                <div className="bg-slate-100 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Linked SOP Article</p>
                  <p className="text-sm font-semibold text-slate-900">📄 {getArticleName(selectedWorkflow.related_article)}</p>
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Steps</p>
                  <p className="text-2xl font-black text-slate-900">{selectedWorkflow.step_count || 0}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Duration</p>
                  <p className="text-2xl font-black text-slate-900">{selectedWorkflow.avg_completion_days || 0}d</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Importance</p>
                  <p className="text-2xl font-black text-amber-600">{selectedWorkflow.operational_importance_score || 0}%</p>
                </div>
              </div>

              {/* Importance explanation */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Operational Significance</p>
                <p className="text-sm text-slate-700">
                  This {selectedWorkflow.step_count || 0}-step workflow typically completes in {selectedWorkflow.avg_completion_days || 0} days and carries {selectedWorkflow.operational_importance_score || 0}% operational importance to the organization's core functions.
                </p>
              </div>
            </div>

            {/* Status Actions */}
            <div className="space-y-2">
              {selectedWorkflow.workflow_status === 'active' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedWorkflow.id, 'review_needed')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    👀 Mark for Review
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedWorkflow.id, 'deprecated')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⛔ Deprecate Workflow
                  </button>
                </>
              )}
              {selectedWorkflow.workflow_status === 'review_needed' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(selectedWorkflow.id, 'active')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ✓ Approve & Activate
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedWorkflow.id, 'deprecated')}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    ⛔ Deprecate Workflow
                  </button>
                </>
              )}
              {selectedWorkflow.workflow_status === 'deprecated' && (
                <button
                  onClick={() => handleStatusUpdate(selectedWorkflow.id, 'active')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  🔄 Reactivate Workflow
                </button>
              )}
              <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 text-sm font-bold py-2 rounded-lg transition-colors">
                📋 Duplicate Workflow
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}