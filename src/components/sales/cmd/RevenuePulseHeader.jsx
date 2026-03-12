import React from 'react';
import { TrendingUp, Target, Zap, DollarSign } from 'lucide-react';

export default function RevenuePulseHeader() {
  const metrics = [
    {
      icon: DollarSign,
      label: 'Deals Closing This Month',
      value: '7',
      subtext: '$17,500 MRR',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Target,
      label: 'New Opportunities This Week',
      value: '12',
      subtext: 'Qualified leads',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: TrendingUp,
      label: 'Demo → Deal Conversion',
      value: '78%',
      subtext: '↑ 4% from last month',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Zap,
      label: 'Projected New MRR',
      value: '$34,500',
      subtext: 'Through end of month',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div
            key={idx}
            className={`${metric.bgColor} p-6 rounded-lg border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">{metric.label}</h3>
              <Icon className={`${metric.color} w-5 h-5`} />
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{metric.value}</p>
            <p className="text-xs text-slate-600">{metric.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}