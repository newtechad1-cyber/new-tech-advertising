import React, { useState, useEffect } from 'react';
import AgencyLayout from '../components/agency/AgencyLayout';
import { base44 } from '@/api/base44Client';
import { Plus, RefreshCw, Users, Eye, X } from 'lucide-react';

const ROLES = ['Owner', 'Manager', 'Approver', 'Viewer'];
const STATUSES = ['Invited', 'Active', 'Suspended', 'Revoked'];
const NOTE_MODAL_DEFAULT = { client_id: '', business_name: '', title: '', message_body: '', visibility: 'Client Visible', created_by: 'NTA' };

export default function AgencyPortalManager() {
  const [clients, setClients] = useState([]);
  const [portalUsers, setPortalUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');
  const [showAdd, setShowAdd] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [addForm, setAddForm] = useState({ client_id: '', business_name: '', full_name: '', email: '', role: 'Approver', access_status: 'Active' });
  const [noteForm, setNoteForm] = useState(NOTE_MODAL_DEFAULT);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [c, pu, n] = await Promise.all([
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.ClientPortalUser.list('-created_date', 200),
      base44.entities.ClientPortalNote.list('-created_date', 300),
    ]);
    setClients(c);
    setPortalUsers(pu);
    setNotes(n);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const clientMap = {};
  clients.forEach(c => clientMap[c.id] = c.business_name);

  const saveUser = async () => {
    if (!addForm.email || !addForm.client_id) return;
    setSaving(true);
    const c = clients.find(x => x.id === addForm.client_id);
    await base44.entities.ClientPortalUser.create({ ...addForm, business_name: c?.business_name || '' });
    setSaving(false); setShowAdd(false);
    setAddForm({ client_id: '', business_name: '', full_name: '', email: '', role: 'Approver', access_status: 'Active' });
    load();
  };

  const saveNote = async () => {
    if (!noteForm.title || !noteForm.client_id) return;
    setSaving(true);
    const c = clients.find(x => x.id === noteForm.client_id);
    await base44.entities.ClientPortalNote.create({ ...noteForm, business_name: c?.business_name || '' });
    setSaving(false); setShowNote(false); setNoteForm(NOTE_MODAL_DEFAULT); load();
  };

  const updateUserStatus = async (id, access_status) => {
    await base44.entities.ClientPortalUser.update(id, { access_status });
    setPortalUsers(prev => prev.map(u => u.id === id ? { ...u, access_status } : u));
  };

  const viewAsClient = (clientId) => {
    window.open(`/portal?preview_client=${clientId}`, '_blank');
  };

  return (
    <AgencyLayout>
      <div className="px-6 pt-6 pb-12 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Client Portal Manager</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage client portal access, users, and messages</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
            <button onClick={() => setShowNote(true)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg">
              + Post Message
            </button>
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
              <Plus className="w-3.5 h-3.5" /> Add Portal User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Portal Users', value: portalUsers.length, color: 'text-blue-400' },
            { label: 'Active', value: portalUsers.filter(u => u.access_status === 'Active').length, color: 'text-emerald-400' },
            { label: 'Client Messages', value: notes.filter(n => n.visibility === 'Client Visible').length, color: 'text-violet-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-800">
          {[['users', 'Portal Users'], ['notes', 'Client Messages'], ['clients', 'Client Overview']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${tab === id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>{label}</button>
          ))}
        </div>

        {/* Users tab */}
        {tab === 'users' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-800">{['Name', 'Email', 'Client', 'Role', 'Status', 'Last Login', 'Actions'].map(h => <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-600">Loading...</td></tr> :
                  portalUsers.length === 0 ? <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-600 text-sm">No portal users yet. Add one to get started.</td></tr> :
                  portalUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-3 py-3 font-medium text-white">{u.full_name || '—'}</td>
                      <td className="px-3 py-3 text-slate-400 text-xs">{u.email}</td>
                      <td className="px-3 py-3 text-slate-400 text-xs">{u.business_name || clientMap[u.client_id] || '—'}</td>
                      <td className="px-3 py-3"><span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{u.role}</span></td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.access_status === 'Active' ? 'bg-emerald-900/40 text-emerald-400' : u.access_status === 'Suspended' ? 'bg-amber-900/40 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>{u.access_status}</span>
                      </td>
                      <td className="px-3 py-3 text-slate-600 text-xs">{u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => viewAsClient(u.client_id)} className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg flex items-center gap-1"><Eye className="w-3 h-3" /> View as Client</button>
                          {u.access_status === 'Active' ? (
                            <button onClick={() => updateUserStatus(u.id, 'Suspended')} className="text-xs px-2 py-1 bg-amber-900/30 border border-amber-800 text-amber-400 rounded-lg">Suspend</button>
                          ) : (
                            <button onClick={() => updateUserStatus(u.id, 'Active')} className="text-xs px-2 py-1 bg-emerald-900/30 border border-emerald-800 text-emerald-400 rounded-lg">Activate</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}

        {/* Notes tab */}
        {tab === 'notes' && (
          <div className="space-y-3">
            {notes.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-600 text-sm">No messages posted yet.</div>
            ) : notes.map(n => (
              <div key={n.id} className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-semibold text-white">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{n.business_name || clientMap[n.client_id] || '—'} · {n.created_date ? new Date(n.created_date).toLocaleDateString() : ''}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${n.visibility === 'Client Visible' ? 'bg-blue-900/40 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>{n.visibility}</span>
                </div>
                <p className="text-sm text-slate-400 whitespace-pre-wrap">{n.message_body}</p>
                {n.acknowledged_by_client && <p className="text-xs text-emerald-500 mt-2">✓ Acknowledged by client</p>}
              </div>
            ))}
          </div>
        )}

        {/* Clients overview tab */}
        {tab === 'clients' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-800">{['Client', 'Portal Users', 'Messages', 'Actions'].map(h => <th key={h} className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-800/60">
                {clients.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-3 py-3 font-medium text-white">{c.business_name}</td>
                    <td className="px-3 py-3 text-slate-400 text-xs">{portalUsers.filter(u => u.client_id === c.id).length} user{portalUsers.filter(u => u.client_id === c.id).length !== 1 ? 's' : ''}</td>
                    <td className="px-3 py-3 text-slate-400 text-xs">{notes.filter(n => n.client_id === c.id && n.visibility === 'Client Visible').length} visible</td>
                    <td className="px-3 py-3">
                      <button onClick={() => viewAsClient(c.id)} className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">
                        <Eye className="w-3 h-3" /> View Portal
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add user modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Add Portal User</h2>
              <button onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-3">
              {[['Full Name', 'full_name', 'text', 'Jane Smith'], ['Email *', 'email', 'email', 'jane@business.com']].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label className="block text-xs text-slate-400 mb-1">{label}</label>
                  <input type={type} value={addForm[key]} onChange={e => setAddForm(f => ({...f, [key]: e.target.value}))} placeholder={ph} className={IN} />
                </div>
              ))}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Client *</label>
                <select value={addForm.client_id} onChange={e => setAddForm(f => ({...f, client_id: e.target.value}))} className={IN}>
                  <option value="">Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Role</label>
                  <select value={addForm.role} onChange={e => setAddForm(f => ({...f, role: e.target.value}))} className={IN}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Status</label>
                  <select value={addForm.access_status} onChange={e => setAddForm(f => ({...f, access_status: e.target.value}))} className={IN}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={saveUser} disabled={saving || !addForm.email || !addForm.client_id} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">{saving ? 'Saving...' : 'Add User'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Note modal */}
      {showNote && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Post Message to Client</h2>
              <button onClick={() => setShowNote(false)}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Client *</label>
                <select value={noteForm.client_id} onChange={e => setNoteForm(f => ({...f, client_id: e.target.value}))} className={IN}>
                  <option value="">Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Title *</label>
                <input value={noteForm.title} onChange={e => setNoteForm(f => ({...f, title: e.target.value}))} placeholder="Campaign update, approval reminder..." className={IN} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Message</label>
                <textarea value={noteForm.message_body} onChange={e => setNoteForm(f => ({...f, message_body: e.target.value}))} rows={4} placeholder="Write your message to the client..." className={IN} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Visibility</label>
                <select value={noteForm.visibility} onChange={e => setNoteForm(f => ({...f, visibility: e.target.value}))} className={IN}>
                  <option>Client Visible</option>
                  <option>Internal Only</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setShowNote(false)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={saveNote} disabled={saving || !noteForm.title || !noteForm.client_id} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">{saving ? 'Saving...' : 'Post Message'}</button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}

const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';