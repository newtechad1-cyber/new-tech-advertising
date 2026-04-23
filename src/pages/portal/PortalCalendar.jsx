import React, { useState, useEffect } from 'react';
import PortalLayout from '../../components/portal/PortalLayout';
import { usePortalClient } from '../../lib/usePortalClient';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const PLATFORM_EMOJI = { Facebook: '👥', Instagram: '📸', LinkedIn: '💼', YouTube: '▶️', 'Google Business Profile': '📍', TikTok: '🎵', X: '✖️' };
const APPROVAL_FRIENDLY = { 'Pending Client Review': 'Needs Your Approval', 'Approved': 'Approved', 'Not Needed': 'Ready', 'Rejected': 'Changes Requested' };

export default function PortalCalendar() {
  const { user, client, loading: authLoading } = usePortalClient();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month');
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!client?.id) return;
    base44.entities.CampaignPost.filter({ client_id: client.id }).then(p => {
      setPosts(p.filter(post => post.scheduled_date));
      setLoading(false);
    });
  }, [client?.id]);

  if (authLoading || loading) return <Loader />;

  const year = current.getFullYear();
  const month = current.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();

  const getPostsForDate = (day) => {
    const d = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return posts.filter(p => p.scheduled_date?.startsWith(d));
  };

  const listPosts = view === 'list' ? posts.filter(p => {
    const d = new Date(p.scheduled_date);
    return d.getFullYear() === year && d.getMonth() === month;
  }).sort((a,b) => a.scheduled_date.localeCompare(b.scheduled_date)) : [];

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

  return (
    <PortalLayout client={client} user={user}>
      <div className="px-6 pt-8 pb-12 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Content Calendar</h1>
            <p className="text-slate-500 text-sm mt-1">Your upcoming scheduled content.</p>
          </div>
          <div className="flex items-center gap-2">
            {['month', 'list'].map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${view === v ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>{v}</button>
            ))}
          </div>
        </div>

        {/* Month nav */}
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><ChevronLeft className="w-4 h-4 text-slate-600" /></button>
          <p className="font-bold text-slate-800 min-w-[140px] text-center">{current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><ChevronRight className="w-4 h-4 text-slate-600" /></button>
        </div>

        {view === 'month' && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-100">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="py-2 text-center text-xs font-bold text-slate-400">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {[...Array(firstDow)].map((_,i) => <div key={`e${i}`} className="min-h-[90px] border-b border-r border-slate-100" />)}
              {[...Array(daysInMonth)].map((_,i) => {
                const day = i + 1;
                const dayPosts = getPostsForDate(day);
                const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                return (
                  <div key={day} className={`min-h-[90px] border-b border-r border-slate-100 p-1 ${isToday ? 'bg-blue-50' : ''}`}>
                    <p className={`text-xs font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>{day}</p>
                    {dayPosts.slice(0, 2).map(p => (
                      <button key={p.id} onClick={() => setSelected(p)}
                        className="w-full text-left text-xs px-1.5 py-1 rounded-lg mb-0.5 bg-blue-600 text-white truncate hover:bg-blue-700 transition-colors">
                        {PLATFORM_EMOJI[p.platform] || '📄'} {p.title}
                      </button>
                    ))}
                    {dayPosts.length > 2 && <p className="text-xs text-slate-400">+{dayPosts.length - 2} more</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'list' && (
          <div className="space-y-2">
            {listPosts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-sm">No posts scheduled this month.</div>
            ) : listPosts.map(p => (
              <button key={p.id} onClick={() => setSelected(p)} className="w-full text-left bg-white border border-slate-200 hover:border-slate-300 rounded-2xl px-5 py-4 flex items-center gap-4 transition-colors">
                <span className="text-2xl">{PLATFORM_EMOJI[p.platform] || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{p.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.platform} · {p.scheduled_date ? new Date(p.scheduled_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '—'}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.approval_status === 'Approved' || p.approval_status === 'Not Needed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {APPROVAL_FRIENDLY[p.approval_status] || p.approval_status}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-start justify-between">
              <div>
                <p className="font-bold text-slate-900">{selected.title}</p>
                <p className="text-xs text-slate-400 mt-1">{selected.platform} · {selected.scheduled_date ? new Date(selected.scheduled_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : '—'}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {selected.content_caption && <Block label="Caption" value={selected.content_caption} />}
              {selected.video_script && <Block label="Script" value={selected.video_script} scroll />}
              {selected.media_url && <img src={selected.media_url} className="rounded-xl w-full object-cover" onError={e => e.target.style.display='none'} />}
              <div className="grid grid-cols-2 gap-3">
                <Chip label="Status" value={selected.publishing_status || '—'} />
                <Chip label="Approval" value={APPROVAL_FRIENDLY[selected.approval_status] || selected.approval_status || '—'} />
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

function Block({ label, value, scroll }) {
  return <div><p className="text-xs text-slate-400 mb-1">{label}</p><div className={`bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-700 whitespace-pre-wrap ${scroll ? 'max-h-40 overflow-y-auto' : ''}`}>{value}</div></div>;
}
function Chip({ label, value }) {
  return <div className="bg-slate-50 rounded-xl px-3 py-2"><p className="text-xs text-slate-400">{label}</p><p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p></div>;
}
function Loader() {
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" /></div>;
}