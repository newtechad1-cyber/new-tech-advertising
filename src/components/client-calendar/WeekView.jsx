import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarEventCard from './CalendarEventCard';
import CalendarEventDetail from './CalendarEventDetail';

export default function WeekView({ events = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 11)); // March 11, 2026
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const prevWeek = () => setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  const nextWeek = () => setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));

  const getEventsForDay = (date) => {
    return events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate();
    });
  };

  const isToday = (date) => new Date().toDateString() === date.toDateString();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-4">
        <button onClick={prevWeek} className="p-1 hover:bg-slate-100 rounded-lg">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-lg font-semibold text-slate-900">
          {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </h2>
        <button onClick={nextWeek} className="p-1 hover:bg-slate-100 rounded-lg">
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Week Grid */}
      <div className="space-y-3">
        {days.map((day, idx) => {
          const dayEvents = getEventsForDay(day);

          return (
            <div key={idx} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <p className="font-semibold text-slate-900">{dayNames[idx]}</p>
                <p className="text-sm text-slate-500">
                  {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                {isToday(day) && (
                  <span className="ml-auto text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Today
                  </span>
                )}
              </div>

              {dayEvents.length === 0 ? (
                <p className="text-sm text-slate-400">No content scheduled</p>
              ) : (
                <div className="space-y-2">
                  {dayEvents.map((event, i) => (
                    <div key={i} onClick={() => setSelectedEvent(event)} className="cursor-pointer">
                      <CalendarEventCard event={event} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedEvent && (
        <CalendarEventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}