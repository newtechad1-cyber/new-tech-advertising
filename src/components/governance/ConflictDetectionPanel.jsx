import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, AlertCircle } from 'lucide-react';

export default function ConflictDetectionPanel({ entities = [], fields = [], lifecycles = [], relationships = [] }) {
  const conflicts = useMemo(() => {
    const issues = [];

    // Lifecycle inconsistencies
    lifecycles.forEach(lc => {
      try {
        const statuses = JSON.parse(lc.allowed_statuses_json || '[]');
        const transitions = JSON.parse(lc.allowed_transitions_json || '{}');

        // Check for unreachable states
        const reachable = new Set();
        statuses.forEach(s => {
          if (transitions[s]?.length === 0) {
            issues.push({
              severity: 'warning',
              type: 'unreachable_state',
              title: 'Unreachable Status State',
              entity: lc.entity_key,
              message: `Status "${s}" has no outgoing transitions. May be a terminal state.`,
            });
          }
        });
      } catch {}
    });

    // Orphan relationship risks
    relationships.forEach(rel => {
      const parentExists = entities.some(e => e.entity_key === rel.parent_entity_key && e.active);
      const childExists = entities.some(e => e.entity_key === rel.child_entity_key && e.active);

      if (!parentExists || !childExists) {
        issues.push({
          severity: 'critical',
          type: 'orphan_relationship',
          title: 'Orphan Relationship',
          entity: rel.parent_entity_key,
          message: `Relationship references inactive/deleted entity. Data integrity risk.`,
        });
      }
    });

    // Ambiguous status fields
    const statusFieldsByEntity = {};
    fields.forEach(field => {
      if (field.field_key.toLowerCase().includes('status')) {
        if (!statusFieldsByEntity[field.entity_key]) {
          statusFieldsByEntity[field.entity_key] = [];
        }
        statusFieldsByEntity[field.entity_key].push(field);
      }
    });

    Object.entries(statusFieldsByEntity).forEach(([entityKey, statusFields]) => {
      if (statusFields.length > 1) {
        issues.push({
          severity: 'critical',
          type: 'ambiguous_status',
          title: 'Ambiguous Status Fields',
          entity: entityKey,
          message: `Multiple status-like fields (${statusFields.map(f => f.field_key).join(', ')}). Unclear state model.`,
        });
      }
    });

    // Cross-context data risks
    entities.forEach(entity => {
      if (!entity.tenant_scoped && !entity.context_scoped && entity.canonical_owner_type !== 'system') {
        // Check if it has dependencies across different context levels
        const hasMultiContextUsage = ['client', 'reseller', 'agency'].some(ctx => {
          return entity.entity_category.includes(ctx) || entity.description?.includes(ctx);
        });

        if (hasMultiContextUsage) {
          issues.push({
            severity: 'critical',
            type: 'cross_context_risk',
            title: 'Cross-Context Data Risk',
            entity: entity.entity_name,
            message: `Unscoped entity used across multiple contexts. Potential data leakage.`,
          });
        }
      }
    });

    return issues.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [entities, fields, lifecycles, relationships]);

  if (conflicts.length === 0) {
    return (
      <Card className="bg-emerald-950/30 border-emerald-700">
        <CardContent className="pt-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-300">No architecture conflicts detected.</span>
        </CardContent>
      </Card>
    );
  }

  const critical = conflicts.filter(c => c.severity === 'critical');
  const warnings = conflicts.filter(c => c.severity === 'warning');

  return (
    <div className="space-y-3">
      {critical.length > 0 && (
        <Card className="bg-red-950/30 border-red-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Critical Conflicts ({critical.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {critical.map((conflict, idx) => (
              <div key={idx} className="rounded-lg bg-red-950/50 p-3 border border-red-800">
                <p className="text-xs font-semibold text-red-300">{conflict.title}</p>
                <p className="text-xs text-red-400/80 mt-1">{conflict.message}</p>
                <p className="text-xs text-red-500 mt-2 font-mono">Entity: {conflict.entity}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {warnings.length > 0 && (
        <Card className="bg-amber-950/30 border-amber-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Warnings ({warnings.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {warnings.map((conflict, idx) => (
              <div key={idx} className="rounded-lg bg-amber-950/50 p-3 border border-amber-800">
                <p className="text-xs font-semibold text-amber-300">{conflict.title}</p>
                <p className="text-xs text-amber-400/80 mt-1">{conflict.message}</p>
                <p className="text-xs text-amber-600 mt-2 font-mono">Entity: {conflict.entity}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}