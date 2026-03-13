import React from 'react';
import { Share2, Video, Search, TrendingUp } from 'lucide-react';
import { getWeeklyWinsSummary } from './ntaRetentionEngine';

const ICON_MAP = {
  share2: Share2,
  video: Video,
  search: Search,
  'trending-up': TrendingUp,
};

export default function DIYWeeklyWins({ metrics }) {
  if (!metrics) return null;

  const wins = getWeeklyWinsSummary(metrics);

  if (wins.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <h3 className="font-semibold text-white mb-4">Weekly Wins</h3>
        <p className="text-slate-400 text-sm">
          Get started by creating your first post or campaign!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
      <h3 className="font-semibold text-white mb-4">Weekly Wins 🎉</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {wins.map((win) => {
          const Icon = ICON_MAP[win.icon] || TrendingUp;
          return (
            <div
              key={win.label}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-4 h-4 text-green-400" />
                <span className="text-xl font-bold text-green-400">{win.change}</span>
              </div>
              <div className="text-2xl font-bold text-white">{win.value}</div>
              <div className="text-xs text-slate-400 mt-1">{win.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}