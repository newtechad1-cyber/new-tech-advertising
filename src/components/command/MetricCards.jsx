import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, TrendingDown, Users, Rocket, DollarSign, MousePointerClick, UserCheck } from 'lucide-react';

function MetricCard({ label, value, icon: Icon, iconColor, trend, trendLabel, loading }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-slate-700`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend !== null && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trendLabel}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">
        {loading ? <span className="text-slate-500 text-xl animate-pulse">...</span> : value}
      </p>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  );
}

export default function MetricCards() {
  const { data: leads = [], isLoading: l1 } = useQuery({
    queryKey: ['cc-leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 500)
  });
  const { data: trials = [], isLoading: l2 } = useQuery({
    queryKey: ['cc-trials'],
    queryFn: () => base44.entities.TrialAccount.list('-created_date', 200)
  });
  const { data: proposals = [], isLoading: l3 } = useQuery({
    queryKey: ['cc-proposals'],
    queryFn: () => base44.entities.Proposal.list('-created_date', 200)
  });

  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now - 60 * 24 * 60 * 60 * 1000);

  const recentLeads = leads.filter(l => new Date(l.created_date) > thirtyDaysAgo).length;
  const prevLeads = leads.filter(l => new Date(l.created_date) > sixtyDaysAgo && new Date(l.created_date) <= thirtyDaysAgo).length;
  const leadTrend = prevLeads > 0 ? Math.round(((recentLeads - prevLeads) / prevLeads) * 100) : 0;

  const recentTrials = trials.filter(t => new Date(t.created_date) > thirtyDaysAgo).length;
  const converted = leads.filter(l => l.status === 'won').length;

  const pipelineValue = proposals
    .filter(p => ['sent', 'viewed'].includes(p.status))
    .reduce((sum, p) => sum + (p.one_time_fee || 0) + ((p.monthly_fee || 0) * 12), 0);

  const loading = l1 || l2 || l3;

  const metrics = [
    {
      label: 'Total Leads (All Time)',
      value: leads.length,
      icon: Users,
      iconColor: 'text-blue-400',
      trend: leadTrend,
      trendLabel: `${Math.abs(leadTrend)}% vs last 30d`
    },
    {
      label: 'New Leads (30 Days)',
      value: recentLeads,
      icon: MousePointerClick,
      iconColor: 'text-violet-400',
      trend: leadTrend,
      trendLabel: leadTrend >= 0 ? 'Growing' : 'Declining'
    },
    {
      label: 'Free Trials Started',
      value: recentTrials,
      icon: Rocket,
      iconColor: 'text-emerald-400',
      trend: recentTrials > 0 ? 1 : -1,
      trendLabel: `${recentTrials} this month`
    },
    {
      label: 'Clients Converted',
      value: converted,
      icon: UserCheck,
      iconColor: 'text-teal-400',
      trend: converted > 0 ? 1 : 0,
      trendLabel: `${leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0}% close rate`
    },
    {
      label: 'Revenue Pipeline',
      value: pipelineValue > 0 ? `$${pipelineValue.toLocaleString()}` : '$0',
      icon: DollarSign,
      iconColor: 'text-yellow-400',
      trend: pipelineValue > 0 ? 1 : 0,
      trendLabel: `${proposals.filter(p => ['sent','viewed'].includes(p.status)).length} open proposals`
    },
  ];

  return (
    <div>
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Platform Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map(m => (
          <MetricCard key={m.label} {...m} loading={loading} />
        ))}
      </div>
    </div>
  );
}