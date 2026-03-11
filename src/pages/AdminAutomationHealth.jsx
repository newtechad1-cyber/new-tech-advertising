import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, TrendingDown } from 'lucide-react';

export default function AdminAutomationHealth() {
  const { data: rules = [] } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: () => base44.entities.MasterAutomationRule?.list?.().catch(() => []),
  });

  const { data: health = [] } = useQuery({
    queryKey: ['automation-health'],
    queryFn: () => base44.entities.AutomationHealthSnapshot?.list?.().catch(() => []),
  });

  const { data: executions = [] } = useQuery({
    queryKey: ['automation-executions'],
    queryFn: () => base44.entities.AutomationExecutionLog?.list?.().catch(() => []),
  });

  const issues = useMemo(() => {
    const allIssues = [];

    health.forEach(h => {
      const rule = rules.find(r => r.rule_key === h.rule_key);
      if (!rule) return;

      if (h.duplicate_fire_risk_score > 70) {
        allIssues.push({
          type: 'duplicate_risk',
          severity: 'high',
          rule_name: rule.rule_name,
          rule_key: rule.rule_key,
          message: `${Math.round(h.duplicate_fire_risk_score)}% duplicate fire risk`,
          hint: !rule.cooldown_rules_json ? 'Missing cooldown protection' : 'Review cooldown window',
        });
      }

      if (h.execution_success_rate < 80) {
        allIssues.push({
          type: 'low_success',
          severity: 'medium',
          rule_name: rule.rule_name,
          rule_key: rule.rule_key,
          message: `${Math.round(h.execution_success_rate)}% success rate (target: 95%+)`,
          hint: 'Check error logs and conditions',
        });
      }

      if (h.blocked_execution_count > 5) {
        allIssues.push({
          type: 'blocked',
          severity: 'medium',
          rule_name: rule.rule_name,
          rule_key: rule.rule_key,
          message: `${h.blocked_execution_count} executions blocked by guardrails`,
          hint: 'Review guardrail rules',
        });
      }

      if (h.escalation_count > 3) {
        allIssues.push({
          type: 'escalations',
          severity: 'high',
          rule_name: rule.rule_name,
          rule_key: rule.rule_key,
          message: `${h.escalation_count} escalations in last period`,
          hint: 'Review escalation trigger conditions',
        });
      }
    });

    return allIssues.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [health, rules]);

  const deprecatedRulesUsed = useMemo(() => {
    return executions.filter(e => {
      const rule = rules.find(r => r.rule_key === e.rule_key);
      return rule?.deprecated;
    }).length;
  }, [executions, rules]);

  const severityColors = {
    critical: 'bg-red-950/30 border-red-700/50',
    high: 'bg-orange-950/30 border-orange-700/50',
    medium: 'bg-amber-950/30 border-amber-700/50',
    low: 'bg-slate-800/30 border-slate-700/50',
  };

  const severityIcons = {
    critical: AlertCircle,
    high: AlertTriangle,
    medium: TrendingDown,
    low: AlertTriangle,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Automation Health & Conflicts</h1>
          <p className="text-slate-400">Identify risky and unhealthy automation rules</p>
        </div>

        {/* Critical Warnings */}
        {deprecatedRulesUsed > 0 && (
          <Card className="bg-red-950/30 border-red-700/50 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="font-semibold text-red-300">Deprecated Rules Still Executing</p>
                  <p className="text-sm text-red-200 mt-1">{deprecatedRulesUsed} executions of deprecated rules detected. These should be removed.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Issues List */}
        {issues.length === 0 ? (
          <Card className="bg-emerald-950/30 border-emerald-700/30">
            <CardContent className="p-6 text-center">
              <p className="text-emerald-400">✓ All automation rules are healthy</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {issues.map((issue, idx) => {
              const Icon = severityIcons[issue.severity];
              const colorClass = severityColors[issue.severity];

              return (
                <Card key={idx} className={`border ${colorClass}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Icon className={`w-5 h-5 mt-1 shrink-0 ${
                        issue.severity === 'critical' ? 'text-red-400' :
                        issue.severity === 'high' ? 'text-orange-400' :
                        issue.severity === 'medium' ? 'text-amber-400' : 'text-slate-400'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-white">{issue.rule_name}</p>
                          <Badge className={`text-xs ${
                            issue.severity === 'critical' ? 'bg-red-950 text-red-300' :
                            issue.severity === 'high' ? 'bg-orange-950 text-orange-300' :
                            issue.severity === 'medium' ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-slate-300">{issue.message}</p>
                        <p className="text-xs text-slate-400 mt-2">💡 {issue.hint}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-sm text-slate-400">Critical Issues</p>
              <p className="text-2xl font-bold text-red-400 mt-2">
                {issues.filter(i => i.severity === 'critical').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-sm text-slate-400">High Priority</p>
              <p className="text-2xl font-bold text-orange-400 mt-2">
                {issues.filter(i => i.severity === 'high').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-sm text-slate-400">Medium Issues</p>
              <p className="text-2xl font-bold text-amber-400 mt-2">
                {issues.filter(i => i.severity === 'medium').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-sm text-slate-400">Total Issues</p>
              <p className="text-2xl font-bold text-slate-400 mt-2">{issues.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}