import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, AlertTriangle, CheckCircle2, TrendingUp, Activity } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function OrchestratorHealth() {
  const { data: orchestrations } = useQuery({
    queryKey: ['orchestrations', 'active'],
    queryFn: () => base44.asServiceRole.entities.WorkflowOrchestrations.filter({
      status: 'active',
      enabled: true
    }),
    initialData: []
  });

  const { data: todaysRuns } = useQuery({
    queryKey: ['workflowRuns', 'today'],
    queryFn: async () => {
      const allRuns = await base44.asServiceRole.entities.WorkflowRuns.list('-started_at', 100);
      const today = new Date();
      return allRuns.filter(r => {
        const runDate = new Date(r.started_at);
        return runDate.toDateString() === today.toDateString();
      });
    },
    initialData: []
  });

  const activeCount = orchestrations.filter(o => o.enabled).length;
  const totalRuns = todaysRuns.length;
  const failedRuns = todaysRuns.filter(r => r.run_status === 'failed').length;
  const rescueWorkflows = todaysRuns.filter(r => r.trigger_event?.includes('rescue')).length;
  const renewalWorkflows = todaysRuns.filter(r => r.trigger_event?.includes('renewal')).length;
  const totalActionsCreated = todaysRuns.reduce((sum, r) => sum + (r.actions_created_count || 0), 0);

  const hasCritical = failedRuns > 0;

  return (
    <Card className={hasCritical ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Workflow Orchestrator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded border">
            <p className="text-xs text-gray-600">Active Workflows</p>
            <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
          </div>
          <div className="p-3 bg-white rounded border">
            <p className="text-xs text-gray-600">Today's Runs</p>
            <p className="text-2xl font-bold text-gray-900">{totalRuns}</p>
          </div>
          <div className="p-3 bg-white rounded border">
            <p className="text-xs text-gray-600">Actions Created</p>
            <p className="text-2xl font-bold text-purple-600">{totalActionsCreated}</p>
          </div>
          <div className={`p-3 rounded border ${failedRuns > 0 ? 'bg-white' : 'bg-white'}`}>
            <p className="text-xs text-gray-600">Failed Runs</p>
            <p className={`text-2xl font-bold ${failedRuns > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {failedRuns}
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Renewal Workflows</span>
            </div>
            <Badge className="bg-green-100 text-green-800">{renewalWorkflows}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-gray-700">Rescue Workflows</span>
            </div>
            <Badge className="bg-amber-100 text-amber-800">{rescueWorkflows}</Badge>
          </div>
          {failedRuns > 0 && (
            <div className="flex items-center justify-between text-sm p-2 bg-red-100 rounded">
              <span className="text-red-800 font-semibold">⚠️ {failedRuns} failures</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button size="sm" asChild className="w-full">
          <a href={createPageUrl('AdminOrchestrator')}>
            View Orchestrator
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}