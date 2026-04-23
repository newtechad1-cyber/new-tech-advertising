import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Send } from 'lucide-react';
import { CQApprovalBadge } from './CQUtils';
import ContentQueueDrawer from './ContentQueueDrawer';
import { base44 } from '@/api/base44Client';

export default function CQReviewTab({ items, campaigns, clients, onRefresh, onAssign }) {
  const [saving, setSaving] = useState(null);
  const [drawer, setDrawer] = useState(null);

  const pending = items.filter(i => (i.approval_status === 'Pending' || i.review_status === 'Unreviewed') && i.queue_status !== 'Archived');

  const handle = async (id, patch) => {
    setSaving(id);
    await base44.entities.ContentQueueItem.update(id, patch);
    setSaving(null);
    onRefresh();
  };

  const approve = (i) => handle(i.id, { approval_status: 'Approved', asset_status: 'Approved Asset', queue_status: 'Ready to Schedule', review_status: 'Reviewed' });
  const reject = (i) => handle(i.id, { approval_status: 'Rejected', asset_status: 'Rejected Asset', review_status: 'Reviewed' });
  const revise = (i) => handle(i.id, { approval_status: 'Revision Needed', asset_status: 'Needs Revision', review_status: 'Reviewed' });

  if (pending.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-16 text-center">
        <p className="text-4xl mb-3">✅</p>
        <p className="text-white font-semibold">Review Queue is Clear</p>
        <p className="text-slate-500 text-sm mt-1">All content has been reviewed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">{pending.length} item{pending.length !== 1 ? 's' : ''} pending review</p>
      {pending.map(item => (
        <div key={item.id} className="bg-slate-900 border border-amber-900/30 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex-1 min-w-0">
              <button onClick={() => setDrawer(item)} className="text-left">
                <p className="font-semibold text-white hover:text-blue-300 transition-colors">{item.content_title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.business_name || 'NTA Internal'} · {item.content_type} · {item.platform_recommended || '—'} · {item.source_type}</p>
              </button>
            </div>
            <CQApprovalBadge status={item.approval_status} />
          </div>

          <div className="px-5 py-4 grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {item.hook && <Preview label="Hook" value={item.hook} />}
              {item.caption && <Preview label="Caption" value={item.caption} scroll />}
              {item.cta && <Preview label="CTA" value={item.cta} />}
            </div>
            <div className="space-y-3">
              {item.script && <Preview label="Script" value={item.script} scroll />}
              {(item.image_url || item.thumbnail_url) && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Image</p>
                  <img src={item.image_url || item.thumbnail_url} className="rounded-lg w-full object-cover max-h-36" onError={e => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 pb-5 flex-wrap">
            <button onClick={() => approve(item)} disabled={saving === item.id} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg">
              <CheckCircle className="w-4 h-4" /> Approve
            </button>
            <button onClick={() => revise(item)} disabled={saving === item.id} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-amber-800 hover:bg-amber-700 text-amber-200 rounded-lg">
              <RotateCcw className="w-4 h-4" /> Revision Needed
            </button>
            <button onClick={() => reject(item)} disabled={saving === item.id} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-red-900/40 hover:bg-red-900/60 border border-red-800 text-red-300 rounded-lg">
              <XCircle className="w-4 h-4" /> Reject
            </button>
            <button onClick={() => onAssign([item])} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-violet-800 hover:bg-violet-700 text-violet-200 rounded-lg">
              <Send className="w-4 h-4" /> Send to Campaign
            </button>
            <button onClick={() => setDrawer(item)} className="text-xs text-slate-400 hover:text-white px-3 py-2 bg-slate-800 rounded-lg">Full Details →</button>
          </div>
        </div>
      ))}

      {drawer && (
        <ContentQueueDrawer item={drawer} campaigns={campaigns} clients={clients}
          onClose={() => setDrawer(null)}
          onUpdated={(updated) => { setDrawer(updated); onRefresh(); }}
          onAssign={(items) => { setDrawer(null); onAssign(items); }} />
      )}
    </div>
  );
}

function Preview({ label, value, scroll }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <div className={`bg-slate-800 rounded-lg p-3 text-xs text-slate-300 whitespace-pre-wrap ${scroll ? 'max-h-28 overflow-y-auto' : ''}`}>{value}</div>
    </div>
  );
}