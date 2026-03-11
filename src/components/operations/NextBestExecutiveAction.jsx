import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Zap, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function NextBestExecutiveAction() {
  const { data: deals = [] } = useQuery({
    queryKey: ['nba-deals'],
    queryFn: () => base44.entities.SalesDeals?.list?.('-created_date', 500).catch(() => []),
  });

  const { data: videoRequests = [] } = useQuery({
    queryKey: ['nba-videos'],
    queryFn: () => base44.entities.VideoRequests?.list?.('-created_date', 200).catch(() => []),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['nba-clients'],
    queryFn: () => base44.entities.ClientCompanies?.list?.('-updated_date', 200).catch(() => []),
  });

  const now = new Date();

  // Identify best action
  const actions = [];

  // Stalled high-value deals
  const stalledDeals = deals.filter(d =>
    d.stage === 'negotiation' &&
    (d.deal_value || 0) > 10000 &&
    d.last_activity_date &&
    new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) > new Date(d.last_activity_date)
  ).length;

  if (stalledDeals > 0) {
    actions.push({
      priority: 'critical',
      title: 'Review Stalled Deals',
      description: `${stalledDeals} large deal(s) inactive for 5+ days—urgent follow-up needed`,
      action: 'Review Deals',
      icon: AlertTriangle,
      link: 'AdminSales',
      metric: stalledDeals,
    });
  }

  // Content approval backlog
  const backlog = videoRequests.filter(v => v.review_status === 'pending_review').length;
  if (backlog > 3) {
    actions.push({
      priority: 'high',
      title: 'Approve Content Backlog',
      description: `${backlog} videos awaiting review—clear the queue`,
      action: 'Review Videos',
      icon: CheckCircle,
      link: 'AdminVideoPublishing',
      metric: backlog,
    });
  }

  // At-risk clients
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const atRiskClients = clients.filter(c => {
    const lastActivity = new Date(c.updated_date || 0);
    return lastActivity <= new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  }).length;

  if (atRiskClients > 0) {
    actions.push({
      priority: 'high',
      title: 'Engage At-Risk Clients',
      description: `${atRiskClients} client(s) inactive for 60+ days—re-engagement campaign`,
      action: 'Outreach',
      icon: AlertTriangle,
      link: 'AdminClients',
      metric: atRiskClients,
    });
  }

  // New pipeline opportunities
  const newLeads = deals.filter(d => d.stage === 'new_lead').length;
  if (newLeads > 5) {
    actions.push({
      priority: 'medium',
      title: 'Qualify New Leads',
      description: `${newLeads} fresh leads ready for qualification`,
      action: 'Qualify',
      icon: Zap,
      link: 'AdminSales',
      metric: newLeads,
    });
  }

  // Default if no critical actions
  if (actions.length === 0) {
    actions.push({
      priority: 'low',
      title: 'All Clear',
      description: 'No critical actions—maintain current pace',
      action: 'Dashboard',
      icon: CheckCircle,
      link: 'AdminDashboard',
      metric: null,
    });
  }

  const primaryAction = actions[0];
  const Icon = primaryAction.icon;

  const priorityColor = {
    critical: 'border-red-700 bg-red-900/20',
    high: 'border-orange-700 bg-orange-900/20',
    medium: 'border-yellow-700 bg-yellow-900/20',
    low: 'border-emerald-700 bg-emerald-900/20',
  };

  const priorityTextColor = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
    low: 'text-emerald-400',
  };

  return (
    <div className={`${priorityColor[primaryAction.priority]} border rounded-xl p-6 relative overflow-hidden`}>
      {/* Animated background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-700/30 to-transparent rounded-full -mr-16 -mt-16 animate-pulse" />

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 bg-slate-800 rounded-lg flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${priorityTextColor[primaryAction.priority]}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-sm font-bold ${primaryAction.priority !== 'low' ? 'text-white' : 'text-emerald-300'}`}>
                {primaryAction.title}
              </h3>
              {primaryAction.metric !== null && (
                <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${priorityTextColor[primaryAction.priority]} bg-slate-800`}>
                  {primaryAction.metric}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300">{primaryAction.description}</p>
          </div>
        </div>

        <Link to={createPageUrl(primaryAction.link)}>
          <Button size="sm" className="w-full gap-2 mt-4 bg-slate-800 hover:bg-slate-700 text-slate-200">
            {primaryAction.action}
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>

        {/* Secondary actions preview */}
        {actions.length > 1 && (
          <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2">
            {actions.slice(1, 3).map((action, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-1 h-1 rounded-full bg-slate-600" />
                <span>{action.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}