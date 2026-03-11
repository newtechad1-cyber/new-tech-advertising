import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Zap, AlertTriangle } from 'lucide-react';

export default function AdminAutomationRules() {
  const [search, setSearch] = useState('');

  const { data: rules = [] } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: () => base44.entities.MasterAutomationRule?.list?.().catch(() => []),
  });

  const { data: triggers = [] } = useQuery({
    queryKey: ['automation-triggers'],
    queryFn: () => base44.entities.MasterTriggerDefinition?.list?.().catch(() => []),
  });

  const { data: health = [] } = useQuery({
    queryKey: ['automation-health'],
    queryFn: () => base44.entities.AutomationHealthSnapshot?.list?.().catch(() => []),
  });

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return rules.filter(r => 
      r.rule_name.toLowerCase().includes(searchLower) ||
      r.rule_key.toLowerCase().includes(searchLower) ||
      r.automation_category.includes(searchLower)
    );
  }, [rules, search]);

  const categoryColors = {
    publishing: 'bg-indigo-950/30 border-indigo-700/50 text-indigo-300',
    onboarding: 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300',
    reporting: 'bg-purple-950/30 border-purple-700/50 text-purple-300',
    approval: 'bg-blue-950/30 border-blue-700/50 text-blue-300',
    notification: 'bg-amber-950/30 border-amber-700/50 text-amber-300',
    workflow: 'bg-cyan-950/30 border-cyan-700/50 text-cyan-300',
    maintenance: 'bg-slate-800/30 border-slate-700/50 text-slate-300',
    escalation: 'bg-red-950/30 border-red-700/50 text-red-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Automation Rules Registry</h1>
          <p className="text-slate-400">Master registry of all automation rules and their health</p>
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

        <div className="grid gap-4">
          {filtered.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6 text-center text-slate-400">
                No rules found
              </CardContent>
            </Card>
          ) : (
            filtered.map((rule) => {
              const trigger = triggers.find(t => t.trigger_key === rule.trigger_key);
              const ruleHealth = health.find(h => h.rule_key === rule.rule_key);
              const colorClass = categoryColors[rule.automation_category] || categoryColors.workflow;

              return (
                <Card key={rule.id} className={`border ${colorClass}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Zap className="w-5 h-5 opacity-50" />
                          <h3 className="text-lg font-semibold text-white">{rule.rule_name}</h3>
                          {!rule.active && (
                            <Badge variant="secondary" className="text-xs">Inactive</Badge>
                          )}
                          {rule.deprecated && (
                            <Badge className="bg-slate-700 text-slate-300 text-xs">Deprecated</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{rule.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Trigger</span>
                            <p className="text-slate-300 font-mono text-xs mt-1">{trigger?.trigger_name || rule.trigger_key}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Category</span>
                            <p className="text-slate-300 font-mono text-xs mt-1">{rule.automation_category}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Context</span>
                            <p className="text-slate-300 font-mono text-xs mt-1">{rule.tenant_scope}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Owner</span>
                            <p className="text-slate-300 font-mono text-xs mt-1">{rule.owner_team || 'Unassigned'}</p>
                          </div>
                        </div>
                      </div>

                      {ruleHealth && (
                        <div className="ml-6 text-right">
                          <div className={`text-2xl font-bold ${
                            ruleHealth.health_score >= 85 ? 'text-emerald-400' :
                            ruleHealth.health_score >= 70 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {Math.round(ruleHealth.health_score)}%
                          </div>
                          {ruleHealth.duplicate_fire_risk_score > 70 && (
                            <div className="text-xs text-orange-400 mt-2 flex items-center gap-1 justify-end">
                              <AlertTriangle className="w-3 h-3" />
                              Dup. Risk
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}