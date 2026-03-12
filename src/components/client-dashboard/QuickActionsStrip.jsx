import React from 'react';
import { Plus, Zap, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActionsStrip() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Request New Content',
      icon: <Plus className="w-4 h-4" />,
      action: () => navigate('/client/campaigns'),
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      label: 'Connect Channels',
      icon: <Zap className="w-4 h-4" />,
      action: () => navigate('/client/channels'),
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'Book Strategy Session',
      icon: <Calendar className="w-4 h-4" />,
      action: () => window.open('https://calendly.com', '_blank'),
      color: 'bg-slate-600 hover:bg-slate-700',
    },
    {
      label: 'Upgrade Plan',
      icon: <TrendingUp className="w-4 h-4" />,
      action: () => navigate('/pricing'),
      color: 'bg-green-600 hover:bg-green-700',
    },
  ];

  return (
    <div>
      <p className="text-sm text-slate-600 mb-4 font-medium uppercase tracking-wide">Quick Actions</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.action}
            className={`${action.color} text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors`}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}