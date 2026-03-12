import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export default function AdminFunnelOptimization() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('14days');

  useEffect(() => {
    base44.entities.FunnelPerformanceMetric.list('-metric_date', 100).then(m => {
      setMetrics(m.sort((a, b) => new Date(a.metric_date) - new Date(b.metric_date)));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading funnel analytics…</div>
      </div>
    );
  }

  // Get today's metrics
  const today = metrics[metrics.length - 1] || {};
  const yesterday = metrics.length > 1 ? metrics[metrics.length - 2] : {};

  // Calculate KPIs and trends
  const visitorsToday = today.website_visitors || 0;
  const demoStartsToday = today.demo_starts || 0;
  const trialSignupsToday = today.trial_signups || 0;
  const strategyCallsToday = today.booked_strategy_calls || 0;
  const conversionRateToday = today.conversion_rate_overall || 0;

  // Calculate conversions at each funnel stage
  const demoStartRate = visitorsToday > 0 ? Math.round((demoStartsToday / visitorsToday) * 100) : 0;
  const trialConversionRate = demoStartsToday > 0 ? Math.round((trialSignupsToday / demoStartsToday) * 100) : 0;
  const dealClosureRate = trialSignupsToday > 0 ? Math.round((strategyCallsToday / trialSignupsToday) * 100) : 0;

  // Trend calculations
  const visitorsTrend = yesterday.website_visitors ? ((visitorsToday - yesterday.website_visitors) / yesterday.website_visitors * 100).toFixed(1) : 0;
  const demoStartsTrend = yesterday.demo_starts ? ((demoStartsToday - yesterday.demo_starts) / yesterday.demo_starts * 100).toFixed(1) : 0;
  const trialSignupsTrend = yesterday.trial_signups ? ((trialSignupsToday - yesterday.trial_signups) / yesterday.trial_signups * 100).toFixed(1) : 0;

  // Prepare chart data
  const chartData = metrics.map(m => ({
    date: new Date(m.metric_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visitors: m.website_visitors || 0,
    demoStarts: m.demo_starts || 0,
    trialSignups: m.trial_signups || 0,
  }));

  // Insights
  const insights = [];
  if (trialConversionRate > 35) {
    insights.push({
      type: 'positive',
      title: 'Demo Completion Rate Improving',
      description: `Trial conversion from demos is strong at ${trialConversionRate}%. Continue optimizing demo experience.`,
      action: '✓ Maintain current demo flow',
    });
  } else if (trialConversionRate < 20) {
    insights.push({
      type: 'alert',
      title: 'Trial Conversion Dip Detected',
      description: `Demo-to-trial conversion dropped to ${trialConversionRate}%. Review demo value messaging.`,
      action: '🎯 Review demo script and objection handling',
    });
  }

  if (strategyCallsToday > 5) {
    insights.push({
      type: 'positive',
      title: 'Strategy Calls Momentum Strong',
      description: `${strategyCallsToday} strategy calls booked today. Sales pipeline is active.`,
      action: '📞 Ensure timely follow-up on all calls',
    });
  }

  if (visitorsToday < 50) {
    insights.push({
      type: 'alert',
      title: 'Website Traffic Low',
      description: `Today's visitor count (${visitorsToday}) is below typical. Check marketing channels.`,
      action: '📈 Audit paid ads and organic channels',
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-black text-white">Funnel Optimization</h1>
          <p className="text-slate-400 text-sm mt-1">Website funnel performance and conversion analytics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* SECTION 1 — KPI Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Visitors Today</p>
            <p className="text-3xl font-black text-white">{visitorsToday.toLocaleString()}</p>
            {visitorsTrend !== 0 && (
              <p className={`text-xs font-bold mt-2 ${visitorsTrend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {visitorsTrend > 0 ? '↑' : '↓'} {Math.abs(visitorsTrend)}% vs yesterday
              </p>
            )}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Demo Starts</p>
            <p className="text-3xl font-black text-blue-400">{demoStartsToday}</p>
            {demoStartsTrend !== 0 && (
              <p className={`text-xs font-bold mt-2 ${demoStartsTrend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {demoStartsTrend > 0 ? '↑' : '↓'} {Math.abs(demoStartsTrend)}% vs yesterday
              </p>
            )}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Trial Signups</p>
            <p className="text-3xl font-black text-emerald-400">{trialSignupsToday}</p>
            {trialSignupsTrend !== 0 && (
              <p className={`text-xs font-bold mt-2 ${trialSignupsTrend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trialSignupsTrend > 0 ? '↑' : '↓'} {Math.abs(trialSignupsTrend)}% vs yesterday
              </p>
            )}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Strategy Calls Booked</p>
            <p className="text-3xl font-black text-purple-400">{strategyCallsToday}</p>
            <p className="text-xs text-slate-400 mt-2">Sales momentum</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Conversion Rate</p>
            <p className="text-3xl font-black text-amber-400">{conversionRateToday.toFixed(2)}%</p>
            <p className="text-xs text-slate-400 mt-2">Overall funnel</p>
          </div>
        </div>

        {/* SECTION 2 — Funnel Conversion Trend Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Conversion Trend (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }}
              />
              <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} dot={false} name="Visitors" />
              <Line type="monotone" dataKey="demoStarts" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Demo Starts" />
              <Line type="monotone" dataKey="trialSignups" stroke="#10b981" strokeWidth={2} dot={false} name="Trial Signups" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SECTION 3 — Funnel Drop-Off Visualization */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-sm font-black text-white mb-6 uppercase tracking-wider">Funnel Stage Drop-Off</h3>
          <div className="space-y-3">
            {/* Visitors */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">Website Visitors</p>
                <p className="text-sm font-black text-blue-400">{visitorsToday.toLocaleString()}</p>
              </div>
              <div className="h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center px-4">
                <span className="text-white text-sm font-bold">100%</span>
              </div>
            </div>

            {/* Demo Starts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">Demo Starts</p>
                <p className="text-sm font-black text-purple-400">{demoStartsToday} ({demoStartRate}%)</p>
              </div>
              <div className="h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg flex items-center px-4" style={{ width: `${demoStartRate}%` }}>
                <span className="text-white text-sm font-bold">{demoStartRate}%</span>
              </div>
            </div>

            {/* Trial Signups */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">Trial Signups</p>
                <p className="text-sm font-black text-emerald-400">{trialSignupsToday} ({Math.round((trialSignupsToday / visitorsToday) * 100)}%)</p>
              </div>
              <div className="h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg flex items-center px-4" style={{ width: `${Math.round((trialSignupsToday / visitorsToday) * 100)}%` }}>
                <span className="text-white text-sm font-bold">{Math.round((trialSignupsToday / visitorsToday) * 100)}%</span>
              </div>
            </div>

            {/* Strategy Calls */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">Strategy Calls Booked</p>
                <p className="text-sm font-black text-rose-400">{strategyCallsToday} ({dealClosureRate}%)</p>
              </div>
              <div className="h-12 bg-gradient-to-r from-rose-600 to-rose-500 rounded-lg flex items-center px-4" style={{ width: `${dealClosureRate}%` }}>
                <span className="text-white text-sm font-bold">{dealClosureRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 — Lead Engagement Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Form Submissions</p>
            <p className="text-3xl font-black text-white">{today.lead_form_submissions || 0}</p>
            <p className="text-xs text-slate-400 mt-2">Lead capture activity</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Strategy Call Interest</p>
            <p className="text-3xl font-black text-white">{today.booked_strategy_calls || 0}</p>
            <p className="text-xs text-slate-400 mt-2">Sales qualification</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Demo Completions</p>
            <p className="text-3xl font-black text-white">{today.demo_completions || 0}</p>
            <p className="text-xs text-slate-400 mt-2">Product engagement</p>
          </div>
        </div>

        {/* SECTION 5 — Conversion Momentum Insights */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Conversion Intelligence</h3>
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
    </div>
  );
}