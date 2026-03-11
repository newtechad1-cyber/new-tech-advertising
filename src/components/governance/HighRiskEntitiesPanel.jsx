import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Zap } from 'lucide-react';

export default function HighRiskEntitiesPanel({ entities = [], fields = [], relationships = [] }) {
  const highRiskEntities = useMemo(() => {
    return entities
      .map(entity => {
        let riskScore = 0;
        let riskReasons = [];

        // Core business entities are high-impact
        if (['core', 'operational'].includes(entity.entity_category)) {
          riskScore += 25;
          riskReasons.push('Core/Operational');
        }

        // High relationship count = complex
        const relCount = relationships.filter(
          r => r.parent_entity_key === entity.entity_key || r.child_entity_key === entity.entity_key
        ).length;
        if (relCount > 5) {
          riskScore += 20;
          riskReasons.push(`${relCount} relationships`);
        }

        // Many fields = complexity
        const fieldCount = fields.filter(f => f.entity_key === entity.entity_key).length;
        if (fieldCount > 15) {
          riskScore += 15;
          riskReasons.push(`${fieldCount} fields`);
        }

        // No tenant scope = exposure
        if (!entity.tenant_scoped && !entity.context_scoped) {
          riskScore += 20;
          riskReasons.push('No tenant isolation');
        }

        // No visibility rules = unknown access
        if (!entity.visibility_rules_json) {
          riskScore += 10;
          riskReasons.push('Missing visibility rules');
        }

        // Client-editable without controls = danger
        if (entity.edit_rules_json) {
          try {
            const rules = JSON.parse(entity.edit_rules_json);
            if (rules.client_editable) {
              riskScore += 15;
              riskReasons.push('Client-editable');
            }
          } catch {}
        }

        return { ...entity, riskScore, riskReasons };
      })
      .filter(e => e.riskScore > 0)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 8);
  }, [entities, fields, relationships]);

  if (highRiskEntities.length === 0) {
    return (
      <Card className="bg-emerald-950/30 border-emerald-700">
        <CardContent className="pt-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-300">All critical entities properly governed.</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          High-Risk Entities ({highRiskEntities.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {highRiskEntities.map((entity, idx) => {
          const riskLevel = entity.riskScore >= 80 ? 'critical' : entity.riskScore >= 60 ? 'high' : 'medium';
          const riskColors = {
            critical: 'red',
            high: 'orange',
            medium: 'amber',
          };
          const color = riskColors[riskLevel];

          return (
            <div
              key={idx}
              className={`rounded-lg bg-${color}-950/30 border border-${color}-700 p-3`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className={`font-semibold text-${color}-300 text-sm`}>{entity.entity_name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">{entity.entity_key}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entity.riskReasons.map((reason, ridx) => (
                      <span key={ridx} className={`text-xs px-2 py-0.5 rounded bg-${color}-950 text-${color}-400`}>
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`text-2xl font-bold text-${color}-400`}>{entity.riskScore}</div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded bg-${color}-950 text-${color}-300 uppercase`}>
                    {riskLevel}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}