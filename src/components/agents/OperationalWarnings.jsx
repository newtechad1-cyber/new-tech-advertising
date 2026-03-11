import React, { useMemo } from 'react';
import { AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OperationalWarnings({ tasks = [], agents = [] }) {
  const warnings = useMemo(() => {
    const alerts = [];

    // 1. Agent running without clear context
    const uncontextedTasks = tasks.filter(
      t => t.task_status === 'running' && 
      (!t.context_type || t.context_type === 'vertical') &&
      !t.client_id && !t.reseller_id && !t.school_id
    );
    if (uncontextedTasks.length > 0) {
      alerts.push({
        severity: 'warning',
        title: `${uncontextedTasks.length} Task(s) Without Clear Context`,
        description: 'Running tasks lack proper tenant/context scope. May cause data isolation issues.',
        icon: AlertTriangle,
        color: 'text-amber-400',
        items: uncontextedTasks
      });
    }

    // 2. Repeated retries
    const highRetryTasks = tasks.filter(
      t => t.task_status === 'failed' && 
      t.retry_count >= (t.max_retries || 3) - 1
    );
    if (highRetryTasks.length > 0) {
      alerts.push({
        severity: 'critical',
        title: `${highRetryTasks.length} Task(s) Near Max Retries`,
        description: 'Tasks are approaching retry limits. Consider manual escalation.',
        icon: TrendingUp,
        color: 'text-red-400',
        items: highRetryTasks
      });
    }

    // 3. Blocked tasks aging
    const now = Date.now();
    const staledBlockedTasks = tasks.filter(t => {
      if (t.task_status !== 'blocked' || !t.created_at) return false;
      const ageMs = now - new Date(t.created_at).getTime();
      const ageHours = ageMs / (1000 * 60 * 60);
      return ageHours > 2; // blocked for >2 hours
    });
    if (staledBlockedTasks.length > 0) {
      alerts.push({
        severity: 'warning',
        title: `${staledBlockedTasks.length} Blocked Task(s) Aging > 2 Hours`,
        description: 'Blocked tasks stale. May indicate dependency issues or missing automation.',
        icon: AlertCircle,
        color: 'text-amber-400',
        items: staledBlockedTasks
      });
    }

    // 4. Agent health degradation
    const degradedAgents = agents.filter(
      a => a.health_status === 'degraded' || a.health_status === 'unhealthy'
    );
    if (degradedAgents.length > 0) {
      alerts.push({
        severity: 'warning',
        title: `${degradedAgents.length} Agent(s) Unhealthy`,
        description: 'Agents showing high failure or queue rates. Performance may suffer.',
        icon: AlertTriangle,
        color: 'text-orange-400',
        items: degradedAgents
      });
    }

    return alerts.sort((a, b) => {
      const severityMap = { critical: 1, warning: 2 };
      return (severityMap[a.severity] || 3) - (severityMap[b.severity] || 3);
    });
  }, [tasks, agents]);

  if (warnings.length === 0) {
    return null; // No warnings, don't show card
  }

  return (
    <Card className="bg-red-950/20 border-red-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-red-300 text-sm uppercase tracking-wide flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Operational Warnings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {warnings.map((warning, idx) => {
          const Icon = warning.icon;
          return (
            <div
              key={idx}
              className={`rounded-lg p-3 border ${
                warning.severity === 'critical'
                  ? 'bg-red-950/50 border-red-700'
                  : 'bg-amber-950/50 border-amber-700'
              }`}
            >
              <div className="flex gap-3">
                <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${warning.color}`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${warning.color}`}>
                    {warning.title}
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    {warning.description}
                  </p>
                  {warning.items && warning.items.length > 0 && (
                    <div className="mt-2 text-xs">
                      <p className="text-slate-400 mb-1">Affected items:</p>
                      <ul className="space-y-1">
                        {warning.items.slice(0, 3).map((item, i) => (
                          <li key={i} className="text-slate-400 ml-2">
                            • {item.task_title || item.agent_name || item.id}
                          </li>
                        ))}
                        {warning.items.length > 3 && (
                          <li className="text-slate-500 ml-2">
                            +{warning.items.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}