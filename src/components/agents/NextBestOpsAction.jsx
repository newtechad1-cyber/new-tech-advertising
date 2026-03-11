import React, { useMemo } from 'react';
import { AlertCircle, Play, CheckCircle2, ChevronRight, Pause, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NextBestOpsAction({ tasks = [], escalations = [], agents = [] }) {
  const actions = useMemo(() => {
    const prioritized = [];

    // 1. Retry failed publishing (highest impact)
    const failedPublishing = tasks.filter(
      t => t.task_status === 'failed' && t.task_type?.includes('publish') && t.retry_count < t.max_retries
    );
    if (failedPublishing.length > 0) {
      prioritized.push({
        priority: 1,
        title: `Retry ${failedPublishing.length} Failed Publishing Tasks`,
        description: `${failedPublishing.length} tasks ready for retry`,
        action: 'retry',
        icon: Play,
        color: 'text-blue-400',
        count: failedPublishing.length,
        items: failedPublishing
      });
    }

    // 2. Resolve blocked onboarding (customer impact)
    const blockedOnboarding = tasks.filter(
      t => t.task_status === 'blocked' && t.task_type?.includes('onboard')
    );
    if (blockedOnboarding.length > 0) {
      prioritized.push({
        priority: 2,
        title: `Unblock ${blockedOnboarding.length} Onboarding Tasks`,
        description: `Tasks waiting on dependencies`,
        action: 'unblock',
        icon: AlertCircle,
        color: 'text-amber-400',
        count: blockedOnboarding.length,
        items: blockedOnboarding
      });
    }

    // 3. Review open escalations (critical)
    if (escalations.length > 0) {
      prioritized.push({
        priority: 3,
        title: `Review ${escalations.length} Escalations`,
        description: `Tasks waiting for human decision`,
        action: 'escalations',
        icon: AlertCircle,
        color: 'text-red-400',
        count: escalations.length,
        items: escalations
      });
    }

    // 4. Pause unhealthy agents
    const unhealthyAgents = agents.filter(a => a.health_status === 'unhealthy' && a.active);
    if (unhealthyAgents.length > 0) {
      prioritized.push({
        priority: 4,
        title: `Pause ${unhealthyAgents.length} Unhealthy Agents`,
        description: `Preventing cascading failures`,
        action: 'pause',
        icon: Pause,
        color: 'text-orange-400',
        count: unhealthyAgents.length,
        items: unhealthyAgents
      });
    }

    // 5. Workflow bottleneck investigation
    const slowWorkflows = tasks.filter(
      t => t.task_status === 'running' && t.started_at && 
      (Date.now() - new Date(t.started_at).getTime()) > 3600000 // running > 1 hour
    );
    if (slowWorkflows.length > 0) {
      prioritized.push({
        priority: 5,
        title: `Investigate ${slowWorkflows.length} Slow Tasks`,
        description: `Tasks running longer than expected`,
        action: 'investigate',
        icon: Zap,
        color: 'text-yellow-400',
        count: slowWorkflows.length,
        items: slowWorkflows
      });
    }

    return prioritized.sort((a, b) => a.priority - b.priority);
  }, [tasks, escalations, agents]);

  if (actions.length === 0) {
    return (
      <Card className="bg-slate-950 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            All Systems Nominal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm">No critical actions needed</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-200 text-sm uppercase tracking-wide">
          Next Best Ops Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/70 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${action.color}`} />
                    <p className="text-slate-200 font-medium text-sm leading-tight">
                      {action.title}
                    </p>
                  </div>
                  <p className="text-slate-400 text-xs ml-6">{action.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-800 border-slate-700 hover:bg-slate-700 flex-shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}