import React, { useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CONTENT_TYPES = ['Caption', 'Script', 'Image', 'Video', 'Carousel', 'Reel / Short', 'Testimonial', 'Educational', 'Offer', 'FAQ', 'Blog Snippet', 'Email Copy', 'Ad Copy'];
const PLATFORMS = ['Facebook', 'Instagram', 'LinkedIn', 'X', 'YouTube', 'Google Business Profile', 'TikTok', 'Multiple', 'Any'];
const SOURCES = ['AI Generated', 'Manual Upload', 'Imported', 'Reworked Content', 'Repurposed Content'];
const FUNNELS = ['Awareness', 'Consideration', 'Conversion', 'Retention', 'Referral'];

export default function AddContentModal({ clients, campaigns, onClose, onSaved }) {
  const [form, setForm] = useState({
    content_title: '',
    client_id: '',
    business_name: '',
    content_type: 'Caption',
    topic: '',
    platform_recommended: 'Facebook',
    funnel_stage: 'Awareness',
    source_type: 'Manual Upload',
    campaign_id: '',
    target_audience: '',
    primary_offer: '',
    hook: '',
    caption: '',
    script: '',
    cta: '',
    image_url: '',
    video_url: '',
    tags: '',
    notes: '',
    approval_status: 'Pending',
    asset_status: 'Draft',
    queue_status: 'Backlog',
    review_status: 'Unreviewed',
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => {
    const update = { ...form, [k]: v };
    if (k === 'client_id') {
      const c = clients.find(c => c.id === v);
      update.business_name = c?.business_name || '';
    }
    setForm(update);
  };

  const save = async () => {
    if (!form.content_title.trim()) return;
    setSaving(true);
    await base44.entities.ContentQueueItem.create(form);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">Add Content to Queue</h2>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Content Title *">
            <input value={form.content_title} onChange={e => set('content_title', e.target.value)} placeholder="Descriptive title for this content..." className={IN} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Client / Business">
              <select value={form.client_id} onChange={e => set('client_id', e.target.value)} className={IN}>
                <option value="">— NTA Internal —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
              </select>
            </Field>
            <Field label="Content Type">
              <select value={form.content_type} onChange={e => set('content_type', e.target.value)} className={IN}>
                {CONTENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Recommended Platform">
              <select value={form.platform_recommended} onChange={e => set('platform_recommended', e.target.value)} className={IN}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Source">
              <select value={form.source_type} onChange={e => set('source_type', e.target.value)} className={IN}>
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Funnel Stage">
              <select value={form.funnel_stage} onChange={e => set('funnel_stage', e.target.value)} className={IN}>
                {FUNNELS.map(f => <option key={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Campaign (Optional)">
              <select value={form.campaign_id} onChange={e => set('campaign_id', e.target.value)} className={IN}>
                <option value="">— None —</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.campaign_name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Topic">
            <input value={form.topic} onChange={e => set('topic', e.target.value)} placeholder="Content topic or subject..." className={IN} />
          </Field>
          <Field label="Hook">
            <input value={form.hook} onChange={e => set('hook', e.target.value)} placeholder="Opening hook or headline..." className={IN} />
          </Field>
          <Field label="Caption">
            <textarea value={form.caption} onChange={e => set('caption', e.target.value)} rows={3} placeholder="Social caption text..." className={IN} />
          </Field>
          <Field label="Script">
            <textarea value={form.script} onChange={e => set('script', e.target.value)} rows={4} placeholder="Video or audio script..." className={IN} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CTA">
              <input value={form.cta} onChange={e => set('cta', e.target.value)} placeholder="Call to action..." className={IN} />
            </Field>
            <Field label="Tags">
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="comma, separated, tags" className={IN} />
            </Field>
            <Field label="Image URL">
              <input value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." className={IN} />
            </Field>
            <Field label="Video URL">
              <input value={form.video_url} onChange={e => set('video_url', e.target.value)} placeholder="https://..." className={IN} />
            </Field>
          </div>
          <Field label="Notes">
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Internal notes..." className={IN} />
          </Field>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox"
                checked={form.approval_status === 'Not Needed'}
                onChange={e => set('approval_status', e.target.checked ? 'Not Needed' : 'Pending')}
                className="rounded border-slate-600 accent-blue-500"
              />
              <span className="text-xs text-slate-400">No approval required</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
          <button onClick={save} disabled={saving || !form.content_title.trim()} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Saving...' : 'Add to Queue'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div><label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>{children}</div>;
}
const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';