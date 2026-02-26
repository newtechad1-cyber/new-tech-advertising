import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, Search, UserCheck, UserX, Tag, Loader2 } from 'lucide-react';

export default function SubscribersManager() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', first_name: '', last_name: '', tags: '', source: '' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Subscriber.list('-created_date');
    setSubscribers(data);
    setLoading(false);
  };

  const save = async () => {
    if (!form.email) { toast.error('Email required'); return; }
    const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [], status: 'active' };
    await base44.entities.Subscriber.create(payload);
    toast.success('Subscriber added');
    setForm({ email: '', first_name: '', last_name: '', tags: '', source: '' });
    setShowForm(false);
    load();
  };

  const toggle = async (sub) => {
    const newStatus = sub.status === 'active' ? 'unsubscribed' : 'active';
    await base44.entities.Subscriber.update(sub.id, { status: newStatus });
    setSubscribers(prev => prev.map(s => s.id === sub.id ? { ...s, status: newStatus } : s));
  };

  const remove = async (id) => { await base44.entities.Subscriber.delete(id); load(); };

  const allTags = [...new Set(subscribers.flatMap(s => s.tags || []))].filter(Boolean);

  const filtered = subscribers.filter(s => {
    const matchSearch = s.email?.toLowerCase().includes(search.toLowerCase()) || s.first_name?.toLowerCase().includes(search.toLowerCase());
    const matchTag = tagFilter === 'all' || s.tags?.includes(tagFilter);
    return matchSearch && matchTag;
  });

  const activeCount = subscribers.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-400">{activeCount}</p>
          <p className="text-slate-400 text-xs mt-1">Active</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-400">{subscribers.length - activeCount}</p>
          <p className="text-slate-400 text-xs mt-1">Unsubscribed</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{allTags.length}</p>
          <p className="text-slate-400 text-xs mt-1">Segments</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 bg-slate-800 border-slate-700 text-white w-48" />
          </div>
          {/* Tag filters */}
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => setTagFilter('all')} className={`px-3 py-1 rounded-full text-xs border transition-colors ${tagFilter === 'all' ? 'bg-orange-600 text-white border-transparent' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>All</button>
            {allTags.map(tag => (
              <button key={tag} onClick={() => setTagFilter(tag)} className={`px-3 py-1 rounded-full text-xs border transition-colors ${tagFilter === tag ? 'bg-orange-600 text-white border-transparent' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>{tag}</button>
            ))}
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" /> Add Subscriber
        </Button>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-slate-400 text-xs mb-1 block">First Name</label><Input value={form.first_name} onChange={e => setForm(f => ({...f, first_name: e.target.value}))} placeholder="Jane" className="bg-slate-800 border-slate-700 text-white" /></div>
            <div><label className="text-slate-400 text-xs mb-1 block">Last Name</label><Input value={form.last_name} onChange={e => setForm(f => ({...f, last_name: e.target.value}))} placeholder="Smith" className="bg-slate-800 border-slate-700 text-white" /></div>
            <div><label className="text-slate-400 text-xs mb-1 block">Email *</label><Input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="jane@example.com" className="bg-slate-800 border-slate-700 text-white" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-slate-400 text-xs mb-1 block">Tags (comma separated)</label><Input value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} placeholder="client, newsletter, vip" className="bg-slate-800 border-slate-700 text-white" /></div>
            <div><label className="text-slate-400 text-xs mb-1 block">Source</label><Input value={form.source} onChange={e => setForm(f => ({...f, source: e.target.value}))} placeholder="website, referral..." className="bg-slate-800 border-slate-700 text-white" /></div>
          </div>
          <div className="flex gap-3">
            <Button onClick={save} className="bg-orange-600 hover:bg-orange-700">Add</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-slate-400">Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No subscribers found.</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="divide-y divide-slate-800">
            {filtered.map(s => (
              <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === 'active' ? 'bg-green-500' : 'bg-slate-600'}`} />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {s.first_name} {s.last_name} <span className="text-slate-400 font-normal text-xs">— {s.email}</span>
                    </p>
                    <div className="flex gap-1 mt-0.5 flex-wrap">
                      {s.tags?.map(tag => <span key={tag} className="bg-slate-700 text-slate-400 text-xs px-1.5 py-0 rounded">{tag}</span>)}
                      {s.source && <span className="text-slate-600 text-xs">{s.source}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs">{new Date(s.created_date).toLocaleDateString()}</span>
                  <Button size="icon" variant="ghost" onClick={() => toggle(s)} className={`h-7 w-7 ${s.status === 'active' ? 'text-green-500' : 'text-slate-500'}`}>
                    {s.status === 'active' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(s.id)} className="text-red-500 h-7 w-7"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}