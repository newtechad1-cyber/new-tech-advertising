import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Play, Video, Zap, Star } from 'lucide-react';

const MOMENTUM_CONFIG = {
  early_progress: {
    label: 'Early Progress',
    message: 'Your marketing is getting started. Great foundation building!',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    accent: 'bg-blue-100',
  },
  steady_growth: {
    label: 'Steady Growth',
    message: 'Your visibility and engagement are steadily improving. Keep it up!',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    accent: 'bg-emerald-100',
  },
  strong_momentum: {
    label: 'Strong Momentum',
    message: 'You\'re building real traction. Your efforts are clearly paying off!',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    accent: 'bg-amber-100',
  },
  acceleration_phase: {
    label: 'Accelerating 🚀',
    message: 'Wow! Your marketing is in overdrive. This is exciting growth!',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    accent: 'bg-rose-100',
  },
};

function MetricCard({ icon: Icon, label, value, subtext, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
      <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
      <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  );
}

export default function ClientROI() {
  const [metrics, setMetrics] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.auth.me(),
      base44.entities.ClientROIMetric.list('-report_month', 50)
    ]).then(([user, metricsData]) => {
      setCurrentUser(user);
      // Filter to current client if needed
      const clientMetrics = metricsData.slice(0, 3).reverse(); // Last 3 months
      setMetrics(clientMetrics);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-sm animate-pulse">Loading your growth report…</div>
      </div>
    );
  }

  const latestMetric = metrics[metrics.length - 1];
  const momentum = MOMENTUM_CONFIG[latestMetric?.roi_momentum_label || 'steady_growth'];

  // Chart data
  const chartData = metrics.map(m => ({
    month: new Date(m.report_month).toLocaleDateString('en-US', { month: 'short' }),
    visibility: m.visibility_growth_score || 0,
    engagement: m.engagement_growth_score || 0,
  }));

  const suggestions = [
    latestMetric?.visibility_growth_score < 75 && {
      icon: '🎯',
      title: 'Boost Local Visibility',
      desc: 'Add seasonal promotions and local business partnerships to increase discovery.',
    },
    latestMetric?.campaign_activity_score < 70 && {
      icon: '📢',
      title: 'Ramp Up Campaigns',
      desc: 'More consistent campaigns mean more touchpoints with your audience.',
    },
    latestMetric?.video_views_estimate < 500 && {
      icon: '🎬',
      title: 'More Video Content',
      desc: 'Video drives 3x more engagement. Consider increasing production frequency.',
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-5 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Your Growth ROI Report</h1>
          <p className="text-slate-600 text-sm mt-1">Marketing momentum and impact insights</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 space-y-8">

        {/* SECTION 1 — Growth Momentum Hero */}
        <div className={`${momentum.bg} border-2 border-slate-200 rounded-3xl p-6 sm:p-8 text-center`}>
          <div className={`inline-block px-3 py-1 rounded-full ${momentum.accent} mb-3`}>
            <span className={`text-xs font-black uppercase tracking-widest ${momentum.color}`}>
              {momentum.label}
            </span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${momentum.color} mb-2`}>
            {momentum.message}
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            Your marketing efforts are creating measurable visibility and engagement growth. This month shows continued progress across key metrics.
          </p>
        </div>

        {/* SECTION 2 — Key Growth Signals Snapshot */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">This Month's Performance</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <MetricCard
              icon={TrendingUp}
              label="Visibility"
              value={`${latestMetric?.visibility_growth_score || 0}`}
              subtext="out of 100"
              color="text-blue-600"
            />
            <MetricCard
              icon={Zap}
              label="Engagement"
              value={`${latestMetric?.engagement_growth_score || 0}`}
              subtext="out of 100"
              color="text-emerald-600"
            />
            <MetricCard
              icon={Play}
              label="Content"
              value={latestMetric?.content_output_volume || 0}
              subtext="pieces published"
              color="text-amber-600"
            />
            <MetricCard
              icon={Video}
              label="Video Views"
              value={latestMetric?.video_views_estimate ? `${(latestMetric.video_views_estimate / 100).toFixed(0)}k` : '0'}
              subtext="this month"
              color="text-rose-600"
            />
            <MetricCard
              icon={TrendingUp}
              label="Campaign"
              value={`${latestMetric?.campaign_activity_score || 0}`}
              subtext="consistency"
              color="text-purple-600"
            />
          </div>
        </div>

        {/* SECTION 3 — Monthly Growth Trend Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Growth Trend (Last 3 Months)</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(val) => [val, '']}
                />
                <Line
                  type="monotone"
                  dataKey="visibility"
                  stroke="#2563eb"
                  strokeWidth={3}
                  name="Visibility"
                  dot={{ fill: '#2563eb', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Engagement"
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-slate-500 text-sm py-8">No data available yet.</p>
          )}
        </div>

        {/* SECTION 4 — Marketing Activity Summary */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">What's Been Happening</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
              <Play className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <p className="text-2xl font-black text-slate-900">{latestMetric?.content_output_volume || 0}</p>
              <p className="text-slate-600 text-sm font-semibold mt-1">Content pieces published</p>
              <p className="text-xs text-slate-500 mt-2">More content = more visibility</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
              <Video className="w-8 h-8 text-rose-600 mx-auto mb-3" />
              <p className="text-2xl font-black text-slate-900">{latestMetric?.video_views_estimate ? `${(latestMetric.video_views_estimate / 1000).toFixed(1)}k` : '0'}</p>
              <p className="text-slate-600 text-sm font-semibold mt-1">Video views</p>
              <p className="text-xs text-slate-500 mt-2">Video is your strongest channel</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
              <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <p className="text-2xl font-black text-slate-900">{latestMetric?.campaign_activity_score || 0}%</p>
              <p className="text-slate-600 text-sm font-semibold mt-1">Campaign consistency</p>
              <p className="text-xs text-slate-500 mt-2">Consistency drives results</p>
            </div>
          </div>
        </div>

        {/* SECTION 5 — Lead Signal Strength */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Lead Discovery Strength</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Signal Strength</span>
              <span className="text-sm font-black text-emerald-600">{latestMetric?.lead_signal_strength || 0}/100</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
                style={{ width: `${latestMetric?.lead_signal_strength || 0}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-slate-700">
            <strong>What this means:</strong> Stronger signals mean more people are discovering your business online. Your current strength shows there's momentum in the market.
          </p>
        </div>

        {/* SECTION 6 — Growth Opportunities */}
        {suggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Growth Opportunities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {suggestions.map((sug, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
                  <span className="text-3xl block mb-2">{sug.icon}</span>
                  <p className="text-sm font-black text-slate-900 mb-1">{sug.title}</p>
                  <p className="text-xs text-slate-600">{sug.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-100 rounded-2xl border border-slate-200 p-6 text-center">
          <Star className="w-5 h-5 text-amber-500 mx-auto mb-2" />
          <p className="text-sm text-slate-700 font-semibold">
            Questions about your report? Reach out to your dedicated success manager.
          </p>
        </div>

      </div>
    </div>
  );
}