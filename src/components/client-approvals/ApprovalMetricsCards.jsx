import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, TrendingUp, Zap } from 'lucide-react';

export default function ApprovalMetricsCards({ awaitingCount, scheduledCount, publishedCount }) {
  const metrics = [
    {
      label: 'Awaiting Your Approval',
      value: awaitingCount,
      icon: CheckCircle2,
      color: 'bg-blue-50 text-blue-600',
      accent: 'text-blue-600'
    },
    {
      label: 'Scheduled Posts',
      value: scheduledCount,
      icon: Clock,
      color: 'bg-purple-50 text-purple-600',
      accent: 'text-purple-600'
    },
    {
      label: 'Recently Published',
      value: publishedCount,
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
      accent: 'text-green-600'
    },
    {
      label: 'Active Campaigns',
      value: '2',
      icon: Zap,
      color: 'bg-amber-50 text-amber-600',
      accent: 'text-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                    {metric.label}
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${metric.accent}`}>
                    {metric.value}
                  </p>
                </div>
                <div className={`${metric.color} p-3 rounded-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}