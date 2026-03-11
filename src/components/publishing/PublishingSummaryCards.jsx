import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Clock, Play, AlertCircle, TrendingUp, Eye } from 'lucide-react';

const SUMMARY_CARDS = [
  {
    id: 'awaiting_review',
    title: 'Awaiting Review',
    icon: Eye,
    color: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    count: 0,
  },
  {
    id: 'approved',
    title: 'Approved & Ready',
    icon: CheckCircle2,
    color: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    count: 0,
  },
  {
    id: 'scheduled',
    title: 'Scheduled',
    icon: Clock,
    color: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    count: 0,
  },
  {
    id: 'publishing',
    title: 'Publishing Now',
    icon: Play,
    color: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    count: 0,
  },
  {
    id: 'published',
    title: 'Published Today',
    icon: TrendingUp,
    color: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    count: 0,
  },
  {
    id: 'failed',
    title: 'Failed / Blocked',
    icon: AlertCircle,
    color: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    count: 0,
  },
];

export default function PublishingSummaryCards({ stats, onCardClick, selectedCard }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 px-6 py-4 border-b bg-white">
      {SUMMARY_CARDS.map(card => {
        const Icon = card.icon;
        const stat = stats[card.id] || 0;
        const isSelected = selectedCard === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onCardClick(card.id)}
            className={`transition-all ${
              isSelected 
                ? `${card.color} ${card.border} ring-2 ring-offset-1` 
                : 'hover:bg-gray-50'
            } border rounded-lg p-4 text-left`}
          >
            <div className="flex items-start justify-between mb-2">
              <Icon className={`w-5 h-5 ${card.text}`} />
            </div>
            <div className={`text-2xl font-bold ${card.text}`}>{stat}</div>
            <div className="text-xs text-gray-600 mt-1">{card.title}</div>
          </button>
        );
      })}
    </div>
  );
}