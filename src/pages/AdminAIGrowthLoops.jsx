import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Zap } from 'lucide-react';

const CATEGORY_CONFIG = {
  acquisition: { label: 'Acquisition', emoji: '📥', color: '#3b82f6' },
  retention: { label: 'Retention', emoji: '🛡️', color: '#10b981' },
  expansion: { label: 'Expansion', emoji: '🚀', color: '#f59e0b' },
  operations: { label: 'Operations', emoji: '⚙️', color: '#8b5cf6' },
  funnel_optimization: { label: 'Funnel', emoji: '⚡', color: '#ec4899' },
  content_authority: { label: 'Content Authority', emoji: '📝', color: '#06b6d4' },
};

const STATUS_CONFIG = {
  optimized: { label: 'Optimized', color: 'bg-emerald-100', textColor: 'text-emerald-700', dot: 'bg-emerald-500' },
  scaling: { label: 'Scaling', color: 'bg-blue-100', textColor: 'text-blue-700', dot: 'bg-blue-500' },
  validated: { label: 'Validated', color: 'bg-amber-100', textColor: 'text-amber-700', dot: 'bg-amber-500' },
  observed: { label: 'Observed', color: 'bg-slate-100', textColor: 'text-slate-700', dot: 'bg-slate-400' },
};

const CARD_BORDER = {
  optimized: 'border-l-4 border-emerald-500 bg-slate-800/60',
  scaling: 'border-l-4 border-blue-500 bg-slate-800/60',
  validated: 'border-l-4 border-amber-500 bg-slate-800/60',
  observed: 'border-l-4 border-slate-500 bg-slate-800/60',
};

