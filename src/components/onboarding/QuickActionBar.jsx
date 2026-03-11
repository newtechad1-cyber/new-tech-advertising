import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Link2, Zap, Key, Calendar, CheckCircle } from 'lucide-react';

export default function QuickActionBar() {
  const actions = [
    { label: 'Send Assets Request', icon: Mail, color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Connect Channels', icon: Link2, color: 'bg-violet-600 hover:bg-violet-700' },
    { label: 'Generate Content', icon: Zap, color: 'bg-orange-600 hover:bg-orange-700' },
    { label: 'Activate Portal', icon: Key, color: 'bg-cyan-600 hover:bg-cyan-700' },
    { label: 'Schedule Launch', icon: Calendar, color: 'bg-amber-600 hover:bg-amber-700' },
    { label: 'Mark Live', icon: CheckCircle, color: 'bg-emerald-600 hover:bg-emerald-700' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <p className="text-xs font-semibold text-slate-400 mb-3 uppercase">Quick Actions</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Button
              key={idx}
              size="sm"
              className={`${action.color} text-white gap-1.5 flex flex-col items-center justify-center h-auto py-2`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}