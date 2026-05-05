import React, { useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const BLANK = {
  title: '', topic: '', video_type: 'Outreach', target_audience: '',
  hook: '', script: '', scene_breakdown: '', text_overlays: '',
  visual_suggestions: '', cta: '', duration_seconds: 60,
  platform_tags: 'Facebook,LinkedIn', status: 'Draft',
};

export default function VideoAssetFormModal({ asset, onClose, onSaved }) {
  const [form, setForm] = useState(asset ? { ...asset } : { ...BLANK });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    let saved;
    if (asset?.id) {
      saved = await base44.entities.VideoAsset.update(asset.id, form);
    } else {
      saved = await base44.entities.VideoAsset.create(form);
    }
    setSaving(false);
    onSaved(saved);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="font-bold text-white">{asset ? 'Edit Video Asset' : 'New Video Asset'}</h2>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <F label="Title *"><input value={form.title} onChange={e => set('title', e.target.value)} className={inp()} placeholder="Why You're Not Getting Calls" /></F>
            <F label="Video Type">
              <select value={form.video_type} onChange={e => set('video_type', e.target.value)} className={inp()}>
                {['Outreach','Educational','Follow-Up','Ad'].map(t => <option key={t}>{t}</option>)}
              </select>
            </F>
          </div>
          <F label="Topic"><input value={form.topic} onChange={e => set('topic', e.target.value)} className={inp()} placeholder="What this video is about" /></F>
          <F label="Target Audience"><input value={form.target_audience} onChange={e => set('target_audience', e.target.value)} className={inp()} placeholder="Local small business owners" /></F>
          <F label="Hook (opening line)"><input value={form.hook} onChange={e => set('hook', e.target.value)} className={inp()} placeholder="The first thing you say on camera" /></F>
          <F label="Full Script"><textarea value={form.script} onChange={e => set('script', e.target.value)} rows={6} className={inp() + ' resize-none'} placeholder="Write the full spoken script..." /></F>
          <F label="Scene Breakdown"><textarea value={form.scene_breakdown} onChange={e => set('scene_breakdown', e.target.value)} rows={4} className={inp() + ' resize-none'} placeholder="Scene 1 (0-5s): Hook&#10;Scene 2 (5-20s): ..." /></F>
          <F label="Text Overlays"><textarea value={form.text_overlays} onChange={e => set('text_overlays', e.target.value)} rows={3} className={inp() + ' resize-none'} placeholder="Line 1: ...&#10;Line 2: ..." /></F>
          <F label="Visual Suggestions"><textarea value={form.visual_suggestions} onChange={e => set('visual_suggestions', e.target.value)} rows={2} className={inp() + ' resize-none'} /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="CTA"><input value={form.cta} onChange={e => set('cta', e.target.value)} className={inp()} placeholder="Text me: 641-420-8816" /></F>
            <F label="Duration (seconds)"><input type="number" value={form.duration_seconds} onChange={e => set('duration_seconds', Number(e.target.value))} className={inp()} /></F>
          </div>
          <F label="Platform Tags (comma separated)"><input value={form.platform_tags} onChange={e => set('platform_tags', e.target.value)} className={inp()} placeholder="Facebook,LinkedIn,YouTube Shorts" /></F>
        </div>
        <div className="px-5 py-4 border-t border-slate-800 flex gap-2">
          <button onClick={save} disabled={saving || !form.title.trim()} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm">
            {saving ? 'Saving...' : asset ? 'Save Changes' : 'Create Asset'}
          </button>
          <button onClick={onClose} className="px-4 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function F({ label, children }) {
  return <div><label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>{children}</div>;
}
function inp() {
  return 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
}