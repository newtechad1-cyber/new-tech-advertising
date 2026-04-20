import React, { useState } from 'react';
import {
  ChevronRight, CheckCircle2, XCircle, Trash2, Calendar,
  ExternalLink, AlertTriangle, Play, ChevronDown, ChevronUp,
  RotateCcw, Link2, MapPin
} from 'lucide-react';
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
  queued:      'bg-blue-900/40 text-blue-400 border-blue-700',
  scheduled:   'bg-blue-900/40 text-blue-400 border-blue-700',
  publishing:  'bg-amber-900/40 text-amber-400 border-amber-700',
  posted:      'bg-emerald-900/40 text-emerald-400 border-emerald-700',
  failed:      'bg-red-900/40 text-red-400 border-red-700',
  cancelled:   'bg-slate-800 text-slate-500 border-slate-700',
};

// Canonical runnable statuses (must match backend)
const ELIGIBLE_STATUSES = ['queued', 'scheduled', 'not_started'];

// Providers that require a selected_destination_id
const DESTINATION_REQUIRED = ['google_business_profile', 'youtube'];

function getTopBlocker(item, connection) {
  if (!item.connection_id) return { type: 'no_connection', msg: 'Cannot publish: no channel connection linked' };
  if (item.publish_status === 'failed') return { type: 'failed', msg: 'Cannot publish: item status is failed — reset required' };
  if (item.publish_status === 'publishing') return { type: 'stuck', msg: 'Possible stuck: item has been in "publishing" state — may need reset' };
  if (DESTINATION_REQUIRED.includes(item.provider) && connection && !connection.selected_destination_id) {
    return { type: 'no_destination', msg: `Cannot publish: no destination selected on connection (${item.provider === 'youtube' ? 'YouTube channel' : 'GBP location'} required)` };
  }
  if (item.approval_status !== 'approved') return { type: 'not_approved', msg: `Cannot publish: approval status is "${item.approval_status}"` };
  if (!item.scheduled_for) return { type: 'no_schedule', msg: 'Cannot publish: no scheduled date set' };
  if (!ELIGIBLE_STATUSES.includes(item.publish_status)) return { type: 'bad_status', msg: `Cannot publish: status is "${item.publish_status}"` };
  return null;
}

