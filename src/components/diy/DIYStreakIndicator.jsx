import React from 'react';
import { Flame, Trophy } from 'lucide-react';

export default function DIYStreakIndicator({ metrics }) {
  if (!metrics) return null;

  const { streak_days = 0, streak_weeks = 0, longest_streak_days = 0 } = metrics;
  const isActive = streak_days > 0;

  return (
    <div className="flex items-center gap-6">
      {/* Current Streak */}
      <div className={`flex items-center gap-2 ${isActive ? 'text-orange-400' : 'text-slate-500'}`}>
        <Flame className={`w-5 h-5 ${isActive ? 'animate-bounce' : ''}`} />
        <div>
          <div className="text-xs text-slate-400">Current Streak</div>
          <div className="font-bold text-lg">
            {streak_days}
            <span className="text-sm text-slate-400"> day{streak_days !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Longest Streak */}
      {longest_streak_days > 0 && (
        <div className="flex items-center gap-2 text-amber-300">
          <Trophy className="w-5 h-5" />
          <div>
            <div className="text-xs text-slate-400">Record Streak</div>
            <div className="font-bold text-lg">
              {longest_streak_days}
              <span className="text-sm text-slate-400"> day{longest_streak_days !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}