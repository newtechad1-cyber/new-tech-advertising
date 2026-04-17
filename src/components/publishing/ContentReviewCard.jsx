import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Eye, Check, X, Send, Clock, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import SendToQueueModal from './SendToQueueModal';

const STATUS_STYLES = {
  draft: 'bg-slate-700 text-slate-300',
  needs_review: 'bg-amber-900 text-amber-300',
  ready_for_review: 'bg-violet-900 text-violet-300',
  approved: 'bg-teal-900 text-teal-300',
  rejected: 'bg-red-900 text-red-300',
  published: 'bg-emerald-900 text-emerald-300',
  queued: 'bg-blue-900 text-blue-300',
  posted: 'bg-emerald-700 text-emerald-100',
};

const ASSET_LABELS = {
  blog: 'Blog', landing_page: 'Landing Page', video_script: 'Video Script',
  social_series: 'Social Series', gbp_post: 'GBP Post', email: 'Email',
};

export default function ContentReviewCard({ asset, onUpdated, onView, selected, onSelect }) {
  const [queueModal, setQueueModal] = useState(null); // 'queue' | 'schedule' | 'now' | null
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = async (fields) => {
    setSaving(true);
    await base44.entities.ContentAssets.update(asset.id, fields);
    onUpdated?.({ ...asset, ...fields });
    setSaving(false);
  };

  const status = asset.status;
  const isReviewable = ['draft', 'needs_review', 'ready_for_review'].includes(status);
  const isApproved = status === 'approved' || status === 'published';

  return (
    <>
      <div className={`bg-slate-900 border rounded-xl p-4 transition-colors ${selected ? 'border-blue-600' : 'border-slate-800 hover:border-slate-700'}`}>
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <input type="checkbox" checked={selected} onChange={e => onSelect?.(asset.id, e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-slate-600 accent-blue-500 flex-shrink-0 cursor-pointer" />

          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="font-semibold text-white text-sm">{asset.title || asset.topic_title || '—'}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {asset.client} · {ASSET_LABELS[asset.asset_type] || asset.asset_type} · {fmt(asset.created_date)}
                </p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_STYLES[status] || 'bg-slate-700 text-slate-300'}`}>
                {status?.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Content preview */}
            {asset.content && (
              <div className="mt-2">
                <p className={`text-xs text-slate-400 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
                  {asset.content}
                </p>
                {asset.content.length > 120 && (
                  <button onClick={() => setExpanded(p => !p)} className="text-xs text-slate-600 hover:text-slate-400 mt-0.5 flex items-center gap-0.5">
                    {expanded ? <><ChevronUp className="w-3 h-3" />Less</> : <><ChevronDown className="w-3 h-3" />More</>}
                  </button>
                )}
              </div>
            )}

            {/* Action bar */}
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <button onClick={() => onView?.(asset)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg">
                <Eye className="w-3.5 h-3.5" /> View
              </button>

              {isReviewable && (
                <button onClick={() => update({ status: 'approved' })} disabled={saving}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg disabled:opacity-50">
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
              )}

              {isReviewable && (
                <button onClick={() => update({ status: 'rejected' })} disabled={saving}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-300 text-xs font-semibold rounded-lg disabled:opacity-50">
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
              )}

              {status === 'rejected' && (
                <button onClick={() => update({ status: 'needs_review' })} disabled={saving}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg">
                  ↩ Re-review
                </button>
              )}

              {(isApproved || isReviewable) && (
                <>
                  <button onClick={() => setQueueModal('queue')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-900/60 hover:bg-blue-700 text-blue-300 text-xs font-semibold rounded-lg">
                    <Send className="w-3.5 h-3.5" /> Send to Queue
                  </button>
                  <button onClick={() => setQueueModal('schedule')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-violet-900/60 hover:bg-violet-700 text-violet-300 text-xs font-semibold rounded-lg">
                    <Clock className="w-3.5 h-3.5" /> Schedule
                  </button>
                  <button onClick={() => setQueueModal('now')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg">
                    <Zap className="w-3.5 h-3.5" /> Publish Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {queueModal && (
        <SendToQueueModal
          asset={asset}
          mode={queueModal}
          onClose={() => setQueueModal(null)}
          onSuccess={() => { onUpdated?.({ ...asset, status: queueModal === 'now' ? 'published' : 'approved' }); }}
        />
      )}
    </>
  );
}

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}