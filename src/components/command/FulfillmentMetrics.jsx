import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';

export default function FulfillmentMetrics() {
  const [metrics, setMetrics] = useState({
    active: 0,
    waiting_on_client: 0,
    pending_approvals: 0,
    overdue: 0,
    requests_open: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [workrooms, tasks, requests] = await Promise.all([
        base44.entities.FulfillmentWorkrooms.list('-created_date', 500),
        base44.entities.FulfillmentTasks.list('-created_date', 500),
        base44.entities.ClientRequests.list('-created_date', 500),
      ]);

      const now = new Date();
      const m = {
        active: workrooms.filter(w => w.status === 'active').length,
        waiting_on_client: workrooms.filter(w => w.status === 'waiting_on_client').length,
        pending_approvals: tasks.filter(t => t.visible_to_client && t.status === 'pending').length,
        overdue: tasks.filter(t => 
          t.due_date && new Date(t.due_date) < now && !['completed', 'approved'].includes(t.status)
        ).length,
        requests_open: requests.filter(r => r.status === 'new' || r.status === 'in_progress').length,
      };

      setMetrics(m);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader2 className="w-5 h-5 animate-spin text-slate-400" />;

  return (
    <div className="grid grid-cols-5 gap-3">
      <Link to={createPageUrl('AdminFulfillment')}>
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-2xl font-bold text-indigo-600">{metrics.active}</p>
          <p className="text-xs text-slate-500 mt-1">Active Workrooms</p>
        </Card>
      </Link>
      <Link to={createPageUrl('AdminFulfillment?filter=waiting_on_client')}>
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-2xl font-bold text-amber-600">{metrics.waiting_on_client}</p>
          <p className="text-xs text-slate-500 mt-1">Waiting on Client</p>
        </Card>
      </Link>
      <Link to={createPageUrl('AdminFulfillment')}>
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-2xl font-bold text-orange-600">{metrics.pending_approvals}</p>
          <p className="text-xs text-slate-500 mt-1">Pending Approvals</p>
        </Card>
      </Link>
      <Link to={createPageUrl('AdminFulfillment')}>
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-2xl font-bold text-red-600">{metrics.overdue}</p>
          <p className="text-xs text-slate-500 mt-1">Overdue Items</p>
        </Card>
      </Link>
      <Link to={createPageUrl('AdminFulfillment')}>
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-2xl font-bold text-violet-600">{metrics.requests_open}</p>
          <p className="text-xs text-slate-500 mt-1">Open Requests</p>
        </Card>
      </Link>
    </div>
  );
}