import React, { useState, useEffect } from 'react';
import OpsLayout from '../../components/ops-dashboard/OpsLayout';
import { base44 } from '@/api/base44Client';
import { Plus, RefreshCw, Search, FolderOpen, Edit, Trash2, ExternalLink, Upload } from 'lucide-react';

export default function OpsDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.ClientDocument.list('-created_date', 100);
    setDocuments(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = documents.filter(a => !search || a.business_name?.toLowerCase().includes(search.toLowerCase()) || a.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2"><FolderOpen className="w-6 h-6 text-emerald-400" /> Documents</h1>
            <p className="text-slate-500 text-sm">Secure storage for client onboarding files and assets.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={() => setModal({ document_type: 'Other' })} className="flex items-center gap-1.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg">
              <Upload className="w-4 h-4" /> Upload Document
            </button>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Document Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-white">{a.business_name || 'Unknown Client'}</td>
                    <td className="px-4 py-3 text-slate-300">
                      <a href={a.file_url} target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                        {a.title} <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{a.document_type}</td>
                    <td className="px-4 py-3 flex items-center justify-end gap-2">
                      <button onClick={() => setModal(a)} className="p-1.5 text-slate-500 hover:text-white bg-slate-800 rounded hover:bg-slate-700"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={async () => { if(confirm('Delete?')){ await base44.entities.ClientDocument.delete(a.id); load(); } }} className="p-1.5 text-slate-500 hover:text-red-400 bg-slate-800 rounded hover:bg-slate-700"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">No documents found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && <DocumentModal document={modal.id ? modal : null} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />}
    </OpsLayout>
  );
}

function DocumentModal({ document, onSave, onClose }) {
  const [form, setForm] = useState(document || { client_id: '', business_name: '', title: '', document_type: 'Other', file_url: '', description: '' });
  const [clients, setClients] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    base44.entities.Client.list().then(setClients);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: ev.target.result });
        setForm(prev => ({ ...prev, file_url }));
      } catch (err) {
        alert('Upload failed');
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file_url) return alert('Please upload a file or provide a URL.');
    setSaving(true);
    const client = clients.find(c => c.id === form.client_id);
    const data = { ...form, business_name: client?.business_name || form.business_name };
    if (document?.id) {
      await base44.entities.ClientDocument.update(document.id, data);
    } else {
      await base44.entities.ClientDocument.create(data);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-white font-bold text-lg mb-4">{document ? 'Edit Document' : 'Upload Document'}</h2>
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
          <div>
            <label className="block text-xs text-slate-400 mb-1">Type</label>
            <select value={form.document_type} onChange={e => setForm({...form, document_type: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
              {["Intake Form", "Brand Assets", "Tax Form", "Report", "Other"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">File</label>
            <div className="flex gap-2">
              <input type="file" onChange={handleUpload} className="hidden" id="fileUpload" />
              <label htmlFor="fileUpload" className="flex-shrink-0 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 cursor-pointer">
                {uploading ? 'Uploading...' : 'Upload File'}
              </label>
              <input value={form.file_url} onChange={e => setForm({...form, file_url: e.target.value})} placeholder="Or paste URL..." className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Description (Optional)</label>
            <textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none"></textarea>
          </div>
          
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={saving || uploading} className="flex-1 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}