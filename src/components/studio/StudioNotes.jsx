import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Pin, PinOff, Pencil } from 'lucide-react';

const CATEGORIES = ['general', 'idea', 'todo', 'client', 'campaign'];
const CAT_COLORS = { general: 'bg-slate-600', idea: 'bg-yellow-600', todo: 'bg-blue-600', client: 'bg-purple-600', campaign: 'bg-green-600' };

export default function StudioNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', pinned: false });
  const [filterCat, setFilterCat] = useState('all');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.AdminNote.list('-created_date');
    setNotes(data);
    setLoading(false);
  };

  const save = async () => {
    if (editing) await base44.entities.AdminNote.update(editing.id, form);
    else await base44.entities.AdminNote.create(form);
    reset(); load();
  };

  const remove = async (id) => { await base44.entities.AdminNote.delete(id); load(); };

  const togglePin = async (note) => {
    await base44.entities.AdminNote.update(note.id, { pinned: !note.pinned });
    load();
  };

  const startEdit = (n) => { setEditing(n); setForm({ title: n.title, content: n.content, category: n.category, pinned: n.pinned }); setShowForm(true); };
  const reset = () => { setEditing(null); setForm({ title: '', content: '', category: 'general', pinned: false }); setShowForm(false); };

  const sorted = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const filtered = filterCat === 'all' ? sorted : sorted.filter(n => n.category === filterCat);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Notes</h2>
        <Button onClick={() => { reset(); setShowForm(true); }} className="bg-yellow-600 hover:bg-yellow-700">
          <Plus className="w-4 h-4 mr-2" /> New Note
        </Button>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Title</label>
              <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Note title..." className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Content</label>
            <textarea
              value={form.content}
              onChange={e => setForm({...form, content: e.target.value})}
              rows={5}
              placeholder="Write your note..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>
          <div className="flex gap-3 items-center">
            <Button onClick={save} className="bg-yellow-600 hover:bg-yellow-700">{editing ? 'Update' : 'Save'} Note</Button>
            <Button variant="ghost" onClick={reset} className="text-slate-400">Cancel</Button>
            <label className="flex items-center gap-2 text-slate-400 text-sm cursor-pointer ml-2">
              <input type="checkbox" checked={form.pinned} onChange={e => setForm({...form, pinned: e.target.checked})} className="rounded" />
              Pin to top
            </label>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterCat('all')} className={`px-3 py-1 rounded-full text-sm border transition-colors ${filterCat === 'all' ? 'bg-white text-slate-900 border-white' : 'border-slate-700 text-slate-400 hover:border-white'}`}>All</button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1 rounded-full text-sm border transition-colors ${filterCat === c ? 'bg-white text-slate-900 border-white' : 'border-slate-700 text-slate-400 hover:border-white'}`}>{c}</button>
        ))}
      </div>

      {loading ? <p className="text-slate-400">Loading...</p> : (
        filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No notes yet. Capture your ideas!</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(n => (
              <div key={n.id} className={`bg-slate-900 border rounded-xl p-5 ${n.pinned ? 'border-yellow-500/50' : 'border-slate-800'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {n.pinned && <Pin className="w-4 h-4 text-yellow-500" />}
                    <h3 className="font-bold text-white">{n.title}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => togglePin(n)} className={`h-7 w-7 ${n.pinned ? 'text-yellow-500' : 'text-slate-600'}`}>
                      {n.pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => startEdit(n)} className="text-slate-400 h-7 w-7"><Pencil className="w-3 h-3" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(n.id)} className="text-red-500 h-7 w-7"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
                <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{n.content}</p>
                <div className="mt-3">
                  <Badge className={`${CAT_COLORS[n.category]} text-white text-xs`}>{n.category}</Badge>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}