import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Zap } from 'lucide-react';

export default function StrongerVisualAlerts({ rules = [], health = [], executions = [], triggers = [] }) {
  const alerts = useMemo(() => {
    const alertList = [];

    // 1. Overlapping triggers
    const triggerCounts = {};
    rules.filter(r => r.active).forEach(r => {
      triggerCounts[r.trigger_key] = (triggerCounts[r.trigger_key] || 0) + 1;
    });

    Object.entries(triggerCounts).forEach(([triggerKey, count]) => {
      if (count > 1) {
        const trigger = triggers.find(t => t.trigger_key === triggerKey);
        alertList.push({
          type: 'overlapping_triggers',
          severity: 'high',
          icon: AlertTriangle,
          title: `${count} Rules Share Trigger: ${trigger?.trigger_name || triggerKey}`,
          description: `Multiple active rules fire on same trigger. Risk of unintended execution overlap.`,
          color: 'border-orange-700/50 bg-orange-950/20 text-orange-300',
        });
      }
    });

    // 2. Repeated failures
    health.forEach(h => {
      if (h.execution_success_rate < 75) {
        const rule = rules.find(r => r.rule_key === h.rule_key);
        const recentFails = executions.filter(
          e => e.rule_key === h.rule_key && e.execution_status === 'failed'
        ).slice(0, 5).length;

        if (recentFails > 2) {
          alertList.push({
            type: 'repeated_failures',
            severity: 'critical',
            icon: AlertCircle,
            title: `Repeated Failures: ${rule?.rule_name || h.rule_key}`,
            description: `${recentFails} failures in recent executions. ${Math.round(h.execution_success_rate)}% success rate.`,
            color: 'border-red-700/50 bg-red-950/20 text-red-300',
          });
        }
      }
    });

    // 3. Cooldown conflicts
    health.forEach(h => {
      if (h.cooldown_conflict_score > 60) {
        const rule = rules.find(r => r.rule_key === h.rule_key);
        alertList.push({
          type: 'cooldown_conflict',
          severity: 'high',
          icon: AlertTriangle,
          title: `Cooldown Conflict: ${rule?.rule_name || h.rule_key}`,
          description: `${Math.round(h.cooldown_conflict_score)}% risk of cooldown window violations.`,
          color: 'border-amber-700/50 bg-amber-950/20 text-amber-300',
        });
      }
    });

    // 4. Escalations aging too long
    health.forEach(h => {
      if (h.escalation_count > 3) {
        const rule = rules.find(r => r.rule_key === h.rule_key);
        alertList.push({
          type: 'aged_escalations',
          severity: 'high',
          icon: AlertTriangle,
          title: `${h.escalation_count} Aging Escalations: ${rule?.rule_name || h.rule_key}`,
          description: `Rule has triggered escalation flow multiple times. Underlying issue may need resolution.`,
          color: 'border-red-700/50 bg-red-950/20 text-red-300',
        });
      }
    });

    // 5. Missing guardrails
    rules.filter(r => r.active).forEach(r => {
      if (!r.guardrail_rules_json || r.guardrail_rules_json === '{}' || r.guardrail_rules_json === '{"max_per_day":0}') {
        alertList.push({
          type: 'missing_guardrails',
          severity: 'medium',
          icon: AlertTriangle,
          title: `Missing Guardrails: ${r.rule_name}`,
          description: `Rule lacks execution limits (max_per_day, max_per_hour). Could exhaust resources.`,
          color: 'border-amber-700/50 bg-amber-950/20 text-amber-300',
        });
      }
    });

    // Remove duplicates
    const seen = new Set();
    return alertList.filter(a => {
      const key = `${a.type}_${a.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [rules, health, executions, triggers]);

  if (alerts.length === 0) {
    return (
      <Card className="border-emerald-700/30 bg-emerald-950/20">
        <CardContent className="p-4">
          <p className="text-emerald-400 text-sm">✓ No critical alerts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert, idx) => {
        const Icon = alert.icon;
        return (
          <Card key={idx} className={`border ${alert.color}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{alert.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{alert.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}