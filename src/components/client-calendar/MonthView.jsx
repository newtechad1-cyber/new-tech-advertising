import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CalendarEventCard from './CalendarEventCard';
import CalendarEventDetail from './CalendarEventDetail';

export default function MonthView({ events = [], onEventClick = () => {} }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 11)); // March 11, 2026
  const [selectedEvent, setSelectedEvent] = useState(null);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const current = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const getEventsForDay = (date) => {
    return events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate();
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-4">
        <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-lg">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-lg font-semibold text-slate-900">
          {monthNames[month]} {year}
        </h2>
        <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-lg">
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-px bg-slate-200">
          {dayNames.map(day => (
            <div key={day} className="bg-slate-50 p-3 text-center font-semibold text-sm text-slate-600">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-px bg-slate-200">
          {days.map((day, idx) => {
            const isCurrentMonth = day.getMonth() === month;
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().toDateString() === day.toDateString();

            return (
              <div
                key={idx}
                className={`min-h-24 p-2 ${
                  isCurrentMonth ? 'bg-white' : 'bg-slate-50'
                } ${isToday ? 'border-l-4 border-blue-500' : ''}`}
              >
                <p className={`text-xs font-semibold mb-1 ${
                  isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {day.getDate()}
                </p>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 2).map((event, i) => (
                    <div key={i} onClick={() => setSelectedEvent(event)} className="cursor-pointer">
                      <CalendarEventCard event={event} compact />
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <p className="text-xs text-slate-500 px-1">+{dayEvents.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedEvent && (
        <CalendarEventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}