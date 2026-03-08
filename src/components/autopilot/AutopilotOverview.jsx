import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AutopilotOverview() {
  const { data: jobs = [] } = useQuery({
    queryKey: ['autopilot-jobs'],
    queryFn: () => base44.entities.AutopilotJobs.list()
  });

  const stats = [
    {
      label: 'Total Jobs',
      value: jobs.length,
      icon: Zap,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Active & Enabled',
      value: jobs.filter(j => j.enabled && j.status !== 'failed').length,
      icon: Clock,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Completed Runs',
      value: jobs.filter(j => j.status === 'completed').length,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Failed Jobs',
      value: jobs.filter(j => j.status === 'failed').length,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}