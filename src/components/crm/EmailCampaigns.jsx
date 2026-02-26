import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Send, Users, Mail, Loader2, RefreshCw } from 'lucide-react';
import EmailBodyEditor from './EmailBodyEditor';

export default function EmailCampaigns() {
  const [tab, setTab] = useState('broadcasts');
  const [broadcasts, setBroadcasts] = useState([]);
  const [autoresponders, setAutoresponders] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', subject: '', body: '', send_day: 1, status: 'draft' });
  const [sending, setSending] = useState(null);
  const [sendResult, setSendResult] = useState(null);
  const [tagFilter, setTagFilter] = useState('all');
  const [bodyKey, setBodyKey] = useState(0);

  useEffect(() => { load(); }, [tab]);

  const load = async () => {
    setLoading(true);
    const [subs, emails] = await Promise.all([
      base44.entities.Subscriber.filter({ status: 'active' }),
      tab === 'broadcasts'
        ? base44.entities.EmailTemplate.filter({ type: 'broadcast' }, '-created_date')
        : base44.entities.EmailTemplate.filter({ type: 'autoresponder' }, 'send_day')
    ]);
    setSubscribers(subs);
    if (tab === 'broadcasts') setBroadcasts(emails);
    else setAutoresponders(emails);
    setLoading(false);
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', subject: '', body: '', send_day: 1, status: 'draft' });
    setBodyKey(k => k + 1);
    setShowForm(false);
    setSendResult(null);
  };

  const save = async () => {
    if (!form.name || !form.subject || !form.body) { toast.error('Name, subject, and body required'); return; }
    const payload = { ...form, type: tab === 'broadcasts' ? 'broadcast' : 'autoresponder' };
    if (editing) await base44.entities.EmailTemplate.update(editing.id, payload);
    else await base44.entities.EmailTemplate.create(payload);
    toast.success(editing ? 'Updated' : 'Saved');
    resetForm();
    load();
  };

  const startEdit = (email) => {
    setEditing(email);
    setForm({ name: email.name, subject: email.subject, body: email.body, send_day: email.send_day || 1, status: email.status || 'draft' });
    setShowForm(true);
  };

  const remove = async (id) => { await base44.entities.EmailTemplate.delete(id); load(); };

  // Send broadcast to all active subscribers (or filtered by tag)
  const sendBroadcast = async (email) => {
    setSending(email.id);
    setSendResult(null);
    const targets = tagFilter === 'all' ? subscribers : subscribers.filter(s => s.tags?.includes(tagFilter));
    let sent = 0;
    for (const sub of targets) {
      await base44.integrations.Core.SendEmail({ to: sub.email, subject: email.subject, body: email.body });
      sent++;
    }
    await base44.entities.EmailTemplate.update(email.id, { status: 'sent' });
    setSendResult(`✅ Sent to ${sent} subscriber${sent !== 1 ? 's' : ''}`);
    setSending(null);
    load();
  };

  // Collect all unique tags from subscribers
  const allTags = [...new Set(subscribers.flatMap(s => s.tags || []))].filter(Boolean);

  const activeCount = subscribers.length;
  const emails = tab === 'broadcasts' ? broadcasts : autoresponders;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-400">{activeCount}</p>
          <p className="text-slate-400 text-xs mt-1">Active Subscribers</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{broadcasts.length}</p>
          <p className="text-slate-400 text-xs mt-1">Broadcasts</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">{autoresponders.length}</p>
          <p className="text-slate-400 text-xs mt-1">Autoresponders</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        {[
          { id: 'broadcasts', label: '📣 Broadcasts', color: 'bg-blue-600' },
          { id: 'autoresponders', label: '🔄 Autoresponders', color: 'bg-cyan-600' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setShowForm(false); setSendResult(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? t.color + ' text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Broadcast tag filter */}
      {tab === 'broadcasts' && (
        <div className="flex items-center gap-3">
          <p className="text-slate-400 text-sm">Send to:</p>
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-48 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subscribers ({activeCount})</SelectItem>
              {allTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag} ({subscribers.filter(s => s.tags?.includes(tag)).length})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {sendResult && <div className="bg-green-900/40 border border-green-700 rounded-lg p-3 text-green-400 text-sm">{sendResult}</div>}

      {/* Add button */}
      <div className="flex justify-between items-center">
        <p className="text-slate-400 text-sm">
          {tab === 'autoresponders' ? 'Automated emails triggered when someone subscribes.' : 'One-time emails sent to your list.'}
        </p>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className={tab === 'broadcasts' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-cyan-600 hover:bg-cyan-700'}>
          <Plus className="w-4 h-4 mr-2" /> New {tab === 'broadcasts' ? 'Broadcast' : 'Autoresponder'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Campaign Name</label>
              <Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. March Newsletter" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Subject Line</label>
              <Input value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} placeholder="Subject..." className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          {tab === 'autoresponders' && (
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Send on Day # (after subscribe)</label>
              <Input type="number" value={form.send_day} onChange={e => setForm(f => ({...f, send_day: parseInt(e.target.value)}))} className="bg-slate-800 border-slate-700 text-white w-32" min={0} />
            </div>
          )}
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Email Body</label>
            <EmailBodyEditor
              key={bodyKey}
              value={form.body}
              onChange={val => setForm(f => ({...f, body: val}))}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={save} className={tab === 'broadcasts' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-cyan-600 hover:bg-cyan-700'}>
              {editing ? 'Update' : 'Save'}
            </Button>
            <Button variant="ghost" onClick={resetForm} className="text-slate-400">Cancel</Button>
          </div>
        </div>
      )}

      {/* Email list */}
      {loading ? (
        <div className="text-center py-12 text-slate-400"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
      ) : emails.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No {tab} yet. Create your first!</div>
      ) : (
        <div className="space-y-3">
          {emails.map(email => (
            <div key={email.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{email.name}</p>
                <p className="text-slate-400 text-sm mt-0.5 truncate">Subject: {email.subject}</p>
                {email.send_day !== undefined && tab === 'autoresponders' && (
                  <p className="text-cyan-400 text-xs mt-1">Sends on day {email.send_day}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge className={email.status === 'sent' ? 'bg-green-900 text-green-400' : 'bg-slate-700 text-slate-300'}>{email.status || 'draft'}</Badge>
                {tab === 'broadcasts' && email.status !== 'sent' && (
                  <Button size="sm" onClick={() => sendBroadcast(email)} disabled={sending === email.id} className="bg-blue-600 hover:bg-blue-700 text-xs">
                    {sending === email.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Send className="w-3 h-3 mr-1" />}
                    {sending === email.id ? 'Sending...' : 'Send Now'}
                  </Button>
                )}
                <Button size="icon" variant="ghost" onClick={() => startEdit(email)} className="text-slate-400 h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(email.id)} className="text-red-500 h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}