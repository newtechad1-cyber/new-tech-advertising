import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLATFORMS = ['facebook','instagram','linkedin','x','threads','google_business_profile','youtube','tiktok'];
const PLATFORM_EMOJI = { facebook:'📘', instagram:'📷', linkedin:'💼', x:'𝕏', threads:'🧵', google_business_profile:'🟢', youtube:'▶️', tiktok:'🎵' };
const PLATFORM_COLORS = { facebook:'bg-blue-900/40 text-blue-300', instagram:'bg-pink-900/40 text-pink-300', linkedin:'bg-sky-900/40 text-sky-300', x:'bg-slate-700 text-slate-300', threads:'bg-violet-900/40 text-violet-300', google_business_profile:'bg-emerald-900/40 text-emerald-300', youtube:'bg-red-900/40 text-red-300', tiktok:'bg-fuchsia-900/40 text-fuchsia-300' };

export default function AgencyPublishingCalendar() {
  const [posts, setPosts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Canonical client filter — read from ?client=<Clients.id> in URL
  const urlParams = new URLSearchParams(window.location.search);
  const clientIdFilter = urlParams.get('client') || '';

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [p, cl] = await Promise.all([
      base44.entities.SocialPostQueue.filter({ publish_status: 'scheduled' }),
      base44.entities.Clients.list('-created_date', 200),
    ]);
    setPosts(p);
    setClients(cl);
    setLoading(false);
  };

  const clientMap = Object.fromEntries(clients.map(c => [c.id, c]));

  // Build events list. When ?client= is present, filter by canonical client_id.
  // LEGACY FALLBACK NOTE: records without client_id are excluded from client-scoped views
  // (they will still appear in the global "all clients" view).
  const allEvents = posts
    .filter(p => p.scheduled_time)
    .map(p => ({ id: p.id, platform: p.platform, text: p.post_text, date: p.scheduled_time, type: 'post', client_id: p.client_id || '' }));

  // Apply canonical client_id filter
  const clientScoped = clientIdFilter
    ? allEvents.filter(e => e.client_id === clientIdFilter)
    : allEvents;

  const filtered = clientScoped.filter(e => filterPlatform === 'all' || e.platform === filterPlatform);

  // Build calendar grid
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getEventsForDay = (day) => {
    return filtered.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const today = new Date();

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Publishing Calendar</h1>
            {clientIdFilter ? (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-blue-400 bg-blue-900/30 border border-blue-700/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Filter className="w-3 h-3" /> {clientMap[clientIdFilter]?.business_name || clientIdFilter}
                </span>
                <Link to="/agency/publishing-calendar" className="text-xs text-slate-500 hover:text-white transition-colors">Clear filter →</Link>
                <Link to={`/agency/clients/${clientIdFilter}`} className="text-xs text-slate-500 hover:text-white transition-colors">← Back to client</Link>
              </div>
            ) : (
              <p className="text-slate-500 text-sm mt-0.5">All scheduled content across platforms</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm font-semibold text-white min-w-[120px] text-center">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={nextMonth} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Platform filter */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterPlatform('all')} className={`text-xs px-3 py-1.5 rounded-full font-semibold ${filterPlatform === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>All</button>
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setFilterPlatform(p)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${filterPlatform === p ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {PLATFORM_EMOJI[p]} {p.replace(/_/g,' ')}
            </button>
          ))}
        </div>

        {/* Calendar grid */}
        {loading ? <div className="h-80 bg-slate-800 rounded-xl animate-pulse" /> : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-slate-800">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="px-3 py-2.5 text-center text-xs font-bold text-slate-500 uppercase">{d}</div>
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7">
              {days.map((day, i) => {
                const events = day ? getEventsForDay(day) : [];
                const isToday = day && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
                return (
                  <div key={i} className={`min-h-[90px] border-b border-r border-slate-800 p-1.5 ${!day ? 'bg-slate-950/40' : ''}`}>
                    {day && (
                      <>
                        <span className={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full mb-1 ${isToday ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>{day}</span>
                        <div className="space-y-0.5">
                          {events.slice(0, 3).map(e => (
                            <div key={e.id} className={`text-xs px-1.5 py-0.5 rounded truncate ${PLATFORM_COLORS[e.platform] || 'bg-slate-700 text-slate-400'}`}>
                              {PLATFORM_EMOJI[e.platform]} {e.text?.slice(0, 20) || 'Post'}
                            </div>
                          ))}
                          {events.length > 3 && <p className="text-xs text-slate-600 pl-1">+{events.length - 3} more</p>}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming list */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Upcoming Posts</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
            {filtered.sort((a,b) => new Date(a.date) - new Date(b.date)).slice(0, 10).map(e => (
              <div key={e.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{PLATFORM_EMOJI[e.platform]}</span>
                  <div>
                    <p className="text-sm text-white truncate max-w-[300px]">{e.text?.slice(0, 60) || 'Post'}</p>
                    <p className="text-xs text-slate-500">{e.platform?.replace(/_/g,' ')}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">{new Date(e.date).toLocaleDateString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}</span>
              </div>
            ))}
            {filtered.length === 0 && <p className="p-8 text-center text-slate-600 text-sm">No scheduled posts for this filter.</p>}
          </div>
        </div>
      </div>
    </AgencyLayout>
  );
}