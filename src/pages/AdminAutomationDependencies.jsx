import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Network } from 'lucide-react';

export default function AdminAutomationDependencies() {
  const [search, setSearch] = useState('');

  const { data: rules = [] } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: () => base44.entities.MasterAutomationRule?.list?.().catch(() => []),
  });

  const { data: dependencies = [] } = useQuery({
    queryKey: ['automation-dependencies'],
    queryFn: () => base44.entities.AutomationDependencyMap?.list?.().catch(() => []),
  });

  const grouped = useMemo(() => {
    const map = {};
    dependencies.forEach(dep => {
      if (!map[dep.rule_key]) {
        map[dep.rule_key] = [];
      }
      map[dep.rule_key].push(dep);
    });
    return map;
  }, [dependencies]);

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return Object.entries(grouped).filter(([ruleKey]) => {
      const rule = rules.find(r => r.rule_key === ruleKey);
      return rule?.rule_name.toLowerCase().includes(searchLower) ||
             ruleKey.toLowerCase().includes(searchLower);
    });
  }, [grouped, rules, search]);

  const depTypeColors = {
    depends_on_entity: 'bg-blue-950/20 border-blue-700/50 text-blue-300',
    depends_on_lifecycle: 'bg-purple-950/20 border-purple-700/50 text-purple-300',
    depends_on_function: 'bg-emerald-950/20 border-emerald-700/50 text-emerald-300',
    depends_on_workflow: 'bg-cyan-950/20 border-cyan-700/50 text-cyan-300',
    depends_on_agent: 'bg-indigo-950/20 border-indigo-700/50 text-indigo-300',
    depends_on_page: 'bg-amber-950/20 border-amber-700/50 text-amber-300',
    depends_on_integration: 'bg-red-950/20 border-red-700/50 text-red-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Automation Dependencies</h1>
          <p className="text-slate-400">Map automation rules to entities, functions, workflows, integrations</p>
        </div>

        <Card className="bg-slate-900/50 border-slate-700 mb-6">
          <CardContent className="p-6">
            <Input
              placeholder="Search rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800 border-slate-700"
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6 text-center text-slate-400">
                No rules with dependencies found
              </CardContent>
            </Card>
          ) : (
            filtered.map(([ruleKey, deps]) => {
              const rule = rules.find(r => r.rule_key === ruleKey);
              if (!rule) return null;

              return (
                <Card key={ruleKey} className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Network className="w-5 h-5 text-slate-400" />
                      <h3 className="text-lg font-semibold text-white">{rule.rule_name}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {deps.map((dep, idx) => {
                        const colorClass = depTypeColors[dep.dependency_type] || depTypeColors.depends_on_function;

                        return (
                          <div key={idx} className={`border rounded-lg p-3 ${colorClass}`}>
                            <Badge variant="outline" className="text-xs mb-2 block w-fit">
                              {dep.dependency_type.replace('depends_on_', '')}
                            </Badge>
                            <p className="font-semibold text-sm">{dep.dependency_name}</p>
                            {dep.dependency_target && (
                              <p className="text-xs font-mono text-slate-300 mt-1 opacity-75">
                                {dep.dependency_target}
                              </p>
                            )}
                            {dep.notes && (
                              <p className="text-xs text-slate-300 mt-2 italic">{dep.notes}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Entity Dependencies', type: 'depends_on_entity' },
            { label: 'Lifecycle Dependencies', type: 'depends_on_lifecycle' },
            { label: 'Function Dependencies', type: 'depends_on_function' },
            { label: 'Workflow Dependencies', type: 'depends_on_workflow' },
          ].map((stat, idx) => (
            <Card key={idx} className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-4">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-blue-400 mt-2">
                  {dependencies.filter(d => d.dependency_type === stat.type).length}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}