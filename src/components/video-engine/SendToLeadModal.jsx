import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SendToLeadModal({ asset, messageText, onClose }) {
  const [leads, setLeads] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [customMsg, setCustomMsg] = useState(messageText || '');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    base44.entities.SalesLead.list('-created_date', 200).then(setLeads);
  }, []);

  const send = async () => {
    if (!selectedId) return;
    setSending(true);
    const today = new Date().toISOString().split('T')[0];
    const lead = leads.find(l => l.id === selectedId);
    const entry = `[${new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}][video_sent] Sent video "${asset.title}"${customMsg ? ` — ${customMsg.slice(0, 80)}...` : ''}`;
    const existing = lead?.notes || '';
    await base44.entities.SalesLead.update(selectedId, {
      notes: existing ? `${entry}\n\n${existing}` : entry,
      last_contacted: today,
    });
    // Track usage on asset
    await base44.entities.VideoAsset.update(asset.id, {
      times_used: (asset.times_used || 0) + 1,
      last_used_date: today,
      status: 'Used',
    });
    setSending(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Send to Lead</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
        </div>

        {done ? (
          <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-4 text-center">
            <p className="text-emerald-300 font-bold text-sm">✅ Logged to lead record!</p>
            <p className="text-xs text-emerald-600 mt-1">Activity and message saved.</p>
            <button onClick={onClose} className="mt-3 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg">Close</button>
          </div>
        ) : (
          <>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Select Lead</label>
              <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="">Choose a lead...</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.business_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Message to copy/send</label>
              <textarea value={customMsg} onChange={e => setCustomMsg(e.target.value)}
                rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-2">
              <button onClick={send} disabled={!selectedId || sending}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm">
                <Send className="w-4 h-4" />{sending ? 'Saving...' : 'Log & Mark Sent'}
              </button>
              <button onClick={onClose} className="px-4 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-sm">Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}