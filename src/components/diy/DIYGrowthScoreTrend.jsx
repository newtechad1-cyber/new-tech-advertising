import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function DIYGrowthScoreTrend({ metrics }) {
  if (!metrics) return null;

  const { growth_score = 0, growth_trend = 'stable' } = metrics;

  const getTrendIcon = () => {
    switch (growth_trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <div className="w-5 h-5 text-slate-400">→</div>;
    }
  };

  const getTrendColor = () => {
    switch (growth_trend) {
      case 'improving':
        return 'text-green-400';
      case 'declining':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getScoreColor = () => {
    if (growth_score >= 75) return 'bg-green-500/20 border-green-500/30';
    if (growth_score >= 50) return 'bg-amber-500/20 border-amber-500/30';
    return 'bg-slate-800/50 border-slate-700';
  };

  return (
    <div className={`rounded-lg p-6 border ${getScoreColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Growth Score</h3>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <span className={`text-sm font-semibold capitalize ${getTrendColor()}`}>
            {growth_trend}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-4xl font-bold text-white mb-2">{growth_score}</div>
        <p className="text-sm text-slate-400">
          {growth_score < 25
            ? 'Just getting started'
            : growth_score < 50
            ? 'Building momentum'
            : growth_score < 75
            ? 'Strong progress'
            : 'Exceptional growth'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all ${
            growth_score >= 75
              ? 'bg-green-500'
              : growth_score >= 50
              ? 'bg-amber-500'
              : 'bg-slate-500'
          }`}
          style={{ width: `${growth_score}%` }}
        />
      </div>
    </div>
  );
}