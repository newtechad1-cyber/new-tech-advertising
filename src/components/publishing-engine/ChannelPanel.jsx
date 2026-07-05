/**
 * P-001 Publishing Engine — Channel Panel
 * Per-channel content adaptation, scheduling, and status management.
 * Shows all 10 channels with their derivative content and publish state.
 */
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import {
  ChevronDown, ChevronRight, Calendar, Clock, Send,
  ExternalLink, SkipForward, RefreshCw, AlertCircle
} from 'lucide-react';
import {
  CHANNELS, CHANNEL_LIST, TARGET_STATES, STATUS_COLORS,
  DEFAULT_SCHEDULE, formatDate, formatDateTime, getNextDefaultSchedule
} from './publishingData';

function ChannelRow({ channel, target, onUpdate, onSchedule, articleStatus }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = CHANNELS[channel];
  const Icon = LucideIcons[cfg.icon] || LucideIcons.Circle;
  const channelColor = STATUS_COLORS[cfg.color] || STATUS_COLORS.blue;

  const status = target?.status || 'Pending';
  const ts = TARGET_STATES[status];
  const sc = STATUS_COLORS[ts.color];
  const StatusIcon = LucideIcons[ts.icon] || LucideIcons.Circle;

  const canSchedule = articleStatus === 'Approved' || articleStatus === 'Queued';
  const canPublish = status === 'Scheduled' || status === 'Adapted';
  const canRetry = status === 'Failed';

  return (
    <div className={`rounded-xl border transition-all ${expanded ? `${channelColor.bg} ${channelColor.border}` : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'}`}>
      {/* Row header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <Icon className={`w-4 h-4 ${channelColor.text} flex-shrink-0`} />
        <span className="text-sm font-semibold text-white flex-1">{cfg.label}</span>

        {/* Status badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
          <StatusIcon className="w-3 h-3" />
          {ts.label}
        </span>

        {/* Schedule date if scheduled */}
        {status === 'Scheduled' && target?.scheduled_date && (
          <span className="text-[10px] text-slate-500 hidden sm:block">
            {formatDateTime(target.scheduled_date, target.scheduled_time)}
          </span>
        )}

        {/* Platform link if published */}
        {status === 'Published' && target?.platform_url && (
          <a
            href={target.platform_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-green-400 hover:text-green-300"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {expanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-slate-800/50 pt-3">
          {/* Adapted content */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
              {channel === 'X' ? `Content (${cfg.maxChars} char limit)` : 'Adapted Content'}
            </label>
            <textarea
              value={target?.adapted_body || ''}
              onChange={(e) => onUpdate(channel, { adapted_body: e.target.value })}
              placeholder={`Write ${cfg.label} version...`}
              rows={channel === 'X' ? 3 : 5}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-700 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500/50"
            />
            {cfg.maxChars && target?.adapted_body && (
              <p className={`text-[10px] mt-0.5 ${
                target.adapted_body.length > cfg.maxChars ? 'text-red-400' : 'text-slate-600'
              }`}>
                {target.adapted_body.length}/{cfg.maxChars} characters
              </p>
            )}
          </div>

          {/* Channel-specific fields */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Title</label>
              <input
                type="text"
                value={target?.adapted_title || ''}
                onChange={(e) => onUpdate(channel, { adapted_title: e.target.value })}
                placeholder="Channel-specific title..."
                className="w-full px-2 py-1.5 rounded-lg bg-slate-950/50 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Hashtags</label>
              <input
                type="text"
                value={target?.hashtags || ''}
                onChange={(e) => onUpdate(channel, { hashtags: e.target.value })}
                placeholder="#tags"
                className="w-full px-2 py-1.5 rounded-lg bg-slate-950/50 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Media */}
          {cfg.supportsMedia && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Media URL</label>
              <input
                type="text"
                value={target?.media_url || ''}
                onChange={(e) => onUpdate(channel, { media_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-2 py-1.5 rounded-lg bg-slate-950/50 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500/50"
              />
            </div>
          )}

          {/* Schedule */}
          {cfg.supportsSchedule && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/30 border border-slate-700/50">
              <Calendar className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <input
                type="date"
                value={target?.scheduled_date || ''}
                onChange={(e) => onUpdate(channel, { scheduled_date: e.target.value })}
                className="bg-transparent text-xs text-white border-none focus:outline-none"
              />
              <Clock className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <input
                type="time"
                value={target?.scheduled_time || DEFAULT_SCHEDULE.time}
                onChange={(e) => onUpdate(channel, { scheduled_time: e.target.value })}
                className="bg-transparent text-xs text-white border-none focus:outline-none"
              />
            </div>
          )}

          {/* Error message */}
          {status === 'Failed' && target?.error_message && (
            <div className="flex items-start gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">{target.error_message}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            {status === 'Pending' && (
              <button
                onClick={() => onUpdate(channel, { status: 'Adapted' })}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
              >
                Mark as Adapted
              </button>
            )}
            {canSchedule && status !== 'Scheduled' && status !== 'Published' && (
              <button
                onClick={() => {
                  const sched = getNextDefaultSchedule();
                  onUpdate(channel, { status: 'Scheduled', scheduled_date: target?.scheduled_date || sched.date, scheduled_time: target?.scheduled_time || sched.time });
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-colors"
              >
                <Calendar className="w-3 h-3" /> Schedule
              </button>
            )}
            {canRetry && (
              <button
                onClick={() => onUpdate(channel, { status: 'Adapted', error_message: '', retry_count: (target?.retry_count || 0) + 1 })}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-500 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            )}
            {status !== 'Skipped' && status !== 'Published' && (
              <button
                onClick={() => onUpdate(channel, { status: 'Skipped' })}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-600 transition-colors"
              >
                <SkipForward className="w-3 h-3" /> Skip
              </button>
            )}

            {/* Published link */}
            {status === 'Published' && target?.platform_url && (
              <a
                href={target.platform_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> View on {cfg.label}
              </a>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Notes</label>
            <input
              type="text"
              value={target?.notes || ''}
              onChange={(e) => onUpdate(channel, { notes: e.target.value })}
              placeholder="Channel-specific notes..."
              className="w-full px-2 py-1.5 rounded-lg bg-slate-950/50 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChannelPanel({ article, targets, onUpdateTarget }) {
  const [scheduleAll, setScheduleAll] = useState(false);
  const channels = article?.publish_to_channels || CHANNEL_LIST;

  function getTarget(channel) {
    return targets.find(t => t.channel === channel) || null;
  }

  function scheduleAllChannels() {
    const sched = getNextDefaultSchedule();
    channels.forEach(ch => {
      const cfg = CHANNELS[ch];
      if (cfg.supportsSchedule) {
        const t = getTarget(ch);
        if (!t || (t.status !== 'Published' && t.status !== 'Skipped')) {
          onUpdateTarget(ch, {
            status: 'Scheduled',
            scheduled_date: t?.scheduled_date || sched.date,
            scheduled_time: t?.scheduled_time || sched.time,
          });
        }
      }
    });
  }

  const schedulable = channels.filter(ch => CHANNELS[ch]?.supportsSchedule);
  const publishedCount = targets.filter(t => t.status === 'Published').length;
  const scheduledCount = targets.filter(t => t.status === 'Scheduled').length;

  return (
    <div className="space-y-4">
      {/* Header with quick actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Publishing Channels</h3>
          <p className="text-xs text-slate-500">
            {publishedCount} published · {scheduledCount} scheduled · {channels.length} total
          </p>
        </div>
        {(article?.status === 'Approved' || article?.status === 'Queued') && (
          <button
            onClick={scheduleAllChannels}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-colors"
          >
            <Calendar className="w-3 h-3" />
            Schedule All
          </button>
        )}
      </div>

      {/* Channel list */}
      <div className="space-y-2">
        {channels.map(ch => (
          <ChannelRow
            key={ch}
            channel={ch}
            target={getTarget(ch)}
            onUpdate={onUpdateTarget}
            articleStatus={article?.status}
          />
        ))}

        {/* Channels not included */}
        {CHANNEL_LIST.filter(ch => !channels.includes(ch)).length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <p className="text-[10px] text-slate-600 uppercase tracking-wider font-bold mb-2">Not included</p>
            {CHANNEL_LIST.filter(ch => !channels.includes(ch)).map(ch => {
              const cfg = CHANNELS[ch];
              const Icon = LucideIcons[cfg.icon] || LucideIcons.Circle;
              return (
                <div key={ch} className="flex items-center gap-2 px-3 py-1.5 text-slate-700">
                  <Icon className="w-3 h-3" />
                  <span className="text-xs">{cfg.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
