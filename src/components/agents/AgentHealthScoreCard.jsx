import React, { useMemo } from 'react';
import { AlertCircle, TrendingDown, Zap, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgentHealthScoreCard({ snapshots = [], tasks = [] }) {
  const metrics = useMemo(() => {
    if (!snapshots || snapshots.length === 0) return null;

    const latestSnapshot = snapshots[0];
    
    // Queue pressure (0-25 points)
    const queuePressure = Math.min(latestSnapshot.queued_count || 0, 50);
    const queueScore = Math.max(0, 25 - (queuePressure / 50) * 25);

    // Failure rate (0-25 points)
    const totalTasks = (latestSnapshot.completed_count || 0) + (latestSnapshot.failed_count || 0);
    const failureRate = totalTasks > 0 ? (latestSnapshot.failed_count || 0) / totalTasks : 0;
    const failureScore = Math.max(0, 25 - failureRate * 100);

    // Blocked tasks (0-25 points)
    const blockedCount = latestSnapshot.blocked_count || 0;
    const blockedScore = Math.max(0, 25 - (blockedCount / 10) * 25);

    // Completion time (0-25 points)
    const avgTime = latestSnapshot.avg_completion_time || 0;
    const timeScore = avgTime > 0 ? Math.max(0, 25 - (avgTime / 300) * 25) : 25;

    const totalScore = Math.round(queueScore + failureScore + blockedScore + timeScore);

    return {
      totalScore,
      queueScore: Math.round(queueScore),
      failureScore: Math.round(failureScore),
      blockedScore: Math.round(blockedScore),
      timeScore: Math.round(timeScore),
      queueCount: latestSnapshot.queued_count || 0,
      failureRate: Math.round(failureRate * 100),
      blockedCount,
      avgTime: Math.round(avgTime),
      healthStatus: latestSnapshot.health_status || 'unknown'
    };
  }, [snapshots]);

  if (!metrics) {
    return (
      <Card className="bg-slate-950 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-400">System Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm">No snapshot data available</p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-emerald-950 border-emerald-700';
    if (score >= 70) return 'bg-blue-950 border-blue-700';
    if (score >= 50) return 'bg-amber-950 border-amber-700';
    return 'bg-red-950 border-red-700';
  };

  return (
    <Card className={`border ${getScoreBg(metrics.totalScore)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-200">Orchestrator Health</CardTitle>
          <Zap className="w-5 h-5 text-slate-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div>
            <div className={`text-4xl font-bold ${getScoreColor(metrics.totalScore)}`}>
              {metrics.totalScore}
            </div>
            <p className="text-slate-400 text-xs mt-1">System Score</p>
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-400">Queue Pressure</span>
                <span className="text-xs text-slate-300">{Math.round(metrics.queueScore)}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${metrics.queueScore}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-400">Success Rate</span>
                <span className="text-xs text-slate-300">{Math.round(metrics.failureScore)}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${metrics.failureScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
          <div className="bg-slate-900/50 rounded p-2">
            <p className="text-slate-400 text-xs">Queued Tasks</p>
            <p className="text-slate-100 font-bold">{metrics.queueCount}</p>
          </div>
          <div className="bg-slate-900/50 rounded p-2">
            <p className="text-slate-400 text-xs">Blocked Tasks</p>
            <p className="text-slate-100 font-bold">{metrics.blockedCount}</p>
          </div>
          <div className="bg-slate-900/50 rounded p-2">
            <p className="text-slate-400 text-xs">Failure Rate</p>
            <p className="text-slate-100 font-bold">{metrics.failureRate}%</p>
          </div>
          <div className="bg-slate-900/50 rounded p-2">
            <p className="text-slate-400 text-xs">Avg Time</p>
            <p className="text-slate-100 font-bold">{metrics.avgTime}s</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}