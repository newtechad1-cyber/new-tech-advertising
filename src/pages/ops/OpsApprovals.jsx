import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

export default function OpsApprovals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.NTAContentAsset.filter({ status: 'ready_for_review' });
    const all = await base44.entities.NTAContentAsset.list('-updated_date', 100);
    setItems(all.filter(a => ['ready_for_review','needs_reapproval','approved','rejected'].includes(a.status)));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleAction = async (id, status) => {
    await base44.entities.NTAContentAsset.update(id, { status });
    load();
  };

  const filtered = items.filter(i => filter === 'all' || i.status === filter);

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Approval Workflow</h1>
            <p className="text-slate-500 text-sm">Review and approve content before it publishes</p>
          </div>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { label: 'All', value: 'all' },
            { label: 'Needs Review', value: 'ready_for_review' },
            { label: 'Needs Reapproval', value: 'needs_reapproval' },
            { label: 'Approved', value: 'approved' },
            { label: 'Rejected', value: 'rejected' },
          ].map(t => (
            <button key={t.value} onClick={() => setFilter(t.value)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${filter === t.value ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {t.label}
              {t.value !== 'all' && <span className="ml-1.5 opacity-60">{items.filter(i => i.status === t.value).length}</span>}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {loading ? <div className="p-8 text-center text-slate-500 text-sm">Loading…</div> :
           filtered.length === 0 ? <div className="p-8 text-center text-slate-500 text-sm">No items in this queue.</div> :
           filtered.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'ready_for_review' ? 'bg-amber-900/40 text-amber-400' :
                      item.status === 'approved' ? 'bg-emerald-900/40 text-emerald-400' :
                      item.status === 'rejected' ? 'bg-red-900/40 text-red-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>{item.status?.replace(/_/g, ' ')}</span>
                    <span className="text-xs text-slate-600">{item.platform} · {item.asset_type?.replace(/_/g,' ')}</span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{item.asset_name}</h3>
                  {item.headline && <p className="text-xs text-slate-400 mb-1">{item.headline}</p>}
                  {item.body_copy && <p className="text-xs text-slate-500 line-clamp-2">{item.body_copy}</p>}
                  {item.rejection_feedback && (
                    <div className="mt-2 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
                      <p className="text-xs text-red-400"><span className="font-bold">Rejection note:</span> {item.rejection_feedback}</p>
                    </div>
                  )}
                </div>
                {(item.status === 'ready_for_review' || item.status === 'needs_reapproval') && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleAction(item.id, 'approved')}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => handleAction(item.id, 'rejected')}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </OpsLayout>
  );
}