import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { RotateCcw, Trash2 } from 'lucide-react';
import CRMLayout from '../components/crm-dashboard/CRMLayout';

export default function CRMArchivedLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    base44.entities.DemoPipelineLead.filter({ archived: true }).then(data => {
      setLeads(data);
      setLoading(false);
    });
  }, []);

  const restore = async (id) => {
    await base44.entities.DemoPipelineLead.update(id, { archived: false });
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const deleteLead = async (id) => {
    await base44.entities.DemoPipelineLead.delete(id);
    setLeads(prev => prev.filter(l => l.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <CRMLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Archived Leads</h1>
          <p className="text-slate-400 text-sm mt-1">Leads moved here are hidden from the main dashboard. Restore or permanently delete them.</p>
        </div>

        {loading && <p className="text-slate-500 text-sm">Loading...</p>}

        {!loading && leads.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-500 text-sm">No archived leads.</p>
          </div>
        )}

        {!loading && leads.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
            {leads.map(lead => (
              <div key={lead.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-white">{lead.business_name}</p>
                  <div className="flex gap-3 mt-0.5">
                    {lead.city && <span className="text-xs text-slate-500">{lead.city}</span>}
                    {lead.industry && <span className="text-xs text-slate-500">{lead.industry}</span>}
                    <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">{lead.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => restore(lead.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restore
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(lead.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-white mb-2">Permanently Delete?</h3>
            <p className="text-slate-400 text-sm mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteLead(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg text-sm">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-800 text-white font-semibold py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </CRMLayout>
  );
}