import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ConflictingRulesPanel({ rules = [], triggers = [] }) {
  const conflicts = useMemo(() => {
    const byTrigger = {};
    rules.filter(r => r.active).forEach(rule => {
      if (!byTrigger[rule.trigger_key]) {
        byTrigger[rule.trigger_key] = [];
      }
      byTrigger[rule.trigger_key].push(rule);
    });

    const conflictList = [];
    Object.entries(byTrigger).forEach(([triggerKey, rules]) => {
      if (rules.length > 1) {
        conflictList.push({
          trigger_key: triggerKey,
          trigger_name: triggers.find(t => t.trigger_key === triggerKey)?.trigger_name || triggerKey,
          rule_count: rules.length,
          rules: rules.slice(0, 3),
        });
      }
    });

    return conflictList.sort((a, b) => b.rule_count - a.rule_count).slice(0, 6);
  }, [rules, triggers]);

  if (conflicts.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-emerald-700/30 mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Conflicting Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-emerald-400">✓ No conflicting rules detected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-red-700 mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-red-400">✗ Conflicting Rules Detected</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {conflicts.map((conflict, idx) => (
          <div key={idx} className="bg-red-950/20 border border-red-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-red-300">{conflict.trigger_name}</p>
              <Badge className="bg-red-950 text-red-300">{conflict.rule_count} rules</Badge>
            </div>
            <div className="text-sm text-slate-400">
              {conflict.rules.map((rule, i) => (
                <div key={i} className="text-slate-400">• {rule.rule_name}</div>
              ))}
              {conflict.rule_count > 3 && (
                <div className="text-slate-500 italic">+ {conflict.rule_count - 3} more</div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}