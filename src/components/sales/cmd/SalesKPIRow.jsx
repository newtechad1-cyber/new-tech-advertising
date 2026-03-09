import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, CalendarCheck, Briefcase, Trophy, DollarSign, TrendingUp, ArrowRight, UserPlus } from 'lucide-react';

function KPI({ icon: Icon, label, value, sub, color = 'text-white', border = 'border-gray-700' }) {
  return (
    <div className={`bg-gray-900 rounded-xl border ${border} p-4`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-4 h-4 text-gray-500" />
        {sub && <span className="text-xs text-gray-600">{sub}</span>}
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

export default function SalesKPIRow() {
  const { data: leads = [] } = useQuery({ queryKey: ['sc-leads'], queryFn: () => base44.entities.SalesLeads.list('-created_date', 500) });
  const { data: deals = [] } = useQuery({ queryKey: ['sc-deals'], queryFn: () => base44.entities.SalesDeals.list('-created_date', 500) });
  const { data: subs = [] } = useQuery({ queryKey: ['sc-subs'], queryFn: () => base44.entities.ClientSubscriptions.filter({ status: 'active' }) });
  const { data: activities = [] } = useQuery({ queryKey: ['sc-activities'], queryFn: () => base44.entities.SalesActivities.list('-created_date', 200) });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const leadsToday = leads.filter(l => new Date(l.created_date) >= todayStart).length;
  const leadsWeek = leads.filter(l => new Date(l.created_date) >= weekAgo).length;
  const demosScheduled = activities.filter(a => a.activity_type === 'demo' && a.date >= todayStart.toISOString().slice(0, 10)).length;
  const openDeals = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage));
  const pipelineValue = openDeals.reduce((s, d) => s + (d.deal_value || 0), 0);
  const closedWonMonth = deals.filter(d => d.stage === 'closed_won' && new Date(d.updated_date) >= startOfMonth).length;
  const newMRRMonth = subs.filter(s => new Date(s.created_date) >= startOfMonth).reduce((s, sub) => s + (sub.monthly_amount || 0), 0);
  const avgDealValue = openDeals.length > 0 ? Math.round(pipelineValue / openDeals.length) : 0;
  const converted = leads.filter(l => l.status === 'converted').length;
  const convRate = leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
      <KPI icon={UserPlus} label="Leads Today" value={leadsToday} color={leadsToday > 0 ? 'text-green-400' : 'text-gray-400'} border={leadsToday > 0 ? 'border-green-900' : 'border-gray-700'} />
      <KPI icon={Users} label="Leads This Week" value={leadsWeek} sub="7d" color="text-blue-400" />
      <KPI icon={CalendarCheck} label="Demos Scheduled" value={demosScheduled} color={demosScheduled > 0 ? 'text-purple-400' : 'text-gray-400'} />
      <KPI icon={Briefcase} label="Deals in Pipeline" value={openDeals.length} sub={`$${Math.round(pipelineValue / 1000)}k`} color="text-orange-400" />
      <KPI icon={Trophy} label="Closed Won MTD" value={closedWonMonth} color={closedWonMonth > 0 ? 'text-green-400' : 'text-gray-400'} border={closedWonMonth > 0 ? 'border-green-900' : 'border-gray-700'} />
      <KPI icon={DollarSign} label="New MRR MTD" value={`$${newMRRMonth.toLocaleString()}`} color="text-green-400" />
      <KPI icon={TrendingUp} label="Avg Deal Value" value={`$${avgDealValue.toLocaleString()}`} color="text-yellow-400" />
      <KPI icon={ArrowRight} label="Lead→Client Rate" value={`${convRate}%`} sub={`${converted}/${leads.length}`} color={convRate >= 20 ? 'text-green-400' : convRate > 0 ? 'text-yellow-400' : 'text-gray-400'} />
    </div>
  );
}