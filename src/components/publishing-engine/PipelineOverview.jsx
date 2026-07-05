/**
 * P-001 Publishing Engine — Pipeline Overview
 * Shows workflow stage counts, channel coverage, and recent activity.
 */
import React from 'react';
import * as LucideIcons from 'lucide-react';
import {
  WORKFLOW_STATES, WORKFLOW_ORDER, CHANNELS, CHANNEL_LIST,
  STATUS_COLORS, TARGET_STATES, formatDate
} from './publishingData';

function StatCard({ icon, label, value, color = 'blue', sub }) {
  const Icon = LucideIcons[icon] || LucideIcons.FileText;
  const c = STATUS_COLORS[color] || STATUS_COLORS.blue;
  return (
    <div className={`p-4 rounded-xl ${c.bg} border ${c.border}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${c.text}`} />
        </div>
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

function WorkflowPipeline({ articles }) {
  const counts = {};
  WORKFLOW_ORDER.forEach(s => { counts[s] = 0; });
  articles.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });

  return (
    <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
        Content Pipeline
      </h3>
      <div className="flex items-center gap-1">
        {WORKFLOW_ORDER.map((state, i) => {
          const ws = WORKFLOW_STATES[state];
          const c = STATUS_COLORS[ws.color];
          const Icon = LucideIcons[ws.icon] || LucideIcons.Circle;
          const count = counts[state];
          return (
            <React.Fragment key={state}>
              <div className={`flex-1 p-3 rounded-xl ${c.bg} border ${c.border} text-center`}>
                <Icon className={`w-4 h-4 ${c.text} mx-auto mb-1`} />
                <p className="text-lg font-bold text-white">{count}</p>
                <p className={`text-xs ${c.text} font-semibold`}>{ws.label}</p>
              </div>
              {i < WORKFLOW_ORDER.length - 1 && (
                <LucideIcons.ChevronRight className="w-4 h-4 text-slate-700 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function ChannelHealth({ targets }) {
  const channelCounts = {};
  CHANNEL_LIST.forEach(ch => { channelCounts[ch] = { total: 0, published: 0, scheduled: 0, failed: 0 }; });
  targets.forEach(t => {
    if (!channelCounts[t.channel]) return;
    channelCounts[t.channel].total++;
    if (t.status === 'Published') channelCounts[t.channel].published++;
    if (t.status === 'Scheduled') channelCounts[t.channel].scheduled++;
    if (t.status === 'Failed') channelCounts[t.channel].failed++;
  });

  return (
    <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
        Channel Health
      </h3>
      <div className="space-y-2">
        {CHANNEL_LIST.map(ch => {
          const cfg = CHANNELS[ch];
          const data = channelCounts[ch];
          const Icon = LucideIcons[cfg.icon] || LucideIcons.Circle;
          const c = STATUS_COLORS[cfg.color] || STATUS_COLORS.blue;
          const pct = data.total > 0 ? Math.round((data.published / data.total) * 100) : 0;

          return (
            <div key={ch} className="flex items-center gap-3">
              <Icon className={`w-4 h-4 ${c.text} flex-shrink-0`} />
              <span className="text-sm text-slate-300 w-32 truncate">{cfg.label}</span>
              <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${c.solid} rounded-full transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 w-16 text-right">
                {data.published}/{data.total}
              </span>
              {data.failed > 0 && (
                <span className="text-xs text-red-400 font-semibold">{data.failed} ✗</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecentActivity({ articles, targets, limit = 8 }) {
  // Combine and sort by date
  const events = [];
  articles.forEach(a => {
    if (a.published_date) events.push({ type: 'published', title: a.title, date: a.published_date, status: a.status });
    if (a.approved_date) events.push({ type: 'approved', title: a.title, date: a.approved_date, status: 'Approved' });
    if (a.created_date) events.push({ type: 'created', title: a.title, date: a.created_date, status: 'Draft' });
  });
  targets.forEach(t => {
    if (t.status === 'Published' && t.published_date) {
      events.push({ type: 'channel_published', title: t.article_title, channel: t.channel, date: t.published_date });
    }
  });
  events.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const eventConfig = {
    published: { icon: 'Send', color: 'green', label: 'Published' },
    approved: { icon: 'CheckCircle', color: 'blue', label: 'Approved' },
    created: { icon: 'FileEdit', color: 'slate', label: 'Created' },
    channel_published: { icon: 'Share2', color: 'purple', label: 'Distributed' },
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
        Recent Activity
      </h3>
      {events.length === 0 ? (
        <p className="text-slate-600 text-sm">No activity yet. Create your first article.</p>
      ) : (
        <div className="space-y-3">
          {events.slice(0, limit).map((ev, i) => {
            const cfg = eventConfig[ev.type] || eventConfig.created;
            const Icon = LucideIcons[cfg.icon];
            const c = STATUS_COLORS[cfg.color];
            return (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-md ${c.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-3 h-3 ${c.text}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{ev.title}</p>
                  <p className="text-xs text-slate-500">
                    {cfg.label}
                    {ev.channel && ` → ${CHANNELS[ev.channel]?.label || ev.channel}`}
                    {ev.date && ` · ${formatDate(ev.date)}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PipelineOverview({ articles, targets }) {
  const published = articles.filter(a => a.status === 'Published').length;
  const inPipeline = articles.filter(a => ['Draft','Review','Approved','Queued'].includes(a.status)).length;
  const scheduled = targets.filter(t => t.status === 'Scheduled').length;
  const failed = targets.filter(t => t.status === 'Failed').length;

  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="FileText" label="Total Articles" value={articles.length} color="blue" />
        <StatCard icon="Layers" label="In Pipeline" value={inPipeline} color="amber" sub={`${published} published`} />
        <StatCard icon="CalendarClock" label="Scheduled" value={scheduled} color="purple" />
        <StatCard icon="AlertCircle" label="Failed" value={failed} color={failed > 0 ? 'red' : 'slate'} />
      </div>

      {/* Pipeline + Channel Health */}
      <WorkflowPipeline articles={articles} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChannelHealth targets={targets} />
        <RecentActivity articles={articles} targets={targets} />
      </div>
    </div>
  );
}
