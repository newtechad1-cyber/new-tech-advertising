import React, { useMemo } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SchemaHealthAlerts({ health }) {
  const issues = useMemo(() => {
    if (!health || !health.issues_json) return [];
    try {
      return JSON.parse(health.issues_json);
    } catch {
      return [];
    }
  }, [health]);

  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const warningIssues = issues.filter(i => i.severity === 'warning');
  const infoIssues = issues.filter(i => i.severity === 'info');

  if (issues.length === 0) {
    return (
      <Card className="bg-emerald-950/20 border-emerald-700">
        <CardContent className="pt-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-300">All systems healthy. No schema violations detected.</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {criticalIssues.length > 0 && (
        <Card className="bg-red-950/30 border-red-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Critical Issues ({criticalIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {criticalIssues.map((issue, idx) => (
              <div key={idx} className="text-xs text-red-300">
                <p className="font-semibold">{issue.title}</p>
                <p className="text-red-400/80">{issue.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {warningIssues.length > 0 && (
        <Card className="bg-amber-950/30 border-amber-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Warnings ({warningIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {warningIssues.map((issue, idx) => (
              <div key={idx} className="text-xs text-amber-300">
                <p className="font-semibold">{issue.title}</p>
                <p className="text-amber-400/80">{issue.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {infoIssues.length > 0 && (
        <Card className="bg-blue-950/30 border-blue-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-400 text-sm">Info ({infoIssues.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {infoIssues.slice(0, 3).map((issue, idx) => (
              <div key={idx} className="text-xs text-blue-300">
                <p className="font-semibold">{issue.title}</p>
                <p className="text-blue-400/80">{issue.message}</p>
              </div>
            ))}
            {infoIssues.length > 3 && (
              <p className="text-xs text-slate-500">+{infoIssues.length - 3} more info items</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}