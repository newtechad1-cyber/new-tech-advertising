import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Database, AlertTriangle } from 'lucide-react';

export default function EntityRegistryOverview({ entities = [] }) {
  const categories = {
    core: { label: 'Core', color: 'blue' },
    operational: { label: 'Operational', color: 'emerald' },
    ai_orchestration: { label: 'AI & Orchestration', color: 'purple' },
    publishing: { label: 'Publishing', color: 'amber' },
    onboarding: { label: 'Onboarding', color: 'cyan' },
    reporting: { label: 'Reporting', color: 'indigo' },
    client_portal: { label: 'Client Portal', color: 'pink' },
    reseller: { label: 'Reseller', color: 'orange' },
    school_media: { label: 'School Media', color: 'lime' },
  };

  const grouped = Object.keys(categories).reduce((acc, cat) => {
    acc[cat] = entities.filter(e => e.entity_category === cat && e.active);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(categories).map(([key, cat]) => {
        const entityList = grouped[key];
        if (entityList.length === 0) return null;

        return (
          <Card key={key} className="bg-slate-950 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">
                {cat.label} ({entityList.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {entityList.map((entity) => (
                <div
                  key={entity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Database className="w-4 h-4 text-slate-500" />
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{entity.entity_name}</p>
                      <p className="text-xs text-slate-500">Key: {entity.entity_key}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entity.status === 'deprecated' && (
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                    )}
                    <span className={`text-xs px-2 py-1 rounded font-mono text-${cat.color}-300`}>
                      {entity.tenant_scoped ? 'tenant' : 'global'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {entities.length === 0 && (
        <Card className="bg-slate-950 border-slate-800">
          <CardContent className="pt-6">
            <p className="text-slate-400">No governed entities yet. Start by defining core entities.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}