import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export default function AutomationHealthScore({ rule, health, executions = [] }) {
  const ruleHealth = useMemo(() => {
    if (!health) {
      return {
        score: 0,
        status: 'unknown',
        factors: [],
      };
    }

    const factors = [];
    let baseScore = 100;

    // Success rate impact
    const successRate = health.execution_success_rate || 0;
    if (successRate < 95) baseScore -= (95 - successRate) * 0.5;
    factors.push({
      label: 'Success Rate',
      value: Math.round(successRate),
      threshold: 95,
      impact: Math.round((95 - successRate) * 0.5),
    });

    // Duplicate fire risk
    if (health.duplicate_fire_risk_score > 70) {
      baseScore -= (health.duplicate_fire_risk_score - 70) * 0.3;
    }
    factors.push({
      label: 'Duplicate Risk',
      value: Math.round(health.duplicate_fire_risk_score),
      threshold: 30,
      impact: Math.round(Math.max(0, health.duplicate_fire_risk_score - 70) * 0.3),
    });

    // Cooldown conflicts
    if (health.cooldown_conflict_score > 50) {
      baseScore -= (health.cooldown_conflict_score - 50) * 0.2;
    }
    factors.push({
      label: 'Cooldown Conflicts',
      value: Math.round(health.cooldown_conflict_score),
      threshold: 20,
      impact: Math.round(Math.max(0, health.cooldown_conflict_score - 50) * 0.2),
    });

    // Guardrails blocking
    if (health.blocked_execution_count > 5) {
      baseScore -= Math.min(10, health.blocked_execution_count);
    }
    factors.push({
      label: 'Blocked Executions',
      value: health.blocked_execution_count,
      threshold: 0,
      impact: Math.min(10, health.blocked_execution_count),
    });

    // Escalations
    if (health.escalation_count > 3) {
      baseScore -= (health.escalation_count - 3) * 2;
    }
    factors.push({
      label: 'Escalations',
      value: health.escalation_count,
      threshold: 0,
      impact: Math.round(Math.max(0, (health.escalation_count - 3) * 2)),
    });

    const score = Math.max(0, Math.min(100, baseScore));
    const status = score >= 85 ? 'healthy' : score >= 70 ? 'warning' : 'critical';

    return { score, status, factors };
  }, [health]);

  const statusConfig = {
    healthy: {
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-700/50',
    },
    warning: {
      color: 'text-amber-400',
      bg: 'bg-amber-950/30',
      border: 'border-amber-700/50',
    },
    critical: {
      color: 'text-red-400',
      bg: 'bg-red-950/30',
      border: 'border-red-700/50',
    },
  };

  const config = statusConfig[ruleHealth.status];

  return (
    <Card className={`${config.bg} border ${config.border}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 opacity-60" />
            <span className="text-sm font-semibold text-slate-300">Health Score</span>
          </div>
          <Badge className={`${config.color} bg-transparent border ${config.color.replace('text-', 'border-')}`}>
            {ruleHealth.status}
          </Badge>
        </div>

        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${config.color}`}>{Math.round(ruleHealth.score)}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
        </div>

        {/* Factor breakdown */}
        <div className="space-y-2">
          {ruleHealth.factors.map((factor, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{factor.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      factor.value <= factor.threshold ? 'bg-emerald-500' : 'bg-orange-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (factor.value / Math.max(factor.threshold, 100)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-slate-300 w-8 text-right">{factor.value}</span>
              </div>
            </div>
          ))}
        </div>

        {ruleHealth.status !== 'healthy' && (
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-slate-400">
              {ruleHealth.status === 'critical' && '⚠️ Critical issues affecting reliability'}
              {ruleHealth.status === 'warning' && '⚠️ Address issues to improve stability'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}