import React, { useState } from 'react';
import { ChevronRight, RotateCcw, CheckCircle2, XCircle, Pause, Trash2, Copy, Calendar, ExternalLink, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PROVIDER_ICONS = {
  google_business_profile: '📍',
  facebook: '👥',
  instagram: '📸',
  youtube: '▶️',
};

const APPROVAL_BADGE = {
  draft: 'bg-slate-800 text-slate-400 border-slate-700',
  needs_review: 'bg-amber-900/40 text-amber-400 border-amber-700',
  approved: 'bg-emerald-900/40 text-emerald-400 border-emerald-700',
  rejected: 'bg-red-900/40 text-red-400 border-red-700',
};

const PUBLISH_BADGE = {
  queued: 'bg-slate-800 text-slate-400 border-slate-700',
  scheduled: 'bg-blue-900/40 text-blue-400 border-blue-700',
  publishing: 'bg-amber-900/40 text-amber-400 border-amber-700',
  posted: 'bg-emerald-900/40 text-emerald-400 border-emerald-700',
  failed: 'bg-red-900/40 text-red-400 border-red-700',
  paused: 'bg-slate-700 text-slate-400 border-slate-600',
  cancelled: 'bg-slate-800 text-slate-500 border-slate-700',
};

export default function QueueItemRow({ item, onRefresh, onDetail }) {
  const [acting, setActing] = useState(false);

  const act = async (fn) => {
    setActing(true);
    await fn();
    onRefresh();
    setActing(false);
  };

  const approve = () => act(() => base44.entities.PublishingQueue.update(item.id, { approval_status: 'approved', publish_status: 'scheduled' }));
  const reject  = () => act(() => base44.entities.PublishingQueue.update(item.id, { approval_status: 'rejected', publish_status: 'paused' }));
  const retry   = () => act(() => base44.functions.invoke('publishQueueItem', { queue_id: item.id }));
  const cancel  = () => act(() => base44.entities.PublishingQueue.update(item.id, { publish_status: 'cancelled' }));

  return (
    <div className={`bg-slate-900 border rounded-xl px-4 py-3 flex items-center gap-4 ${item.publish_status === 'failed' ? 'border-red-900' : 'border-slate-800'}`}>
      {/* Platform icon */}
      <span className="text-xl flex-shrink-0">{PROVIDER_ICONS[item.provider] || '📤'}</span>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-white text-sm truncate">{item.title || item.body_text?.slice(0, 60) || 'Untitled'}</p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${APPROVAL_BADGE[item.approval_status]}`}>
            {item.approval_status?.replace(/_/g, ' ')}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PUBLISH_BADGE[item.publish_status]}`}>
            {item.publish_status}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
          <span>{item.client_name || item.client_id}</span>
          <span className="capitalize">{item.content_type?.replace(/_/g, ' ')}</span>
          {item.scheduled_for && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(item.scheduled_for).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
        {item.publish_status === 'failed' && item.retry_count < (item.max_retries || 3) && (
          <button onClick={retry} disabled={acting} title="Retry"
            className="p-1.5 text-amber-400 hover:bg-amber-900/30 rounded-lg transition-colors disabled:opacity-50">
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
        {['queued', 'scheduled'].includes(item.publish_status) && (
          <button onClick={cancel} disabled={acting} title="Cancel"
            className="p-1.5 text-slate-500 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <button onClick={() => onDetail(item)} title="Details"
          className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}