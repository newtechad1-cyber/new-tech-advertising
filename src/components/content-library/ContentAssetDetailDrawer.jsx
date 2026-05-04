import React, { useState } from 'react';
import { X, Copy, Check, Download, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PLATFORM_EMOJI = { facebook: '📘', instagram: '📷', linkedin: '💼', x: '𝕏', threads: '🧵', google_business_profile: '🟢', youtube: '▶️', tiktok: '🎵' };
const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-300',
  needs_review: 'bg-violet-900/50 text-violet-300',
  approved: 'bg-emerald-900/50 text-emerald-300',
  exported: 'bg-blue-900/50 text-blue-300',
  scheduled: 'bg-cyan-900/50 text-cyan-300',
  published: 'bg-teal-900/50 text-teal-300',
  rejected: 'bg-red-900/50 text-red-300',
};

const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const LBL = 'block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide';

function CopyBtn({ text, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors">
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

function Field({ label, value, canCopy, copyLabel, large }) {
  if (!value) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={LBL}>{label}</span>
        {canCopy && value && <CopyBtn text={value} label={copyLabel || `Copy ${label}`} />}
      </div>
      {large ? (
        <div className="bg-slate-800/60 rounded-lg px-3 py-2 text-sm text-slate-200 whitespace-pre-wrap">{value}</div>
      ) : (
        <div className="bg-slate-800/60 rounded-lg px-3 py-2 text-sm text-slate-200">{value}</div>
      )}
    </div>
  );
}

export default function ContentAssetDetailDrawer({ asset, campaigns, clients, onClose, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [tracking, setTracking] = useState({
    exported_to_content360: asset.exported_to_content360 || false,
    scheduled_in_content360: asset.scheduled_in_content360 || false,
    content360_scheduled_date: asset.content360_scheduled_date || '',
    content360_channel: asset.content360_channel || '',
    external_notes: asset.external_notes || '',
    notes: asset.notes || '',
    suggested_publish_date: asset.suggested_publish_date || '',
    suggested_image_video: asset.suggested_image_video || '',
    status: asset.status || 'draft',
  });

  const campaign = campaigns.find(c => c.id === asset.campaign_id);
  const client = clients.find(c => c.id === asset.client_id);

  const saveTracking = async () => {
    setSaving(true);
    await base44.entities.NTAContentAsset.update(asset.id, tracking);
    setSaving(false);
    onUpdate();
  };

  const buildFullPost = () => {
    const parts = [];
    if (asset.headline) parts.push(`HEADLINE: ${asset.headline}`);
    if (asset.hook) parts.push(`HOOK: ${asset.hook}`);
    if (asset.caption_text) parts.push(`\n${asset.caption_text}`);
    if (asset.body_copy && !asset.caption_text) parts.push(`\n${asset.body_copy}`);
    if (asset.cta) parts.push(`\nCTA: ${asset.cta}`);
    if (asset.hashtags) parts.push(`\n${asset.hashtags}`);
    return parts.join('\n');
  };

  const buildContent360Format = () => {
    const lines = [];
    lines.push(`=== CONTENT360 EXPORT ===`);
    lines.push(`Asset: ${asset.asset_name}`);
    lines.push(`Client: ${client?.business_name || '—'}`);
    lines.push(`Campaign: ${campaign?.campaign_name || '—'}`);
    lines.push(`Platform: ${asset.platform}`);
    lines.push(`Suggested Publish Date: ${tracking.suggested_publish_date || asset.scheduled_date || '—'}`);
    lines.push(`Status: ${asset.status}`);
    lines.push('');
    if (asset.headline) lines.push(`Headline: ${asset.headline}`);
    if (asset.hook) lines.push(`Hook: ${asset.hook}`);
    lines.push('');
    lines.push(`Post Text:`);
    lines.push(asset.caption_text || asset.body_copy || '');
    lines.push('');
    if (asset.cta) lines.push(`CTA: ${asset.cta}`);
    if (asset.hashtags) lines.push(`Hashtags: ${asset.hashtags}`);
    if (tracking.suggested_image_video) lines.push(`Image/Video: ${tracking.suggested_image_video}`);
    if (tracking.notes) lines.push(`Notes: ${tracking.notes}`);
    return lines.join('\n');
  };

  const downloadTxt = () => {
    const content = buildContent360Format();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asset.asset_name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-end">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="min-w-0 pr-4">
            <h2 className="text-base font-bold text-white truncate">{asset.asset_name}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-slate-400">{PLATFORM_EMOJI[asset.platform]} {asset.platform?.replace(/_/g, ' ')}</span>
              {client && <span className="text-xs text-slate-500">· {client.business_name}</span>}
              {campaign && <span className="text-xs text-slate-500">· {campaign.campaign_name}</span>}
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[asset.status] || 'bg-slate-700 text-slate-300'}`}>{asset.status?.replace(/_/g, ' ')}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Quick Copy Bar */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Quick Copy</p>
            <div className="flex flex-wrap gap-2">
              <CopyBtn text={asset.caption_text || asset.body_copy} label="Post Text" />
              <CopyBtn text={asset.hashtags} label="Hashtags" />
              <CopyBtn text={asset.cta} label="CTA" />
              <CopyBtn text={buildFullPost()} label="Full Post" />
              <CopyBtn text={buildContent360Format()} label="Content360 Format" />
              <button onClick={downloadTxt} className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-900/40 hover:bg-blue-800 text-blue-300 rounded transition-colors">
                <Download className="w-3 h-3" /> Download TXT
              </button>
            </div>
          </div>

          {/* Content Fields */}
          <div className="space-y-4">
            <Field label="Headline" value={asset.headline} canCopy />
            <Field label="Hook" value={asset.hook} canCopy />
            <Field label="Post Text / Caption" value={asset.caption_text || asset.body_copy} canCopy large />
            <Field label="CTA" value={asset.cta} canCopy />
            <Field label="Hashtags" value={asset.hashtags} canCopy />
            {asset.script_text && <Field label="Script" value={asset.script_text} canCopy large />}
            {asset.on_screen_text && <Field label="On-Screen Text" value={asset.on_screen_text} canCopy />}
            {asset.rejection_feedback && (
              <div className="bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2 text-sm text-red-300">
                <span className="font-semibold">Rejection feedback:</span> {asset.rejection_feedback}
              </div>
            )}
          </div>

          {/* Editable fields */}
          <div className="space-y-4 border-t border-slate-800 pt-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Asset Details</p>
            <div>
              <label className={LBL}>Suggested Image / Video</label>
              <input value={tracking.suggested_image_video} onChange={e => setTracking(p => ({ ...p, suggested_image_video: e.target.value }))} placeholder="URL or description" className={IN} />
            </div>
            <div>
              <label className={LBL}>Suggested Publish Date</label>
              <input type="date" value={tracking.suggested_publish_date} onChange={e => setTracking(p => ({ ...p, suggested_publish_date: e.target.value }))} className={IN} />
            </div>
            <div>
              <label className={LBL}>Internal Notes</label>
              <textarea value={tracking.notes} onChange={e => setTracking(p => ({ ...p, notes: e.target.value }))} rows={2} className={IN} />
            </div>
          </div>

          {/* Content360 Tracking */}
          <div className="space-y-4 border-t border-slate-800 pt-5">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Content360 Tracking</p>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-4 py-3 cursor-pointer">
                <input type="checkbox" checked={tracking.exported_to_content360} onChange={e => setTracking(p => ({ ...p, exported_to_content360: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                <div>
                  <p className="text-sm text-white font-medium">Exported</p>
                  <p className="text-xs text-slate-500">Copied to Content360</p>
                </div>
              </label>
              <label className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-4 py-3 cursor-pointer">
                <input type="checkbox" checked={tracking.scheduled_in_content360} onChange={e => setTracking(p => ({ ...p, scheduled_in_content360: e.target.checked }))} className="w-4 h-4 accent-emerald-500" />
                <div>
                  <p className="text-sm text-white font-medium">Scheduled</p>
                  <p className="text-xs text-slate-500">Live in Content360</p>
                </div>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LBL}>Scheduled Date in C360</label>
                <input type="date" value={tracking.content360_scheduled_date} onChange={e => setTracking(p => ({ ...p, content360_scheduled_date: e.target.value }))} className={IN} />
              </div>
              <div>
                <label className={LBL}>Channel in C360</label>
                <input value={tracking.content360_channel} onChange={e => setTracking(p => ({ ...p, content360_channel: e.target.value }))} placeholder="e.g. Facebook Page Name" className={IN} />
              </div>
            </div>
            <div>
              <label className={LBL}>External Notes</label>
              <textarea value={tracking.external_notes} onChange={e => setTracking(p => ({ ...p, external_notes: e.target.value }))} rows={2} placeholder="Any notes about Content360 scheduling..." className={IN} />
            </div>
          </div>

          {/* Status update */}
          <div className="border-t border-slate-800 pt-5">
            <label className={LBL}>Update Status</label>
            <select value={tracking.status} onChange={e => setTracking(p => ({ ...p, status: e.target.value }))} className={IN}>
              {['draft', 'needs_review', 'approved', 'exported', 'scheduled', 'published', 'rejected'].map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex-shrink-0 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg hover:bg-slate-700">Close</button>
          <button onClick={saveTracking} disabled={saving} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}