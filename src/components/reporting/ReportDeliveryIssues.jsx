import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportDeliveryIssues() {
  const { data: deliveries = [] } = useQuery({
    queryKey: ['delivery-issues'],
    queryFn: () => base44.entities.ReportDeliveryLog?.list?.('-sent_at', 200).catch(() => []),
  });

  const issues = deliveries.filter(d => d.delivery_status === 'failed' || d.delivery_status === 'bounced');

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        Delivery Issues
      </h3>

      {issues.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {issues.map((issue, idx) => (
            <div key={idx} className="bg-red-900/20 border border-red-700 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-400 mb-1">{issue.recipient}</p>
              <p className="text-xs text-red-300 mb-2">{issue.error_message || 'Unknown error'}</p>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs gap-1 text-red-400 hover:text-red-300">
                <RotateCw className="w-3 h-3" /> Retry
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-slate-500">
          <p className="text-sm">No delivery issues</p>
        </div>
      )}
    </div>
  );
}