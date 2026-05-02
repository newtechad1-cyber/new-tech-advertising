import React, { useState, useEffect } from 'react';
import OpsLayout from '../../components/ops-dashboard/OpsLayout';
import { base44 } from '@/api/base44Client';
import { Plus, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const STATUS_COLORS = {
  scheduled: 'bg-blue-900/40 text-blue-300',
  sent: 'bg-purple-900/40 text-purple-300',
  completed: 'bg-emerald-900/40 text-emerald-300',
  skipped: 'bg-slate-700 text-slate-400',
  failed: 'bg-red-900/40 text-red-300',
};

const TYPE_ICONS = { call: '📞', text: '💬', email: '✉️', dm: '📲', voicemail: '📭', in_person: '🤝' };

function FollowUpModal({ followUp, leads, clients, onSave, onClose }) {
  const [form, setForm] = useState(followUp || { lead_id: '', client_id: '', type: 'call', message: '', scheduled_date: '', status: 'scheduled' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (followUp?.id) { await base44.entities.FollowUp.update(followUp.id, form); }
    else { await base44.entities.FollowUp.create(form); }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6">
        <h2 className="text-white font-bold text-lg mb-4">{followUp?.id ? 'Edit Follow-Up' : 'New Follow-Up'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Client</label>
              <select value={form.client_id} onChange={e => set('client_id', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                <option value="">Select…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Lead</label>
              <select value={form.lead_id} onChange={e => set('lead_id', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                <option value="">Select…</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.name || l.phone || l.id.slice(0,8)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {['call','text','email','dm','voicemail','in_person'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {['scheduled','sent','completed','skipped','failed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Scheduled Date/Time</label>
            <input type="datetime-local" value={form.scheduled_date?.slice(0,16) || ''} onChange={e => set('scheduled_date', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Message / Script</label>
            <textarea value={form.message || ''} onChange={e => set('message', e.target.value)} rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none" />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OpsFollowUps() {
  const [followUps, setFollowUps] = useState([]);
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState('upcoming');

  const load = async () => {
    setLoading(true);
    const [f, l, c] = await Promise.all([
      base44.entities.FollowUp.list('-scheduled_date', 200),
      base44.entities.Lead.list('-created_date', 200),
      base44.entities.Client.list('-created_date', 100),
    ]);
    setFollowUps(f);
    setLeads(l);
    setClients(c);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const now = new Date();

  const overdue = followUps.filter(f => f.status === 'scheduled' && f.scheduled_date && new Date(f.scheduled_date) < now);
  const upcoming = followUps.filter(f => f.status === 'scheduled' && (!f.scheduled_date || new Date(f.scheduled_date) >= now));
  const done = followUps.filter(f => ['completed','sent'].includes(f.status));

  const displayList = tab === 'overdue' ? overdue : tab === 'upcoming' ? upcoming : tab === 'done' ? done : followUps;

  const leadName = (id) => { const l = leads.find(l => l.id === id); return l?.name || l?.phone || '—'; };
  const clientName = (id) => clients.find(c => c.id === id)?.business_name || '—';

  const markDone = async (fu) => {
    await base44.entities.FollowUp.update(fu.id, { status: 'completed' });
    load();
  };

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Follow-Ups</h1>
            <p className="text-slate-500 text-sm">{overdue.length} overdue · {upcoming.length} upcoming</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={() => setModal({})} className="flex items-center gap-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" /> New Follow-Up
            </button>
          </div>
        </div>

        <div className="flex gap-1 bg-slate-900 rounded-xl p-1 w-fit">
          {[['overdue', `Overdue (${overdue.length})`], ['upcoming', `Upcoming (${upcoming.length})`], ['done', `Done (${done.length})`], ['all', 'All']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${tab === k ? (k === 'overdue' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white') : 'text-slate-400 hover:text-white'}`}>
              {l}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : displayList.length === 0 ? (
          <div className="text-center text-slate-600 py-12 text-sm">No follow-ups in this category.</div>
        ) : (
          <div className="space-y-2">
            {displayList.map(f => {
              const isOverdue = f.status === 'scheduled' && f.scheduled_date && new Date(f.scheduled_date) < now;
              return (
                <div key={f.id} className={`bg-slate-900 rounded-xl px-4 py-3 border flex items-center justify-between gap-3 flex-wrap ${isOverdue ? 'border-red-900/50' : 'border-slate-800'}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base">{TYPE_ICONS[f.type] || '📋'}</span>
                      <p className="text-white font-semibold text-sm">{leadName(f.lead_id)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[f.status] || 'bg-slate-700 text-slate-400'}`}>{f.status}</span>
                      {isOverdue && <span className="text-xs text-red-400 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> OVERDUE</span>}
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {clientName(f.client_id)} · {f.scheduled_date ? new Date(f.scheduled_date).toLocaleString() : 'No date set'}
                    </p>
                    {f.message && <p className="text-slate-400 text-xs mt-1 line-clamp-1">{f.message}</p>}
                  </div>
                  <div className="flex gap-2">
                    {f.status === 'scheduled' && (
                      <button onClick={() => markDone(f)} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg">
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </button>
                    )}
                    <button onClick={() => setModal(f)} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">Edit</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {modal !== null && <FollowUpModal followUp={modal?.id ? modal : null} leads={leads} clients={clients} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />}
    </OpsLayout>
  );
}