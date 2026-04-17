import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PROVIDERS = ['google_business_profile', 'facebook', 'instagram', 'youtube'];
const PROVIDER_LABELS = {
  google_business_profile: '📍 Google Business Profile',
  facebook: '👥 Facebook',
  instagram: '📸 Instagram',
  youtube: '▶️ YouTube',
};
const CONTENT_TYPES = {
  google_business_profile: ['gbp_cta', 'gbp_event', 'gbp_offer', 'text_post'],
  facebook: ['text_post', 'image_post', 'video_post', 'link_post'],
  instagram: ['image_post', 'reel', 'video_post'],
  youtube: ['youtube_video'],
};

export default function AddToQueueModal({ clientId, clientName, prefill = {}, onClose, onAdded }) {
  const [connections, setConnections] = useState([]);
  const [form, setForm] = useState({
    provider: '',
    connection_id: '',
    content_type: '',
    title: prefill.title || '',
    body_text: prefill.body_text || '',
    caption: prefill.caption || '',
    hashtags: prefill.hashtags || '',
    video_url: prefill.video_url || '',
    thumbnail_url: prefill.thumbnail_url || '',
    link_url: '',
    scheduled_for: '',
    approval_status: 'needs_review',
    yt_description: prefill.yt_description || '',
    yt_tags: prefill.yt_tags || '',
    yt_privacy: 'public',
    gbp_cta_type: 'LEARN_MORE',
    gbp_cta_url: '',
    source_wizard: prefill.source_wizard || 'manual',
    source_content_id: prefill.source_content_id || '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.ChannelConnection.filter({ client_id: clientId, status: 'connected' })
      .then(setConnections);
  }, [clientId]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const filteredConnections = connections.filter(c => !form.provider || c.provider === form.provider);

  const save = async () => {
    if (!form.connection_id || !form.content_type) return;
    setSaving(true);
    const conn = connections.find(c => c.id === form.connection_id);
    await base44.entities.PublishingQueue.create({
      ...form,
      client_id: clientId,
      client_name: clientName,
      provider: conn?.provider || form.provider,
      publish_status: form.scheduled_for ? 'scheduled' : 'queued',
    });
    setSaving(false);
    onAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white">Add to Publishing Queue</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Provider */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDERS.map(p => (
                <button key={p} onClick={() => { set('provider', p); set('connection_id', ''); set('content_type', ''); }}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-colors text-left ${form.provider === p ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'}`}>
                  {PROVIDER_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Connection */}
          {form.provider && (
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Connection</label>
              <select value={form.connection_id} onChange={e => set('connection_id', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                <option value="">Select connection...</option>
                {filteredConnections.map(c => (
                  <option key={c.id} value={c.id}>{c.external_account_name} {c.selected_destination_name ? `→ ${c.selected_destination_name}` : ''}</option>
                ))}
              </select>
              {filteredConnections.length === 0 && (
                <p className="text-xs text-amber-400 mt-1">⚠ No connected accounts for this platform. Connect one first.</p>
              )}
            </div>
          )}

          {/* Content type */}
          {form.provider && (
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Content Type</label>
              <select value={form.content_type} onChange={e => set('content_type', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                <option value="">Select type...</option>
                {(CONTENT_TYPES[form.provider] || []).map(t => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          )}

          {/* Common fields */}
          <F label="Title"><input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Post title..." className={INPUT} /></F>
          <F label="Body / Caption">
            <textarea value={form.body_text} onChange={e => set('body_text', e.target.value)} rows={3} placeholder="Post text..." className={TEXTAREA} />
          </F>
          {(form.provider === 'instagram' || form.provider === 'facebook') && (
            <F label="Hashtags"><input value={form.hashtags} onChange={e => set('hashtags', e.target.value)} placeholder="#local #business..." className={INPUT} /></F>
          )}
          {form.provider === 'youtube' && <>
            <F label="YouTube Description"><textarea value={form.yt_description} onChange={e => set('yt_description', e.target.value)} rows={3} className={TEXTAREA} /></F>
            <F label="Tags (comma-separated)"><input value={form.yt_tags} onChange={e => set('yt_tags', e.target.value)} placeholder="marketing, local, video" className={INPUT} /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Privacy">
                <select value={form.yt_privacy} onChange={e => set('yt_privacy', e.target.value)} className={INPUT}>
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                </select>
              </F>
              <F label="Category ID"><input value={form.yt_category_id || ''} onChange={e => set('yt_category_id', e.target.value)} placeholder="22 = People & Blogs" className={INPUT} /></F>
            </div>
          </>}
          {form.content_type === 'gbp_cta' && (
            <div className="grid grid-cols-2 gap-3">
              <F label="CTA Type">
                <select value={form.gbp_cta_type} onChange={e => set('gbp_cta_type', e.target.value)} className={INPUT}>
                  {['LEARN_MORE','CALL','SIGN_UP','ORDER','BUY','BOOK'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </F>
              <F label="CTA URL"><input value={form.gbp_cta_url} onChange={e => set('gbp_cta_url', e.target.value)} placeholder="https://..." className={INPUT} /></F>
            </div>
          )}
          {(form.video_url !== undefined) && (
            <F label="Video URL"><input value={form.video_url} onChange={e => set('video_url', e.target.value)} placeholder="https://..." className={INPUT} /></F>
          )}
          <div className="grid grid-cols-2 gap-3">
            <F label="Schedule For">
              <input type="datetime-local" value={form.scheduled_for} onChange={e => set('scheduled_for', e.target.value)} className={INPUT} />
            </F>
            <F label="Approval">
              <select value={form.approval_status} onChange={e => set('approval_status', e.target.value)} className={INPUT}>
                <option value="draft">Draft</option>
                <option value="needs_review">Needs Review</option>
                <option value="approved">Approved</option>
              </select>
            </F>
          </div>
        </div>
        <div className="sticky bottom-0 bg-slate-900 px-5 py-4 border-t border-slate-800 flex gap-3">
          <button onClick={save} disabled={saving || !form.connection_id || !form.content_type}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm">
            <Send className="w-4 h-4" /> {saving ? 'Adding...' : 'Add to Queue'}
          </button>
          <button onClick={onClose} className="px-4 bg-slate-800 text-white font-semibold py-2.5 rounded-lg text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

const INPUT = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500";
const TEXTAREA = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white resize-y focus:outline-none focus:border-blue-500";
function F({ label, children }) {
  return <div><label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>{children}</div>;
}