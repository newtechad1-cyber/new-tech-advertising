import React from 'react';
import { Star, TrendingUp, Zap, Award } from 'lucide-react';

const WIN_TYPES = {
  visibility: { icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600', label: 'Visibility Win' },
  campaign: { icon: Zap, color: 'bg-blue-100 text-blue-600', label: 'Campaign Launch' },
  content: { icon: Star, color: 'bg-amber-100 text-amber-600', label: 'Content Achievement' },
  milestone: { icon: Award, color: 'bg-violet-100 text-violet-600', label: 'Milestone' },
};

function WinCard({ type, title, description }) {
  const config = WIN_TYPES[type] || WIN_TYPES.campaign;
  const Icon = config.icon;

  return (
    <div className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
      <div className={`inline-flex p-2 rounded-lg mb-3 ${config.color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xs font-semibold text-slate-500 mb-1">{config.label}</p>
      <h3 className="font-semibold text-slate-900 text-sm mb-1">{title}</h3>
      <p className="text-xs text-slate-600">{description}</p>
    </div>
  );
}

export default function RecentWinsPanel({ wins = [] }) {
  // Default wins if none provided
  const defaultWins = [
    {
      type: 'visibility',
      title: 'Brand Growing',
      description: 'Your business appeared in local search results this month',
    },
    {
      type: 'content',
      title: 'Video Posted',
      description: 'New promotional video distributed across channels',
    },
    {
      type: 'campaign',
      title: 'Campaign Ready',
      description: 'Seasonal promotion prepared and scheduled',
    },
    {
      type: 'milestone',
      title: 'Content Consistency',
      description: 'Maintaining regular publishing schedule',
    },
  ];

  const displayWins = wins.length > 0 ? wins : defaultWins;
  const recentWins = displayWins.slice(0, 4);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          Recent Wins
        </h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recentWins.map((win, idx) => (
          <WinCard
            key={idx}
            type={win.type}
            title={win.title}
            description={win.description}
          />
        ))}
      </div>
    </div>
  );
}