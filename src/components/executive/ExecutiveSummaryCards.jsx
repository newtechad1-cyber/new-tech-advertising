import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
export default function ExecutiveSummaryCards({ data }) {
  if (!data || !data.summary) return null;

  const { summary } = data;

  const cards = [
    {
      title: 'Active Clients',
      value: summary.active_clients || 0,
      icon: Users,
      link: '/admin/clients',
      trend: null,
      color: 'blue'
    },
    {
      title: 'Pipeline Value',
      value: `$${(summary.pipeline_value / 1000).toFixed(0)}k`,
      icon: DollarSign,
      link: '/admin/pipeline',
      trend: null,
      color: 'green'
    },
    {
      title: '90-Day Renewals',
      value: `$${(summary.renewal_revenue_90d / 1000).toFixed(0)}k`,
      icon: TrendingUp,
      link: '/admin/growth',
      trend: null,
      color: 'purple'
    },
    {
      title: 'Upsell Opportunities',
      value: summary.upsell_opportunities_count || 0,
      icon: CheckCircle2,
      link: '/admin/growth',
      subtitle: `$${(summary.upsell_value / 1000).toFixed(0)}k potential`,
      color: 'orange'
    },
    {
      title: 'At-Risk Accounts',
      value: summary.at_risk_accounts || 0,
      icon: AlertTriangle,
      link: '/admin/success',
      trend: 'alert',
      color: 'red'
    },
    {
      title: 'Critical SLA Breaches',
      value: summary.critical_sla_breaches || 0,
      icon: AlertTriangle,
      link: '/admin/operations',
      trend: summary.critical_sla_breaches > 0 ? 'alert' : 'ok',
      color: summary.critical_sla_breaches > 0 ? 'red' : 'green'
    },
    {
      title: 'Active Fulfillment',
      value: summary.active_fulfillment_workrooms || 0,
      icon: Clock,
      link: '/admin/fulfillment',
      subtitle: `${summary.active_onboarding_workrooms} onboarding`,
      color: 'blue'
    },
    {
      title: 'Reports Ready',
      value: summary.reports_ready || 0,
      icon: CheckCircle2,
      link: '/admin/results',
      subtitle: `${summary.reports_published} published`,
      color: 'teal'
    }
  ];

  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    orange: 'border-orange-200 bg-orange-50',
    red: 'border-red-200 bg-red-50',
    teal: 'border-teal-200 bg-teal-50'
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    teal: 'text-teal-600'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <a key={idx} href={createPageUrl(card.link)}>
            <Card className={`cursor-pointer hover:shadow-md transition-all border ${colorClasses[card.color]} h-full`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    {card.subtitle && (
                      <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                    )}
                  </div>
                  <Icon className={`w-5 h-5 ${iconColorClasses[card.color]}`} />
                </div>
              </CardContent>
            </Card>
          </a>
        );
      })}
    </div>
  );
}