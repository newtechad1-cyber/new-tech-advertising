import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function AutomationLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.AuthorityMapRunLog.list('-created_date', 10);
      setLogs(data);
    } catch (err) {
      console.error('[AutomationLogs] Failed to load:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Automation Run Logs</CardTitle>
        <Button variant="ghost" size="icon" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-slate-400">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-slate-400">No automation runs recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-3 text-sm border rounded-lg px-3 py-2 bg-slate-50">
                <div className="mt-0.5 shrink-0">
                  {log.status === 'success'
                    ? <CheckCircle className="w-4 h-4 text-green-500" />
                    : <XCircle className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {log.status}
                    </Badge>
                    <span className="text-xs text-slate-400">{new Date(log.created_date).toLocaleString()}</span>
                    {log.pillars_count && <span className="text-xs text-slate-500">{log.pillars_count} pillars · {log.topics_scheduled} queued</span>}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 break-words">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}