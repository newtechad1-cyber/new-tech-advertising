import React from 'react';
import { TrendingUp, Activity, Zap } from 'lucide-react';

export default function HeroSummary() {
  const kpis = [
    {
      icon: TrendingUp,
      label: 'Visibility Trend',
      value: '+24%',
      description: 'More customers are seeing your business online.',
      color: 'bg-green-50 border-green-200'
    },
    {
      icon: Activity,
      label: 'Engagement Activity',
      value: '+18%',
      description: 'Customers interacting with your content more.',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: Zap,
      label: 'Content Output',
      value: 'Active',
      description: 'Marketing system running at full capacity.',
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="mb-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Your Marketing Visibility Is Growing
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Here's what your marketing efforts are delivering this month.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`border rounded-lg p-6 ${kpi.color}`}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900">{kpi.label}</h3>
                <Icon className="w-5 h-5 text-slate-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{kpi.value}</div>
              <p className="text-sm text-slate-700">{kpi.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}