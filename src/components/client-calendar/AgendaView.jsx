import React, { useState } from 'react';
import CalendarEventCard from './CalendarEventCard';
import CalendarEventDetail from './CalendarEventDetail';

export default function AgendaView({ events = [] }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  const now = new Date();

  const upcomingEvents = sortedEvents.filter(e => new Date(e.date) >= now);
  const pastEvents = sortedEvents.filter(e => new Date(e.date) < now);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Upcoming Section */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Upcoming</h2>
        {upcomingEvents.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <p className="text-slate-500">No upcoming content scheduled.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingEvents.map((event, idx) => (
              <div key={idx}>
                {(idx === 0 || formatDate(event.date) !== formatDate(upcomingEvents[idx - 1].date)) && (
                  <h3 className="text-sm font-semibold text-slate-600 mt-4 mb-2 px-4">
                    {formatDate(event.date)}
                  </h3>
                )}
                <div onClick={() => setSelectedEvent(event)} className="cursor-pointer">
                  <CalendarEventCard event={event} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Published Section */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Published</h2>
          <div className="space-y-2">
            {pastEvents.slice(0, 10).map((event, idx) => (
              <div key={idx}>
                {(idx === 0 || formatDate(event.date) !== formatDate(pastEvents[idx - 1].date)) && (
                  <h3 className="text-sm font-semibold text-slate-600 mt-4 mb-2 px-4">
                    {formatDate(event.date)}
                  </h3>
                )}
                <div onClick={() => setSelectedEvent(event)} className="cursor-pointer">
                  <CalendarEventCard event={event} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedEvent && (
        <CalendarEventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}