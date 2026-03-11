import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronRight, Database, Lock, Eye } from 'lucide-react';

export default function CategorizedEntityBrowser({ entities = [] }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = {
    'Core Business': {
      keys: ['core'],
      icon: '🏢',
      description: 'Foundational data models',
      color: 'blue',
    },
    'Publishing': {
      keys: ['publishing'],
      icon: '📤',
      description: 'Content distribution & channels',
      color: 'amber',
    },
    'Sales': {
      keys: ['sales', 'sales_orchestration'],
      icon: '💼',
      description: 'Revenue & opportunity models',
      color: 'emerald',
    },
    'Onboarding': {
      keys: ['onboarding'],
      icon: '🚀',
      description: 'Customer setup workflows',
      color: 'cyan',
    },
    'Reporting': {
      keys: ['reporting'],
      icon: '📊',
      description: 'Analytics & insights',
      color: 'purple',
    },
    'Reseller': {
      keys: ['reseller'],
      icon: '🤝',
      description: 'Partner management',
      color: 'pink',
    },
    'Automation': {
      keys: ['ai_orchestration'],
      icon: '⚙️',
      description: 'AI & workflow execution',
      color: 'indigo',
    },
    'School Media': {
      keys: ['school_media'],
      icon: '🎓',
      description: 'Educational platform',
      color: 'lime',
    },
  };

  const categorizedEntities = Object.entries(categories).map(([catName, catConfig]) => {
    const ents = entities.filter(e => catConfig.keys.includes(e.entity_category) && e.active);
    return { name: catName, ...catConfig, entities: ents };
  });

  return (
    <div className="space-y-3">
      {categorizedEntities.map((category) => (
        <div key={category.name}>
          <button
            onClick={() =>
              setExpandedCategory(expandedCategory === category.name ? null : category.name)
            }
            className={`w-full flex items-center justify-between p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all text-left`}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-lg">{category.icon}</span>
              <div>
                <p className="font-semibold text-white text-sm">{category.name}</p>
                <p className="text-xs text-slate-500">{category.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
                {category.entities.length}
              </span>
              {expandedCategory === category.name ? (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              )}
            </div>
          </button>

          {expandedCategory === category.name && (
            <Card className="mt-2 bg-slate-950 border-slate-800 rounded-lg">
              <CardContent className="pt-4 space-y-2">
                {category.entities.length === 0 ? (
                  <p className="text-xs text-slate-500">No entities in this category</p>
                ) : (
                  category.entities.map((entity) => (
                    <div
                      key={entity.id}
                      className="p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-700 hover:border-slate-600 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-white text-sm">{entity.entity_name}</p>
                          <p className="text-xs text-slate-500 font-mono">{entity.entity_key}</p>
                        </div>
                        <div className="flex gap-1">
                          {entity.tenant_scoped && (
                            <div title="Tenant Scoped" className="p-1.5 rounded bg-blue-950/40 text-blue-400">
                              <Lock className="w-3 h-3" />
                            </div>
                          )}
                          {entity.visibility_rules_json && (
                            <div title="Visibility Rules Defined" className="p-1.5 rounded bg-purple-950/40 text-purple-400">
                              <Eye className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </div>

                      {entity.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">{entity.description}</p>
                      )}

                      <div className="flex flex-wrap gap-1 pt-1">
                        {entity.status === 'deprecated' && (
                          <span className="text-xs px-2 py-0.5 rounded bg-orange-950/40 text-orange-400">
                            Deprecated
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded bg-${category.color}-950/40 text-${category.color}-400`}>
                          {entity.canonical_owner_type}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
}