export default function QueueItemRow({ item, onRefresh, onDetail, connections = [] }) {
  const [acting, setActing] = useState(false);
  const [showDiag, setShowDiag] = useState(false);
  const [runResult, setRunResult] = useState(null);

  // Find this item's connection
  const connection = item.connection_id ? connections.find(c => c.id === item.connection_id) : null;

  const act = async (fn) => {
    setActing(true);
    setRunResult(null);
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

  // Reset to queued — clears stale worker state
  const resetToQueue = () => act(() =>
    base44.entities.PublishingQueue.update(item.id, {
      publish_status: 'queued',
      error_message: null,
    })
  );

  // Mark failed manually (for stuck publishing items)
  const markFailed = () => act(() =>
    base44.entities.PublishingQueue.update(item.id, {
      publish_status: 'failed',
      error_message: 'Manually marked as failed by operator',
    })
  );

  // Retry: only if destination is present (or not required), then reset + invoke
  const retry = async () => {
    const blocker = getTopBlocker(item, connection);
    if (blocker?.type === 'no_destination') {
      setRunResult({ ok: false, msg: blocker.msg + ' — select a destination in Channel Connections first.' });
      return;
    }
    setActing(true);
    setRunResult(null);
    try {
      await base44.entities.PublishingQueue.update(item.id, {
        publish_status: 'queued',
        error_message: null,
        retry_count: (item.retry_count || 0) + 1,
      });
      const res = await base44.functions.invoke('publishQueueItem', { queue_id: item.id });
      const d = res?.data;
      setRunResult(d?.success
        ? { ok: true, msg: `Published! ${d.platform_post_url || ''}` }
        : { ok: false, msg: d?.error || 'Unknown error' });
    } catch (err) {
      setRunResult({ ok: false, msg: err.message });
    }
    onRefresh();
    setActing(false);
  };

  // Run now (for eligible items)
  const runNow = async () => {
    setActing(true);
    setRunResult(null);
    try {
      await base44.entities.PublishingQueue.update(item.id, { approval_status: 'approved', publish_status: 'queued' });
      const res = await base44.functions.invoke('publishQueueItem', { queue_id: item.id });
      const d = res?.data;
      setRunResult(d?.success
        ? { ok: true, msg: `Published! ${d.platform_post_url || ''}` }
        : { ok: false, msg: d?.error || 'Unknown error' });
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
  const isEligibleStatus = ELIGIBLE_STATUSES.includes(item.publish_status);
  const isFailed = item.publish_status === 'failed';
  const isStuckPublishing = item.publish_status === 'publishing';
  const isCancelled = item.publish_status === 'cancelled';
  const isPosted = item.publish_status === 'posted';

  // Destination check
  const needsDestination = DESTINATION_REQUIRED.includes(item.provider);
  const hasDestination = !needsDestination || !!(connection?.selected_destination_id);
  const destinationName = connection?.selected_destination_name || connection?.selected_destination_id || null;
  const missingDestination = needsDestination && item.connection_id && !hasDestination;

  const topBlocker = getTopBlocker(item, connection);
  const willRunNext = isApproved && isEligibleStatus && isPast && item.connection_id && hasDestination;

  const diagItems = [
    { ok: isApproved, msg: `Approval: ${item.approval_status}${isApproved ? ' ✓' : ' (needs: approved)'}` },
    { ok: isEligibleStatus && !isFailed && !isStuckPublishing, msg: `Status: ${item.publish_status}${isEligibleStatus ? ' ✓' : ` (needs: ${ELIGIBLE_STATUSES.join('/')})` }` },
    { ok: !!scheduledFor, msg: scheduledFor ? `Scheduled: ${scheduledFor.toLocaleString()}${isPast ? ' — due now' : ' — future'}` : 'No scheduled_for date' },
    { ok: !!item.connection_id, msg: item.connection_id ? `Connection: ${item.connection_id.slice(0, 10)}… ✓` : 'No connection_id — link a channel' },
    ...(needsDestination ? [{ ok: hasDestination, msg: hasDestination ? `Destination: ${destinationName} ✓` : `No destination selected (${item.provider === 'youtube' ? 'channel' : 'location'} required)` }] : []),
    ...(item.notes?.includes('[Runner skip') ? [{ ok: false, msg: item.notes }] : []),
  ];

  const rowBorder = isFailed ? 'border-red-900' : isStuckPublishing ? 'border-amber-800' : 'border-slate-800';

  return (
    <div className={`bg-slate-900 border rounded-xl px-4 py-3 space-y-2 ${rowBorder}`}>
      <div className="flex items-center gap-3">
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
              <span className={`flex items-center gap-1 ${isPast && isEligibleStatus ? 'text-amber-400' : ''}`}>
                <Calendar className="w-3 h-3" />
                {scheduledFor.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                {isPast && isEligibleStatus && ' (due)'}
              </span>
            )}
            {item.retry_count > 0 && <span className="text-amber-500">Retried {item.retry_count}×</span>}
          </div>

          {/* Top blocker — shown inline when something is wrong */}
          {topBlocker && !isPosted && !isCancelled && (
            <div className="flex items-start gap-1.5 mt-1.5">
              <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">{topBlocker.msg}</p>
            </div>
          )}

          {/* Destination missing — extra action hint */}
          {missingDestination && (
            <a href="/agency/channel-connections" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1 hover:underline">
              <MapPin className="w-3 h-3" /> Select Destination in Channel Connections →
            </a>
          )}

          {item.error_message && !topBlocker && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" /> {item.error_message}
            </p>
          )}
          {item.platform_post_url && (
            <a href={item.platform_post_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1">
              <ExternalLink className="w-3 h-3" /> View Post
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
          {/* Approval actions */}
          {item.approval_status === 'needs_review' && (
            <>
              <button onClick={approve} disabled={acting} title="Approve"
                className="p-1.5 text-emerald-400 hover:bg-emerald-900/30 rounded-lg disabled:opacity-50">
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button onClick={reject} disabled={acting} title="Reject"
                className="p-1.5 text-red-400 hover:bg-red-900/30 rounded-lg disabled:opacity-50">
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Failed: Reset to Queue + Retry */}
          {isFailed && !missingDestination && (
            <>
              <button onClick={resetToQueue} disabled={acting} title="Reset to Queue"
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button onClick={retry} disabled={acting} title="Retry Now"
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg">
                <Play className="w-3.5 h-3.5" /> {acting ? '...' : 'Retry'}
              </button>
            </>
          )}

          {/* Failed with missing destination: only show link */}
          {isFailed && missingDestination && (
            <a href="/agency/channel-connections"
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg">
              <Link2 className="w-3.5 h-3.5" /> Select Destination
            </a>
          )}

          {/* Stuck publishing: Reset to Queue or Mark Failed */}
          {isStuckPublishing && (
            <>
              <button onClick={resetToQueue} disabled={acting} title="Reset to Queue"
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button onClick={markFailed} disabled={acting} title="Mark Failed"
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-red-800 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg">
                <XCircle className="w-3.5 h-3.5" /> Mark Failed
              </button>
            </>
          )}

          {/* Eligible items: Run Now */}
          {isEligibleStatus && !isFailed && isApproved && item.connection_id && !missingDestination && (
            <button onClick={runNow} disabled={acting} title="Run Now — bypass job runner"
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg">
              <Play className="w-3.5 h-3.5" /> {acting ? '...' : 'Run Now'}
            </button>
          )}

          {/* Cancel for queued items */}
          {ELIGIBLE_STATUSES.includes(item.publish_status) && (
            <button onClick={cancel} disabled={acting} title="Cancel"
              className="p-1.5 text-slate-500 hover:bg-slate-800 rounded-lg disabled:opacity-50">
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button onClick={() => setShowDiag(!showDiag)} title="Diagnostics"
            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg">
            {showDiag ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={() => onDetail(item)} title="Details"
            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Run result feedback */}
      {runResult && (
        <div className={`text-xs px-3 py-2 rounded-lg border ${runResult.ok ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' : 'bg-red-900/20 border-red-800 text-red-300'}`}>
          {runResult.msg}
        </div>
      )}

      {/* Diagnostics panel */}
      {showDiag && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-400">Diagnostics</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${willRunNext ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700' : 'bg-amber-900/40 text-amber-400 border-amber-800'}`}>
              {willRunNext ? '✓ Will run on next cycle' : '⚠ Will NOT run automatically'}
            </span>
          </div>

          {/* Top blocker highlight */}
          {topBlocker && (
            <div className="bg-red-950/40 border border-red-800/60 rounded-lg px-3 py-2 mb-2">
              <p className="text-xs font-bold text-red-400">{topBlocker.msg}</p>
            </div>
          )}

          <div className="space-y-1">
            {diagItems.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`flex-shrink-0 mt-0.5 font-bold ${d.ok === true ? 'text-emerald-400' : d.ok === false ? 'text-red-400' : 'text-slate-500'}`}>
                  {d.ok === true ? '✓' : d.ok === false ? '✗' : '○'}
                </span>
                <span className={d.ok === false ? 'text-red-300' : d.ok === true ? 'text-slate-300' : 'text-slate-500'}>{d.msg}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs pt-2 border-t border-slate-800 mt-1">
            <span className="text-slate-500">Runner status field</span><span className="text-slate-400">publish_status</span>
            <span className="text-slate-500">Runnable values</span><span className="text-slate-400">queued / scheduled / not_started</span>
            <span className="text-slate-500">Item ID</span><span className="text-slate-400 font-mono">{item.id?.slice(0, 14)}</span>
            <span className="text-slate-500">Current time</span><span className="text-slate-400">{now.toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}