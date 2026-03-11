import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function ProgressIndicators({ report, previousReport }) {
  const getMetricTrend = (current, previous) => {
    if (!previous) return null;
    const change = current - previous;
    if (change > 0) return { direction: 'up', change, pct: Math.round((change / previous) * 100) };
    if (change < 0) return { direction: 'down', change: Math.abs(change), pct: Math.round((Math.abs(change) / previous) * 100) };
    return { direction: 'flat', change: 0 };
  };

  const contentTrend = getMetricTrend(report.content_published_count || 0, previousReport?.content_published_count);
  const campaignTrend = getMetricTrend(report.campaigns_active || 0, previousReport?.campaigns_active);

  const indicators = [
    {
      title: 'Content Consistency',
      description: 'Publishing frequency and cadence',
      trend: contentTrend,
      status: (report.content_published_count || 0) > 3 ? 'improving' : 'building',
    },
    {
      title: 'Channel Activation',
      description: 'Active marketing channels',
      trend: campaignTrend,
      status: (report.campaigns_active || 0) > 0 ? 'expanding' : 'launching',
    },
  ];

  const getTrendIcon = (direction) => {
    if (direction === 'up') return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
    if (direction === 'down') return <ArrowDownRight className="w-4 h-4 text-orange-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Progress Indicators</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {indicators.map((indicator, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-white">{indicator.title}</p>
                <p className="text-xs text-slate-400 mt-1">{indicator.description}</p>
              </div>
              {indicator.trend && getTrendIcon(indicator.trend.direction)}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-1.5 rounded-full w-2/3" />
              </div>
              <span className="text-xs font-bold text-emerald-400 capitalize">{indicator.status}</span>
            </div>

            {indicator.trend && indicator.trend.direction !== 'flat' && (
              <p className="text-xs text-slate-400 mt-2">
                <span className={indicator.trend.direction === 'up' ? 'text-emerald-400' : 'text-orange-400'}>
                  {indicator.trend.direction === 'up' ? '+' : '-'}{indicator.trend.pct}%
                </span>
                {' '}vs last period
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}