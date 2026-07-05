/**
 * P-001 Publishing Engine — Publishing Calendar
 * Calendar view of scheduled content across all channels.
 * Shows upcoming publishes with channel indicators.
 */
import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import {
  ChevronLeft, ChevronRight, Calendar, Clock,
  ExternalLink
} from 'lucide-react';
import {
  CHANNELS, TARGET_STATES, STATUS_COLORS, formatDate
} from './publishingData';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function CalendarDay({ date, targets, today, isCurrentMonth, onSelectTarget }) {
  const isToday = date === today;
  const dayNum = parseInt(date.split('-')[2], 10);

  return (
    <div className={`min-h-[80px] p-1.5 border-r border-b border-slate-800 ${
      isCurrentMonth ? 'bg-slate-900/30' : 'bg-slate-950/50'
    } ${isToday ? 'ring-1 ring-blue-500/50' : ''}`}>
      <p className={`text-xs font-semibold mb-1 ${
        isToday ? 'text-blue-400' : isCurrentMonth ? 'text-slate-400' : 'text-slate-700'
      }`}>
        {dayNum}
      </p>
      <div className="space-y-0.5">
        {targets.slice(0, 3).map((t, i) => {
          const cfg = CHANNELS[t.channel];
          const Icon = LucideIcons[cfg?.icon] || LucideIcons.Circle;
          const c = STATUS_COLORS[cfg?.color] || STATUS_COLORS.blue;
          const ts = TARGET_STATES[t.status];
          return (
            <button
              key={i}
              onClick={() => onSelectTarget(t)}
              className={`w-full flex items-center gap-1 px-1 py-0.5 rounded text-[9px] truncate transition-all hover:brightness-125 ${
                t.status === 'Published'
                  ? 'bg-green-500/15 text-green-400'
                  : t.status === 'Failed'
                    ? 'bg-red-500/15 text-red-400'
                    : `${c.bg} ${c.text}`
              }`}
              title={`${t.article_title || 'Article'} → ${cfg?.label || t.channel} (${ts?.label || t.status})`}
            >
              <Icon className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="truncate">{t.article_title || t.adapted_title || t.channel}</span>
            </button>
          );
        })}
        {targets.length > 3 && (
          <p className="text-[9px] text-slate-600 px-1">+{targets.length - 3} more</p>
        )}
      </div>
    </div>
  );
}

function UpcomingList({ targets, onSelectTarget }) {
  const upcoming = targets
    .filter(t => t.status === 'Scheduled' && t.scheduled_date)
    .sort((a, b) => (a.scheduled_date + (a.scheduled_time || '')).localeCompare(b.scheduled_date + (b.scheduled_time || '')));

  if (upcoming.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-8 h-8 text-slate-700 mx-auto mb-2" />
        <p className="text-sm text-slate-500">Nothing scheduled</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {upcoming.slice(0, 15).map((t, i) => {
        const cfg = CHANNELS[t.channel];
        const Icon = LucideIcons[cfg?.icon] || LucideIcons.Circle;
        const c = STATUS_COLORS[cfg?.color] || STATUS_COLORS.blue;
        return (
          <button
            key={i}
            onClick={() => onSelectTarget(t)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all text-left"
          >
            <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${c.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{t.article_title || 'Article'}</p>
              <p className="text-[10px] text-slate-500">{cfg?.label || t.channel}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-slate-400">{formatDate(t.scheduled_date)}</p>
              <p className="text-[10px] text-slate-600">{t.scheduled_time || '07:00'}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function PublishingCalendar({ targets, onSelectTarget }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // calendar | list

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  })();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      days.push({ date: `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`, isCurrentMonth: false });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ date: `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, isCurrentMonth: true });
    }

    // Next month to fill grid
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = month === 11 ? 1 : month + 2;
      const y = month === 11 ? year + 1 : year;
      days.push({ date: `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`, isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  // Group targets by date
  const targetsByDate = useMemo(() => {
    const map = {};
    targets.forEach(t => {
      const date = t.scheduled_date || t.published_date;
      if (date) {
        if (!map[date]) map[date] = [];
        map[date].push(t);
      }
    });
    return map;
  }, [targets]);

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }
  function goToday() {
    setViewDate(new Date());
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-white">
            {MONTHS[month]} {year}
          </h3>
          <button onClick={goToday} className="px-2 py-1 rounded text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
            Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 mr-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              List
            </button>
          </div>
          <button onClick={prevMonth} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar view */}
      {viewMode === 'calendar' ? (
        <div className="rounded-2xl border border-slate-800 overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-800">
            {WEEKDAYS.map(d => (
              <div key={d} className="p-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-900/50">
                {d}
              </div>
            ))}
          </div>
          {/* Days grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, i) => (
              <CalendarDay
                key={i}
                date={day.date}
                targets={targetsByDate[day.date] || []}
                today={today}
                isCurrentMonth={day.isCurrentMonth}
                onSelectTarget={onSelectTarget}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800">
          <UpcomingList targets={targets} onSelectTarget={onSelectTarget} />
        </div>
      )}
    </div>
  );
}
