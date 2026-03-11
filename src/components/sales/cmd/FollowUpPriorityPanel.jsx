import React from 'react';
import { AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FollowUpPriorityPanel({ deals = [] }) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const overdue = deals.filter(d => {
    if (!d.next_followup_date) return false;
    return new Date(d.next_followup_date) < today;
  });

  const dueToday = deals.filter(d => {
    if (!d.next_followup_date) return false;
    const followUpDate = new Date(d.next_followup_date);
    return followUpDate.getTime() === today.getTime();
  });

  const dueThisWeek = deals.filter(d => {
    if (!d.next_followup_date) return false;
    const followUpDate = new Date(d.next_followup_date);
    return followUpDate >= today && followUpDate <= weekFromNow && followUpDate.getTime() !== today.getTime();
  });

  const followUpGroups = [
    { title: 'Overdue', count: overdue.length, items: overdue, icon: AlertCircle, color: 'red' },
    { title: 'Due Today', count: dueToday.length, items: dueToday, icon: Clock, color: 'orange' },
    { title: 'Due This Week', count: dueThisWeek.length, items: dueThisWeek, icon: Clock, color: 'blue' },
  ];

  const totalNeedingAction = overdue.length + dueToday.length;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Follow-Ups Needing Attention</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {totalNeedingAction} action items
            </p>
          </div>
          {totalNeedingAction > 0 && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg px-2.5 py-1">
              <span className="text-xs font-bold text-red-400">{totalNeedingAction}</span>
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-slate-700">
        {followUpGroups.map((group, idx) => {
          const Icon = group.icon;
          const colorClass = {
            red: 'text-red-400 bg-red-900/20 border-red-800',
            orange: 'text-orange-400 bg-orange-900/20 border-orange-800',
            blue: 'text-blue-400 bg-blue-900/20 border-blue-800',
          }[group.color];

          return (
            <div key={idx}>
              {/* Group Header */}
              <div className={`px-4 py-3 border-l-4 ${colorClass.replace('border', 'border-l')} bg-slate-800/50`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${colorClass.split(' ')[0]}`} />
                  <span className="text-sm font-semibold text-white">{group.title}</span>
                  <span className={`text-xs font-bold ${colorClass.split(' ')[0]}`}>
                    {group.count}
                  </span>
                </div>

                {/* Items */}
                {group.items.length === 0 ? (
                  <p className="text-xs text-slate-500 ml-6">All clear</p>
                ) : (
                  <div className="ml-6 space-y-2">
                    {group.items.map(item => (
                      <div
                        key={item.id}
                        className="bg-slate-700/50 border border-slate-600 rounded-lg p-2.5 flex items-center justify-between group/item hover:bg-slate-700 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {item.company_name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {item.stage?.replace(/_/g, ' ')} • {item.contact_name || item.email}
                          </p>
                          <p className="text-xs text-amber-400 font-semibold mt-0.5">
                            ${(item.deal_value / 1000).toFixed(0)}k
                          </p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 text-slate-400 hover:text-slate-300"
                          >
                            Log
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-6 h-6 text-slate-500 hover:text-slate-300"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}