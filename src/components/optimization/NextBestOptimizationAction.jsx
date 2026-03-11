import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, TrendingDown, Lock, Zap } from 'lucide-react';

export default function NextBestOptimizationAction({ candidates = [], experiments = [], outcomes = [], policies = [] }) {
  const action = useMemo(() => {
    // Priority 1: Approve low-risk timing experiment
    const lowRiskCandidate = candidates.find(
      c => c.risk_level === 'low' && c.status === 'detected' && c.confidence_score >= 80
    );
    if (lowRiskCandidate) {
      return {
        type: 'approve_experiment',
        priority: 'high',
        icon: CheckCircle2,
        color: 'bg-emerald-950/40 border-emerald-700/50',
        title: 'Approve Low-Risk Experiment',
        description: `Run A/B test for ${lowRiskCandidate.target_system} optimization (${lowRiskCandidate.confidence_score}% confidence)`,
        action: `Run experiment on "${lowRiskCandidate.proposed_value}" change`,
        rationale: `${lowRiskCandidate.reason_detected}. Low risk + high confidence = safe to proceed.`,
      };
    }

    // Priority 2: Rollback weak optimization
    const weakOutcome = outcomes.find(o => o.outcome_direction === 'negative' && o.confidence_level >= 70);
    if (weakOutcome) {
      const relatedExp = experiments.find(e => e.experiment_key === weakOutcome.experiment_key);
      return {
        type: 'rollback',
        priority: 'urgent',
        icon: TrendingDown,
        color: 'bg-red-950/40 border-red-700/50',
        title: 'Rollback Negative Outcome',
        description: `${weakOutcome.metric_name} declined ${Math.abs(weakOutcome.delta_value)}% (${weakOutcome.confidence_level}% confident)`,
        action: 'Revert to baseline configuration',
        rationale: `Experiment ${relatedExp?.experiment_key} showed negative results. Immediate rollback recommended.`,
      };
    }

    // Priority 3: Promote winning preset
    const topWinner = outcomes
      .filter(o => o.outcome_direction === 'positive' && o.confidence_level >= 85)
      .sort((a, b) => (b.delta_value || 0) - (a.delta_value || 0))[0];
    if (topWinner) {
      return {
        type: 'promote_preset',
        priority: 'high',
        icon: Zap,
        color: 'bg-blue-950/40 border-blue-700/50',
        title: 'Promote Winning Preset',
        description: `${topWinner.metric_name} improved +${topWinner.delta_value}% (${topWinner.confidence_level}% confident)`,
        action: 'Create platform default from winning config',
        rationale: `Proven improvement with high confidence. Ready for promotion to platform default preset.`,
      };
    }

    // Priority 4: Tighten protected policy
    const riskyCat = policies.find(p => p.allowed_auto_apply !== 'protected_never_auto' && p.approval_threshold <= 70);
    if (riskyCat) {
      return {
        type: 'tighten_policy',
        priority: 'medium',
        icon: Lock,
        color: 'bg-yellow-950/40 border-yellow-700/50',
        title: 'Tighten Protection Policy',
        description: `${riskyCat.policy_name} has low approval threshold (${riskyCat.approval_threshold}%)`,
        action: 'Increase approval threshold & restrict auto-apply',
        rationale: `Policy allows too much autonomy for this critical category. Recommend raising threshold to 80%+.`,
      };
    }

    // Priority 5: Investigate low-confidence outcome
    const lowConfidenceOutcome = outcomes.find(o => o.confidence_level < 60);
    if (lowConfidenceOutcome) {
      return {
        type: 'investigate',
        priority: 'low',
        icon: AlertCircle,
        color: 'bg-orange-950/40 border-orange-700/50',
        title: 'Investigate Low-Confidence Outcome',
        description: `${lowConfidenceOutcome.metric_name} result only ${lowConfidenceOutcome.confidence_level}% confident`,
        action: 'Extend measurement window or increase sample size',
        rationale: `Result lacks statistical confidence. Extend experiment duration or gather more data.`,
      };
    }

    return null;
  }, [candidates, experiments, outcomes, policies]);

  if (!action) {
    return (
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Next Best Action</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-slate-400 py-6">
          All systems operating optimally. No immediate actions required.
        </CardContent>
      </Card>
    );
  }

  const Icon = action.icon;

  return (
    <Card className={action.color}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-white" />
            <CardTitle className="text-white">{action.title}</CardTitle>
          </div>
          <Badge
            className={
              action.priority === 'urgent'
                ? 'bg-red-950 text-red-300'
                : action.priority === 'high'
                  ? 'bg-orange-950 text-orange-300'
                  : 'bg-slate-700 text-slate-300'
            }
          >
            {action.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-slate-300 mb-1">{action.description}</p>
          <p className="text-xs text-slate-500">{action.rationale}</p>
        </div>

        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
          {action.action}
        </Button>
      </CardContent>
    </Card>
  );
}