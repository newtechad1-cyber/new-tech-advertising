import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ChannelPills from './ChannelPills';

export default function WeeklyTimeline({ events = [] }) {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (date) => {
    return events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate();
    });
  };

  const isToday = (date) => new Date().toDateString() === date.toDateString();

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <p className="text-slate-500 font-medium">No content scheduled this week</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-bold text-slate-900">This Week at a Glance</h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full inline-flex">
          {days.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const today_flag = isToday(day);

            return (
              <div
                key={idx}
                className={`flex-1 min-w-[140px] border-r border-slate-100 p-4 ${
                  today_flag ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="mb-3">
                  <p className={`text-xs font-semibold ${today_flag ? 'text-blue-700' : 'text-slate-600'}`}>
                    {dayNames[idx]}
                  </p>
                  <p className="text-lg font-bold text-slate-900">{day.getDate()}</p>
                  {today_flag && (
                    <span className="text-xs text-blue-600 font-semibold">Today</span>
                  )}
                </div>

                {dayEvents.length === 0 ? (
                  <p className="text-xs text-slate-400">—</p>
                ) : (
                  <div className="space-y-2">
                    {dayEvents.map((event, i) => (
                      <div key={i} className="bg-slate-50 rounded-lg p-2 border border-slate-200">
                        <p className="text-xs font-semibold text-slate-700 line-clamp-1 mb-1.5">
                          {event.title}
                        </p>
                        <ChannelPills platforms={event.platforms} size="sm" />
                        <p className={`text-xs mt-1.5 font-medium ${
                          event.status === 'published' ? 'text-emerald-600' :
                          event.status === 'approval' ? 'text-amber-600' :
                          event.status === 'scheduled' ? 'text-blue-600' :
                          'text-slate-500'
                        }`}>
                          {event.status === 'published' ? '✓ Published' :
                           event.status === 'approval' ? '⏳ Review' :
                           event.status === 'scheduled' ? '📅 Scheduled' :
                           '✏️ Draft'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}