import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const PRIORITY_STYLES = {
  urgent: 'border-l-4 border-l-red-500 bg-red-50',
  high: 'border-l-4 border-l-orange-400 bg-orange-50',
  medium: 'border-l-4 border-l-yellow-400 bg-yellow-50',
  low: 'border-l-4 border-l-gray-300 bg-gray-50'
};

const PRIORITY_BADGE = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600'
};

export default function SalesAlertsPanel() {
  const qc = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['sales-notifications'],
    queryFn: () => base44.entities.SalesNotification.filter({ status: 'unread' }, '-created_date', 50)
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.SalesNotification.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales-notifications'] })
  });

  const markAll = async () => {
    for (const n of notifications) {
      await base44.entities.SalesNotification.update(n.id, { status: 'read' });
    }
    qc.invalidateQueries({ queryKey: ['sales-notifications'] });
    toast.success('All alerts marked as read');
  };

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading alerts...</div>;

  return (
    <div className="bg-white rounded-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-500" />
          <h2 className="font-semibold text-gray-800">Sales Alerts</h2>
          {notifications.length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{notifications.length}</span>
          )}
        </div>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={markAll}>
            <CheckCheck className="w-4 h-4 mr-1" /> Mark All Read
          </Button>
        )}
      </div>

      <div className="divide-y">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 ${PRIORITY_STYLES[n.priority] || PRIORITY_STYLES.medium}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                  <Badge className={`text-xs ${PRIORITY_BADGE[n.priority]}`}>{n.priority}</Badge>
                </div>
                <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {n.created_date ? formatDistanceToNow(new Date(n.created_date), { addSuffix: true }) : ''}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost" size="icon"
                  className="h-7 w-7"
                  onClick={() => updateMutation.mutate({ id: n.id, status: 'actioned' })}
                  title="Mark Actioned"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-green-600" />
                </Button>
                <Button
                  variant="ghost" size="icon"
                  className="h-7 w-7"
                  onClick={() => updateMutation.mutate({ id: n.id, status: 'dismissed' })}
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            ✅ No unread alerts. You're all caught up.
          </div>
        )}
      </div>
    </div>
  );
}