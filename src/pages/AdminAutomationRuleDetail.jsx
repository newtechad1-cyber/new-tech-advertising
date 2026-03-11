import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit2, Eye } from 'lucide-react';
import { createPageUrl } from '@/utils';

import AutomationHealthScore from '@/components/automation/AutomationHealthScore';
import NextBestAutomationAction from '@/components/automation/NextBestAutomationAction';
import AutomationPreviewMode from '@/components/automation/AutomationPreviewMode';

const urlParams = new URLSearchParams(window.location.search);
const ruleKey = urlParams.get('ruleKey');

export default function AdminAutomationRuleDetail() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRule, setEditedRule] = useState(null);

  const { data: rule } = useQuery({
    queryKey: ['automation-rule', ruleKey],
    queryFn: async () => {
      if (!ruleKey) return null;
      const rules = await base44.entities.MasterAutomationRule?.list?.().catch(() => []);
      return rules.find(r => r.rule_key === ruleKey);
    },
    enabled: !!ruleKey,
  });

  const { data: triggers = [] } = useQuery({
    queryKey: ['automation-triggers'],
    queryFn: () => base44.entities.MasterTriggerDefinition?.list?.().catch(() => []),
  });

  const { data: rules = [] } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: () => base44.entities.MasterAutomationRule?.list?.().catch(() => []),
  });

  const { data: health } = useQuery({
    queryKey: ['automation-health', ruleKey],
    queryFn: async () => {
      if (!ruleKey) return null;
      const healthData = await base44.entities.AutomationHealthSnapshot?.list?.().catch(() => []);
      return healthData.find(h => h.rule_key === ruleKey);
    },
    enabled: !!ruleKey,
  });

  const { data: executions = [] } = useQuery({
    queryKey: ['automation-executions', ruleKey],
    queryFn: () =>
      base44.entities.AutomationExecutionLog?.filter?.({ rule_key: ruleKey }, '-started_at', 20).catch(() => []),
    enabled: !!ruleKey,
  });

  const { data: conditions = [] } = useQuery({
    queryKey: ['automation-conditions', ruleKey],
    queryFn: () =>
      base44.entities.AutomationConditionDefinition?.filter?.({ rule_key: ruleKey }).catch(() => []),
    enabled: !!ruleKey,
  });

  const { data: actions = [] } = useQuery({
    queryKey: ['automation-actions', ruleKey],
    queryFn: () =>
      base44.entities.AutomationActionDefinition?.filter?.({ rule_key: ruleKey }, 'sequence_order').catch(() => []),
    enabled: !!ruleKey,
  });

  const trigger = useMemo(() => triggers.find(t => t.trigger_key === rule?.trigger_key), [rule, triggers]);

  if (!rule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-400">Rule not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-slate-400"
            asChild
          >
            <a href={createPageUrl('AdminAutomationRules')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rules
            </a>
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{rule.rule_name}</h1>
                {!rule.active && <Badge variant="secondary">Inactive</Badge>}
                {rule.deprecated && <Badge className="bg-slate-700">Deprecated</Badge>}
              </div>
              <p className="text-slate-400">{rule.description}</p>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)} className="gap-2">
              {isEditing ? <Eye className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              {isEditing ? 'View Mode' : 'Edit'}
            </Button>
          </div>
        </div>

        {/* Health Score & Recommendations */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-1">
            <AutomationHealthScore rule={rule} health={health} executions={executions} />
          </div>
          <div className="col-span-2">
            <NextBestAutomationAction rule={rule} health={health} triggers={triggers} rules={rules} />
          </div>
        </div>

        {/* Rule Details */}
        <Card className="bg-slate-900/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle>Rule Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Category</p>
                <Badge variant="outline" className="text-xs">{rule.automation_category}</Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Trigger</p>
                <p className="text-sm text-slate-300 font-mono">{trigger?.trigger_name || rule.trigger_key}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Scope</p>
                <Badge variant="outline" className="text-xs">{rule.tenant_scope}</Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Owner</p>
                <p className="text-sm text-slate-300">{rule.owner_team || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Execution Mode</p>
                <Badge variant="outline" className="text-xs">{rule.execution_mode}</Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Entity</p>
                <p className="text-sm text-slate-300 font-mono">{rule.primary_entity_key}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status Field</p>
                <p className="text-sm text-slate-300">{rule.primary_status_field || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Source of Truth</p>
                <p className="text-sm text-slate-300">{rule.source_of_truth || 'System'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed View */}
        <Tabs defaultValue="conditions" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="conditions">Conditions ({conditions.length})</TabsTrigger>
            <TabsTrigger value="actions">Actions ({actions.length})</TabsTrigger>
            <TabsTrigger value="execution">Execution History</TabsTrigger>
          </TabsList>

          <TabsContent value="conditions">
            {conditions.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-6 text-center text-slate-400">
                  No conditions defined
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {conditions.map((cond, idx) => (
                  <Card key={idx} className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-white">{cond.condition_key}</p>
                        <Badge variant="outline" className="text-xs">{cond.condition_type}</Badge>
                      </div>
                      {cond.condition_logic_json && (
                        <pre className="text-xs bg-slate-800 p-2 rounded text-slate-300 overflow-auto">
                          {JSON.stringify(JSON.parse(cond.condition_logic_json), null, 2)}
                        </pre>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="actions">
            {actions.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-6 text-center text-slate-400">
                  No actions defined
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {actions.map((action, idx) => (
                  <Card key={idx} className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-white">{action.action_key}</p>
                        <Badge variant="outline" className="text-xs">{action.action_type}</Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">Target: {action.target_key}</p>
                      {action.action_payload_json && (
                        <pre className="text-xs bg-slate-800 p-2 rounded text-slate-300 overflow-auto">
                          {JSON.stringify(JSON.parse(action.action_payload_json), null, 2)}
                        </pre>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="execution">
            {executions.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-6 text-center text-slate-400">
                  No execution history
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {executions.map((exec, idx) => (
                  <Card key={idx} className={`border ${
                    exec.execution_status === 'completed'
                      ? 'bg-emerald-950/20 border-emerald-700/30'
                      : exec.execution_status === 'failed'
                      ? 'bg-red-950/20 border-red-700/30'
                      : 'bg-slate-900/50 border-slate-700'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`text-xs ${
                          exec.execution_status === 'completed'
                            ? 'bg-emerald-950 text-emerald-300'
                            : exec.execution_status === 'failed'
                            ? 'bg-red-950 text-red-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {exec.execution_status}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {new Date(exec.started_at).toLocaleString()}
                        </span>
                      </div>
                      {exec.error_message && (
                        <p className="text-xs text-red-300 mt-2">{exec.error_message}</p>
                      )}
                      {exec.result_summary && (
                        <p className="text-xs text-slate-400 mt-2">{exec.result_summary}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Preview Mode */}
        {isEditing && (
          <div className="mt-6">
            <AutomationPreviewMode
              rule={rule}
              changes={editedRule}
              onApply={() => {
                // Handle apply
                setIsEditing(false);
              }}
              onCancel={() => {
                setIsEditing(false);
                setEditedRule(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}