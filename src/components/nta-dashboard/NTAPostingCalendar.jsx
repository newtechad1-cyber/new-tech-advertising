import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const DAYS = [
  { day: 'Monday',    theme: 'Website / Audit',        color: 'border-blue-700',    badge: 'bg-blue-900 text-blue-300' },
  { day: 'Tuesday',   theme: 'SEO / Google / Visibility', color: 'border-emerald-700', badge: 'bg-emerald-900 text-emerald-300' },
  { day: 'Wednesday', theme: 'Demo / Before-After',    color: 'border-violet-700',  badge: 'bg-violet-900 text-violet-300' },
  { day: 'Thursday',  theme: 'Authority / Insight',    color: 'border-amber-700',   badge: 'bg-amber-900 text-amber-300' },
  { day: 'Friday',    theme: 'Offer / CTA',            color: 'border-red-700',     badge: 'bg-red-900 text-red-300' },
];

const DAY_FUNNEL = { Monday: 'Demo', Tuesday: 'Awareness', Wednesday: 'Demo', Thursday: 'Consideration', Friday: 'Close' };

export default function NTAPostingCalendar() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.NTAContent.list('-created_date', 500).then(d => { setItems(d); setLoading(false); });
  }, []);

  const assignDay = (item) => {
    const idx = items.indexOf(item);
    return DAYS[idx % 5];
  };

  // group by funnel stage mapped to day
  const dayItems = DAYS.map(d => ({
    ...d,
    items: items.filter(i => i.funnel_stage === DAY_FUNNEL[d.day] && i.posted_status !== 'Posted').slice(0, 3),
    posted: items.filter(i => i.funnel_stage === DAY_FUNNEL[d.day] && i.posted_status === 'Posted').slice(0, 2),
  }));

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-xl font-black text-white mb-1">Posting Calendar</h1>
      <p className="text-slate-500 text-sm mb-5">Weekly content themes — videos matched by funnel stage</p>

      {loading ? (
        <div className="grid grid-cols-5 gap-3">{DAYS.map(d => <div key={d.day} className="h-64 bg-slate-800 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {dayItems.map(({ day, theme, color, badge, items: dayVids, posted }) => (
            <div key={day} className={`bg-slate-900 border ${color} rounded-xl p-4`}>
              <p className="text-sm font-black text-white">{day}</p>
              <p className="text-xs text-slate-500 mb-3">{theme}</p>

              {/* Action box */}
              <div className="bg-slate-800 rounded-lg p-2 mb-3 space-y-1">
                <p className="text-xs font-bold text-slate-400 mb-1">Actions</p>
                {['Create video', 'Post video', 'Reuse in outreach', 'Add to demo page'].map(a => (
                  <label key={a} className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input type="checkbox" className="rounded" /> {a}
                  </label>
                ))}
              </div>

              {/* Videos */}
              <div className="space-y-2">
                {dayVids.map(v => (
                  <div key={v.id} className="bg-slate-800 rounded-lg p-2">
                    <p className="text-xs font-semibold text-white leading-tight truncate">{v.video_title}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <span className={`text-xs px-1 py-0.5 rounded font-bold ${badge}`}>{v.posted_status}</span>
                      {v.outreach_compatible && <span className="text-xs bg-sky-900 text-sky-400 px-1 py-0.5 rounded">OUT</span>}
                    </div>
                  </div>
                ))}
                {posted.map(v => (
                  <div key={v.id} className="bg-slate-800/50 rounded-lg p-2 opacity-60">
                    <p className="text-xs text-slate-400 leading-tight truncate line-through">{v.video_title}</p>
                  </div>
                ))}
                {dayVids.length === 0 && posted.length === 0 && (
                  <p className="text-slate-700 text-xs text-center py-3">No content</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}