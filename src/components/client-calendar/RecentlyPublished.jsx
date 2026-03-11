import React from 'react';
import { TrendingUp, ExternalLink } from 'lucide-react';
import CalendarEventCard from './CalendarEventCard';

export default function RecentlyPublished({ events = [] }) {
  const publishedEvents = events
    .filter(e => e.status === 'published')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  if (publishedEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">No published content yet</p>
        <p className="text-slate-400 text-sm mt-1">Your published content will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Recently Published
        </h2>
      </div>
      <div className="divide-y divide-slate-100">
        {publishedEvents.map((event, idx) => (
          <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
            <CalendarEventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}