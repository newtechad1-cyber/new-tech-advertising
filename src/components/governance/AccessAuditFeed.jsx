import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, X, Lock } from 'lucide-react';

export default function AccessAuditFeed() {
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['access-audit'],
    queryFn: async () => {
      return await base44.entities.AccessAuditLog.list('-timestamp', 30);
    },
  });

  const actionIcon = (actionType) => {
    if (actionType.includes('denied')) return <X className="w-4 h-4 text-red-500" />;
    if (actionType.includes('assigned')) return <Check className="w-4 h-4 text-green-500" />;
    if (actionType.includes('suspended')) return <Lock className="w-4 h-4 text-orange-500" />;
    return <AlertCircle className="w-4 h-4 text-gray-500" />;
  };

  const resultColor = (result) => {
    switch (result) {
      case 'allowed': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'requires_upgrade': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_scope': return 'bg-orange-100 text-orange-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="animate-spin">Loading audit logs...</div>;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Access Audit Events</h2>

      <div className="space-y-3">
        {auditLogs?.map(log => (
          <div key={log.id} className="border rounded p-3 hover:bg-gray-50">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  {actionIcon(log.actionType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{log.actionType.replace(/_/g, ' ')}</p>
                    <Badge className={resultColor(log.result)} variant="outline">
                      {log.result}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    User: <span className="font-mono">{log.userId?.slice(-8)}</span>
                    {log.targetUserId && ` → ${log.targetUserId?.slice(-8)}`}
                  </p>
                  {log.resourceType && (
                    <p className="text-xs text-gray-600">
                      Resource: {log.resourceType} {log.resourceId && `(${log.resourceId?.slice(-8)})`}
                    </p>
                  )}
                  {log.denialReason && (
                    <p className="text-xs text-red-600 mt-1">
                      Reason: {log.denialReason.replace(/_/g, ' ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                </p>
                {log.isSensitive && (
                  <Badge className="mt-1 bg-red-100 text-red-800">Sensitive</Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!auditLogs || auditLogs.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No access audit events found.
        </div>
      )}
    </Card>
  );
}