export default function AdminAIGrowthLoops() {
  const [loops, setLoops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoop, setSelectedLoop] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    base44.entities.AutonomousGrowthLoop.list('-avg_revenue_impact', 100)
      .then((data) => {
        setLoops(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading growth loop intelligence…</div>
      </div>
    );
  }

  // Filter loops
  const filtered = loops.filter(l => {
    if (filterCategory !== 'all' && l.loop_category !== filterCategory) return false;
    if (filterStatus !== 'all' && l.loop_status !== filterStatus) return false;
    return true;
  });

  // KPIs
  const activeLoops = loops.length;
  const validatedLoops = loops.filter(l => ['validated', 'scaling', 'optimized'].includes(l.loop_status)).length;
  const avgRevenue = loops.length > 0
    ? Math.round(loops.reduce((sum, l) => sum + (l.avg_revenue_impact || 0), 0) / loops.length)
    : 0;
  const avgEfficiency = loops.length > 0
    ? Math.round(loops.reduce((sum, l) => sum + (l.efficiency_gain_score || 0), 0) / loops.length)
    : 0;
  const confidenceIndex = loops.length > 0
    ? Math.round(loops.reduce((sum, l) => sum + (l.confidence_score || 0), 0) / loops.length)
    : 0;

  // Category distribution
  const categoryDistribution = Object.keys(CATEGORY_CONFIG).map(cat => ({
    name: CATEGORY_CONFIG[cat].label,
    count: loops.filter(l => l.loop_category === cat).length,
    color: CATEGORY_CONFIG[cat].color,
  })).filter(item => item.count > 0);

  // Matrix data
  const matrixData = loops.map(l => ({
    x: l.frequency_per_month || 0,
    y: l.avg_revenue_impact || 0,
    name: l.loop_name,
    status: l.loop_status,
    fill: l.loop_status === 'optimized' ? '#10b981' : l.loop_status === 'scaling' ? '#3b82f6' : l.loop_status === 'validated' ? '#f59e0b' : '#64748b',
  }));

  // Insights
  const insights = [];

  const expansionLoops = loops.filter(l => l.loop_category === 'expansion');
  const strongExpansion = expansionLoops.filter(l => (l.avg_revenue_impact || 0) > 80);
  if (strongExpansion.length > 0) {
    insights.push({
      type: 'positive',
      title: 'ROI-Triggered Upsell Loops Producing Strongest Expansion Lift',
      description: `${strongExpansion.length} expansion loop(s) with 80%+ revenue impact. Self-reinforcing upsell patterns detected.`,
      action: '📈 Increase frequency cap on top-performing expansion loops',
    });
  }

  const contentLoops = loops.filter(l => l.loop_category === 'content_authority');
  const optimizedContent = contentLoops.filter(l => l.loop_status === 'optimized');
  if (optimizedContent.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Content Authority Loops Improving Funnel Conversion Quality',
      description: `${optimizedContent.length} optimized content loop(s). Authority automation driving qualified leads.`,
      action: '📝 Expand content authority automation to new verticals',
    });
  }

  const retentionLoops = loops.filter(l => l.loop_category === 'retention');
  const highImpactRetention = retentionLoops.filter(l => (l.avg_revenue_impact || 0) > 75);
  if (highImpactRetention.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Retention Intervention Loops Reducing Revenue Leakage',
      description: `${highImpactRetention.length} retention loop(s) preventing churn. Risk mitigation working autonomously.`,
      action: '🛡️ Integrate retention loop signals into renewal playbooks',
    });
  }

  const acquisitionLoops = loops.filter(l => l.loop_category === 'acquisition');
  const scalingAcquisition = acquisitionLoops.filter(l => l.loop_status === 'scaling');
  if (scalingAcquisition.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Acquisition Loops Strengthening After Demo Improvements',
      description: `${scalingAcquisition.length} acquisition loop(s) in scaling phase. Demo completion gains compound.`,
      action: '🔄 Reinvest in top-converting demo variations; automate winning sequences',
    });
  }

  const observedLoops = loops.filter(l => l.loop_status === 'observed');
  if (observedLoops.length > 2) {
    insights.push({
      type: 'alert',
      title: `${observedLoops.length} Loops Still in Observation—Validate Soon`,
      description: 'Observed loops need validation before scaling. Recommended review cadence: monthly.',
      action: '✓ Schedule validation reviews for high-confidence observed loops',
    });
  }

  // Recommendations
  const recommendations = [];

  const highFrequencyHighImpact = loops.filter(l => (l.frequency_per_month || 0) > 10 && (l.avg_revenue_impact || 0) > 75 && l.loop_status !== 'optimized');
  if (highFrequencyHighImpact.length > 0) {
    recommendations.push({
      type: 'scale',
      title: 'Scale Frequent, High-Impact Loops',
      description: `${highFrequencyHighImpact.length} loop(s) running frequently with strong impact. Ready for acceleration.`,
      upside: '25-40% additional revenue impact',
      action: 'Increase automation frequency caps; reallocate AI agent capacity',
    });
  }

  const lowFrequencyHighImpact = loops.filter(l => (l.frequency_per_month || 0) <= 5 && (l.avg_revenue_impact || 0) > 80);
  if (lowFrequencyHighImpact.length > 0) {
    recommendations.push({
      type: 'optimize',
      title: 'Optimize High-Impact, Infrequent Loops',
      description: `${lowFrequencyHighImpact.length} rare but powerful loop(s). Increase trigger sensitivity to boost frequency.`,
      upside: '15-30% frequency gain',
      action: 'Review trigger thresholds; lower friction in automation entry points',
    });
  }

  const validatedNotOptimized = loops.filter(l => l.loop_status === 'validated');
  if (validatedNotOptimized.length > 0) {
    recommendations.push({
      type: 'scale',
      title: 'Promote Validated Loops to Scaling',
      description: `${validatedNotOptimized.length} validated loop(s) ready for acceleration. Confidence and data support scaling.`,
      upside: '10-20% operational efficiency gain',
      action: 'Increase loop execution frequency; monitor performance metrics closely',
    });
  }

  const handleStatusUpdate = async (loopId, newStatus) => {
    await base44.entities.AutonomousGrowthLoop.update(loopId, { loop_status: newStatus });
    setLoops(loops.map(l => l.id === loopId ? { ...l, loop_status: newStatus } : l));
    setSelectedLoop(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🔄</div>
            <h1 className="text-3xl font-black text-white">Autonomous Growth Loops</h1>
          </div>
          <p className="text-slate-400 text-sm">Self-reinforcing automation patterns and compounding revenue sequences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Loops</p>
            <p className="text-3xl font-black text-blue-400">{activeLoops}</p>
            <p className="text-xs text-slate-400 mt-2">Identified patterns</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Validated Loops</p>
            <p className="text-3xl font-black text-emerald-400">{validatedLoops}</p>
            <p className="text-xs text-slate-400 mt-2">Production-ready</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Revenue Impact</p>
            <p className="text-3xl font-black text-amber-400">${avgRevenue}</p>
            <p className="text-xs text-slate-400 mt-2">Per cycle</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Efficiency Average</p>
            <p className="text-3xl font-black text-cyan-400">{avgEfficiency}%</p>
            <p className="text-xs text-slate-400 mt-2">Operational gains</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Confidence Index</p>
            <p className="text-3xl font-black text-purple-400">{confidenceIndex}%</p>
            <p className="text-xs text-slate-400 mt-2">Loop reliability</p>
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
            <option value="optimized">Optimized</option>
            <option value="scaling">Scaling</option>
            <option value="validated">Validated</option>
            <option value="observed">Observed</option>
          </select>
        </div>

        {/* SECTION 2 — Growth Loop Grid */}
        <div>
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Growth Loop Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(loop => {
              const categoryConfig = CATEGORY_CONFIG[loop.loop_category];
              const statusConfig = STATUS_CONFIG[loop.loop_status];
              return (
                <button
                  key={loop.id}
                  onClick={() => setSelectedLoop(loop)}
                  className={`rounded-xl p-5 text-left transition-all hover:shadow-lg ${CARD_BORDER[loop.loop_status]} backdrop-blur`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{loop.loop_name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{loop.frequency_per_month || 0}x/month</p>
                    </div>
                    <span className="text-lg flex-shrink-0">{categoryConfig.emoji}</span>
                  </div>

                  {/* Category and status badges */}
                  <div className="mb-3 pb-3 border-b border-slate-700">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-300">
                        {categoryConfig.label}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${statusConfig.color} ${statusConfig.textColor}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Revenue impact */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">Revenue Impact</span>
                      <span className="text-sm font-bold text-amber-400">${loop.avg_revenue_impact || 0}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.min(loop.avg_revenue_impact || 0, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Efficiency */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">Efficiency Gain</span>
                      <span className="text-sm font-bold text-emerald-400">{loop.efficiency_gain_score || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${loop.efficiency_gain_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Confidence</span>
                    <span className="font-bold text-cyan-400">{loop.confidence_score || 0}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — Category Distribution */}
        {categoryDistribution.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Loop Category Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryDistribution} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  formatter={(val) => [val, 'Loops']}
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

        {/* SECTION 5 — Frequency vs Revenue Impact Matrix */}
        {matrixData.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Frequency vs Revenue Impact Matrix</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis
                  dataKey="x"
                  name="Frequency/Month"
                  label={{ value: 'Frequency per Month', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis
                  dataKey="y"
                  name="Revenue Impact"
                  label={{ value: 'Avg Revenue Impact', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
                  cursor={{ strokeDasharray: '3 3', stroke: '#64748b' }}
                  formatter={(value) => [value, '']}
                />
                <Scatter name="Loops" data={matrixData}>
                  {matrixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-400 mt-4 text-center">
              Top-right = Frequent & impactful (scale) · Top-left = Frequent but lower impact (optimize) · Bottom-right = Rare but high impact (increase triggers)
            </p>
          </div>
        )}

        {/* SECTION 6 — Intelligence Feed */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Growth Loop Intelligence</h3>
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

        {/* SECTION 7 — Optimization Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Loop Optimization Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 backdrop-blur">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">
                      {rec.type === 'scale' ? '📈' : '⚙️'}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-white">{rec.title}</h4>
                      <p className="text-sm text-slate-300 mt-1">{rec.description}</p>
                      <div className="mt-3 flex flex-col gap-2 text-xs">
                        <div>
                          <span className="text-slate-400">Estimated Upside: </span>
                          <span className="font-bold text-cyan-400">{rec.upside}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Next Step: </span>
                          <span className="font-bold text-emerald-400">{rec.action}</span>
                        </div>
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
      {selectedLoop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto backdrop-blur">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{CATEGORY_CONFIG[selectedLoop.loop_category].label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{selectedLoop.loop_name}</h3>
              </div>
              <button onClick={() => setSelectedLoop(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
              {/* Trigger Event */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Trigger Event</p>
                <p className="text-sm text-slate-300">{selectedLoop.trigger_event}</p>
              </div>

              {/* Automation Sequence */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Automation Sequence</p>
                <p className="text-sm text-slate-300">{selectedLoop.automation_sequence_summary}</p>
              </div>

              {/* Frequency */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Frequency</p>
                <p className="text-lg font-black text-cyan-400">{selectedLoop.frequency_per_month || 0} times/month</p>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Revenue</p>
                  <p className="text-lg font-black text-amber-400">${selectedLoop.avg_revenue_impact || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Efficiency</p>
                  <p className="text-lg font-black text-emerald-400">{selectedLoop.efficiency_gain_score || 0}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Confidence</p>
                  <p className="text-lg font-black text-cyan-400">{selectedLoop.confidence_score || 0}%</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Current Status</p>
                <span className={`text-xs font-bold px-2 py-1 rounded ${STATUS_CONFIG[selectedLoop.loop_status].color} ${STATUS_CONFIG[selectedLoop.loop_status].textColor}`}>
                  {STATUS_CONFIG[selectedLoop.loop_status].label}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {selectedLoop.loop_status === 'observed' && (
                <button
                  onClick={() => handleStatusUpdate(selectedLoop.id, 'validated')}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ✓ Mark Validated
                </button>
              )}
              {selectedLoop.loop_status === 'validated' && (
                <button
                  onClick={() => handleStatusUpdate(selectedLoop.id, 'scaling')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  📈 Mark Scaling
                </button>
              )}
              {selectedLoop.loop_status === 'scaling' && (
                <button
                  onClick={() => handleStatusUpdate(selectedLoop.id, 'optimized')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  ⭐ Mark Optimized
                </button>
              )}
              {selectedLoop.loop_status !== 'observed' && (
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                  📋 Attach to Strategic Action
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}