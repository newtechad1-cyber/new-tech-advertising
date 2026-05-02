import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { Plus, Search, RefreshCw } from 'lucide-react';

const STATUS_COLORS = {
  not_started: 'bg-slate-800 text-slate-400',
  script_ready: 'bg-blue-900/40 text-blue-400',
  in_production: 'bg-amber-900/40 text-amber-400',
  completed: 'bg-emerald-900/40 text-emerald-400',
  failed: 'bg-red-900/40 text-red-400',
};

function VideoModal({ video, onClose, onSave }) {
  const [form, setForm] = useState(video || {
    title: '', script: '', avatar_template: '', voice: '', render_status: 'not_started', campaign_id: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    if (video?.id) {
      await base44.entities.NTAVideoAsset.update(video.id, form);
    } else {
      await base44.entities.NTAVideoAsset.create(form);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="font-bold text-white">{video ? 'Edit Video Script' : 'New Video Script'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Title *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Script</label>
            <textarea value={form.script || ''} onChange={e => setForm(p => ({ ...p, script: e.target.value }))} rows={8}
              placeholder="Write the full video script here…"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[['Avatar Template', 'avatar_template'], ['Voice', 'voice']].map(([label, k]) => (
              <div key={k}>
                <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
                <input value={form[k] || ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
            <select value={form.render_status} onChange={e => setForm(p => ({ ...p, render_status: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
              {['not_started','script_ready','in_production','completed','failed'].map(v => (
                <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-800">
          <button onClick={onClose} className="text-sm px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.title.trim()}
            className="text-sm font-bold px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OpsVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.NTAVideoAsset.list('-created_date', 100);
    setVideos(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = videos.filter(v => !search || v.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Video Scripts</h1>
            <p className="text-slate-500 text-sm">{filtered.length} scripts</p>
          </div>
          <button onClick={() => setModal({})} className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
            <Plus className="w-4 h-4" /> New Script
          </button>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search scripts…"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? <div className="col-span-full p-8 text-center text-slate-500 text-sm">Loading…</div> :
           filtered.length === 0 ? <div className="col-span-full p-8 text-center text-slate-500 text-sm">No video scripts yet.</div> :
           filtered.map(v => (
            <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[v.render_status] || STATUS_COLORS.not_started}`}>{v.render_status?.replace(/_/g, ' ')}</span>
                <button onClick={() => setModal(v)} className="text-xs text-slate-500 hover:text-white px-2 py-0.5 rounded hover:bg-slate-700">Edit</button>
              </div>
              <h3 className="font-bold text-white text-sm mb-2">{v.title}</h3>
              {v.script && <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{v.script}</p>}
              {v.avatar_template && <p className="text-xs text-blue-400 mt-2">Avatar: {v.avatar_template}</p>}
            </div>
          ))}
        </div>
      </div>
      {modal !== null && <VideoModal video={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
    </OpsLayout>
  );
}