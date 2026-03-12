import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, TrendingUp, Check } from 'lucide-react';

const TEST_TYPE_CONFIG = {
  headline: { label: 'Headline', emoji: '📝', color: '#3b82f6' },
  cta: { label: 'CTA', emoji: '🎯', color: '#8b5cf6' },
  offer: { label: 'Offer', emoji: '🎁', color: '#10b981' },
  pricing_message: { label: 'Pricing Message', emoji: '💰', color: '#f59e0b' },
  layout: { label: 'Layout', emoji: '🎨', color: '#ec4899' },
  video_focus: { label: 'Video Focus', emoji: '🎬', color: '#06b6d4' },
};

const STATUS_CONFIG = {
  planned: { label: 'Planned', color: 'bg-slate-100', textColor: 'text-slate-600' },
  running: { label: 'Running', color: 'bg-blue-100', textColor: 'text-blue-600' },
  completed: { label: 'Completed', color: 'bg-emerald-100', textColor: 'text-emerald-600' },
  paused: { label: 'Paused', color: 'bg-amber-100', textColor: 'text-amber-600' },
};

function confidenceBg(score) {
  if (score >= 80) return 'bg-emerald-100';
  if (score >= 60) return 'bg-blue-100';
  return 'bg-slate-100';
}

function confidenceColor(score) {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-blue-600';
  return 'text-slate-500';
}

