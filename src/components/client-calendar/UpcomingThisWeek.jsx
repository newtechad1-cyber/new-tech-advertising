import React from 'react';
import { Calendar } from 'lucide-react';
import CalendarEventCard from './CalendarEventCard';

export default function UpcomingThisWeek({ events = [] }) {
  const now = new Date();
  const weekStart = new Date(now);
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const upcomingWeek = events
    .filter(e => {
      const eventDate = new Date(e.date);
      return eventDate >= now && eventDate <= weekEnd;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  if (upcomingWeek.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">Nothing scheduled this week</p>
        <p className="text-slate-400 text-sm mt-1">Your team will notify you when content is scheduled.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Coming Up This Week
        </h2>
      </div>
      <div className="divide-y divide-slate-100">
        {upcomingWeek.map((event, idx) => (
          <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
            <CalendarEventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}