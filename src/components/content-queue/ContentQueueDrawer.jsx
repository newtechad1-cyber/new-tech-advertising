import React, { useState } from 'react';
import { X, CheckCircle, RotateCcw, XCircle, Send, Archive, Copy } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const APPROVAL_COLORS = {
  'Pending':         'bg-amber-900/40 text-amber-300',
  'Approved':        'bg-emerald-900/40 text-emerald-300',
  'Rejected':        'bg-red-900/40 text-red-300',
  'Revision Needed': 'bg-orange-900/40 text-orange-300',
  'Not Needed':      'bg-slate-700 text-slate-400',
};

const QUEUE_COLORS = {
  'Backlog':              'bg-slate-700 text-slate-400',
  'Ready to Schedule':    'bg-blue-900/40 text-blue-300',
  'Assigned to Campaign': 'bg-violet-900/40 text-violet-300',
  'Scheduled':            'bg-amber-900/40 text-amber-300',
  'Published':            'bg-emerald-900/40 text-emerald-300',
  'Archived':             'bg-slate-800 text-slate-500',
};

export default function ContentQueueDrawer({ item, campaigns, clients, onClose, onUpdated, onAssign }) {
  const [saving, setSaving] = useState(null);
  const [notes, setNotes] = useState(item.notes || '');

  const campMap = {};
  campaigns.forEach(c => campMap[c.id] = c.campaign_name);

  const update = async (patch) => {
    setSaving(Object.keys(patch)[0]);
    const updated = await base44.entities.ContentQueueItem.update(item.id, patch);
    onUpdated({ ...item, ...patch });
    setSaving(null);
  };

  const handleApprove = () => update({ approval_status: 'Approved', asset_status: 'Approved Asset', queue_status: 'Ready to Schedule', review_status: 'Reviewed' });
  const handleReject = () => update({ approval_status: 'Rejected', asset_status: 'Rejected Asset', review_status: 'Reviewed' });
  const handleRevise = () => update({ approval_status: 'Revision Needed', asset_status: 'Needs Revision', review_status: 'Reviewed' });
  const handleArchive = () => update({ queue_status: 'Archived', asset_status: 'Archived' });
  const handleSaveNotes = () => update({ notes });

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <div className="bg-slate-900 border-l border-slate-700 w-full max-w-xl h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-5 py-4 flex items-start justify-between gap-3 z-10">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white truncate">{item.content_title}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs text-slate-400">{item.business_name || 'NTA Internal'}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${APPROVAL_COLORS[item.approval_status] || 'bg-slate-700 text-slate-400'}`}>{item.approval_status}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${QUEUE_COLORS[item.queue_status] || 'bg-slate-700 text-slate-400'}`}>{item.queue_status}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white flex-shrink-0"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-5">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Info label="Type" value={item.content_type} />
            <Info label="Platform" value={item.platform_recommended || '—'} />
            <Info label="Topic" value={item.topic || '—'} />
            <Info label="Funnel Stage" value={item.funnel_stage || '—'} />
            <Info label="Source" value={item.source_type || '—'} />
            <Info label="Agent" value={item.source_agent || '—'} />
            <Info label="Campaign" value={campMap[item.campaign_id] || '—'} />
            <Info label="Target Audience" value={item.target_audience || '—'} />
          </div>

          {/* Hook */}
          {item.hook && <Block label="Hook" value={item.hook} />}

          {/* Caption */}
          {item.caption && <Block label="Caption" value={item.caption} scroll />}

          {/* Script */}
          {item.script && <Block label="Script" value={item.script} scroll />}

          {/* CTA */}
          {item.cta && <Block label="CTA" value={item.cta} />}

          {/* Media */}
          {(item.image_url || item.thumbnail_url) && (
            <div>
              <p className="text-xs text-slate-500 mb-1.5">Image</p>
              <img src={item.image_url || item.thumbnail_url} className="rounded-lg w-full object-cover max-h-48" onError={e => e.target.style.display = 'none'} />
            </div>
          )}
          {item.video_url && (
            <div>
              <p className="text-xs text-slate-500 mb-1.5">Video</p>
              <a href={item.video_url} target="_blank" rel="noreferrer" className="text-blue-400 text-xs underline">{item.video_url}</a>
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="text-xs text-slate-500 mb-1.5">Notes</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Add internal notes..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            <button onClick={handleSaveNotes} className="mt-1.5 text-xs text-blue-400 hover:text-blue-300">Save Notes</button>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 px-5 py-4 flex flex-wrap gap-2">
          {item.approval_status !== 'Approved' && (
            <Btn onClick={handleApprove} loading={saving === 'approval_status'} icon={<CheckCircle className="w-3.5 h-3.5" />} label="Approve" color="bg-emerald-700 hover:bg-emerald-600 text-white" />
          )}
          <Btn onClick={handleRevise} loading={false} icon={<RotateCcw className="w-3.5 h-3.5" />} label="Request Revision" color="bg-amber-800 hover:bg-amber-700 text-amber-200" />
          <Btn onClick={handleReject} loading={false} icon={<XCircle className="w-3.5 h-3.5" />} label="Reject" color="bg-red-900/40 hover:bg-red-900/60 border border-red-800 text-red-300" />
          <Btn onClick={() => onAssign([item])} loading={false} icon={<Send className="w-3.5 h-3.5" />} label="Assign to Campaign" color="bg-blue-700 hover:bg-blue-600 text-white" />
          <Btn onClick={handleArchive} loading={false} icon={<Archive className="w-3.5 h-3.5" />} label="Archive" color="bg-slate-700 hover:bg-slate-600 text-slate-300" />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-slate-500 text-xs">{label}</p>
      <p className="text-slate-300 text-xs mt-0.5">{value}</p>
    </div>
  );
}

function Block({ label, value, scroll }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1.5">{label}</p>
      <div className={`bg-slate-800 rounded-lg p-3 text-sm text-slate-300 whitespace-pre-wrap ${scroll ? 'max-h-40 overflow-y-auto' : ''}`}>{value}</div>
    </div>
  );
}

function Btn({ onClick, loading, icon, label, color }) {
  return (
    <button onClick={onClick} disabled={loading} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50 ${color}`}>
      {icon}{loading ? '...' : label}
    </button>
  );
}