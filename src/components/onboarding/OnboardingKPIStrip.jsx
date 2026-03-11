import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, Clock, CheckCircle, AlertTriangle, TrendingUp, Zap } from 'lucide-react';

export default function OnboardingKPIStrip() {
  const { data: clients = [] } = useQuery({
    queryKey: ['onboarding-clients'],
    queryFn: () => base44.entities.ClientCompanies?.list?.('-created_date', 500).catch(() => []),
  });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Calculate KPIs
  const newThisMonth = clients.filter(c => {
    const created = new Date(c.created_date || 0);
    return created >= monthStart;
  }).length;

  const inOnboarding = clients.filter(c => 
    c.onboarding_status && ['started', 'in_progress'].includes(c.onboarding_status)
  ).length;

  const readyToLaunch = clients.filter(c => 
    c.onboarding_status === 'ready_to_launch'
  ).length;

  const fullyLive = clients.filter(c => 
    c.onboarding_status === 'live'
  ).length;

  const withDelays = clients.filter(c => {
    if (!c.onboarding_started_date) return false;
    const daysInOnboarding = Math.floor((now - new Date(c.onboarding_started_date)) / (1000 * 60 * 60 * 24));
    return daysInOnboarding > 14;
  }).length;

  const avgActivationTime = clients.filter(c => 
    c.onboarding_completed_date && c.onboarding_started_date
  ).reduce((sum, c) => {
    const days = Math.floor((new Date(c.onboarding_completed_date) - new Date(c.onboarding_started_date)) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0) / Math.max(fullyLive, 1);

  const kpis = [
    {
      label: 'New Clients (MTD)',
      value: newThisMonth,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
    },
    {
      label: 'In Onboarding',
      value: inOnboarding,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-900/20',
    },
    {
      label: 'Ready to Launch',
      value: readyToLaunch,
      icon: Zap,
      color: 'text-violet-400',
      bg: 'bg-violet-900/20',
    },
    {
      label: 'Fully Live',
      value: fullyLive,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-900/20',
    },
    {
      label: 'Onboarding Delays',
      value: withDelays,
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-900/20',
    },
    {
      label: 'Avg Activation Time',
      value: `${Math.round(avgActivationTime)}d`,
      icon: TrendingUp,
      color: 'text-slate-400',
      bg: 'bg-slate-800/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div key={idx} className={`${kpi.bg} border border-slate-700 rounded-lg p-3 hover:border-slate-600 transition-all cursor-pointer`}>
            <Icon className={`w-4 h-4 ${kpi.color} mb-2`} />
            <p className="text-xs text-slate-400 mb-1">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        );
      })}
    </div>
  );
}