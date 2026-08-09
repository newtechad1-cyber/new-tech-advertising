import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { Plus, Search, RefreshCw } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-slate-800 text-slate-400',
  scheduled: 'bg-blue-900/40 text-blue-400',
  queued: 'bg-amber-900/40 text-amber-400',
  published: 'bg-emerald-900/40 text-emerald-400',
  failed: 'bg-red-900/40 text-red-400',
  cancelled: 'bg-slate-700 text-slate-500',
};

const PLATFORM_ICONS = { facebook:'📘',instagram:'📸',linkedin:'💼',youtube:'▶️',google_business_profile:'📍',tiktok:'🎵',x:'✖️',threads:'🧵' };

function PostModal({ post, clients, onClose, onSave }) {
  const [form, setForm] = useState(post || {
    platform: 'facebook', post_text: '', scheduled_time: '',
    publish_status: 'draft', client_id: '', media_url: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.post_text.trim()) return;
    setSaving(true);
    if (post?.id) {
      await base44.entities.SocialPostQueue.update(post.id, form);
    } else {
      await base44.entities.SocialPostQueue.create(form);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="font-bold text-white">{post ? 'Edit Post' : 'New Social Post'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Platform</label>
            <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              {['facebook','instagram','linkedin','youtube','google_business_profile','tiktok','x','threads'].map(v => (
                <option key={v} value={v}>{PLATFORM_ICONS[v]} {v.replace(/_/g,' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Post Text *</label>
            <textarea value={form.post_text} onChange={e => setForm(p => ({ ...p, post_text: e.target.value }))} rows={5}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Media URL</label>
            <input value={form.media_url || ''} onChange={e => setForm(p => ({ ...p, media_url: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Scheduled Time</label>
              <input type="datetime-local" value={form.scheduled_time ? form.scheduled_time.slice(0, 16) : ''}
                onChange={e => setForm(p => ({ ...p, scheduled_time: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
              <select value={form.publish_status} onChange={e => setForm(p => ({ ...p, publish_status: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                {['draft','scheduled','queued','published','failed','cancelled'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Client</label>
            <select value={form.client_id || ''} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              <option value="">— None —</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-800">
          <button onClick={onClose} className="text-sm px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.post_text.trim()}
            className="text-sm font-bold px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OpsSocial() {
  const [posts, setPosts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([
      base44.entities.SocialPostQueue.list('-created_date', 100),
      base44.entities.Clients.filter({ archived: false }),
    ]);
    setPosts(p);
    setClients(c);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = posts.filter(p => {
    const matchSearch = !search || p.post_text?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.publish_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Social Queue</h1>
            <p className="text-slate-500 text-sm">{filtered.length} posts</p>
          </div>
          <button onClick={() => setModal({})} className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
            <option value="all">All Statuses</option>
            {['draft','scheduled','queued','published','failed','cancelled'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {loading ? <div className="p-8 text-center text-slate-500 text-sm">Loading…</div> :
           filtered.length === 0 ? <div className="p-8 text-center text-slate-500 text-sm">No posts found.</div> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Post</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">Platform</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Scheduled</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white text-xs line-clamp-2 max-w-72">{p.post_text}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-base">{PLATFORM_ICONS[p.platform] || '📣'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[p.publish_status] || STATUS_COLORS.draft}`}>{p.publish_status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">
                      {p.scheduled_time ? new Date(p.scheduled_time).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setModal(p)} className="text-xs text-slate-500 hover:text-white px-2 py-1 rounded hover:bg-slate-700">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {modal !== null && <PostModal post={modal?.id ? modal : null} clients={clients} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
    </OpsLayout>
  );
}