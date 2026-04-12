import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Film, FileText, CheckCircle, Send, Zap, Monitor, Mail, Plus } from 'lucide-react';

export default function NTAOverview({ onNavigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.NTAContent.list('-created_date', 200).then(d => { setItems(d); setLoading(false); });
  }, []);

  const total = items.length;
  const scriptsReady = items.filter(i => ['Script Ready', 'In Production', 'Complete'].includes(i.script_status)).length;
  const videosCreated = items.filter(i => ['Created', 'Posted'].includes(i.posted_status)).length;
  const readyToPost = items.filter(i => i.posted_status === 'Created').length;
  const posted = items.filter(i => i.posted_status === 'Posted').length;
  const outreachCount = items.filter(i => i.outreach_compatible).length;
  const demoCount = items.filter(i => i.demo_compatible).length;

  const STATS = [
    { label: 'Content Ideas', value: total, color: 'text-slate-300', icon: FileText },
    { label: 'Scripts Ready', value: scriptsReady, color: 'text-blue-400', icon: FileText },
    { label: 'Videos Created', value: videosCreated, color: 'text-violet-400', icon: Film },
    { label: 'Ready to Post', value: readyToPost, color: 'text-amber-400', icon: Zap },
    { label: 'Posted', value: posted, color: 'text-emerald-400', icon: CheckCircle },
    { label: 'Outreach Videos', value: outreachCount, color: 'text-sky-400', icon: Mail },
    { label: 'Demo Videos', value: demoCount, color: 'text-pink-400', icon: Monitor },
  ];

  const suggested = items.find(i => i.script_status === 'Idea');
  const suggestedPost = items.find(i => i.posted_status === 'Created');
  const suggestedOutreach = items.find(i => i.outreach_compatible && i.posted_status === 'Posted');

  const thisWeek = items.filter(i => i.priority === 'High' && i.posted_status !== 'Posted').slice(0, 5);
  const readyCreate = items.filter(i => i.script_status === 'Script Ready' && i.posted_status === 'Not Created').slice(0, 4);
  const readyPostList = items.filter(i => i.posted_status === 'Created').slice(0, 4);
  const recentPosted = items.filter(i => i.posted_status === 'Posted').slice(0, 4);

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">NTA Video Command Center</h1>
          <p className="text-slate-500 text-sm">New Tech Advertising · Rick Hesse</p>
        </div>
        <button onClick={() => onNavigate('library')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Content
        </button>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {STATS.map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className={`text-2xl font-black ${color}`}>{value}</p>
                <Icon className={`w-4 h-4 ${color} opacity-60`} />
              </div>
              <p className="text-slate-500 text-xs leading-tight">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SuggestionCard title="💡 Suggested Next Video" item={suggested} fallback="No ideas yet — add one!" color="border-blue-800" onClick={() => onNavigate('production')} />
        <SuggestionCard title="📤 Suggested Next Post" item={suggestedPost} fallback="No videos ready to post." color="border-amber-800" onClick={() => onNavigate('calendar')} />
        <SuggestionCard title="📧 Suggested Outreach Video" item={suggestedOutreach} fallback="No outreach-compatible videos yet." color="border-sky-800" onClick={() => onNavigate('outreach')} />
      </div>

      {/* Weekly plan grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <ContentList title="📅 This Week (High Priority)" items={thisWeek} emptyText="No high-priority items" badge={i => <Badge color="text-amber-400 bg-amber-400/10">{i.priority}</Badge>} />
        <ContentList title="🎬 Ready to Create" items={readyCreate} emptyText="No scripts ready" badge={i => <Badge color="text-blue-400 bg-blue-400/10">Script Ready</Badge>} />
        <ContentList title="📲 Ready to Post" items={readyPostList} emptyText="No videos ready to post" badge={i => <Badge color="text-violet-400 bg-violet-400/10">Created</Badge>} />
        <ContentList title="✅ Recently Posted" items={recentPosted} emptyText="Nothing posted yet" badge={() => <Badge color="text-emerald-400 bg-emerald-400/10">Posted</Badge>} />
      </div>
    </div>
  );
}

function SuggestionCard({ title, item, fallback, color, onClick }) {
  return (
    <div className={`bg-slate-900 border ${color} rounded-xl p-4 cursor-pointer hover:border-opacity-80 transition-colors`} onClick={onClick}>
      <p className="text-xs font-bold text-slate-400 mb-2">{title}</p>
      {item ? (
        <>
          <p className="text-sm font-semibold text-white">{item.video_title}</p>
          <p className="text-xs text-slate-500 mt-1">{item.topic || item.funnel_stage || '—'}</p>
        </>
      ) : (
        <p className="text-sm text-slate-600">{fallback}</p>
      )}
    </div>
  );
}

function ContentList({ title, items, emptyText, badge }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className="text-xs font-bold text-slate-400 mb-3">{title}</p>
      {items.length === 0 ? (
        <p className="text-slate-600 text-xs">{emptyText}</p>
      ) : (
        <div className="space-y-2">
          {items.map(i => (
            <div key={i.id} className="flex items-start justify-between gap-2">
              <p className="text-xs text-slate-300 leading-tight truncate flex-1">{i.video_title}</p>
              {badge(i)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Badge({ children, color }) {
  return <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${color}`}>{children}</span>;
}