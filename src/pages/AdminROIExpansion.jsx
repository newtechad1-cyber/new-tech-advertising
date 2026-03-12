import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter } from 'recharts';
import { ChevronRight, TrendingUp, Target } from 'lucide-react';

const TRIGGER_CONFIG = {
  premium_video: { label: 'Premium Video', emoji: '🎬', color: '#ec4899', bg: 'bg-pink-50' },
  seasonal_campaign: { label: 'Seasonal Campaign', emoji: '🎯', color: '#f59e0b', bg: 'bg-amber-50' },
  authority_content: { label: 'Authority Content', emoji: '📚', color: '#8b5cf6', bg: 'bg-purple-50' },
  pricing_upgrade: { label: 'Pricing Upgrade', emoji: '💰', color: '#10b981', bg: 'bg-emerald-50' },
  multi_location: { label: 'Multi-Location', emoji: '🌍', color: '#3b82f6', bg: 'bg-blue-50' },
  enterprise_package: { label: 'Enterprise Package', emoji: '🏢', color: '#6366f1', bg: 'bg-indigo-50' },
  strategy_review: { label: 'Strategy Review', emoji: '🎓', color: '#06b6d4', bg: 'bg-cyan-50' },
};

const STATUS_LABELS = {
  identified: 'Identified',
  reviewed: 'Reviewed',
  conversation_started: 'In Conversation',
  proposal_sent: 'Proposal Sent',
  converted: 'Converted',
  dismissed: 'Dismissed',
};

function readinessBg(score) {
  if (score >= 75) return 'bg-emerald-100';
  if (score >= 50) return 'bg-amber-100';
  return 'bg-slate-100';
}

function readinessColor(score) {
  if (score >= 75) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-slate-500';
}

