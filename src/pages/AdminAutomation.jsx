import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, FileText } from 'lucide-react';

import AutomationKPICards from '@/components/automation/AutomationKPICards';
import AutomationHealthOverview from '@/components/automation/AutomationHealthOverview';
import DuplicateFirePanel from '@/components/automation/DuplicateFirePanel';
import ConflictingRulesPanel from '@/components/automation/ConflictingRulesPanel';
import RecentFailuresPanel from '@/components/automation/RecentFailuresPanel';

export default function AdminAutomation() {
  const { data: rules = [] } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: () => base44.entities.MasterAutomationRule?.list?.().catch(() => []),
  });

  const { data: triggers = [] } = useQuery({
    queryKey: ['automation-triggers'],
    queryFn: () => base44.entities.MasterTriggerDefinition?.list?.().catch(() => []),
  });

  const { data: executions = [] } = useQuery({
    queryKey: ['automation-executions'],
    queryFn: () => base44.entities.AutomationExecutionLog?.list?.('-started_at', 100).catch(() => []),
  });

  const { data: health = [] } = useQuery({
    queryKey: ['automation-health'],
    queryFn: () => base44.entities.AutomationHealthSnapshot?.list?.('-snapshot_time', 50).catch(() => []),
  });

  const { data: audits = [] } = useQuery({
    queryKey: ['automation-audits'],
    queryFn: () => base44.entities.AutomationGovernanceAuditLog?.list?.('-created_at', 20).catch(() => []),
  });

  const activeRules = rules.filter(r => r.active).length;
  const deprecatedRules = rules.filter(r => r.deprecated).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Automation Governance</h1>
              <p className="text-slate-400">Master control center for automation rules and triggers</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={createPageUrl('AdminAutomationRules')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Rules
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={createPageUrl('AdminAutomationTriggers')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Triggers
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <AutomationKPICards rules={rules} triggers={triggers} executions={executions} health={health} />

        {/* Health Overview */}
        <AutomationHealthOverview rules={rules} health={health} executions={executions} />

        {/* Main Tabs */}
        <Tabs defaultValue="conflicts" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
            <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
            <TabsTrigger value="failures">Failures</TabsTrigger>
            <TabsTrigger value="changes">Recent Changes</TabsTrigger>
          </TabsList>

          <TabsContent value="conflicts">
            <ConflictingRulesPanel rules={rules} triggers={triggers} />
          </TabsContent>

          <TabsContent value="duplicates">
            <DuplicateFirePanel rules={rules} health={health} triggers={triggers} />
          </TabsContent>

          <TabsContent value="failures">
            <RecentFailuresPanel executions={executions} rules={rules} />
          </TabsContent>

          <TabsContent value="changes">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6">
                {audits.length === 0 ? (
                  <p className="text-slate-400">No recent changes</p>
                ) : (
                  <div className="space-y-3">
                    {audits.slice(0, 8).map((audit, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                        <div>
                          <p className="font-semibold text-slate-300">{audit.rule_key}</p>
                          <p className="text-xs text-slate-500 mt-1">{audit.change_type}</p>
                        </div>
                        <div className="text-right text-xs text-slate-400">
                          {new Date(audit.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-sm text-slate-400">Active Rules</p>
              <p className="text-2xl font-bold text-emerald-400 mt-2">{activeRules}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-sm text-slate-400">Deprecated</p>
              <p className="text-2xl font-bold text-slate-400 mt-2">{deprecatedRules}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-sm text-slate-400">Categories</p>
              <p className="text-2xl font-bold text-blue-400 mt-2">{new Set(rules.map(r => r.automation_category)).size}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-sm text-slate-400">Execution Health</p>
              <p className="text-2xl font-bold text-amber-400 mt-2">
                {health.length > 0 ? Math.round(health.reduce((sum, h) => sum + h.execution_success_rate, 0) / health.length) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}