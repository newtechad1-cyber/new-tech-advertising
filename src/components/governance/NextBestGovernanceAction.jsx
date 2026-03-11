import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react';

export default function NextBestGovernanceAction({ entities = [], fields = [], lifecycles = [], relationships = [], dependencies = [] }) {
  const actions = useMemo(() => {
    const recommendations = [];

    // 1. Entities missing lifecycle definitions
    entities.forEach(entity => {
      if (entity.status === 'active') {
        const hasLifecycle = lifecycles.some(l => l.entity_key === entity.entity_key);
        if (!hasLifecycle && entity.entity_category !== 'core') {
          recommendations.push({
            priority: 'high',
            action: 'Define Missing Lifecycle',
            entity: entity.entity_name,
            description: `Entity has no status/lifecycle model. Critical for operational consistency.`,
            type: 'lifecycle',
            icon: 'AlertCircle',
          });
        }
      }
    });

    // 2. Detect duplicate field semantics
    const fieldsByEntity = {};
    fields.forEach(field => {
      if (!fieldsByEntity[field.entity_key]) fieldsByEntity[field.entity_key] = [];
      fieldsByEntity[field.entity_key].push(field);
    });

    Object.entries(fieldsByEntity).forEach(([entityKey, entityFields]) => {
      const statusFields = entityFields.filter(f => f.field_key.toLowerCase().includes('status'));
      if (statusFields.length > 1) {
        recommendations.push({
          priority: 'medium',
          action: 'Resolve Duplicate Status Fields',
          entity: entityKey,
          description: `Found ${statusFields.length} status-like fields. Consolidate for consistency.`,
          type: 'field_semantics',
          icon: 'Lightbulb',
        });
      }
    });

    // 3. Mark deprecated fields
    const deprecatedCount = fields.filter(f => f.deprecated).length;
    if (deprecatedCount > 0) {
      recommendations.push({
        priority: 'low',
        action: 'Review Deprecated Fields',
        entity: `${deprecatedCount} entities`,
        description: `${deprecatedCount} fields marked deprecated. Plan migration strategy.`,
        type: 'deprecation',
        icon: 'Zap',
      });
    }

    // 4. Tighten tenant scope
    entities.forEach(entity => {
      if (!entity.tenant_scoped && !entity.context_scoped && entity.entity_category !== 'core') {
        recommendations.push({
          priority: 'medium',
          action: 'Tighten Tenant Scope',
          entity: entity.entity_name,
          description: `Global entity without tenant isolation. Data leakage risk.`,
          type: 'tenant_scope',
          icon: 'AlertCircle',
        });
      }
    });

    // 5. Map missing dependencies
    entities.forEach(entity => {
      if (entity.status === 'active') {
        const hasDeps = dependencies.some(d => d.entity_key === entity.entity_key);
        if (!hasDeps) {
          recommendations.push({
            priority: 'low',
            action: 'Map Missing Dependencies',
            entity: entity.entity_name,
            description: `No dependency mappings. Update to track usage across pages/agents.`,
            type: 'dependencies',
            icon: 'Lightbulb',
          });
        }
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [entities, fields, lifecycles, relationships, dependencies]);

  const priorityColors = {
    high: 'red',
    medium: 'amber',
    low: 'blue',
  };

  if (actions.length === 0) {
    return (
      <Card className="bg-emerald-950/30 border-emerald-700">
        <CardContent className="pt-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-300">All governance requirements met. No actions needed.</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {actions.slice(0, 5).map((action, idx) => {
        const color = priorityColors[action.priority];
        
        return (
          <Card key={idx} className={`bg-${color}-950/30 border-${color}-700`}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded bg-${color}-950/50 text-${color}-400 flex-shrink-0 mt-0.5`}>
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-${color}-300 text-sm`}>{action.action}</p>
                  <p className="text-xs text-slate-400 mt-1">{action.description}</p>
                  <p className={`text-xs text-${color}-400 mt-2 font-mono`}>Entity: {action.entity}</p>
                </div>
                <div className={`text-xs px-2 py-1 rounded font-semibold text-${color}-300 bg-${color}-950/50 flex-shrink-0`}>
                  {action.priority}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {actions.length > 5 && (
        <p className="text-xs text-slate-500 text-center">
          +{actions.length - 5} more recommendations
        </p>
      )}
    </div>
  );
}