export default function AdminROIExpansion() {
  const [triggers, setTriggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    base44.entities.ROIExpansionTrigger.list('-momentum_score', 100).then(t => {
      setTriggers(t);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading expansion intelligence…</div>
      </div>
    );
  }

  // Filter triggers
  const filteredTriggers = triggers.filter(t => {
    if (filterType !== 'all' && t.trigger_type !== filterType) return false;
    if (filterStatus !== 'all' && t.trigger_status !== filterStatus) return false;
    return true;
  });

  // KPIs
  const clientsReadyCount = new Set(filteredTriggers.map(t => t.client_name)).size;
  const totalProjectedMRR = filteredTriggers.reduce((sum, t) => sum + (t.projected_mrr_increase || 0), 0);
  const inConversationCount = filteredTriggers.filter(t => t.trigger_status === 'conversation_started').length;
  const convertedCount = filteredTriggers.filter(t => t.trigger_status === 'converted').length;
  const avgReadiness = filteredTriggers.length > 0
    ? Math.round(filteredTriggers.reduce((sum, t) => sum + (t.readiness_score || 0), 0) / filteredTriggers.length)
    : 0;

  // Type distribution
  const typeDistribution = Object.keys(TRIGGER_CONFIG).map(type => ({
    name: TRIGGER_CONFIG[type].label,
    count: triggers.filter(t => t.trigger_type === type).length,
    color: TRIGGER_CONFIG[type].color,
  })).filter(item => item.count > 0);

  // Momentum vs Readiness matrix data
  const matrixData = triggers.map(t => ({
    momentum: t.momentum_score || 0,
    readiness: t.readiness_score || 0,
    client: t.client_name,
    trigger: t.trigger_type,
  }));

  // Insights
  const insights = [
    {
      title: 'Video-Heavy Accounts Show Strongest Upgrade Readiness',
      description: 'Clients with consistent video engagement demonstrate 23% higher pricing upgrade acceptance.',
      action: 'Focus video upsells on high-momentum accounts',
    },
    {
      title: 'Visibility Growth Correlates with Authority Upsells',
      description: 'Top 10 visibility gainers show 67% interest in authority content packages.',
      action: 'Proactive strategy reviews for visibility leaders',
    },
    {
      title: 'Strategy Reviews Increase Pricing Upgrade Acceptance',
      description: 'Clients who complete strategy reviews convert 4x more often on pricing upgrades.',
      action: 'Schedule Q1 strategy reviews for high-readiness clients',
    },
  ];

  const handleStatusUpdate = async (triggerId, newStatus) => {
    await base44.entities.ROIExpansionTrigger.update(triggerId, { trigger_status: newStatus });
    setTriggers(triggers.map(t => t.id === triggerId ? { ...t, trigger_status: newStatus } : t));
    setSelectedTrigger(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-black text-white">ROI Expansion Intelligence</h1>
          <p className="text-slate-400 text-sm mt-1">Identify clients ready for upsell, expansion, and strategic upgrades</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Clients Ready</p>
            <p className="text-3xl font-black text-white">{clientsReadyCount}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Projected Expansion MRR</p>
            <p className="text-3xl font-black text-emerald-400">${totalProjectedMRR.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">In Conversation</p>
            <p className="text-3xl font-black text-blue-400">{inConversationCount}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Converted This Month</p>
            <p className="text-3xl font-black text-amber-400">{convertedCount}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Avg Readiness</p>
            <p className="text-3xl font-black text-purple-400">{avgReadiness}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg"
          >
            <option value="all">All Trigger Types</option>
            {Object.entries(TRIGGER_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* SECTION 2 — Expansion Trigger Grid */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Expansion Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTriggers.map(trigger => {
              const config = TRIGGER_CONFIG[trigger.trigger_type];
              return (
                <button
                  key={trigger.id}
                  onClick={() => setSelectedTrigger(trigger)}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-left hover:border-slate-600 hover:bg-slate-750 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-white">{trigger.client_name}</p>
                      <p className="text-xs text-slate-400 mt-1">{config.label}</p>
                    </div>
                    <span className="text-lg">{config.emoji}</span>
                  </div>

                  <div className="space-y-3">
                    {/* Readiness progress */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-400">Readiness</span>
                        <span className={`text-xs font-bold ${readinessColor(trigger.readiness_score || 0)}`}>
                          {trigger.readiness_score || 0}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            (trigger.readiness_score || 0) >= 75
                              ? 'bg-emerald-500'
                              : (trigger.readiness_score || 0) >= 50
                              ? 'bg-amber-500'
                              : 'bg-slate-500'
                          }`}
                          style={{ width: `${trigger.readiness_score || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Momentum meter */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Momentum</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${trigger.momentum_score || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-blue-400 font-bold">{trigger.momentum_score || 0}%</span>
                      </div>
                    </div>

                    {/* Projected MRR */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Projected MRR</span>
                      <span className="text-sm font-black text-emerald-400">${(trigger.projected_mrr_increase || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-300">
                      {STATUS_LABELS[trigger.trigger_status]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Type Distribution */}
        {typeDistribution.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Trigger Type Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={typeDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  formatter={(val) => [val, 'Count']}
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

        {/* SECTION 5 — Momentum vs Readiness */}
        {matrixData.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Momentum vs Readiness Matrix</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis
                  dataKey="momentum"
                  name="Momentum"
                  label={{ value: 'Momentum Score', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis
                  dataKey="readiness"
                  name="Readiness"
                  label={{ value: 'Readiness Score', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  cursor={{ strokeDasharray: '3 3', stroke: '#64748b' }}
                />
                <Scatter name="Triggers" data={matrixData} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SECTION 6 — Intelligence Feed */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Expansion Intelligence Feed</h3>
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-white">{insight.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{insight.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-bold text-blue-400">
                      <Target className="w-3 h-3" />
                      {insight.action}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Detail Modal */}
      {selectedTrigger && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{selectedTrigger.client_name}</p>
                <h3 className="text-2xl font-black text-white mt-1">
                  {TRIGGER_CONFIG[selectedTrigger.trigger_type].label}
                </h3>
              </div>
              <button onClick={() => setSelectedTrigger(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
              {/* Trigger reason */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Reason</p>
                <p className="text-sm text-slate-300">{selectedTrigger.trigger_reason}</p>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Readiness</p>
                  <p className="text-2xl font-black text-emerald-400">{selectedTrigger.readiness_score || 0}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Momentum</p>
                  <p className="text-2xl font-black text-blue-400">{selectedTrigger.momentum_score || 0}%</p>
                </div>
              </div>

              {/* Timing & MRR */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Recommended Timing</p>
                <p className="text-sm text-slate-300">{selectedTrigger.recommended_timing}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Projected MRR Increase</p>
                <p className="text-2xl font-black text-emerald-400">${(selectedTrigger.projected_mrr_increase || 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => handleStatusUpdate(selectedTrigger.id, 'reviewed')}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors"
              >
                Mark Reviewed
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedTrigger.id, 'conversation_started')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
              >
                Start Conversation
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedTrigger.id, 'proposal_sent')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
              >
                Mark Proposal Sent
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedTrigger.id, 'converted')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
              >
                Mark Converted
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedTrigger.id, 'dismissed')}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold py-2 rounded-lg transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}