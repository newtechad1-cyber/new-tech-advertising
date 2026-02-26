import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Send } from 'lucide-react';
import ReactQuill from 'react-quill';

export default function EmailMarketing() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', subject: '', body: '', type: 'broadcast', status: 'draft' });
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.EmailTemplate.filter({ type: 'broadcast' }, '-created_date');
    setEmails(data);
    setLoading(false);
  };

  const save = async () => {
    if (editing) await base44.entities.EmailTemplate.update(editing.id, form);
    else await base44.entities.EmailTemplate.create({ ...form, type: 'broadcast' });
    reset(); load();
  };

  const remove = async (id) => { await base44.entities.EmailTemplate.delete(id); load(); };

  const startEdit = (e) => { setEditing(e); setForm({ name: e.name, subject: e.subject, body: e.body, type: 'broadcast', status: e.status }); setShowForm(true); };

  const reset = () => { setEditing(null); setForm({ name: '', subject: '', body: '', type: 'broadcast', status: 'draft' }); setShowForm(false); setSendResult(null); };

  const sendBroadcast = async (email) => {
    setSending(email.id);
    const subscribers = await base44.entities.Subscriber.filter({ status: 'active' });
    let sent = 0;
    for (const sub of subscribers) {
      await base44.integrations.Core.SendEmail({ to: sub.email, subject: email.subject, body: email.body });
      sent++;
    }
    await base44.entities.EmailTemplate.update(email.id, { status: 'sent' });
    setSendResult(`Sent to ${sent} subscribers!`);
    setSending(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Email Broadcasts</h2>
        <Button onClick={() => { reset(); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> New Email
        </Button>
      </div>

      {sendResult && <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 text-green-400 text-sm">{sendResult}</div>}

      {showForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Campaign Name</label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. March Newsletter" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Subject Line</label>
              <Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Email subject..." className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Email Body</label>
            <div className="bg-white rounded-lg">
              <ReactQuill theme="snow" value={form.body} onChange={val => setForm(f => ({...f, body: val}))} style={{ minHeight: '200px' }} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={save} className="bg-blue-600 hover:bg-blue-700">{editing ? 'Update' : 'Save'} Email</Button>
            <Button variant="ghost" onClick={reset} className="text-slate-400">Cancel</Button>
          </div>
        </div>
      )}

      {loading ? <p className="text-slate-400">Loading...</p> : (
        emails.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No email campaigns yet.</div>
        ) : (
          <div className="space-y-3">
            {emails.map(e => (
              <div key={e.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">{e.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">Subject: {e.subject}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={e.status === 'sent' ? 'bg-green-900 text-green-400' : 'bg-slate-700 text-slate-300'}>{e.status}</Badge>
                  {e.status !== 'sent' && (
                    <Button size="sm" onClick={() => sendBroadcast(e)} disabled={sending === e.id} className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-3 h-3 mr-1" /> {sending === e.id ? 'Sending...' : 'Send Now'}
                    </Button>
                  )}
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