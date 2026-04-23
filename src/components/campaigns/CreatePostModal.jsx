import React, { useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PLATFORMS = ['Facebook', 'Instagram', 'LinkedIn', 'X', 'YouTube', 'Google Business Profile', 'TikTok'];
const POST_TYPES = ['Image Post', 'Video Post', 'Reel / Short', 'Text Post', 'Carousel', 'Offer Post', 'Testimonial', 'Educational', 'Before/After'];
const APPROVAL_OPTS = ['Not Needed', 'Pending'];

export default function CreatePostModal({ campaigns, clients, onClose, onSaved, prefillCampaignId }) {
  const [form, setForm] = useState({
    title: '',
    client_id: '',
    business_name: '',
    campaign_id: prefillCampaignId || '',
    platform: 'Facebook',
    post_type: 'Image Post',
    content_caption: '',
    media_url: '',
    scheduled_date: '',
    scheduled_time: '09:00',
    publishing_status: 'Draft',
    approval_status: 'Not Needed',
    notes: '',
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
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = { ...form };
    if (form.scheduled_date && form.approval_status === 'Not Needed') {
      payload.publishing_status = 'Scheduled';
    }
    await base44.entities.CampaignPost.create(payload);
    onSaved();
  };

  const filteredCampaigns = form.client_id
    ? campaigns.filter(c => c.client_id === form.client_id)
    : campaigns;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">New Post</h2>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Post Title *">
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Spring Sale Announcement" className={INPUT} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Client / Business">
              <select value={form.client_id} onChange={e => set('client_id', e.target.value)} className={INPUT}>
                <option value="">— NTA Internal —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
              </select>
            </Field>
            <Field label="Campaign">
              <select value={form.campaign_id} onChange={e => set('campaign_id', e.target.value)} className={INPUT}>
                <option value="">— No Campaign —</option>
                {filteredCampaigns.map(c => <option key={c.id} value={c.id}>{c.campaign_name}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Platform">
              <select value={form.platform} onChange={e => set('platform', e.target.value)} className={INPUT}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Post Type">
              <select value={form.post_type} onChange={e => set('post_type', e.target.value)} className={INPUT}>
                {POST_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Caption / Content">
            <textarea value={form.content_caption} onChange={e => set('content_caption', e.target.value)} rows={3} placeholder="Write your caption here..." className={INPUT} />
          </Field>
          <Field label="Media URL">
            <input value={form.media_url} onChange={e => set('media_url', e.target.value)} placeholder="https://..." className={INPUT} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Scheduled Date">
              <input type="date" value={form.scheduled_date} onChange={e => set('scheduled_date', e.target.value)} className={INPUT} />
            </Field>
            <Field label="Time">
              <input type="time" value={form.scheduled_time} onChange={e => set('scheduled_time', e.target.value)} className={INPUT} />
            </Field>
            <Field label="Approval">
              <select value={form.approval_status} onChange={e => set('approval_status', e.target.value)} className={INPUT}>
                {APPROVAL_OPTS.map(a => <option key={a}>{a}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Notes">
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Internal notes..." className={INPUT} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white bg-slate-800 rounded-lg">Cancel</button>
          <button onClick={save} disabled={saving || !form.title.trim()} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Saving...' : 'Create Post'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

const INPUT = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';