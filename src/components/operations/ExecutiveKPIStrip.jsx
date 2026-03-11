import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Users, DollarSign, Video, AlertCircle } from 'lucide-react';

export default function ExecutiveKPIStrip() {
  const { data: deals = [] } = useQuery({
    queryKey: ['executive-deals'],
    queryFn: () => base44.entities.SalesDeals?.list?.('-created_date', 500).catch(() => []),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['executive-clients'],
    queryFn: () => base44.entities.ClientCompanies?.list?.('-created_date', 500).catch(() => []),
  });

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Calculate KPIs
  const pipelineValue = deals
    .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((sum, d) => sum + (d.deal_value || 0), 0);

  const revenueWonThisMonth = deals
    .filter(d => d.stage === 'closed_won' && d.created_date)
    .filter(d => {
      const dateObj = new Date(d.created_date);
      return dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear;
    })
    .reduce((sum, d) => sum + (d.deal_value || 0), 0);

  const closingSoon = deals.filter(d => {
    if (!d.closing_date || d.stage === 'closed_lost' || d.stage === 'closed_won') return false;
    const closeDate = new Date(d.closing_date);
    return closeDate >= now && closeDate <= new Date(currentYear, currentMonth + 1, 0);
  }).length;

  const kpis = [
    {
      label: 'Pipeline Value',
      value: `$${(pipelineValue / 1000000).toFixed(1)}M`,
      change: '+12%',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-900/20',
    },
    {
      label: 'Revenue Won (MTD)',
      value: `$${(revenueWonThisMonth / 1000).toFixed(0)}k`,
      change: '+8%',
      icon: DollarSign,
      color: 'text-amber-400',
      bg: 'bg-amber-900/20',
    },
    {
      label: 'Active Clients',
      value: clients.length,
      change: `+${Math.floor(clients.length * 0.1)}`,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
    },
    {
      label: 'Closing Soon',
      value: closingSoon,
      change: 'This month',
      icon: AlertCircle,
      color: 'text-violet-400',
      bg: 'bg-violet-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div key={idx} className={`${kpi.bg} border border-slate-700 rounded-xl p-4`}>
            <div className="flex items-start justify-between mb-2">
              <Icon className={`w-5 h-5 ${kpi.color}`} />
              <span className="text-xs font-semibold text-slate-400">{kpi.change}</span>
            </div>
            <p className="text-xs text-slate-400 mb-1">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        );
      })}
    </div>
  );
}