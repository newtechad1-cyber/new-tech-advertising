import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PLATFORM_ICON, PostStatusBadge, ApprovalBadge } from './CampaignUtils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const VIEWS = ['Month', 'Week', 'List'];

export default function CampaignCalendarTab({ posts, clients, campaigns }) {
  const [view, setView] = useState('Month');
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState(null);
  const [clientFilter, setClientFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');

  const clientMap = {};
  clients.forEach(c => clientMap[c.id] = c.business_name);

  const filteredPosts = posts.filter(p =>
    p.scheduled_date &&
    (clientFilter === 'All' || p.client_id === clientFilter) &&
    (platformFilter === 'All' || p.platform === platformFilter)
  );

  const postsByDate = {};
  filteredPosts.forEach(p => {
    const d = p.scheduled_date;
    if (!postsByDate[d]) postsByDate[d] = [];
    postsByDate[d].push(p);
  });

  // Month view helpers
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const toKey = (d) => {
    if (!d) return '';
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const todayKey = new Date().toISOString().split('T')[0];

  // Week view
  const startOfWeek = new Date(current);
  startOfWeek.setDate(current.getDate() - current.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));
  const prevWeek = () => { const d = new Date(current); d.setDate(d.getDate() - 7); setCurrent(d); };
  const nextWeek = () => { const d = new Date(current); d.setDate(d.getDate() + 7); setCurrent(d); };

  const platforms = ['All', ...new Set(posts.map(p => p.platform).filter(Boolean))];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5">
          {VIEWS.map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${view === v ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={view === 'Week' ? prevWeek : prevMonth} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-semibold text-white px-2">
            {view === 'Week'
              ? `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            }
          </span>
          <button onClick={view === 'Week' ? nextWeek : nextMonth} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
        </div>

        <select value={clientFilter} onChange={e => setClientFilter(e.target.value)} className="ml-auto bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2">
          <option value="All">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
        </select>
        <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2">
          {platforms.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Month View */}
      {view === 'Month' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-800">
            {DAYS.map(d => (
              <div key={d} className="px-2 py-2 text-center text-xs font-bold text-slate-500 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const key = toKey(day);
              const dayPosts = day ? (postsByDate[key] || []) : [];
              const isToday = key === todayKey;
              return (
                <div key={i} className={`min-h-[90px] border-b border-r border-slate-800/60 p-1.5 ${!day ? 'bg-slate-900/40' : ''} ${i % 7 === 6 ? 'border-r-0' : ''}`}>
                  {day && (
                    <>
                      <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full mb-1 ${isToday ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>{day}</span>
                      <div className="space-y-0.5">
                        {dayPosts.slice(0, 3).map(p => (
                          <button key={p.id} onClick={() => setSelected(p)}
                            className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded px-1.5 py-0.5 truncate flex items-center gap-1 transition-colors">
                            <span className="text-xs">{PLATFORM_ICON[p.platform] || '📱'}</span>
                            <span className="text-slate-300 truncate">{p.title}</span>
                          </button>
                        ))}
                        {dayPosts.length > 3 && (
                          <p className="text-xs text-slate-500 pl-1">+{dayPosts.length - 3} more</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {view === 'Week' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-7">
            {weekDays.map((d, i) => {
              const key = d.toISOString().split('T')[0];
              const dayPosts = postsByDate[key] || [];
              const isToday = key === todayKey;
              return (
                <div key={i} className={`border-r border-slate-800 last:border-r-0 ${isToday ? 'bg-blue-950/20' : ''}`}>
                  <div className={`px-3 py-2 border-b border-slate-800 text-center ${isToday ? 'bg-blue-950/40' : ''}`}>
                    <p className="text-xs text-slate-500">{DAYS[d.getDay()]}</p>
                    <p className={`text-sm font-bold ${isToday ? 'text-blue-400' : 'text-white'}`}>{d.getDate()}</p>
                  </div>
                  <div className="p-1.5 space-y-1 min-h-[200px]">
                    {dayPosts.map(p => (
                      <button key={p.id} onClick={() => setSelected(p)}
                        className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-2 py-1.5 transition-colors">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span>{PLATFORM_ICON[p.platform] || '📱'}</span>
                          <span className="text-slate-400 truncate">{p.scheduled_time || ''}</span>
                        </div>
                        <p className="text-slate-200 font-medium truncate">{p.title}</p>
                        <p className="text-slate-500 text-xs truncate">{p.business_name || 'NTA'}</p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'List' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {filteredPosts.length === 0 ? (
            <p className="p-8 text-center text-slate-600 text-sm">No scheduled posts</p>
          ) : (
            <div className="divide-y divide-slate-800">
              {filteredPosts
                .sort((a, b) => a.scheduled_date?.localeCompare(b.scheduled_date))
                .map(p => (
                  <button key={p.id} onClick={() => setSelected(p)} className="w-full text-left flex items-center gap-4 px-4 py-3 hover:bg-slate-800/40 transition-colors">
                    <span className="text-xl">{PLATFORM_ICON[p.platform] || '📱'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{p.title}</p>
                      <p className="text-xs text-slate-500">{p.business_name || 'NTA'} · {p.scheduled_date} {p.scheduled_time}</p>
                    </div>
                    <PostStatusBadge status={p.publishing_status} />
                    <ApprovalBadge status={p.approval_status} />
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Post Detail Drawer */}
      {selected && (
        <PostDetailDrawer post={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function PostDetailDrawer({ post, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <div className="bg-slate-900 border-l border-slate-700 w-full max-w-sm h-full overflow-y-auto p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white">{post.title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-lg">✕</button>
        </div>
        <div className="space-y-2 text-sm">
          <Row label="Platform" value={`${PLATFORM_ICON[post.platform] || ''} ${post.platform}`} />
          <Row label="Client" value={post.business_name || 'NTA Internal'} />
          <Row label="Type" value={post.post_type} />
          <Row label="Scheduled" value={`${post.scheduled_date || '—'} ${post.scheduled_time || ''}`} />
          <Row label="Publishing" value={<PostStatusBadge status={post.publishing_status} />} />
          <Row label="Approval" value={<ApprovalBadge status={post.approval_status} />} />
          {post.content_caption && (
            <div>
              <p className="text-xs text-slate-500 mb-1">Caption</p>
              <p className="text-slate-300 text-sm bg-slate-800 rounded-lg p-3">{post.content_caption}</p>
            </div>
          )}
          {post.media_url && (
            <div>
              <p className="text-xs text-slate-500 mb-1">Media</p>
              <img src={post.media_url} className="rounded-lg w-full object-cover max-h-48" onError={e => e.target.style.display='none'} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-500 w-24 flex-shrink-0 text-xs">{label}</span>
      <span className="text-white text-sm">{value}</span>
    </div>
  );
}