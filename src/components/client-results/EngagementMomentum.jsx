import React from 'react';
import { MessageCircle, Heart, Share2, Clock } from 'lucide-react';

const momentumCards = [
  {
    icon: Heart,
    label: 'Likes & Reactions',
    value: '+42',
    interpretation: 'Customers are loving your content more.',
    trend: 'up'
  },
  {
    icon: MessageCircle,
    label: 'Comments & DMs',
    value: '+28',
    interpretation: 'More customers are reaching out directly.',
    trend: 'up'
  },
  {
    icon: Share2,
    label: 'Shares & Saves',
    value: '+15',
    interpretation: 'People are sharing your posts with others.',
    trend: 'up'
  },
  {
    icon: Clock,
    label: 'Profile Visits',
    value: '+67',
    interpretation: 'Customers checking out your full profile.',
    trend: 'up'
  }
];

export default function EngagementMomentum() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Engagement Momentum</h2>
      <p className="text-slate-600 mb-6">
        Customers are interacting with your posts more frequently.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {momentumCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <Icon className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-green-600">+18%</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{card.label}</h3>
              <div className="text-3xl font-bold text-slate-900 mb-2">{card.value}</div>
              <p className="text-sm text-slate-700">{card.interpretation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}