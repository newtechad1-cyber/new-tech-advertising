import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Shield, Star } from 'lucide-react';
import { addDays, format, startOfDay, isBefore } from 'date-fns';

const TIMES = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'];
// Simulate some slots being taken
const TAKEN = ['10:00 AM', '2:00 PM', '9:30 AM'];

function generateDays() {
  const days = [];
  let d = addDays(new Date(), 1);
  while (days.length < 14) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) days.push(new Date(d));
    d = addDays(d, 1);
  }
  return days;
}

export default function StepBooking({ data, onNext, onBack }) {
  const days = generateDays();
  const [weekStart, setWeekStart] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const visibleDays = days.slice(weekStart, weekStart + 5);
  const valid = selectedDay && selectedTime;

  const handleConfirm = () => {
    if (!valid) return;
    onNext({
      demo_date: format(selectedDay, 'yyyy-MM-dd'),
      demo_time: selectedTime,
      demo_display_date: format(selectedDay, 'EEEE, MMMM d'),
    });
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold mb-4">
          <Star className="w-4 h-4" /> You're Qualified — Reserve Your Session
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Choose Your Strategy Session Time</h2>
        <p className="text-slate-500 text-sm">A 30-minute live platform demo built around <strong>{data.business_name}</strong> and your {data.city} market.</p>
      </div>

      {/* Reassurance */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Clock, label: '30 Minutes', desc: 'Focused and efficient' },
          { icon: Shield, label: 'No Obligation', desc: 'Zero pressure guaranteed' },
          { icon: Star, label: 'Custom Demo', desc: 'Built for your market' },
        ].map(({ icon: Icon, label, desc }, i) => (
          <div key={i} className="text-center p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Icon className="w-4 h-4 text-blue-600 mx-auto mb-1.5" />
            <p className="text-slate-900 text-xs font-bold">{label}</p>
            <p className="text-slate-400 text-xs">{desc}</p>
          </div>
        ))}
      </div>

      {/* Day selector */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-slate-700">Select a Date</p>
          <div className="flex gap-1">
            <button onClick={() => setWeekStart(Math.max(0, weekStart - 5))} disabled={weekStart === 0}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setWeekStart(Math.min(days.length - 5, weekStart + 5))} disabled={weekStart + 5 >= days.length}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {visibleDays.map((day, i) => {
            const isSelected = selectedDay && format(selectedDay, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
            return (
              <button key={i} onClick={() => { setSelectedDay(day); setSelectedTime(null); }}
                className={`flex flex-col items-center py-3 px-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                }`}>
                <span className="text-xs font-semibold opacity-80">{format(day, 'EEE')}</span>
                <span className="text-xl font-black mt-0.5">{format(day, 'd')}</span>
                <span className="text-xs opacity-70">{format(day, 'MMM')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time selector */}
      {selectedDay && (
        <div className="mb-6">
          <p className="text-sm font-bold text-slate-700 mb-3">
            Available Times — {format(selectedDay, 'EEEE, MMMM d')} <span className="font-normal text-slate-400">(Central Time)</span>
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TIMES.map((time) => {
              const taken = TAKEN.includes(time);
              const isSelected = selectedTime === time;
              return (
                <button key={time} disabled={taken} onClick={() => setSelectedTime(time)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    taken      ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through' :
                    isSelected ? 'border-blue-500 bg-blue-600 text-white shadow-md' :
                                 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}>
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button onClick={handleConfirm} disabled={!valid}
        className={`w-full py-4 rounded-2xl text-base font-black transition-all flex items-center justify-center gap-2 ${
          valid
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30 hover:-translate-y-0.5'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}>
        Confirm My Strategy Session →
      </button>

      <p className="text-center text-slate-400 text-xs mt-3">
        You'll receive a calendar invite + preparation guide immediately after booking.
      </p>
    </div>
  );
}