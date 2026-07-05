/**
 * E-005 Editorial Dashboard — Widget Components
 * Reusable dashboard widgets for queues, performance metrics, and publishing actions.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import {
  FileEdit, Clock, Send, Mail, Youtube, Share2, BookOpen,
  Calendar, TrendingUp, Search, Eye, Heart, Play,
  ChevronRight, Zap, ArrowUpRight, BarChart2, Loader2,
  CheckCircle2, Newspaper, Rss, MapPin, GraduationCap
} from 'lucide-react';
import {
  CHANNELS, CHANNEL_LIST, WORKFLOW_STATES, TARGET_STATES,
  STATUS_COLORS, formatDate, formatDateTime
} from './publishingData';

// ── Stat Widget ─────────────────────────────────────────────────────────────
export function StatWidget({ icon: Icon, label, value, sub, color = 'blue', trend, onClick }) {
  const c = STATUS_COLORS[color] || STATUS_COLORS.blue;
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className={`p-4 rounded-xl ${c.bg} border ${c.border} text-left transition-all ${onClick ? 'hover:brightness-110 cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${c.text}`} />
        </div>
        {trend && (
          <span className={`text-[10px] font-bold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
      {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
    </Wrapper>
  );
}

// ── Queue Widget ────────────────────────────────────────────────────────────
export function QueueWidget({ title, icon: Icon, color = 'blue', items, emptyText, onItemClick, onPublishAll }) {
  const c = STATUS_COLORS[color] || STATUS_COLORS.blue;

  return (
    <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${c.text}`} />
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text}`}>
            {items.length}
          </span>
        </div>
        {onPublishAll && items.length > 0 && (
          <button
            onClick={onPublishAll}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold transition-colors"
          >
            <Zap className="w-3 h-3" /> Publish All
          </button>
        )}
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-xs text-slate-600">{emptyText || 'Queue empty'}</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/50">
          {items.slice(0, 8).map((item, i) => (
            <button
              key={i}
              onClick={() => onItemClick?.(item)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/30 transition-colors text-left"
            >
              {item.channelIcon && (
                <item.channelIcon className={`w-3.5 h-3.5 ${item.channelColor || 'text-slate-500'} flex-shrink-0`} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                <p className="text-[10px] text-slate-500 truncate">{item.subtitle}</p>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.badgeColor || 'bg-slate-800 text-slate-400'}`}>
                  {item.badge}
                </span>
              )}
              {item.date && (
                <span className="text-[10px] text-slate-600 flex-shrink-0">{formatDate(item.date)}</span>
              )}
              <ChevronRight className="w-3 h-3 text-slate-700 flex-shrink-0" />
            </button>
          ))}
          {items.length > 8 && (
            <div className="px-4 py-2 text-center">
              <span className="text-[10px] text-slate-600">+{items.length - 8} more</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Performance Widget ──────────────────────────────────────────────────────
export function PerformanceWidget({ title, icon: Icon, color = 'blue', items, metricLabel }) {
  const c = STATUS_COLORS[color] || STATUS_COLORS.blue;

  return (
    <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
        <Icon className={`w-4 h-4 ${c.text}`} />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>

      {items.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-xs text-slate-600">No data yet</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/50">
          {items.slice(0, 5).map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                i === 0 ? 'bg-amber-500/20 text-amber-400' :
                i === 1 ? 'bg-slate-400/20 text-slate-300' :
                i === 2 ? 'bg-orange-500/20 text-orange-400' :
                'bg-slate-800 text-slate-500'
              }`}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                {item.subtitle && <p className="text-[10px] text-slate-500">{item.subtitle}</p>}
              </div>
              <span className={`text-xs font-bold ${c.text}`}>
                {item.metric} {metricLabel || ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Monthly Themes Widget ───────────────────────────────────────────────────
export function MonthlyThemesWidget({ articles }) {
  // Count themes from articles this month
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;

  const themeCounts = {};
  articles.forEach(a => {
    if (a.primary_theme) {
      themeCounts[a.primary_theme] = (themeCounts[a.primary_theme] || 0) + 1;
    }
  });

  const sorted = Object.entries(themeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  const max = sorted[0]?.[1] || 1;

  return (
    <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
        <BarChart2 className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-bold text-white">Content Themes</h3>
      </div>

      {sorted.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-xs text-slate-600">No themed content yet</p>
        </div>
      ) : (
        <div className="p-4 space-y-2.5">
          {sorted.map(([theme, count]) => (
            <div key={theme}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-300">{theme}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{count}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── One-Click Publish Widget ────────────────────────────────────────────────
export function OneClickPublishWidget({ articles, targets, onPublish }) {
  const [publishing, setPublishing] = useState(null);

  // Articles that are Queued with Scheduled targets
  const ready = articles
    .filter(a => a.status === 'Queued')
    .map(a => {
      const articleTargets = targets.filter(t => t.article_id === a.id);
      const scheduled = articleTargets.filter(t => t.status === 'Scheduled');
      const total = articleTargets.length;
      return { ...a, scheduled: scheduled.length, total, targets: articleTargets };
    })
    .filter(a => a.scheduled > 0);

  async function handlePublish(article) {
    setPublishing(article.id);
    try {
      await onPublish(article);
    } finally {
      setPublishing(null);
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-green-500/10">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-bold text-white">One-Click Publish</h3>
        </div>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400">
          {ready.length} ready
        </span>
      </div>

      {ready.length === 0 ? (
        <div className="p-6 text-center">
          <Zap className="w-8 h-8 text-slate-700 mx-auto mb-2" />
          <p className="text-xs text-slate-600">No articles ready for one-click publish</p>
          <p className="text-[10px] text-slate-700">Queue articles and schedule channels first</p>
        </div>
      ) : (
        <div className="divide-y divide-green-500/10">
          {ready.map(article => (
            <div key={article.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{article.title}</p>
                <p className="text-[10px] text-slate-500">
                  {article.scheduled} of {article.total} channels scheduled
                </p>
              </div>
              <button
                onClick={() => handlePublish(article)}
                disabled={publishing === article.id}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-colors disabled:opacity-50 shadow-lg shadow-green-600/20"
              >
                {publishing === article.id ? (
                  <><Loader2 className="w-3 h-3 animate-spin" /> Publishing...</>
                ) : (
                  <><Send className="w-3 h-3" /> Publish Now</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Mini Calendar Widget ────────────────────────────────────────────────────
export function MiniCalendarWidget({ targets }) {
  const now = new Date();
  const upcoming = targets
    .filter(t => t.status === 'Scheduled' && t.scheduled_date)
    .sort((a, b) => (a.scheduled_date + (a.scheduled_time || '')).localeCompare(b.scheduled_date + (b.scheduled_time || '')))
    .slice(0, 7);

  // Group by date
  const grouped = {};
  upcoming.forEach(t => {
    if (!grouped[t.scheduled_date]) grouped[t.scheduled_date] = [];
    grouped[t.scheduled_date].push(t);
  });

  return (
    <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Upcoming</h3>
        </div>
        <Link
          to="/PublishingEngine"
          className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold"
        >
          Full Calendar →
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <div className="p-6 text-center">
          <Calendar className="w-8 h-8 text-slate-700 mx-auto mb-2" />
          <p className="text-xs text-slate-600">Nothing scheduled</p>
        </div>
      ) : (
        <div className="p-3 space-y-3">
          {Object.entries(grouped).map(([date, items]) => {
            const d = new Date(date + 'T12:00:00');
            const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const isToday = date === `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

            return (
              <div key={date}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isToday ? 'text-blue-400' : 'text-slate-500'}`}>
                  {isToday ? '📍 Today' : dayLabel}
                </p>
                <div className="space-y-1">
                  {items.map((t, i) => {
                    const cfg = CHANNELS[t.channel];
                    const Icon = LucideIcons[cfg?.icon] || LucideIcons.Circle;
                    const sc = STATUS_COLORS[cfg?.color] || STATUS_COLORS.blue;
                    return (
                      <div key={i} className={`flex items-center gap-2 px-2 py-1 rounded-lg ${sc.bg}`}>
                        <Icon className={`w-3 h-3 ${sc.text}`} />
                        <span className="text-[10px] text-white truncate flex-1">{t.article_title || 'Article'}</span>
                        <span className="text-[10px] text-slate-500">{t.scheduled_time || '07:00'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
