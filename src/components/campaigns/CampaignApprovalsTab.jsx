import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { PLATFORM_ICON, ApprovalBadge, PostStatusBadge } from './CampaignUtils';
import { base44 } from '@/api/base44Client';

export default function CampaignApprovalsTab({ posts, campaigns, clients, onRefresh }) {
  const [saving, setSaving] = useState(null);
  const [notes, setNotes] = useState({});

  const pending = posts.filter(p => p.approval_status === 'Pending');
  const campMap = {};
  campaigns.forEach(c => campMap[c.id] = c.campaign_name);

  const handle = async (postId, action) => {
    setSaving(postId + action);
    const note = notes[postId] || '';
    let update = { approval_notes: note };
    if (action === 'approve') {
      const post = posts.find(p => p.id === postId);
      update.approval_status = 'Approved';
      update.publishing_status = post?.scheduled_date ? 'Scheduled' : 'Ready';
    } else if (action === 'reject') {
      update.approval_status = 'Rejected';
      update.publishing_status = 'Draft';
    } else if (action === 'revise') {
      update.approval_status = 'Revision Needed';
      update.publishing_status = 'Draft';
    }
    await base44.entities.CampaignPost.update(postId, update);
    setSaving(null);
    setNotes(n => ({ ...n, [postId]: '' }));
    onRefresh();
  };

  if (pending.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-16 text-center">
        <p className="text-4xl mb-3">✅</p>
        <p className="text-white font-semibold mb-1">Approval Queue is Clear</p>
        <p className="text-slate-500 text-sm">All posts have been reviewed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">{pending.length} post{pending.length !== 1 ? 's' : ''} awaiting review</p>
      {pending.map(p => (
        <div key={p.id} className="bg-slate-900 border border-amber-900/40 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xl">{PLATFORM_ICON[p.platform] || '📱'}</span>
              <div>
                <p className="font-semibold text-white">{p.title}</p>
                <p className="text-xs text-slate-500">{p.business_name || 'NTA Internal'} · {campMap[p.campaign_id] || 'No campaign'} · {p.platform}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ApprovalBadge status={p.approval_status} />
              <PostStatusBadge status={p.publishing_status} />
            </div>
          </div>

          {/* Content */}
          <div className="px-5 py-4 grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Info label="Scheduled" value={p.scheduled_date ? `${p.scheduled_date} ${p.scheduled_time || ''}` : 'Not scheduled'} />
              <Info label="Post Type" value={p.post_type} />
              {p.content_caption && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Caption</p>
                  <div className="bg-slate-800 rounded-lg p-3 text-sm text-slate-300 whitespace-pre-wrap">{p.content_caption}</div>
                </div>
              )}
              {p.video_script && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Script</p>
                  <div className="bg-slate-800 rounded-lg p-3 text-sm text-slate-300 max-h-32 overflow-y-auto">{p.video_script}</div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {p.media_url && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Media</p>
                  <img src={p.media_url} className="rounded-lg w-full object-cover max-h-40" onError={e => e.target.style.display='none'} />
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 mb-1">Approval Notes (optional)</p>
                <textarea
                  value={notes[p.id] || ''}
                  onChange={e => setNotes(n => ({ ...n, [p.id]: e.target.value }))}
                  rows={3}
                  placeholder="Add feedback, notes, or revision request..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 px-5 pb-5">
            <button
              onClick={() => handle(p.id, 'approve')}
              disabled={!!saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg transition-colors">
              <CheckCircle className="w-4 h-4" />
              {saving === p.id + 'approve' ? 'Approving...' : 'Approve'}
            </button>
            <button
              onClick={() => handle(p.id, 'revise')}
              disabled={!!saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-amber-800 hover:bg-amber-700 disabled:opacity-50 text-amber-200 rounded-lg transition-colors">
              <RotateCcw className="w-4 h-4" />
              Request Revision
            </button>
            <button
              onClick={() => handle(p.id, 'reject')}
              disabled={!!saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-red-900/40 hover:bg-red-900/60 disabled:opacity-50 border border-red-800 text-red-300 rounded-lg transition-colors">
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-slate-500 w-24 flex-shrink-0 text-xs">{label}</span>
      <span className="text-slate-300">{value}</span>
    </div>
  );
}