export default function AdminFunnelTests() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExp, setSelectedExp] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    base44.entities.FunnelExperiment.list('-start_date', 100).then(e => {
      setExperiments(e);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading experiment dashboard…</div>
      </div>
    );
  }

  // Filter experiments
  const filtered = experiments.filter(e => {
    if (filterType !== 'all' && e.test_type !== filterType) return false;
    if (filterStatus !== 'all' && e.status !== filterStatus) return false;
    return true;
  });

  // KPIs
  const activeCount = experiments.filter(e => e.status === 'running').length;
  const winningVariants = experiments.filter(e => e.status === 'completed' && (e.conversion_lift_percent || 0) > 0).length;
  const avgConversionLift = experiments.length > 0
    ? Math.round(experiments.reduce((sum, e) => sum + (e.conversion_lift_percent || 0), 0) / experiments.length * 10) / 10
    : 0;
  const completedThisMonth = experiments.filter(e => e.status === 'completed').length;
  const avgConfidence = experiments.length > 0
    ? Math.round(experiments.reduce((sum, e) => sum + (e.confidence_score || 0), 0) / experiments.length)
    : 0;

  // Test type distribution
  const typeDistribution = Object.keys(TEST_TYPE_CONFIG).map(type => ({
    name: TEST_TYPE_CONFIG[type].label,
    count: experiments.filter(e => e.test_type === type).length,
    color: TEST_TYPE_CONFIG[type].color,
  })).filter(item => item.count > 0);

  // Insights
  const insights = [];
  const urgencyCTA = experiments.find(e => e.test_type === 'cta' && e.status === 'completed');
  if (urgencyCTA && (urgencyCTA.conversion_lift_percent || 0) > 15) {
    insights.push({
      type: 'positive',
      title: 'Urgency CTAs Outperforming Neutral Messaging',
      description: `CTA tests show ${urgencyCTA.conversion_lift_percent || 0}% lift with urgency language. Strong signal.`,
      action: '🚀 Apply urgency CTA to all high-value pages',
    });
  }

  const videoFocus = experiments.find(e => e.test_type === 'video_focus' && e.status === 'completed');
  if (videoFocus && (videoFocus.conversion_lift_percent || 0) > 10) {
    insights.push({
      type: 'positive',
      title: 'Video-Focused Demos Increasing Engagement',
      description: `Video-first layout delivering ${videoFocus.conversion_lift_percent || 0}% higher conversions.`,
      action: '🎬 Roll out video-first treatment to demo pages',
    });
  }

  const reassurance = experiments.find(e => e.test_type === 'offer' && e.status === 'completed');
  if (reassurance && (reassurance.conversion_lift_percent || 0) > 12) {
    insights.push({
      type: 'positive',
      title: 'Reassurance Messaging Improving Trial Conversion',
      description: `Offer messaging with guarantees showing ${reassurance.conversion_lift_percent || 0}% trial lift.`,
      action: '✓ Update all trial CTAs with reassurance language',
    });
  }

  const lowConfidence = filtered.filter(e => (e.confidence_score || 0) < 60 && e.status === 'running');
  if (lowConfidence.length > 0) {
    insights.push({
      type: 'alert',
      title: 'Some Tests Need More Data',
      description: `${lowConfidence.length} running experiment(s) below 60% confidence. Let them run longer.`,
      action: '⏳ Continue running tests for statistical significance',
    });
  }

  const handleStatusUpdate = async (expId, newStatus) => {
    await base44.entities.FunnelExperiment.update(expId, { status: newStatus });
    setExperiments(experiments.map(e => e.id === expId ? { ...e, status: newStatus } : e));
    setSelectedExp(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-black text-white">Funnel Experimentation</h1>
          <p className="text-slate-400 text-sm mt-1">A/B test messaging, offers, and layouts for conversion optimization</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Experiments</p>
            <p className="text-3xl font-black text-blue-400">{activeCount}</p>
            <p className="text-xs text-slate-400 mt-2">Currently running</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Winning Variants</p>
            <p className="text-3xl font-black text-emerald-400">{winningVariants}</p>
            <p className="text-xs text-slate-400 mt-2">Identified and lifting</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Conversion Lift</p>
            <p className="text-3xl font-black text-amber-400">+{avgConversionLift}%</p>
            <p className="text-xs text-slate-400 mt-2">Across all tests</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Completed This Month</p>
            <p className="text-3xl font-black text-purple-400">{completedThisMonth}</p>
            <p className="text-xs text-slate-400 mt-2">Test iterations</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Confidence</p>
            <p className="text-3xl font-black text-cyan-400">{avgConfidence}%</p>
            <p className="text-xs text-slate-400 mt-2">Statistical rigor</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg"
          >
            <option value="all">All Test Types</option>
            {Object.entries(TEST_TYPE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        {/* SECTION 2 — Experiment Grid */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Active & Recent Experiments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(exp => {
              const typeConfig = TEST_TYPE_CONFIG[exp.test_type];
              const statusConfig = STATUS_CONFIG[exp.status];
              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExp(exp)}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-left hover:border-slate-600 hover:bg-slate-750 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-black text-white">{exp.experiment_name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{exp.target_page}</p>
                    </div>
                    <span className="text-lg">{typeConfig.emoji}</span>
                  </div>

                  {/* Conversion lift */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">Conversion Lift</span>
                      <span className="text-sm font-bold text-emerald-400">
                        +{exp.conversion_lift_percent || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(exp.conversion_lift_percent || 0, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="mb-4 pb-4 border-b border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">Confidence</span>
                      <span className={`text-sm font-bold ${confidenceColor(exp.confidence_score || 0)}`}>
                        {exp.confidence_score || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (exp.confidence_score || 0) >= 80
                            ? 'bg-emerald-500'
                            : (exp.confidence_score || 0) >= 60
                            ? 'bg-blue-500'
                            : 'bg-slate-500'
                        }`}
                        style={{ width: `${exp.confidence_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${statusConfig.color} ${statusConfig.textColor}`}>
                      {statusConfig.label}
                    </span>
                    <span className="text-xs text-slate-400">{typeConfig.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Test Type Distribution */}
        {typeDistribution.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Test Type Distribution</h3>
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

        {/* SECTION 5 — Experiment Intelligence */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Experimentation Intelligence</h3>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className={`border rounded-xl p-5 ${
                  insight.type === 'positive'
                    ? 'bg-emerald-950 border-emerald-700'
                    : 'bg-rose-950 border-rose-700'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">
                      {insight.type === 'positive' ? '📈' : '⚠️'}
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
      {selectedExp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{TEST_TYPE_CONFIG[selectedExp.test_type].label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{selectedExp.experiment_name}</h3>
              </div>
              <button onClick={() => setSelectedExp(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
              {/* Page */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Target Page</p>
                <p className="text-sm text-slate-300">{selectedExp.target_page}</p>
              </div>

              {/* Variant A */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Variant A (Control)</p>
                <p className="text-sm text-slate-300">{selectedExp.variant_a_description}</p>
              </div>

              {/* Variant B */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Variant B (Treatment)</p>
                <p className="text-sm text-slate-300">{selectedExp.variant_b_description}</p>
              </div>

              {/* Performance */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Conversion Lift</p>
                  <p className="text-2xl font-black text-emerald-400">+{selectedExp.conversion_lift_percent || 0}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Confidence</p>
                  <p className={`text-2xl font-black ${confidenceColor(selectedExp.confidence_score || 0)}`}>
                    {selectedExp.confidence_score || 0}%
                  </p>
                </div>
              </div>

              {/* Status & Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Status</p>
                  <p className="text-sm font-bold text-white">{STATUS_CONFIG[selectedExp.status].label}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Started</p>
                  <p className="text-sm text-slate-300">{new Date(selectedExp.start_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                ✓ Mark Winning Variant
              </button>
              {selectedExp.status === 'running' && (
                <button
                  onClick={() => handleStatusUpdate(selectedExp.id, 'paused')}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ⏸ Pause Test
                </button>
              )}
              {(selectedExp.status === 'paused' || selectedExp.status === 'planned') && (
                <button
                  onClick={() => handleStatusUpdate(selectedExp.id, 'running')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ▶ Relaunch Test
                </button>
              )}
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                🚀 Flag for Funnel Update
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}