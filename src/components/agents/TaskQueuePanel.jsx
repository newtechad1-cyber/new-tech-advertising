import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaskQueuePanel({ statusFilter = 'all' }) {
  const [expandedTask, setExpandedTask] = useState(null);

  const { data: tasks = [] } = useQuery({
    queryKey: ['agent-tasks', statusFilter],
    queryFn: async () => {
      if (statusFilter === 'all') {
        return base44.entities.AgentTask?.list?.('-created_at', 50).catch(() => []);
      }
      return base44.entities.AgentTask?.filter?.({ task_status: statusFilter }, '-created_at', 50).catch(() => []);
    },
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-slate-700 text-slate-200',
      queued: 'bg-blue-900/50 text-blue-200',
      running: 'bg-purple-900/50 text-purple-200',
      completed: 'bg-emerald-900/50 text-emerald-200',
      failed: 'bg-red-900/50 text-red-200',
      blocked: 'bg-orange-900/50 text-orange-200',
      escalated: 'bg-red-900/50 text-red-200',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: CheckCircle,
      failed: AlertTriangle,
      blocked: AlertTriangle,
      running: Zap,
      queued: Clock,
    };
    return icons[status] || Clock;
  };

  return (
    <div className="space-y-2">
      {tasks.length > 0 ? (
        tasks.map(task => {
          const Icon = getStatusIcon(task.task_status);
          const isExpanded = expandedTask === task.id;

          return (
            <div
              key={task.id}
              className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-all"
            >
              <div
                className="p-3 flex items-start justify-between cursor-pointer"
                onClick={() => setExpandedTask(isExpanded ? null : task.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <p className="text-sm font-semibold text-white">{task.task_title}</p>
                  </div>
                  <p className="text-xs text-slate-500">{task.agent_key}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(task.task_status)}`}>
                  {task.task_status}
                </span>
              </div>

              {isExpanded && (
                <div className="bg-slate-800/50 border-t border-slate-700 p-3 space-y-2 text-xs">
                  <div>
                    <p className="text-slate-400">Context:</p>
                    <p className="text-white">{task.context_type}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Related Entity:</p>
                    <p className="text-white">{task.related_entity_type} - {task.related_entity_id}</p>
                  </div>
                  {task.error_message && (
                    <div>
                      <p className="text-slate-400">Error:</p>
                      <p className="text-red-300">{task.error_message}</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="ghost" className="text-xs">View Logs</Button>
                    <Button size="sm" variant="ghost" className="text-xs">Retry</Button>
                    <Button size="sm" variant="ghost" className="text-xs">View Record</Button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No tasks in this queue</p>
        </div>
      )}
    </div>
  );
}