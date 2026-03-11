import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WorkflowTimeline({ workflowRun, steps = [] }) {
  if (!workflowRun) {
    return (
      <Card className="bg-slate-950 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-400">Workflow Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm">No workflow selected</p>
        </CardContent>
      </Card>
    );
  }

  const getStepIcon = (status, isCurrent) => {
    if (isCurrent && status !== 'completed' && status !== 'failed') {
      return <Loader className="w-4 h-4 animate-spin text-blue-400" />;
    }
    if (status === 'completed') {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
    if (status === 'failed') {
      return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
    return <Clock className="w-4 h-4 text-slate-500" />;
  };

  const getStepColor = (status, isCurrent) => {
    if (isCurrent && status !== 'completed' && status !== 'failed') {
      return 'border-blue-600 bg-blue-950/20';
    }
    if (status === 'completed') {
      return 'border-emerald-600 bg-emerald-950/20';
    }
    if (status === 'failed') {
      return 'border-red-600 bg-red-950/20';
    }
    return 'border-slate-700 bg-slate-900/50';
  };

  const getTotalDuration = () => {
    if (!workflowRun.started_at || !workflowRun.completed_at) return null;
    const start = new Date(workflowRun.started_at).getTime();
    const end = new Date(workflowRun.completed_at).getTime();
    const seconds = Math.round((end - start) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const displaySteps = steps.length > 0 ? steps : [
    { step: 1, name: 'Step 1', status: 'pending' },
    { step: 2, name: 'Step 2', status: 'pending' },
    { step: 3, name: 'Step 3', status: 'pending' }
  ];

  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-200">Workflow Progress</CardTitle>
          {getTotalDuration() && (
            <span className="text-xs text-slate-400">Duration: {getTotalDuration()}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Overall progress bar */}
          <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">Progress</span>
              <span className="text-sm font-bold text-slate-200">
                {workflowRun.current_step || 0} / {workflowRun.total_steps || 0}
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                style={{
                  width: `${workflowRun.total_steps ? (workflowRun.current_step / workflowRun.total_steps) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          {/* Steps timeline */}
          <div className="relative">
            {displaySteps.map((step, idx) => {
              const isCurrent = idx === (workflowRun.current_step - 1 || 0);
              const isCompleted = idx < (workflowRun.current_step - 1 || 0) || workflowRun.run_status === 'completed';
              const isFailed = workflowRun.run_status === 'failed' && isCurrent;
              const status = isFailed ? 'failed' : isCompleted ? 'completed' : isCurrent ? 'running' : 'pending';

              return (
                <div key={idx} className="relative">
                  {/* Connecting line */}
                  {idx < displaySteps.length - 1 && (
                    <div
                      className={`absolute left-2 top-8 w-0.5 h-8 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    />
                  )}

                  {/* Step node */}
                  <div className={`flex gap-3 border-l-2 pl-4 pb-4 ${getStepColor(status, isCurrent)}`}>
                    <div className="relative mt-0.5">
                      {getStepIcon(status, isCurrent)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-slate-200 font-medium text-sm">
                          Step {step.step}: {step.name || `Step ${step.step}`}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            status === 'running'
                              ? 'bg-blue-900/50 text-blue-300'
                              : status === 'completed'
                              ? 'bg-emerald-900/50 text-emerald-300'
                              : status === 'failed'
                              ? 'bg-red-900/50 text-red-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      {step.error && (
                        <p className="text-red-400 text-xs mt-1">{step.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status summary */}
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Status:</span>
              <span
                className={`text-sm font-bold ${
                  workflowRun.run_status === 'completed'
                    ? 'text-emerald-400'
                    : workflowRun.run_status === 'failed'
                    ? 'text-red-400'
                    : workflowRun.run_status === 'running'
                    ? 'text-blue-400'
                    : 'text-slate-400'
                }`}
              >
                {workflowRun.run_status?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}