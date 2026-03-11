import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export default function RecentFailuresPanel({ executions = [], rules = [] }) {
  const recentFailures = useMemo(() => {
    return executions
      .filter(e => e.execution_status === 'failed')
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
      .slice(0, 6)
      .map(e => ({
        ...e,
        rule_name: rules.find(r => r.rule_key === e.rule_key)?.rule_name || e.rule_key,
      }));
  }, [executions, rules]);

  if (recentFailures.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-emerald-700/30 mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Recent Failures</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-emerald-400">✓ No recent failures</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-red-700/50 mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Recent Failures</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentFailures.map((failure, idx) => (
          <div key={idx} className="bg-red-950/20 border border-red-700/30 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-300">{failure.rule_name}</p>
                <p className="text-xs text-slate-400 mt-1">{failure.error_message?.substring(0, 60)}...</p>
                {failure.retry_count > 0 && (
                  <p className="text-xs text-amber-400 mt-1">Retried {failure.retry_count} times</p>
                )}
              </div>
              <Badge variant="secondary" className="text-xs shrink-0">
                {new Date(failure.completed_at).toLocaleDateString()}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}