import React from 'react';
import CalendarStatusBadge from './CalendarStatusBadge';
import ChannelPills from './ChannelPills';

export default function CalendarEventCard({ event, compact = false }) {
  const platforms = Array.isArray(event.platforms) ? event.platforms : [event.platforms].filter(Boolean);

  return (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        {event.thumbnail && !compact && (
          <img 
            src={event.thumbnail} 
            alt={event.title} 
            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">{event.title}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <CalendarStatusBadge status={event.status} />
            <span className="text-xs text-slate-500">
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {!compact && event.description && (
            <p className="text-xs text-slate-600 line-clamp-2 mb-2">{event.description}</p>
          )}

          {platforms.length > 0 && (
            <ChannelPills platforms={platforms} size="sm" />
          )}
        </div>
      </div>
    </div>
  );
}