import React from 'react';
import { Plus, FileText, Link2, MessageSquare, Zap, Phone } from 'lucide-react';

export default function QuickActionToolbar() {
  const actions = [
    {
      icon: Plus,
      label: 'Add New Opportunity',
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Create new lead'
    },
    {
      icon: MessageSquare,
      label: 'Send Strategy Invite',
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Schedule call'
    },
    {
      icon: Link2,
      label: 'Launch Deal Room',
      color: 'bg-orange-600 hover:bg-orange-700',
      description: 'Send custom link'
    },
    {
      icon: Phone,
      label: 'Log Call Notes',
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Update pipeline'
    },
    {
      icon: Zap,
      label: 'Activate New Client',
      color: 'bg-emerald-600 hover:bg-emerald-700',
      description: 'Start onboarding'
    }
  ];

  return (
    <div className="sticky bottom-6 right-6 flex gap-3 flex-wrap justify-end">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <button
            key={idx}
            className={`${action.color} text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110`}
            title={action.label}
          >
            <Icon className="w-6 h-6" />
          </button>
        );
      })}
    </div>
  );
}