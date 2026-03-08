import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';

export default function OnboardingMetrics() {
  const [metrics, setMetrics] = useState({
    active: 0,
    waiting_on_client: 0,
    ready_to_launch: 0,
    stalled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const workrooms = await base44.entities.OnboardingWorkrooms.list('-created_date', 500);
    const m = {
      active: workrooms.filter(w => !['launched', 'paused'].includes(w.status)).length,
      waiting_on_client: workrooms.filter(w => w.status === 'waiting_on_client').length,
      ready_to_launch: workrooms.filter(w => w.status === 'ready_to_launch').length,
      stalled: 0,
    };

    // Find stalled (not_started for 3+ days)
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    m.stalled = workrooms.filter(
      w => w.status === 'not_started' && new Date(w.created_date) < threeDaysAgo
    ).length;

    setMetrics(m);
    setLoading(false);
  };

  if (loading) return <Loader2 className="w-5 h-5 animate-spin text-slate-400" />;

  return (
    <div className="grid grid-cols-4 gap-3">
      <Link to={createPageUrl('AdminOnboarding')}>
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-2xl font-bold text-violet-600">{metrics.active}</p>
          <p className="text-xs text-slate-500 mt-1">Active Onboardings</p>
        </Card>
      </Link>
      <Link to={createPageUrl('AdminOnboarding?filter=waiting_on_client')}>
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-2xl font-bold text-amber-600">{metrics.waiting_on_client}</p>
          <p className="text-xs text-slate-500 mt-1">Waiting on Client</p>
        </Card>
      </Link>
      <Link to={createPageUrl('AdminOnboarding?filter=ready_to_launch')}>
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-2xl font-bold text-green-600">{metrics.ready_to_launch}</p>
          <p className="text-xs text-slate-500 mt-1">Ready to Launch</p>
        </Card>
      </Link>
      <Link to={createPageUrl('AdminOnboarding')}>
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-2xl font-bold text-red-600">{metrics.stalled}</p>
          <p className="text-xs text-slate-500 mt-1">Stalled</p>
        </Card>
      </Link>
    </div>
  );
}