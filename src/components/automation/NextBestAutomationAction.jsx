import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight } from 'lucide-react';

export default function NextBestAutomationAction({ rule, health, triggers, rules }) {
  const recommendations = useMemo(() => {
    const recs = [];

    if (!rule || !health) return recs;

    // 1. Add duplicate protection
    if (health.duplicate_fire_risk_score > 70) {
      const trigger = triggers.find(t => t.trigger_key === rule.trigger_key);
      if (trigger && !trigger.duplicate_protection_supported) {
        recs.push({
          type: 'duplicate_protection',
          priority: 'high',
          title: 'Enable Duplicate Protection',
          description: 'This trigger has high duplicate fire risk but no deduplication support.',
          action: 'Add cooldown rules to prevent repeated execution',
          impact: `Could improve health by ~${Math.round(Math.min(20, health.duplicate_fire_risk_score - 70) * 0.3)}%`,
        });
      }
    }

    // 2. Tighten context scope
    if (rule.tenant_scope === 'mixed' || rule.tenant_scope === 'universal') {
      recs.push({
        type: 'scope_tightening',
        priority: 'medium',
        title: 'Tighten Context Scope',
        description: `Rule currently scoped to ${rule.tenant_scope}. Consider isolating to specific contexts.`,
        action: 'Define explicit agency/reseller/client boundaries',
        impact: 'Reduce unintended side effects and improve auditability',
      });
    }

    // 3. Resolve trigger conflicts
    const conflictingRules = rules.filter(r => r.trigger_key === rule.trigger_key && r.id !== rule.id && r.active);
    if (conflictingRules.length > 0) {
      recs.push({
        type: 'resolve_conflicts',
        priority: 'high',
        title: 'Resolve Trigger Conflict',
        description: `${conflictingRules.length} other rules share this trigger. Potential execution overlap.`,
        action: 'Review and consolidate or add priority/guards',
        impact: `Could reduce duplicate executions by ${conflictingRules.length * 10}%`,
      });
    }

    // 4. Fix retry loop
    if (health.execution_success_rate < 70 && health.retry_count > 3) {
      recs.push({
        type: 'retry_loop',
        priority: 'high',
        title: 'Investigate Retry Loop',
        description: `Low success rate (${Math.round(health.execution_success_rate)}%) with ${health.retry_count} retries.`,
        action: 'Review error logs and tighten condition logic',
        impact: `Could save ~${health.retry_count * 5} wasted executions daily`,
      });
    }

    // 5. Retire deprecated rule
    if (rule.deprecated) {
      recs.push({
        type: 'retire_rule',
        priority: 'high',
        title: 'Retire Deprecated Rule',
        description: 'This rule is marked deprecated but still active.',
        action: 'Disable and schedule for removal',
        impact: 'Reduce platform complexity and maintenance burden',
      });
    }

    // 6. Reconnect broken dependency
    if (health.issues_json) {
      try {
        const issues = JSON.parse(health.issues_json);
        if (issues.some(i => i.type === 'broken_dependency')) {
          recs.push({
            type: 'broken_dependency',
            priority: 'critical',
            title: 'Reconnect Broken Dependency',
            description: 'Rule references missing entity, function, or integration.',
            action: 'Update target or remove broken action',
            impact: 'Prevent execution failures',
          });
        }
      } catch (e) {
        // Parse error, skip
      }
    }

    // 7. Add missing guardrails
    if (!rule.guardrail_rules_json || rule.guardrail_rules_json === '{}') {
      recs.push({
        type: 'add_guardrails',
        priority: 'medium',
        title: 'Add Guardrail Rules',
        description: 'No execution guardrails defined. Rule could run without limits.',
        action: 'Define max_per_hour, max_per_day, max_payload_size',
        impact: 'Prevent runaway executions and resource exhaustion',
      });
    }

    return recs.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }).slice(0, 3);
  }, [rule, health, triggers, rules]);

  if (recommendations.length === 0) {
    return (
      <Card className="bg-emerald-950/20 border-emerald-700/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-emerald-300">
            <Lightbulb className="w-4 h-4" />
            <span className="text-sm">No actions needed. Rule is optimized.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {recommendations.map((rec, idx) => {
        const priorityColor = {
          critical: 'border-red-700/50 bg-red-950/20',
          high: 'border-orange-700/50 bg-orange-950/20',
          medium: 'border-amber-700/50 bg-amber-950/20',
          low: 'border-slate-700/50 bg-slate-900/20',
        }[rec.priority];

        const priorityBadgeColor = {
          critical: 'bg-red-950 text-red-300',
          high: 'bg-orange-950 text-orange-300',
          medium: 'bg-amber-950 text-amber-300',
          low: 'bg-slate-800 text-slate-300',
        }[rec.priority];

        return (
          <Card key={idx} className={`border ${priorityColor}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-4 h-4 mt-1 text-amber-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-white text-sm">{rec.title}</p>
                    <Badge className={`text-xs ${priorityBadgeColor}`}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{rec.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                    <ArrowRight className="w-3 h-3" />
                    <span>{rec.action}</span>
                  </div>
                  <p className="text-xs text-amber-400">💡 {rec.impact}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}