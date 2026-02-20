import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import ReactQuill from 'react-quill';

export default function Autoresponder() {
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', subject: '', body: '', type: 'autoresponder', sequence_day: 1, status: 'draft' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.EmailTemplate.filter({ type: 'autoresponder' }, 'sequence_day');
    setSequences(data);
    setLoading(false);
  };

  const save = async () => {
    const payload = { ...form, type: 'autoresponder', sequence_day: parseInt(form.sequence_day) || 1 };
    if (editing) await base44.entities.EmailTemplate.update(editing.id, payload);
    else await base44.entities.EmailTemplate.create(payload);
    reset(); load();
  };

  const remove = async (id) => { await base44.entities.EmailTemplate.delete(id); load(); };
  const startEdit = (e) => { setEditing(e); setForm({ name: e.name, subject: e.subject, body: e.body, type: 'autoresponder', sequence_day: e.sequence_day || 1, status: e.status }); setShowForm(true); };
  const reset = () => { setEditing(null); setForm({ name: '', subject: '', body: '', type: 'autoresponder', sequence_day: 1, status: 'draft' }); setShowForm(false); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Autoresponder Sequence</h2>
          <p className="text-slate-400 text-sm">Emails automatically sent to new subscribers in order</p>
        </div>
        <Button onClick={() => { reset(); setShowForm(true); }} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-2" /> Add Email
        </Button>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Email Name</label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Welcome Email" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Send on Day #</label>
              <Input type="number" value={form.sequence_day} onChange={e => setForm({...form, sequence_day: e.target.value})} min="1" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Subject Line</label>
              <Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Subject..." className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Email Body</label>
            <div className="bg-white rounded-lg">
              <ReactQuill value={form.body} onChange={val => setForm({...form, body: val})} style={{ minHeight: '180px' }} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={save} className="bg-cyan-600 hover:bg-cyan-700">{editing ? 'Update' : 'Add'} Email</Button>
            <Button variant="ghost" onClick={reset} className="text-slate-400">Cancel</Button>
          </div>
        </div>
      )}

      {loading ? <p className="text-slate-400">Loading...</p> : (
        sequences.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No autoresponder emails yet. Add your welcome sequence!</div>
        ) : (
          <div className="space-y-3">
            {sequences.map((e, i) => (
              <div key={e.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
                <div className="bg-cyan-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  Day {e.sequence_day}
                </div>
                {i < sequences.length - 1 && <div className="absolute left-[calc(1.5rem+1.25rem)] top-full w-0.5 h-3 bg-slate-700" />}
                <div className="flex-1">
                  <h3 className="font-bold text-white">{e.name}</h3>
                  <p className="text-slate-400 text-sm">Subject: {e.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-cyan-500" />
                  <Button size="icon" variant="ghost" onClick={() => startEdit(e)} className="text-slate-400 h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(e.id)} className="text-red-500 h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}