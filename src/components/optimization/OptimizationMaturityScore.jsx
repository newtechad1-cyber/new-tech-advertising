import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export default function OptimizationMaturityScore({ candidates = [], experiments = [], outcomes = [] }) {
  const CATEGORIES = [
    'publishing_performance',
    'sales_conversion',
    'onboarding_efficiency',
    'automation_reliability',
    'reporting_effectiveness',
    'reseller_growth',
    'client_engagement',
  ];

  const scores = useMemo(() => {
    return CATEGORIES.map((category) => {
      const cCandidates = candidates.filter(c => c.optimization_category === category);
      const cExperiments = experiments.filter(e => e.optimization_category === category);
      const cOutcomes = outcomes.filter(o => {
        const exp = experiments.find(e => e.experiment_key === o.experiment_key);
        return exp?.optimization_category === category;
      });

      const detected = cCandidates.length;
      const running = cExperiments.filter(e => e.status === 'running').length;
      const successful = cOutcomes.filter(o => o.outcome_direction === 'positive').length;
      const failed = cOutcomes.filter(o => o.outcome_direction === 'negative').length;
      const adopted = cCandidates.filter(c => c.status === 'adopted').length;

      // Maturity = (successful adoptions / detected opportunities) * 100
      // Capped at 100, minimum 0
      let maturity = detected > 0 ? (adopted / detected) * 100 : 0;
      maturity = Math.min(100, Math.max(0, maturity));

      // Health deduction for failures
      const failureDeduction = failed * 5;
      const healthScore = Math.max(0, maturity - failureDeduction);

      return {
        category,
        maturity: Math.round(maturity),
        healthScore: Math.round(healthScore),
        detected,
        running,
        successful,
        failed,
        adopted,
        stage: maturity < 20 ? 'exploratory' : maturity < 50 ? 'experimental' : maturity < 80 ? 'proven' : 'mature',
      };
    });
  }, [candidates, experiments, outcomes]);

  const avgMaturity = useMemo(() => {
    return Math.round(scores.reduce((a, s) => a + s.maturity, 0) / scores.length);
  }, [scores]);

  const categoryLabel = (cat) => {
    const labels = {
      publishing_performance: '📰 Publishing',
      sales_conversion: '💰 Sales',
      onboarding_efficiency: '🚀 Onboarding',
      automation_reliability: '⚙️ Automation',
      reporting_effectiveness: '📊 Reporting',
      reseller_growth: '📈 Reseller Growth',
      client_engagement: '👥 Client Engagement',
    };
    return labels[cat] || cat;
  };

  const stageColor = (stage) => {
    const colors = {
      exploratory: { bg: 'bg-slate-950/40', border: 'border-slate-700', text: 'text-slate-400' },
      experimental: { bg: 'bg-yellow-950/40', border: 'border-yellow-700/50', text: 'text-yellow-400' },
      proven: { bg: 'bg-blue-950/40', border: 'border-blue-700/50', text: 'text-blue-400' },
      mature: { bg: 'bg-emerald-950/40', border: 'border-emerald-700/50', text: 'text-emerald-400' },
    };
    return colors[stage];
  };

  return (
    <div className="space-y-4">
      {/* Overall Platform Maturity */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Platform Maturity</CardTitle>
            <div className="text-2xl font-bold text-indigo-300">{avgMaturity}%</div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={avgMaturity} className="h-3" />
          <p className="text-xs text-slate-400 mt-2">
            {avgMaturity < 30 ? 'Early stage - building optimization capability' : 
             avgMaturity < 60 ? 'Growing - multiple proven optimizations' :
             avgMaturity < 85 ? 'Advancing - most categories optimized' :
             'Mature - platform self-optimizing consistently'}
          </p>
        </CardContent>
      </Card>

      {/* By Category */}
      <div className="grid grid-cols-7 gap-2">
        {scores.map((score) => {
          const colors = stageColor(score.stage);
          return (
            <Card key={score.category} className={`${colors.bg} border ${colors.border}`}>
              <CardContent className="p-3 text-center">
                <p className="text-xs text-slate-400 mb-1">{categoryLabel(score.category)}</p>
                <div className="text-xl font-bold text-white mb-1">{score.maturity}%</div>
                <div className="flex items-center justify-center gap-1 text-xs">
                  {score.stage === 'exploratory' && <AlertTriangle className="w-3 h-3 text-slate-500" />}
                  {score.stage === 'experimental' && <TrendingUp className="w-3 h-3 text-yellow-500" />}
                  {score.stage === 'proven' && <TrendingUp className="w-3 h-3 text-blue-500" />}
                  {score.stage === 'mature' && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                  <span className={`${colors.text} capitalize text-xs`}>{score.stage}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-2">
        {scores.map((score) => (
          <div key={score.category} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-300">{categoryLabel(score.category)}</p>
              <div className="text-xs text-slate-400">
                {score.detected} detected • {score.adopted} adopted • {score.failed} failed
              </div>
            </div>
            <Progress value={score.healthScore} className="h-2" />
            <p className="text-xs text-slate-500 mt-1">Health Score: {score.healthScore}% (Maturity: {score.maturity}%)</p>
          </div>
        ))}
      </div>
    </div>
  );
}