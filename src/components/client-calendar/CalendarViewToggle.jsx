import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, List } from 'lucide-react';

export default function CalendarViewToggle({ currentView, onViewChange }) {
  const views = [
    { id: 'month', label: 'Month', icon: Calendar },
    { id: 'week', label: 'Week', icon: Clock },
    { id: 'agenda', label: 'Agenda', icon: List },
  ];

  return (
    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 w-fit">
      {views.map(view => {
        const Icon = view.icon;
        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              currentView === view.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{view.label}</span>
          </button>
        );
      })}
    </div>
  );
}