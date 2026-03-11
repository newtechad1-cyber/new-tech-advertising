import React from 'react';
import { DollarSign, TrendingUp, Target, Zap, Percent, Calendar } from 'lucide-react';

const KPI_CONFIG = [
  {
    id: 'pipeline_value',
    label: 'Pipeline Value',
    icon: DollarSign,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/30',
    borderColor: 'border-emerald-800',
  },
  {
    id: 'deals_closing',
    label: 'Deals Closing This Month',
    icon: Calendar,
    color: 'text-violet-400',
    bgColor: 'bg-violet-900/30',
    borderColor: 'border-violet-800',
  },
  {
    id: 'followups_due',
    label: 'Follow-Ups Due Today',
    icon: Zap,
    color: 'text-orange-400',
    bgColor: 'bg-orange-900/30',
    borderColor: 'border-orange-800',
  },
  {
    id: 'new_leads',
    label: 'New Leads',
    icon: TrendingUp,
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/30',
    borderColor: 'border-blue-800',
  },
  {
    id: 'win_rate',
    label: 'Win Rate',
    icon: Percent,
    color: 'text-green-400',
    bgColor: 'bg-green-900/30',
    borderColor: 'border-green-800',
  },
  {
    id: 'revenue_won',
    label: 'Revenue Won This Month',
    icon: Target,
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/30',
    borderColor: 'border-amber-800',
  },
];

export default function SalesKPICards({ data = {}, onCardClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
      {KPI_CONFIG.map(config => {
        const Icon = config.icon;
        const value = data[config.id];

        return (
          <button
            key={config.id}
            onClick={() => onCardClick?.(config.id)}
            className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 hover:border-current transition-colors text-left group`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${config.color} mb-0.5`}>
              {typeof value === 'number' && config.id.includes('value')
                ? `$${(value / 1000).toFixed(0)}k`
                : typeof value === 'number' && config.id.includes('rate')
                  ? `${value}%`
                  : value || '—'}
            </p>
            <p className="text-xs text-slate-400 font-medium">{config.label}</p>
          </button>
        );
      })}
    </div>
  );
}