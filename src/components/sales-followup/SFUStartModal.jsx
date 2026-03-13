import React, { useState, useEffect } from 'react';
import { X, Play, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SFUStartModal({ onClose, onStarted }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [starting, setStarting] = useState(null);

  useEffect(() => {
    base44.entities.SalesOpportunity.filter({ stage: 'demo_completed' }).then(data => {
      setOpportunities(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = opportunities.filter(o =>
    !search || o.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleStart = async (opp) => {
    setStarting(opp.id);
    await base44.functions.invoke('ntaSalesFollowUpEngine', {
      action: 'start_sequence',
      opportunity_id: opp.id,
    });
    onStarted?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900">Start Follow-Up Sequence</h2>
            <p className="text-sm text-slate-500 mt-0.5">Select a demo-completed opportunity</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 mb-4">
            <Search className="w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search opportunities…" className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder-slate-400" />
          </div>
          {loading ? (
            <p className="text-center text-slate-400 py-8 text-sm">Loading opportunities…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-8 text-sm">No demo-completed opportunities found.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filtered.map(o => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{o.company_name}</p>
                    <p className="text-xs text-slate-400">{o.contact_name} · {o.city} · {o.industry}</p>
                  </div>
                  <button onClick={() => handleStart(o)} disabled={starting === o.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50">
                    <Play className="w-3 h-3" /> {starting === o.id ? 'Starting…' : 'Start'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}