import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Minus, TrendingDown } from 'lucide-react';

const TEAM_CONFIG = {
  sales: { label: 'Sales Team', emoji: '🎯', threshold: 85 },
  onboarding: { label: 'Onboarding', emoji: '🚀', threshold: 80 },
  support: { label: 'Support', emoji: '🎧', threshold: 75 },
  content: { label: 'Content Production', emoji: '✍️', threshold: 90 },
  development: { label: 'Development', emoji: '💻', threshold: 85 },
};

const LoadBar = ({ value, threshold }) => {
  const isWarning = value >= threshold;
  const color = isWarning ? 'bg-red-500' : value >= threshold * 0.75 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
};

const TrendIcon = ({ trend }) => {
  if (trend === 'increasing') return <TrendingUp className="w-3 h-3 text-red-400" />;
  if (trend === 'decreasing') return <TrendingDown className="w-3 h-3 text-emerald-400" />;
  return <Minus className="w-3 h-3 text-slate-400" />;
};

export default function CTTeamCapacity({ teams = [] }) {
  const warnings = teams.filter(t => t.capacity_warning);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Team Capacity & Operations</h2>
        {warnings.length > 0 && (
          <Badge className="bg-red-950 text-red-300 gap-1">
            <AlertTriangle className="w-3 h-3" /> {warnings.length} over capacity
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {teams.map((team, i) => {
          const cfg = TEAM_CONFIG[team.team_name] || { label: team.team_name, emoji: '👥', threshold: 80 };
          const isWarning = team.capacity_warning || team.current_load >= cfg.threshold;
          return (
            <Card key={i} className={`bg-slate-800/50 border-slate-700 ${isWarning ? 'border-red-700/50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg">{cfg.emoji}</span>
                  <div className="flex items-center gap-1">
                    <TrendIcon trend={team.trend} />
                    {isWarning && <AlertTriangle className="w-3 h-3 text-red-400" />}
                  </div>
                </div>
                <p className="text-xs font-semibold text-white mb-1">{cfg.label}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-bold ${isWarning ? 'text-red-300' : team.current_load >= 60 ? 'text-amber-300' : 'text-emerald-300'}`}>
                    {team.current_load}%
                  </span>
                  <span className="text-[10px] text-slate-500">load</span>
                </div>
                <LoadBar value={team.current_load} threshold={cfg.threshold} />
                <div className="mt-2 space-y-0.5 text-[10px] text-slate-500">
                  <div className="flex justify-between">
                    <span>Queue</span>
                    <span className="text-slate-300">{team.queue_volume || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg time</span>
                    <span className="text-slate-300">{team.avg_resolution_time_hours || 0}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Team size</span>
                    <span className="text-slate-300">{team.team_size || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}