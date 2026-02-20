import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Upload, Search, Play, Copy } from 'lucide-react';

const USE_FOR = ['social', 'video', 'blog', 'email', 'website'];

export default function MediaVideos() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', url: '', description: '', tags: '', used_for: [], is_link: false });
  const [pendingFile, setPendingFile] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.MediaAsset.filter({ asset_type: 'video' }, '-created_date');
    setAssets(data);
    setLoading(false);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingFile(file);
    setForm(f => ({ ...f, name: f.name || file.name, is_link: false }));
    setShowForm(true);
  };

  const save = async () => {
    setUploading(true);
    let url = form.url;
    if (!form.is_link && pendingFile) {
      const res = await base44.integrations.Core.UploadFile({ file: pendingFile });
      url = res.file_url;
    }
    const payload = {
      name: form.name,
      url,
      asset_type: 'video',
      description: form.description,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      used_for: form.used_for
    };
    await base44.entities.MediaAsset.create(payload);
    setForm({ name: '', url: '', description: '', tags: '', used_for: [], is_link: false });
    setPendingFile(null);
    setShowForm(false);
    setUploading(false);
    load();
  };

  const remove = async (id) => { await base44.entities.MediaAsset.delete(id); load(); };

  const copy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleUsedFor = (val) => {
    setForm(f => ({
      ...f,
      used_for: f.used_for.includes(val) ? f.used_for.filter(v => v !== val) : [...f.used_for, val]
    }));
  };

  const filtered = assets.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const isYoutube = (url) => url?.includes('youtube') || url?.includes('youtu.be') || url?.includes('vimeo');
  const getThumbnail = (url) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Video Library</h2>
          <p className="text-slate-400 text-sm">{assets.length} videos — upload files or add links</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setShowForm(true); setForm({ name: '', url: '', description: '', tags: '', used_for: [], is_link: true }); setPendingFile(null); }} variant="outline" className="border-slate-700 text-slate-300">
            <Plus className="w-4 h-4 mr-2" /> Add Link
          </Button>
          <label className="cursor-pointer">
            <input type="file" accept="video/*" onChange={handleFile} className="hidden" />
            <Button asChild className="bg-red-600 hover:bg-red-700 pointer-events-none">
              <span><Upload className="w-4 h-4 mr-2" /> Upload Video</span>
            </Button>
          </label>
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Video Name</label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Friendly name" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            {form.is_link && (
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Video URL (YouTube, Vimeo, etc.)</label>
                <Input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://..." className="bg-slate-800 border-slate-700 text-white" />
              </div>
            )}
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Tags</label>
              <Input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="promo, tutorial" className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Use For</label>
            <div className="flex gap-2 flex-wrap">
              {USE_FOR.map(u => (
                <button key={u} onClick={() => toggleUsedFor(u)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${form.used_for.includes(u) ? 'bg-red-600 border-red-600 text-white' : 'border-slate-600 text-slate-400 hover:border-red-500'}`}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={save} disabled={uploading} className="bg-red-600 hover:bg-red-700">{uploading ? 'Uploading...' : 'Save Video'}</Button>
            <Button variant="ghost" onClick={() => { setShowForm(false); setPendingFile(null); }} className="text-slate-400">Cancel</Button>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search videos..." className="bg-slate-900 border-slate-700 text-white pl-10" />
      </div>

      {loading ? <p className="text-slate-400">Loading...</p> : (
        filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No videos yet. Upload or add a link!</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map(a => {
              const thumb = getThumbnail(a.url);
              return (
                <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group">
                  <div className="relative h-40 bg-slate-800 flex items-center justify-center">
                    {thumb ? (
                      <img src={thumb} alt={a.name} className="w-full h-full object-cover" />
                    ) : (
                      <Play className="w-12 h-12 text-slate-600" />
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a href={a.url} target="_blank" rel="noopener noreferrer">
                        <Button size="icon" variant="ghost" className="text-white h-8 w-8 bg-white/20"><Play className="w-4 h-4" /></Button>
                      </a>
                      <Button size="icon" variant="ghost" onClick={() => copy(a.url, a.id)} className="text-white h-8 w-8 bg-white/20">
                        {copied === a.id ? <span className="text-xs">✓</span> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(a.id)} className="text-red-400 h-8 w-8 bg-white/20"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate">{a.name}</p>
                    {a.used_for?.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {a.used_for.map(u => <Badge key={u} className="bg-red-900/50 text-red-400 text-xs py-0">{u}</Badge>)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}