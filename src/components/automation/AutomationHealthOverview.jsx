import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingDown, AlertTriangle } from 'lucide-react';

export default function AutomationHealthOverview({ rules = [], health = [], executions = [] }) {
  const stats = useMemo(() => {
    const avgHealthScore = health.length > 0 
      ? Math.round(health.reduce((sum, h) => sum + h.health_score, 0) / health.length)
      : 0;

    const duplicateRisks = health.filter(h => h.duplicate_fire_risk_score > 70).length;
    const lowSuccessRules = health.filter(h => h.execution_success_rate < 80).length;
    const blockedRules = health.filter(h => h.blocked_execution_count > 0).length;

    return { avgHealthScore, duplicateRisks, lowSuccessRules, blockedRules };
  }, [health]);

  const healthColor = stats.avgHealthScore >= 85 ? 'emerald' : 
                      stats.avgHealthScore >= 70 ? 'amber' : 'red';
  const healthStatus = stats.avgHealthScore >= 85 ? 'Good' : 
                       stats.avgHealthScore >= 70 ? 'At Risk' : 'Critical';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg">Overall Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Average Score</span>
            <div className="text-right">
              <div className={`text-3xl font-bold ${
                healthColor === 'emerald' ? 'text-emerald-400' :
                healthColor === 'amber' ? 'text-amber-400' : 'text-red-400'
              }`}>
                {stats.avgHealthScore}%
              </div>
              <Badge variant="secondary" className={`mt-2 ${
                healthColor === 'emerald' ? 'bg-emerald-950 text-emerald-400' :
                healthColor === 'amber' ? 'bg-amber-950 text-amber-400' : 'bg-red-950 text-red-400'
              }`}>
                {healthStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg">Risk Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-slate-300">Duplicate Fire Risks: <span className="font-bold">{stats.duplicateRisks}</span></span>
          </div>
          <div className="flex items-center gap-3">
            <TrendingDown className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">Low Success Rates: <span className="font-bold">{stats.lowSuccessRules}</span></span>
          </div>
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-slate-300">Blocked Executions: <span className="font-bold">{stats.blockedRules}</span></span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}