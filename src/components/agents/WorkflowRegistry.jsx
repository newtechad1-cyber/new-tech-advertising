import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { GitBranch, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WorkflowRegistry({ onSelectWorkflow }) {
  const [expandedWorkflow, setExpandedWorkflow] = useState(null);

  const { data: workflows = [] } = useQuery({
    queryKey: ['agent-workflows'],
    queryFn: () => base44.entities.AgentWorkflow?.list?.().catch(() => []),
  });

  const { data: runs = [] } = useQuery({
    queryKey: ['agent-workflow-runs'],
    queryFn: () => base44.entities.AgentWorkflowRun?.list?.('-created_at', 100).catch(() => []),
  });

  const getWorkflowStats = (workflowKey) => {
    const workflowRuns = runs.filter(r => r.workflow_key === workflowKey);
    const completed = workflowRuns.filter(r => r.run_status === 'completed').length;
    const failed = workflowRuns.filter(r => r.run_status === 'failed').length;
    const total = workflowRuns.length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, failed, total, successRate };
  };

  return (
    <div className="space-y-3">
      {workflows.length > 0 ? (
        workflows.map(workflow => {
          const stats = getWorkflowStats(workflow.workflow_key);
          const isExpanded = expandedWorkflow === workflow.id;
          const steps = JSON.parse(workflow.step_definition_json || '[]');

          return (
            <div
              key={workflow.id}
              className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-all"
            >
              <div
                className="p-4 flex items-start justify-between cursor-pointer"
                onClick={() => setExpandedWorkflow(isExpanded ? null : workflow.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <GitBranch className="w-4 h-4 text-violet-400" />
                    <p className="text-sm font-bold text-white">{workflow.workflow_name}</p>
                  </div>
                  <p className="text-xs text-slate-400">{workflow.workflow_category}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-400">
                      {stats.total} runs • {stats.successRate}% success rate
                    </span>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${workflow.active ? 'bg-emerald-500' : 'bg-slate-600'}`} />
              </div>

              {isExpanded && (
                <div className="bg-slate-800/50 border-t border-slate-700 p-4 space-y-3">
                  <div>
                    <p className="text-xs font-bold text-slate-300 mb-2">Workflow Steps:</p>
                    <div className="space-y-1">
                      {steps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-slate-300">{step.agent_key || step.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="bg-slate-900 rounded p-2">
                      <p className="text-xs text-slate-400">Completed</p>
                      <p className="text-lg font-bold text-emerald-400">{stats.completed}</p>
                    </div>
                    <div className="bg-slate-900 rounded p-2">
                      <p className="text-xs text-slate-400">Failed</p>
                      <p className="text-lg font-bold text-red-400">{stats.failed}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="ghost" className="text-xs flex-1">
                      Run Workflow
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs flex-1">
                      View Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No workflows registered</p>
        </div>
      )}
    </div>
  );
}