import React, { useState, useEffect } from 'react';
import OpsLayout from '../../components/ops-dashboard/OpsLayout';
import { base44 } from '@/api/base44Client';
import { Plus, RefreshCw, Search, ChevronRight, FileSignature, Edit, Trash2 } from 'lucide-react';

export default function OpsAgreements() {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.ClientAgreement.list('-created_date', 100);
    setAgreements(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = agreements.filter(a => !search || a.business_name?.toLowerCase().includes(search.toLowerCase()) || a.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2"><FileSignature className="w-6 h-6 text-blue-400" /> Agreements</h1>
            <p className="text-slate-500 text-sm">Manage client contracts and approvals.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={() => setModal({ status: 'Draft', agreement_type: 'SOW' })} className="flex items-center gap-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" /> New Agreement
            </button>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agreements..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Client / Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{a.business_name || 'Unknown Client'}</p>
                      <p className="text-xs text-slate-500">{a.title}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{a.agreement_type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        a.status === 'Signed' ? 'bg-emerald-900/40 text-emerald-400' :
                        a.status === 'Sent' ? 'bg-blue-900/40 text-blue-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>{a.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {a.status === 'Signed' ? (a.signed_date ? new Date(a.signed_date).toLocaleDateString() : 'Yes') : (a.sent_date ? new Date(a.sent_date).toLocaleDateString() : 'N/A')}
                    </td>
                    <td className="px-4 py-3 flex items-center justify-end gap-2">
                      <button onClick={() => setModal(a)} className="p-1.5 text-slate-500 hover:text-white bg-slate-800 rounded hover:bg-slate-700"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={async () => { if(confirm('Delete?')){ await base44.entities.ClientAgreement.delete(a.id); load(); } }} className="p-1.5 text-slate-500 hover:text-red-400 bg-slate-800 rounded hover:bg-slate-700"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500">No agreements found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && <AgreementModal agreement={modal.id ? modal : null} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />}
    </OpsLayout>
  );
}

function AgreementModal({ agreement, onSave, onClose }) {
  const [form, setForm] = useState(agreement || { client_id: '', business_name: '', title: '', agreement_type: 'SOW', status: 'Draft', content: '' });
  const [clients, setClients] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.Client.list().then(setClients);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const client = clients.find(c => c.id === form.client_id);
    const data = { ...form, business_name: client?.business_name || form.business_name };
    if (agreement?.id) {
      if (data.status === 'Sent' && !agreement.sent_date) data.sent_date = new Date().toISOString();
      if (data.status === 'Signed' && !agreement.signed_date) data.signed_date = new Date().toISOString();
      await base44.entities.ClientAgreement.update(agreement.id, data);
    } else {
      await base44.entities.ClientAgreement.create(data);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-white font-bold text-lg mb-4">{agreement ? 'Edit Agreement' : 'New Agreement'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Client</label>
            <select required value={form.client_id} onChange={e => setForm({...form, client_id: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
              <option value="">Select Client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Title</label>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Type</label>
              <select value={form.agreement_type} onChange={e => setForm({...form, agreement_type: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {["MSA", "SOW", "NDA", "Amendment", "Other"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {["Draft", "Sent", "Viewed", "Signed", "Cancelled"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Content / Terms</label>
            <textarea value={form.content || ''} onChange={e => setForm({...form, content: e.target.value})} rows={5} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none" placeholder="Enter terms or link to external doc..."></textarea>
          </div>
          
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Agreement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}