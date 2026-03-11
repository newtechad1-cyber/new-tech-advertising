import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EscalationCenter() {
  const { data: escalations = [] } = useQuery({
    queryKey: ['agent-escalations'],
    queryFn: () => base44.entities.AgentEscalation?.filter?.({ status: 'open' }, '-created_at', 50).catch(() => []),
  });

  const { data: tasksMap = {} } = useQuery({
    queryKey: ['escalation-tasks'],
    queryFn: async () => {
      const tasks = await base44.entities.AgentTask?.list?.().catch(() => []);
      const map = {};
      tasks.forEach(t => map[t.id] = t);
      return map;
    },
  });

  const getEscalationColor = (type) => {
    const colors = {
      task_failed: 'text-red-400 bg-red-900/20 border-red-700',
      max_retries_exceeded: 'text-orange-400 bg-orange-900/20 border-orange-700',
      timeout: 'text-amber-400 bg-amber-900/20 border-amber-700',
      blocked_dependency: 'text-blue-400 bg-blue-900/20 border-blue-700',
      permission_denied: 'text-red-400 bg-red-900/20 border-red-700',
      manual_escalation: 'text-violet-400 bg-violet-900/20 border-violet-700',
    };
    return colors[type] || colors.task_failed;
  };

  return (
    <div className="space-y-3">
      {escalations.length > 0 ? (
        escalations.map(esc => {
          const task = tasksMap[esc.task_id];

          return (
            <div
              key={esc.id}
              className={`border rounded-lg p-4 ${getEscalationColor(esc.escalation_type)}`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-white">{task?.task_title || 'Unknown Task'}</p>
                  <p className="text-xs opacity-75 mt-1">{esc.escalation_reason}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs opacity-70">
                    <span>Assigned to: {esc.assigned_to_role}</span>
                    <span>{new Date(esc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="ghost" className="text-xs">
                    Resolve
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs">
                    Details
                  </Button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No open escalations</p>
        </div>
      )}
    </div>
  );
}