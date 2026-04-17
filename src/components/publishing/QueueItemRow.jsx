import React, { useState } from 'react';
import { ChevronRight, RotateCcw, CheckCircle2, XCircle, Trash2, Calendar, ExternalLink, AlertTriangle, Play, ChevronDown, ChevronUp, Clock, Wifi, WifiOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PROVIDER_ICONS = {
  google_business_profile: '📍',
  facebook: '👥',
  instagram: '📸',
  youtube: '▶️',
};

const APPROVAL_BADGE = {
  draft:        'bg-slate-800 text-slate-400 border-slate-700',
  needs_review: 'bg-amber-900/40 text-amber-400 border-amber-700',
  approved:     'bg-emerald-900/40 text-emerald-400 border-emerald-700',
  rejected:     'bg-red-900/40 text-red-400 border-red-700',
};

const PUBLISH_BADGE = {
  not_started: 'bg-slate-800 text-slate-500 border-slate-700',
  queued:      'bg-slate-800 text-slate-400 border-slate-700',
  scheduled:   'bg-blue-900/40 text-blue-400 border-blue-700',
  publishing:  'bg-amber-900/40 text-amber-400 border-amber-700',
  posted:      'bg-emerald-900/40 text-emerald-400 border-emerald-700',
  failed:      'bg-red-900/40 text-red-400 border-red-700',
  cancelled:   'bg-slate-800 text-slate-500 border-slate-700',
};

export default function QueueItemRow({ item, onRefresh, onDetail }) {
  const [acting, setActing] = useState(false);
  const [showDiag, setShowDiag] = useState(false);
  const [runResult, setRunResult] = useState(null);

  const act = async (fn) => {
    setActing(true);
    await fn();
    onRefresh();
    setActing(false);
  };

  const approve = () => act(() =>
    base44.entities.PublishingQueue.update(item.id, { approval_status: 'approved', publish_status: 'queued' })
  );
  const reject = () => act(() =>
    base44.entities.PublishingQueue.update(item.id, { approval_status: 'rejected', publish_status: 'cancelled' })
  );
  const cancel = () => act(() =>
    base44.entities.PublishingQueue.update(item.id, { publish_status: 'cancelled' })
  );

  const runNow = async () => {
    setActing(true);
    setRunResult(null);
    try {
      // First ensure it's approved + queued
      await base44.entities.PublishingQueue.update(item.id, { approval_status: 'approved', publish_status: 'queued' });
      const res = await base44.functions.invoke('publishQueueItem', { queue_id: item.id });
      setRunResult(res?.data?.success ? { ok: true, msg: `Published! ${res.data.platform_post_url || ''}` } : { ok: false, msg: res?.data?.error || 'Unknown error' });
    } catch (err) {
      setRunResult({ ok: false, msg: err.message });
    }
    onRefresh();
    setActing(false);
  };

  // Diagnostics
  const now = new Date();
  const scheduledFor = item.scheduled_for ? new Date(item.scheduled_for) : null;
  const isPast = scheduledFor ? scheduledFor <= now : false;
  const isApproved = item.approval_status === 'approved';
  const isActionable = ['queued', 'scheduled', 'not_started'].includes(item.publish_status);
  const hasDestinationIssue = !item.connection_id;

  const diagStatus = [];
  if (!isApproved) diagStatus.push({ ok: false, msg: `Approval: ${item.approval_status} (needs: approved)` });
  else diagStatus.push({ ok: true, msg: `Approval: approved ✓` });

  if (!isActionable) diagStatus.push({ ok: false, msg: `Status: ${item.publish_status} (needs: queued/scheduled/not_started)` });
  else diagStatus.push({ ok: true, msg: `Status: ${item.publish_status} ✓` });

  if (!scheduledFor) diagStatus.push({ ok: false, msg: 'No scheduled_for date set' });
  else if (isPast) diagStatus.push({ ok: true, msg: `Scheduled: ${scheduledFor.toLocaleString()} (past — due now)` });
  else diagStatus.push({ ok: null, msg: `Scheduled: ${scheduledFor.toLocaleString()} (future)` });

  if (hasDestinationIssue) diagStatus.push({ ok: false, msg: 'No connection_id set' });
  else diagStatus.push({ ok: true, msg: 'Connection ID present ✓' });

  if (item.notes && item.notes.includes('[Runner skip')) {
    diagStatus.push({ ok: false, msg: item.notes });
  }

  const willRunNext = isApproved && isActionable && isPast && !hasDestinationIssue;

  return (
    <div className={`bg-slate-900 border rounded-xl px-4 py-3 space-y-2 ${item.publish_status === 'failed' ? 'border-red-900' : 'border-slate-800'}`}>
      <div className="flex items-center gap-4">
        {/* Platform icon */}
        <span className="text-xl flex-shrink-0">{PROVIDER_ICONS[item.provider] || '📤'}</span>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-white text-sm truncate">{item.title || item.body_text?.slice(0, 60) || 'Untitled'}</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${APPROVAL_BADGE[item.approval_status] || APPROVAL_BADGE.draft}`}>
              {item.approval_status?.replace(/_/g, ' ')}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PUBLISH_BADGE[item.publish_status] || PUBLISH_BADGE.queued}`}>
              {item.publish_status?.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
            <span>{item.client_name || item.client_id}</span>
            <span className="capitalize">{item.content_type?.replace(/_/g, ' ')}</span>
            {scheduledFor && (
              <span className={`flex items-center gap-1 ${isPast && isActionable ? 'text-amber-400' : ''}`}>
                <Calendar className="w-3 h-3" />
                {scheduledFor.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                {isPast && isActionable && ' (due)'}
              </span>
            )}
            {item.retry_count > 0 && <span className="text-amber-500">Retried {item.retry_count}×</span>}
          </div>
          {item.error_message && (
            <div className="flex items-center gap-1.5 mt-1">
              <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400 truncate">{item.error_message}</p>
            </div>
          )}
          {item.platform_post_url && (
            <a href={item.platform_post_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1">
              <ExternalLink className="w-3 h-3" /> View Post
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {item.approval_status === 'needs_review' && (
            <>
              <button onClick={approve} disabled={acting} title="Approve"
                className="p-1.5 text-emerald-400 hover:bg-emerald-900/30 rounded-lg transition-colors disabled:opacity-50">
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button onClick={reject} disabled={acting} title="Reject"
                className="p-1.5 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50">
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          {/* Run This Now */}
          {item.publish_status !== 'posted' && item.publish_status !== 'publishing' && (
            <button onClick={runNow} disabled={acting} title="Run This Now — bypass job runner"
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg transition-colors">
              <Play className="w-3.5 h-3.5" />
              {acting ? '...' : 'Run Now'}
            </button>
          )}
          {['queued', 'scheduled', 'not_started'].includes(item.publish_status) && (
            <button onClick={cancel} disabled={acting} title="Cancel"
              className="p-1.5 text-slate-500 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => setShowDiag(!showDiag)} title="Diagnostics"
            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            {showDiag ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={() => onDetail(item)} title="Details"
            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Run result */}
      {runResult && (
        <div className={`text-xs px-3 py-2 rounded-lg border ${runResult.ok ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' : 'bg-red-900/20 border-red-800 text-red-300'}`}>
          {runResult.msg}
        </div>
      )}

      {/* Diagnostics panel */}
      {showDiag && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-400">Queue Diagnostics</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${willRunNext ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700' : 'bg-amber-900/40 text-amber-400 border-amber-800'}`}>
              {willRunNext ? '✓ Will run on next cycle' : '⚠ Will NOT run — see below'}
            </span>
          </div>
          <div className="space-y-1">
            {diagStatus.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`flex-shrink-0 mt-0.5 ${d.ok === true ? 'text-emerald-400' : d.ok === false ? 'text-red-400' : 'text-slate-500'}`}>
                  {d.ok === true ? '✓' : d.ok === false ? '✗' : '○'}
                </span>
                <span className={d.ok === false ? 'text-red-300' : d.ok === true ? 'text-slate-300' : 'text-slate-500'}>{d.msg}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-600 pt-1 border-t border-slate-800">
            Current time: {now.toLocaleString()} · Provider: {item.provider} · ID: {item.id?.slice(0, 12)}
          </div>
        </div>
      )}
    </div>
  );
}