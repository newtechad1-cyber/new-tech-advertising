import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, Clock, Link2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OperationalRisksPanel() {
  const { data: deals = [] } = useQuery({
    queryKey: ['risk-deals'],
    queryFn: () => base44.entities.SalesDeals?.list?.('-created_date', 500).catch(() => []),
  });

  const { data: connections = [] } = useQuery({
    queryKey: ['risk-connections'],
    queryFn: () => base44.entities.VideoDistributionConnection?.list?.('-updated_date', 100).catch(() => []),
  });

  const now = new Date();

  // Identify risks
  const risks = [];

  // Overdue follow-ups
  const overdueFollowups = deals.filter(d =>
    d.next_followup_date && new Date(d.next_followup_date) < now && !['closed_won', 'closed_lost'].includes(d.stage)
  ).length;

  if (overdueFollowups > 0) {
    risks.push({
      severity: 'high',
      title: 'Overdue Follow-Ups',
      description: `${overdueFollowups} deals need follow-up`,
      icon: Clock,
      action: 'Review Now',
    });
  }

  // Blocked connections
  const blockedConnections = connections.filter(c => c.connection_status === 'token_expired').length;
  if (blockedConnections > 0) {
    risks.push({
      severity: 'critical',
      title: 'Token Expired',
      description: `${blockedConnections} channel connections need refresh`,
      icon: Link2,
      action: 'Reconnect',
    });
  }

  // Stalled deals
  const stalledDeals = deals.filter(d =>
    d.stage === 'negotiation' && d.last_activity_date &&
    new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) > new Date(d.last_activity_date) &&
    (d.deal_value || 0) > 5000
  ).length;

  if (stalledDeals > 0) {
    risks.push({
      severity: 'high',
      title: 'Stalled High-Value Deals',
      description: `${stalledDeals} large deals inactive for 7+ days`,
      icon: Zap,
      action: 'Address',
    });
  }

  const severityColors = {
    critical: 'border-red-700 bg-red-900/20',
    high: 'border-orange-700 bg-orange-900/20',
    medium: 'border-yellow-700 bg-yellow-900/20',
  };

  const severityIconColors = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        Operational Risks
      </h3>

      {risks.length > 0 ? (
        <div className="space-y-3">
          {risks.map((risk, idx) => {
            const Icon = risk.icon;
            return (
              <div key={idx} className={`${severityColors[risk.severity]} border rounded-lg p-4`}>
                <div className="flex items-start gap-3 mb-2">
                  <Icon className={`w-4 h-4 ${severityIconColors[risk.severity]} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${severityIconColors[risk.severity]}`}>
                      {risk.title}
                    </p>
                    <p className="text-xs text-slate-300 mt-1">{risk.description}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="w-full text-xs h-7 mt-2">
                  {risk.action}
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500">
          <p className="text-sm">All systems operational</p>
        </div>
      )}
    </div>
  );
}