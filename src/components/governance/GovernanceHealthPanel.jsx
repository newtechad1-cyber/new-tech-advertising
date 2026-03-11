import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GovernanceHealthPanel({ health, entities, fields }) {
  if (!health) {
    return (
      <Card className="bg-slate-950 border-slate-800">
        <CardContent className="pt-6">
          <p className="text-slate-400">No health snapshot yet. Run schema health check.</p>
        </CardContent>
      </Card>
    );
  }

  const scores = [
    { label: 'Field Coverage', value: health.required_field_coverage_score, max: 100 },
    { label: 'Naming Consistency', value: health.naming_consistency_score, max: 100 },
    { label: 'Relationship Integrity', value: health.relationship_integrity_score, max: 100 },
    { label: 'Lifecycle Consistency', value: health.lifecycle_consistency_score, max: 100 },
    { label: 'Orphan Risk', value: 100 - (health.orphan_record_risk_score || 0), max: 100 },
  ];

  const overallHealth = Math.round(health.governance_health_score || 0);
  const healthColor = overallHealth >= 80 ? 'emerald' : overallHealth >= 60 ? 'amber' : 'red';
  const healthLabel = overallHealth >= 80 ? 'Excellent' : overallHealth >= 60 ? 'Fair' : 'At Risk';

  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Schema Health Overview</span>
          <div className={`text-3xl font-bold text-${healthColor}-400`}>
            {overallHealth}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-slate-400 mb-4">
          Last checked: {new Date(health.snapshot_time).toLocaleString()}
        </div>

        {/* Health Grade */}
        <div className={`rounded-lg p-3 bg-${healthColor}-950/30 border border-${healthColor}-700 text-${healthColor}-300`}>
          <p className="font-semibold">{healthLabel} Health Status</p>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3">
          {scores.map((score, idx) => {
            const percent = (score.value / score.max) * 100;
            const color = percent >= 80 ? 'emerald' : percent >= 60 ? 'amber' : 'red';
            
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{score.label}</span>
                  <span className={`font-bold text-${color}-400`}>{Math.round(score.value)}</span>
                </div>
                <div className="w-full bg-slate-800 rounded h-2">
                  <div
                    className={`bg-${color}-500 h-2 rounded transition-all`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="border-t border-slate-700 pt-3 text-xs text-slate-400 space-y-1">
          <p>📊 {entities?.length || 0} entities | {fields?.length || 0} fields defined</p>
          <p>Last updated: {new Date(health.snapshot_time).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}