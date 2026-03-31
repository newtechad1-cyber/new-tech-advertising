import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Zap, FileText, Globe, Calendar, TrendingUp, RefreshCw, Clock } from 'lucide-react';

const FEED_SOURCES = [
  {
    key: 'opportunities',
    entity: 'Opportunity',
    label: 'Lead → Opportunity',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    badgeColor: 'bg-emerald-500/20 text-emerald-300',
    getTitle: r => r.name || 'Opportunity',
    getSub: r => r.service_type ? `Service: ${r.service_type}` : '',
  },
  {
    key: 'content_drafts',
    entity: 'ContentDraft',
    label: 'Content Draft',
    icon: FileText,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
    badgeColor: 'bg-blue-500/20 text-blue-300',
    getTitle: r => r.hook || r.caption?.slice(0, 60) || 'Content Draft',
    getSub: r => r.platform ? `Platform: ${r.platform}` : '',
  },
  {
    key: 'pages',
    entity: 'Page',
    label: 'SEO Page',
    icon: Globe,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/30',
    badgeColor: 'bg-violet-500/20 text-violet-300',
    getTitle: r => r.title || 'Page',
    getSub: r => r.slug ? `/${r.slug}` : '',
  },
  {
    key: 'scheduled_posts',
    entity: 'ScheduledPost',
    label: 'Scheduled Post',
    icon: Calendar,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
    badgeColor: 'bg-amber-500/20 text-amber-300',
    getTitle: r => r.platform ? `${r.platform} post` : 'Scheduled Post',
    getSub: r => r.scheduled_at ? `Scheduled: ${new Date(r.scheduled_at).toLocaleDateString()}` : '',
  },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminRecentAIActivity() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        FEED_SOURCES.map(src =>
          base44.entities[src.entity]
            .filter({ created_by_automation: true }, '-created_date', 50)
            .then(records => records.map(r => ({ ...r, _source: src.key })))
            .catch(() => [])
        )
      );

      const merged = results
        .flat()
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        .slice(0, 50);

      setItems(merged);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i._source === filter);

  const totalsBySource = FEED_SOURCES.reduce((acc, src) => {
    acc[src.key] = items.filter(i => i._source === src.key).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-7 rounded-full bg-violet-500" />
              <h1 className="text-3xl font-black tracking-tight">Recent AI Activity</h1>
            </div>
            <p className="text-slate-500 text-sm ml-5">Last 50 outputs written by automations across all agents</p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium text-slate-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FEED_SOURCES.map(src => {
            const Icon = src.icon;
            return (
              <button
                key={src.key}
                onClick={() => setFilter(filter === src.key ? 'all' : src.key)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  filter === src.key ? src.bg : 'bg-[#0d1526] border-slate-800/60 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${src.color}`} />
                <p className="text-xl font-black text-white">{totalsBySource[src.key] || 0}</p>
                <p className="text-xs text-slate-500 mt-0.5">{src.label}</p>
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 flex-wrap">
          {['all', ...FEED_SOURCES.map(s => s.key)].map(key => {
            const src = FEED_SOURCES.find(s => s.key === key);
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filter === key
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {src ? src.label : 'All'}
              </button>
            );
          })}
        </div>

        {/* Feed */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm animate-pulse">Loading activity feed…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Zap className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No automation-created records found yet.</p>
            <p className="text-slate-600 text-xs mt-1">Records appear here once automations write to entities with <code className="text-slate-500">created_by_automation: true</code>.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(item => {
              const src = FEED_SOURCES.find(s => s.key === item._source);
              if (!src) return null;
              const Icon = src.icon;
              return (
                <div
                  key={`${item._source}-${item.id}`}
                  className="bg-[#0d1526] border border-slate-800/60 rounded-2xl px-5 py-4 flex items-start gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${src.bg}`}>
                    <Icon className={`w-4 h-4 ${src.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${src.badgeColor}`}>
                        {src.label}
                      </span>
                      {item.source_automation_name && (
                        <span className="text-[10px] text-slate-500 font-mono bg-slate-800/80 px-2 py-0.5 rounded-full">
                          {item.source_automation_name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{src.getTitle(item)}</p>
                    {src.getSub(item) && (
                      <p className="text-xs text-slate-500 mt-0.5">{src.getSub(item)}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600 text-xs flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {timeAgo(item.created_date)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-center text-xs text-slate-600 pb-4">
            Showing {filtered.length} automation-created records
          </p>
        )}
      </div>
    </div>
  );
}