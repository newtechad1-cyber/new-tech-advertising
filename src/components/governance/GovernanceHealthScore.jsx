import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function GovernanceHealthScore({ entity, relationships = [], fields = [], lifecycles = [], dependencies = [] }) {
  const score = useMemo(() => {
    let points = 0;
    let maxPoints = 0;

    // Has description (10 points)
    maxPoints += 10;
    if (entity.description) points += 10;

    // Has lifecycle defined (15 points)
    maxPoints += 15;
    const hasLifecycle = lifecycles.some(l => l.entity_key === entity.entity_key);
    if (hasLifecycle) points += 15;

    // Has relationships (10 points)
    maxPoints += 10;
    const hasRelationships = relationships.some(r => r.parent_entity_key === entity.entity_key || r.child_entity_key === entity.entity_key);
    if (hasRelationships) points += 10;

    // Has fields defined (15 points)
    maxPoints += 15;
    const fieldCount = fields.filter(f => f.entity_key === entity.entity_key).length;
    if (fieldCount > 0) points += 15;

    // Has visibility rules (10 points)
    maxPoints += 10;
    if (entity.visibility_rules_json) {
      try {
        const rules = JSON.parse(entity.visibility_rules_json);
        if (Object.keys(rules).length > 0) points += 10;
      } catch {}
    }

    // Has edit rules defined (10 points)
    maxPoints += 10;
    if (entity.edit_rules_json) {
      try {
        const rules = JSON.parse(entity.edit_rules_json);
        if (Object.keys(rules).length > 0) points += 10;
      } catch {}
    }

    // Has dependencies mapped (15 points)
    maxPoints += 15;
    const hasDeps = dependencies.some(d => d.entity_key === entity.entity_key);
    if (hasDeps) points += 15;

    // Tenant scope defined (5 points)
    maxPoints += 5;
    if (entity.tenant_scoped || entity.context_scoped) points += 5;

    // Has source of truth (5 points)
    maxPoints += 5;
    if (entity.source_of_truth) points += 5;

    const percent = Math.round((points / maxPoints) * 100);
    return { percent, points, maxPoints };
  }, [entity, relationships, fields, lifecycles, dependencies]);

  const getHealthColor = (percent) => {
    if (percent >= 85) return { bg: 'emerald-950/40', border: 'emerald-700', text: 'emerald-300', label: 'Excellent' };
    if (percent >= 70) return { bg: 'blue-950/40', border: 'blue-700', text: 'blue-300', label: 'Good' };
    if (percent >= 50) return { bg: 'amber-950/40', border: 'amber-700', text: 'amber-300', label: 'Fair' };
    return { bg: 'red-950/40', border: 'red-700', text: 'red-300', label: 'At Risk' };
  };

  const health = getHealthColor(score.percent);
  const Icon = score.percent >= 70 ? CheckCircle2 : score.percent >= 50 ? AlertCircle : AlertTriangle;

  return (
    <Card className={`bg-${health.bg.split('-')[0]}-${health.bg.split('-')[1].split('/')[0]} border-${health.border.split('-')[0]}-${health.border.split('-')[1]}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 text-${health.text.split('-')[0]}-${health.text.split('-')[1]}`} />
              <span className={`text-sm font-semibold text-${health.text.split('-')[0]}-${health.text.split('-')[1]}`}>
                {health.label} Governance Health
              </span>
            </div>
            <div className="w-40 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-${health.text.split('-')[0]}-400 to-${health.text.split('-')[0]}-500 transition-all`}
                style={{ width: `${score.percent}%` }}
              />
            </div>
          </div>
          <div className={`text-3xl font-bold text-${health.text.split('-')[0]}-${health.text.split('-')[1]}`}>
            {score.percent}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}