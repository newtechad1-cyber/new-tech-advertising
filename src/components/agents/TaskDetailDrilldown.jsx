import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Copy, AlertCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TaskDetailDrilldown({ task, logs = [] }) {
  const [expanded, setExpanded] = useState(false);

  const payloadSummary = useMemo(() => {
    if (!task.payload_json) return null;
    try {
      const payload = JSON.parse(task.payload_json);
      return payload;
    } catch {
      return null;
    }
  }, [task]);

  const resultSummary = useMemo(() => {
    if (!task.result_json) return null;
    try {
      const result = JSON.parse(task.result_json);
      return result;
    } catch {
      return null;
    }
  }, [task]);

  if (!task) return null;

  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardHeader className="pb-2">
        <div
          className="flex items-center justify-between cursor-pointer hover:opacity-80"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex-1">
            <CardTitle className="text-slate-200">{task.task_title}</CardTitle>
            <p className="text-xs text-slate-400 mt-1">{task.task_type}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="ml-2"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          {/* Status and metadata */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900/50 rounded-lg p-3 border border-slate-800">
            <div>
              <p className="text-slate-400 text-xs">Status</p>
              <p className="text-slate-100 font-bold text-sm capitalize">{task.task_status}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Priority</p>
              <p className="text-slate-100 font-bold text-sm capitalize">{task.priority}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Context</p>
              <p className="text-slate-100 font-bold text-sm capitalize">{task.context_type}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Retries</p>
              <p className="text-slate-100 font-bold text-sm">{task.retry_count} / {task.max_retries}</p>
            </div>
          </div>

          {/* Payload Summary */}
          {payloadSummary && (
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
              <p className="text-slate-400 text-xs font-bold mb-2">Input Payload</p>
              <pre className="text-slate-300 text-xs overflow-x-auto max-h-48 bg-slate-900 rounded p-2">
                {JSON.stringify(payloadSummary, null, 2)}
              </pre>
            </div>
          )}

          {/* Result Summary */}
          {resultSummary && (
            <div className="bg-emerald-950/20 rounded-lg p-3 border border-emerald-800">
              <p className="text-emerald-400 text-xs font-bold mb-2">Result</p>
              <pre className="text-slate-300 text-xs overflow-x-auto max-h-48 bg-slate-900 rounded p-2">
                {JSON.stringify(resultSummary, null, 2)}
              </pre>
            </div>
          )}

          {/* Error message */}
          {task.error_message && (
            <div className="bg-red-950/20 rounded-lg p-3 border border-red-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 text-xs font-bold mb-1">Error</p>
                  <p className="text-red-300 text-xs">{task.error_message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Blocked reason */}
          {task.blocked_reason && (
            <div className="bg-amber-950/20 rounded-lg p-3 border border-amber-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-400 text-xs font-bold mb-1">Blocked</p>
                  <p className="text-amber-300 text-xs">{task.blocked_reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline/Logs */}
          {logs && logs.length > 0 && (
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
              <p className="text-slate-400 text-xs font-bold mb-3">Log History</p>
              <div className="space-y-2">
                {logs.map((log, idx) => (
                  <div key={idx} className="text-xs border-l-2 border-slate-700 pl-2 py-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-slate-400">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </span>
                      <span className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 capitalize">
                        {log.log_type}
                      </span>
                    </div>
                    <p className="text-slate-400">{log.log_message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Records */}
          {task.related_entity_type && (
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
              <p className="text-slate-400 text-xs font-bold mb-2">Related Record</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm font-bold">{task.related_entity_type}</p>
                  <p className="text-slate-500 text-xs">{task.related_entity_id}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                >
                  View
                </Button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2 pt-2">
            {task.task_status === 'failed' && task.retry_count < task.max_retries && (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Zap className="w-3.5 h-3.5 mr-1" />
                Retry
              </Button>
            )}
            {(task.task_status === 'blocked' || task.task_status === 'failed') && (
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700"
              >
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Escalate
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-800 border-slate-700 hover:bg-slate-700 ml-auto"
            >
              <Copy className="w-3.5 h-3.5 mr-1" />
              Copy ID
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}