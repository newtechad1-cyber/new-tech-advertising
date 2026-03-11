import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Radio } from 'lucide-react';

export default function AdminAutomationTriggers() {
  const [search, setSearch] = useState('');

  const { data: triggers = [] } = useQuery({
    queryKey: ['automation-triggers'],
    queryFn: () => base44.entities.MasterTriggerDefinition?.list?.().catch(() => []),
  });

  const { data: rules = [] } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: () => base44.entities.MasterAutomationRule?.list?.().catch(() => []),
  });

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return triggers.filter(t =>
      t.trigger_name.toLowerCase().includes(searchLower) ||
      t.trigger_key.toLowerCase().includes(searchLower) ||
      t.source_entity_key.toLowerCase().includes(searchLower)
    );
  }, [triggers, search]);

  const triggerTypeColors = {
    entity_create: 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300',
    entity_update: 'bg-blue-950/30 border-blue-700/50 text-blue-300',
    entity_delete: 'bg-red-950/30 border-red-700/50 text-red-300',
    entity_status_change: 'bg-purple-950/30 border-purple-700/50 text-purple-300',
    scheduled: 'bg-amber-950/30 border-amber-700/50 text-amber-300',
    webhook: 'bg-cyan-950/30 border-cyan-700/50 text-cyan-300',
    manual: 'bg-slate-800/30 border-slate-700/50 text-slate-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Automation Triggers Registry</h1>
          <p className="text-slate-400">Master registry of all automation triggers and their usage</p>
        </div>

        <Card className="bg-slate-900/50 border-slate-700 mb-6">
          <CardContent className="p-6">
            <Input
              placeholder="Search triggers..."
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
                No triggers found
              </CardContent>
            </Card>
          ) : (
            filtered.map((trigger) => {
              const rulesUsing = rules.filter(r => r.trigger_key === trigger.trigger_key);
              const colorClass = triggerTypeColors[trigger.trigger_type] || triggerTypeColors.manual;
              const contexts = trigger.allowed_contexts_json ? JSON.parse(trigger.allowed_contexts_json) : [];

              return (
                <Card key={trigger.id} className={`border ${colorClass}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Radio className="w-5 h-5 opacity-50" />
                          <h3 className="text-lg font-semibold text-white">{trigger.trigger_name}</h3>
                          {!trigger.active && (
                            <Badge variant="secondary" className="text-xs">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{trigger.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-slate-500">Type</span>
                            <p className="text-slate-300 font-mono text-xs mt-1">{trigger.trigger_type}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Source</span>
                            <p className="text-slate-300 font-mono text-xs mt-1">{trigger.source_entity_key}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Event</span>
                            <p className="text-slate-300 font-mono text-xs mt-1">{trigger.source_event_type}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Dedup Support</span>
                            <p className="text-slate-300 text-xs mt-1">{trigger.duplicate_protection_supported ? '✓' : '✗'}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Rules Using</span>
                            <p className="text-slate-300 font-bold text-xs mt-1">{rulesUsing.length}</p>
                          </div>
                        </div>

                        {contexts.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {contexts.map((ctx, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {ctx}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {!trigger.duplicate_protection_supported && rulesUsing.length > 1 && (
                        <div className="ml-6 text-right">
                          <div className="text-xs text-orange-400 flex items-center gap-1 justify-end">
                            <AlertTriangle className="w-3 h-3" />
                            No Dedup
                          </div>
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