import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, TrendingDown, Zap } from 'lucide-react';

export default function OptimizationAlerts({ candidates = [], experiments = [], outcomes = [], policies = [] }) {
  const alerts = useMemo(() => {
    const alertList = [];

    // 1. Repeated failed optimizations in same category
    const failedByCategory = {};
    outcomes
      .filter(o => o.outcome_direction === 'negative')
      .forEach(o => {
        const exp = experiments.find(e => e.experiment_key === o.experiment_key);
        if (exp) {
          failedByCategory[exp.optimization_category] = (failedByCategory[exp.optimization_category] || 0) + 1;
        }
      });

    Object.entries(failedByCategory).forEach(([category, count]) => {
      if (count >= 3) {
        alertList.push({
          type: 'repeated_failures',
          severity: 'critical',
          icon: AlertTriangle,
          color: 'bg-red-950/40 border-red-700/50',
          title: `${count} Consecutive Failures in ${category.replace(/_/g, ' ')}`,
          message: 'Pattern of negative outcomes detected. Review optimization strategy for this category.',
          count,
        });
      }
    });

    // 2. Risky auto-apply categories
    const riskyPolicies = policies.filter(
      p => p.allowed_auto_apply === 'low_risk_auto_apply' && p.approval_threshold < 75
    );
    if (riskyPolicies.length > 0) {
      alertList.push({
        type: 'risky_auto_apply',
        severity: 'high',
        icon: Zap,
        color: 'bg-yellow-950/40 border-yellow-700/50',
        title: `${riskyPolicies.length} Categories with Risky Auto-Apply`,
        message: 'Some categories allow auto-apply with low confidence thresholds. Consider tightening.',
        categories: riskyPolicies.map(p => p.policy_name),
      });
    }

    // 3. Rollback spikes (3+ rollbacks in last period)
    const recentRollbacks = outcomes
      .filter(o => o.outcome_direction === 'negative')
      .slice(0, 10);
    if (recentRollbacks.length >= 3) {
      alertList.push({
        type: 'rollback_spike',
        severity: 'high',
        icon: TrendingDown,
        color: 'bg-red-950/40 border-red-700/50',
        title: `${recentRollbacks.length} Recent Rollbacks Detected`,
        message: 'Multiple negative outcomes in recent experiments. Verify experiment design and measurement.',
        count: recentRollbacks.length,
      });
    }

    // 4. Low-confidence experiments (< 60%)
    const lowConfidenceExps = experiments.filter(e => {
      const exp = outcomes.find(o => o.experiment_key === e.experiment_key);
      return exp && exp.confidence_level < 60;
    });
    if (lowConfidenceExps.length >= 2) {
      alertList.push({
        type: 'low_confidence',
        severity: 'medium',
        icon: AlertCircle,
        color: 'bg-orange-950/40 border-orange-700/50',
        title: `${lowConfidenceExps.length} Low-Confidence Experiments`,
        message: 'Experiments lack statistical confidence. Extend measurement windows.',
        count: lowConfidenceExps.length,
      });
    }

    // 5. Conflicting optimization candidates
    const candidatesByTarget = {};
    candidates
      .filter(c => c.status === 'detected')
      .forEach(c => {
        const key = `${c.target_system}-${c.target_config_key}`;
        if (!candidatesByTarget[key]) candidatesByTarget[key] = [];
        candidatesByTarget[key].push(c);
      });

    const conflicts = Object.entries(candidatesByTarget).filter(([_, cands]) => cands.length > 1);
    if (conflicts.length > 0) {
      alertList.push({
        type: 'conflicting_candidates',
        severity: 'medium',
        icon: AlertTriangle,
        color: 'bg-purple-950/40 border-purple-700/50',
        title: `${conflicts.length} Conflicting Optimization Candidates`,
        message: 'Multiple competing optimizations detected for same config. Prioritize by confidence.',
        count: conflicts.length,
      });
    }

    return alertList;
  }, [candidates, experiments, outcomes, policies]);

  if (alerts.length === 0) {
    return (
      <Card className="bg-emerald-950/20 border-emerald-700/50">
        <CardContent className="p-4 text-center text-emerald-400 text-sm">
          ✓ All systems healthy. No active alerts.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert, idx) => {
        const Icon = alert.icon;
        return (
          <Card key={idx} className={alert.color}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-white">{alert.title}</p>
                    <Badge
                      className={
                        alert.severity === 'critical'
                          ? 'bg-red-950 text-red-300'
                          : alert.severity === 'high'
                            ? 'bg-orange-950 text-orange-300'
                            : 'bg-yellow-950 text-yellow-300'
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">{alert.message}</p>
                  {alert.categories && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {alert.categories.map((cat, i) => (
                        <Badge key={i} variant="outline" className="text-xs capitalize">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}