import React from 'react';
import { Card } from '@/components/ui/card';
import { Film, Clock, CheckCircle2, AlertTriangle, Zap, Globe, BarChart3 } from 'lucide-react';

const METRIC_CARDS = [
  {
    key: 'total',
    label: 'Total Videos',
    icon: Film,
    color: 'bg-slate-100 text-slate-700',
    bgColor: 'bg-slate-50',
  },
  {
    key: 'awaitingReview',
    label: 'Awaiting Review',
    icon: Clock,
    color: 'bg-amber-100 text-amber-700',
    bgColor: 'bg-amber-50',
    filter: { review_status: 'pending_review' },
  },
  {
    key: 'readyToPublish',
    label: 'Ready to Publish',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-700',
    bgColor: 'bg-green-50',
    filter: { approval: 'approved' },
  },
  {
    key: 'scheduled',
    label: 'Scheduled',
    icon: Calendar,
    color: 'bg-blue-100 text-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    key: 'publishing',
    label: 'Publishing Now',
    icon: Zap,
    color: 'bg-purple-100 text-purple-700',
    bgColor: 'bg-purple-50',
  },
  {
    key: 'published',
    label: 'Published',
    icon: Globe,
    color: 'bg-emerald-100 text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  {
    key: 'failed',
    label: 'Failed / Blocked',
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-700',
    bgColor: 'bg-red-50',
    filter: { renderStatus: 'failed' },
  },
];

export default function SummaryMetricsCards({ metrics, filters, onFilterChange }) {
  const handleCardClick = (card) => {
    if (card.filter) {
      onFilterChange({ ...filters, ...card.filter });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
      {METRIC_CARDS.map(card => {
        const Icon = card.icon;
        const value = metrics[card.key] || 0;
        const isActive = Object.entries(card.filter || {}).some(([k, v]) => filters[k] === v);
        
        return (
          <Card
            key={card.key}
            className={`cursor-pointer transition-all p-4 ${
              isActive ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
            } ${card.bgColor}`}
            onClick={() => handleCardClick(card)}
          >
            <div className="space-y-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-600 font-medium">{card.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}