import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export default function DuplicateFirePanel({ rules = [], health = [], triggers = [] }) {
  const riskyRules = useMemo(() => {
    return health
      .filter(h => h.duplicate_fire_risk_score > 70)
      .sort((a, b) => b.duplicate_fire_risk_score - a.duplicate_fire_risk_score)
      .slice(0, 8)
      .map(h => {
        const rule = rules.find(r => r.rule_key === h.rule_key);
        const trigger = triggers.find(t => t.trigger_key === rule?.trigger_key);
        return { ...h, rule, trigger };
      });
  }, [health, rules, triggers]);

  if (riskyRules.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-emerald-700/30 mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Duplicate Fire Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-emerald-400">✓ No duplicate fire risks detected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-orange-700 mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-orange-400">⚠ Duplicate Fire Risks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {riskyRules.map((item, idx) => (
          <div key={idx} className="bg-orange-950/30 border border-orange-700/50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-orange-300">{item.rule?.rule_name}</p>
                <p className="text-sm text-slate-400 mt-1">Trigger: {item.trigger?.trigger_name}</p>
                {!item.rule?.cooldown_rules_json && (
                  <p className="text-xs text-orange-400 mt-2">⚠ Missing cooldown protection</p>
                )}
              </div>
              <Badge className="bg-orange-950 text-orange-300 shrink-0">
                {Math.round(item.duplicate_fire_risk_score)}%
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}