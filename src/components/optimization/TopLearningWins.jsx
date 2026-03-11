import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp } from 'lucide-react';

export default function TopLearningWins({ outcomes = [], experiments = [], candidates = [] }) {
  const wins = useMemo(() => {
    return outcomes
      .filter(o => o.outcome_direction === 'positive' && o.confidence_level >= 75)
      .map(outcome => {
        const exp = experiments.find(e => e.experiment_key === outcome.experiment_key);
        const candidate = candidates.find(c => {
          const cExp = experiments.find(e => e.experiment_key === c.optimization_category);
          return cExp?.experiment_key === outcome.experiment_key;
        });

        return {
          ...outcome,
          experiment: exp,
          impact: outcome.delta_value,
          category: exp?.optimization_category,
          strategy: exp?.strategy_type,
        };
      })
      .sort((a, b) => (b.impact || 0) - (a.impact || 0))
      .slice(0, 8);
  }, [outcomes, experiments, candidates]);

  const categoryEmoji = (cat) => {
    const emojis = {
      publishing_performance: '📰',
      sales_conversion: '💰',
      onboarding_efficiency: '🚀',
      automation_reliability: '⚙️',
      reporting_effectiveness: '📊',
      reseller_growth: '📈',
      client_engagement: '👥',
    };
    return emojis[cat] || '⭐';
  };

  if (wins.length === 0) {
    return (
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Top Learning Wins</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-slate-400 py-6">
          No winning optimizations yet. Keep experimenting.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Learning Wins
          </CardTitle>
          <Badge className="bg-emerald-950 text-emerald-300">{wins.length} discoveries</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {wins.map((win, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{categoryEmoji(win.category)}</span>
                  <p className="font-semibold text-white text-sm">{win.metric_name}</p>
                </div>
                <p className="text-xs text-slate-400">{win.experiment?.experiment_name}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-lg font-bold text-emerald-300">+{win.impact}%</span>
                </div>
                <p className="text-xs text-slate-500">{win.confidence_level}% confident</p>
              </div>
            </div>

            {/* Impact breakdown */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-950 rounded border border-slate-700">
                <p className="text-slate-500 mb-0.5">Before</p>
                <p className="text-white font-mono">{win.baseline_value}</p>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-700 text-center">
                <p className="text-emerald-400 mb-0.5">→</p>
                <p className="text-emerald-300 font-semibold">+{win.delta_value}%</p>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-700">
                <p className="text-slate-500 mb-0.5">After</p>
                <p className="text-white font-mono">{win.observed_value}</p>
              </div>
            </div>

            {/* Strategy & Date */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700">
              <Badge variant="outline" className="text-xs capitalize">
                {win.strategy?.replace(/_/g, ' ')}
              </Badge>
              <p className="text-xs text-slate-500">
                {win.measured_at ? new Date(win.measured_at).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}