import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap } from 'lucide-react';

export default function HighRiskAutomationsPanel({ rules = [], health = [], executions = [] }) {
  const coreRules = useMemo(() => {
    const highRiskKeys = [
      'approval_to_publish',
      'scheduled_publish_due',
      'deal_closed_won_onboarding',
      'report_generation_schedule',
      'client_approval_pending',
      'onboarding_completion',
      'escalation_notification',
      'system_health_check',
    ];

    return rules
      .filter(r => highRiskKeys.includes(r.rule_key))
      .map(r => ({
        ...r,
        health: health.find(h => h.rule_key === r.rule_key),
        recentFailures: executions.filter(
          e => e.rule_key === r.rule_key && e.execution_status === 'failed'
        ).length,
      }))
      .filter(r => r.health); // Only show if we have health data
  }, [rules, health, executions]);

  const riskLevel = (rule) => {
    if (!rule.health) return 'low';
    const score = rule.health.health_score || 0;
    if (score < 60) return 'critical';
    if (score < 75) return 'high';
    if (score < 85) return 'medium';
    return 'low';
  };

  const riskColor = {
    critical: 'border-red-700/50 bg-red-950/20',
    high: 'border-orange-700/50 bg-orange-950/20',
    medium: 'border-amber-700/50 bg-amber-950/20',
    low: 'border-emerald-700/50 bg-emerald-950/20',
  };

  const riskBadgeColor = {
    critical: 'bg-red-950 text-red-300',
    high: 'bg-orange-950 text-orange-300',
    medium: 'bg-amber-950 text-amber-300',
    low: 'bg-emerald-950 text-emerald-300',
  };

  const sortedRules = [...coreRules].sort((a, b) => {
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return riskOrder[riskLevel(a)] - riskOrder[riskLevel(b)];
  });

  return (
    <Card className="border-slate-700 bg-slate-900/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          High-Risk Core Automations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedRules.length === 0 ? (
          <p className="text-sm text-slate-400">No core automations found</p>
        ) : (
          sortedRules.map((rule) => {
            const risk = riskLevel(rule);
            const colorClass = riskColor[risk];
            const badgeColor = riskBadgeColor[risk];

            return (
              <div key={rule.id} className={`border rounded-lg p-3 ${colorClass}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 opacity-60" />
                    <p className="font-semibold text-white text-sm">{rule.rule_name}</p>
                    <Badge className={`text-xs ${badgeColor}`}>
                      {Math.round(rule.health?.health_score || 0)}%
                    </Badge>
                  </div>
                  <Badge className={`text-xs ${badgeColor}`}>
                    {risk}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs mb-2">
                  <div>
                    <span className="text-slate-500">Success Rate</span>
                    <p className="text-slate-300 font-semibold">
                      {Math.round(rule.health?.execution_success_rate || 0)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Dup. Risk</span>
                    <p className="text-slate-300 font-semibold">
                      {Math.round(rule.health?.duplicate_fire_risk_score || 0)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Recent Fails</span>
                    <p className={`font-semibold ${rule.recentFailures > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {rule.recentFailures}
                    </p>
                  </div>
                </div>

                {rule.health?.escalation_count > 2 && (
                  <div className="text-xs text-orange-400 bg-orange-950/30 rounded px-2 py-1">
                    ⚠️ {rule.health.escalation_count} escalations aging
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}