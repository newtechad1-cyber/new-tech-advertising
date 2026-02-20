import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Search, UserCheck, UserX } from 'lucide-react';

export default function SubscribersList() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', first_name: '', last_name: '', tags: '', source: '', status: 'active' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Subscriber.list('-created_date');
    setSubscribers(data);
    setLoading(false);
  };

  const save = async () => {
    const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
    await base44.entities.Subscriber.create(payload);
    setForm({ email: '', first_name: '', last_name: '', tags: '', source: '', status: 'active' });
    setShowForm(false);
    load();
  };

  const toggle = async (sub) => {
    await base44.entities.Subscriber.update(sub.id, { status: sub.status === 'active' ? 'unsubscribed' : 'active' });
    load();
  };

  const remove = async (id) => { await base44.entities.Subscriber.delete(id); load(); };

  const filtered = subscribers.filter(s =>
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.last_name?.toLowerCase().includes(search.toLowerCase())
  );

  const active = subscribers.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Subscribers</h2>
          <p className="text-slate-400 text-sm">{active} active of {subscribers.length} total</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" /> Add Subscriber
        </Button>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">First Name</label>
              <Input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} placeholder="First name" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Last Name</label>
              <Input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} placeholder="Last name" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Email *</label>
              <Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Tags (comma separated)</label>
              <Input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="newsletter, vip, ebook" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Source</label>
              <Input value={form.source} onChange={e => setForm({...form, source: e.target.value})} placeholder="e.g. website, event" className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={save} className="bg-orange-600 hover:bg-orange-700">Add Subscriber</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-slate-400">Cancel</Button>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscribers..." className="bg-slate-900 border-slate-700 text-white pl-10" />
      </div>

      {loading ? <p className="text-slate-400">Loading...</p> : (
        filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No subscribers found.</div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="divide-y divide-slate-800">
              {filtered.map(s => (
                <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.status === 'active' ? 'bg-green-500' : 'bg-slate-600'}`} />
                    <div>
                      <p className="text-white text-sm font-medium">{s.first_name} {s.last_name} <span className="text-slate-400 font-normal">— {s.email}</span></p>
                      {s.tags?.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {s.tags.map(tag => <Badge key={tag} className="bg-slate-700 text-slate-300 text-xs py-0">{tag}</Badge>)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" onClick={() => toggle(s)} className={`h-7 w-7 ${s.status === 'active' ? 'text-green-500' : 'text-slate-500'}`}>
                      {s.status === 'active' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(s.id)} className="text-red-500 h-7 w-7"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}