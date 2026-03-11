import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { FileText, Send, AlertTriangle, Users, Clock } from 'lucide-react';

export default function ReportingKPIStrip() {
  const { data: reports = [] } = useQuery({
    queryKey: ['reporting-kpi-reports'],
    queryFn: () => base44.entities.ClientPerformanceReport?.list?.('-generated_at', 500).catch(() => []),
  });

  const { data: deliveries = [] } = useQuery({
    queryKey: ['reporting-kpi-deliveries'],
    queryFn: () => base44.entities.ReportDeliveryLog?.list?.('-sent_at', 500).catch(() => []),
  });

  const { data: schedules = [] } = useQuery({
    queryKey: ['reporting-kpi-schedules'],
    queryFn: () => base44.entities.ReportingSchedule?.list?.('-updated_date', 500).catch(() => []),
  });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const generatedThisMonth = reports.filter(r => {
    const date = new Date(r.generated_at || 0);
    return date >= monthStart;
  }).length;

  const sent = deliveries.filter(d => d.delivery_status === 'sent').length;
  const failed = deliveries.filter(d => d.delivery_status === 'failed').length;
  const upcoming = schedules.filter(s => s.next_generation && new Date(s.next_generation) > now).length;

  const kpis = [
    {
      label: 'Generated (MTD)',
      value: generatedThisMonth,
      icon: FileText,
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
    },
    {
      label: 'Sent',
      value: sent,
      icon: Send,
      color: 'text-emerald-400',
      bg: 'bg-emerald-900/20',
    },
    {
      label: 'Failed Deliveries',
      value: failed,
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-900/20',
    },
    {
      label: 'Upcoming Reports',
      value: upcoming,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div key={idx} className={`${kpi.bg} border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all`}>
            <Icon className={`w-5 h-5 ${kpi.color} mb-2`} />
            <p className="text-xs text-slate-400 mb-1">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        );
      })}
    </div>
  );
}