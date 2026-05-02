import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { RefreshCw, Bell, CheckCircle2, Phone, Mail, Calendar } from 'lucide-react';

export default function OpsFollowUps() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addNoteId, setAddNoteId] = useState(null);
  const [noteText, setNoteText] = useState('');

  const load = async () => {
    setLoading(true);
    // Get leads that need follow up (new or contacted, ordered by oldest contact)
    const data = await base44.entities.SalesLead.filter({ status: 'contacted' });
    const newLeads = await base44.entities.SalesLead.filter({ status: 'new' });
    setLeads([...data, ...newLeads].sort((a, b) => {
      if (a.next_follow_up && b.next_follow_up) return new Date(a.next_follow_up) - new Date(b.next_follow_up);
      return new Date(a.created_date) - new Date(b.created_date);
    }));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleNote = async (lead) => {
    if (!noteText.trim()) return;
    const timestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newNote = `[${timestamp}] ${noteText}`;
    const updatedNotes = lead.notes ? `${lead.notes}\n${newNote}` : newNote;
    await base44.entities.SalesLead.update(lead.id, {
      notes: updatedNotes,
      last_contacted: new Date().toISOString().split('T')[0],
      status: 'contacted',
    });
    setAddNoteId(null);
    setNoteText('');
    load();
  };

  const isOverdue = (lead) => {
    if (!lead.next_follow_up) return false;
    return new Date(lead.next_follow_up) < new Date();
  };

  const today = leads.filter(l => {
    if (!l.next_follow_up) return false;
    const d = new Date(l.next_follow_up).toDateString();
    return d === new Date().toDateString();
  });
  const overdue = leads.filter(isOverdue).filter(l => {
    const d = new Date(l.next_follow_up).toDateString();
    return d !== new Date().toDateString();
  });
  const upcoming = leads.filter(l => l.next_follow_up && new Date(l.next_follow_up) > new Date() && new Date(l.next_follow_up).toDateString() !== new Date().toDateString());
  const noDate = leads.filter(l => !l.next_follow_up);

  const Section = ({ title, items, badge }) => (
    items.length > 0 ? (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-bold text-white">{title}</h2>
          {badge && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge}`}>{items.length}</span>}
        </div>
        <div className="space-y-2">
          {items.map(lead => (
            <div key={lead.id} className={`bg-slate-900 border rounded-xl p-4 ${isOverdue(lead) ? 'border-red-900/60' : 'border-slate-800'}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-white text-sm">{lead.business_name}</h3>
                    <span className="text-xs text-blue-400">{lead.status}</span>
                    {lead.next_follow_up && (
                      <span className={`text-xs flex items-center gap-1 ${isOverdue(lead) ? 'text-red-400' : 'text-slate-500'}`}>
                        <Calendar className="w-3 h-3" /> {new Date(lead.next_follow_up).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 mb-2">
                    {lead.phone && <a href={`tel:${lead.phone}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</a>}
                    {lead.email && <a href={`mailto:${lead.email}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</a>}
                  </div>
                  {lead.notes && (
                    <div className="bg-slate-800/60 rounded-lg px-3 py-2 mb-2">
                      <p className="text-xs text-slate-400 whitespace-pre-line">{lead.notes}</p>
                    </div>
                  )}
                  {addNoteId === lead.id && (
                    <div className="flex gap-2 mt-2">
                      <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add follow-up note…"
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                      <button onClick={() => handleNote(lead)} className="text-xs font-bold px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Save</button>
                      <button onClick={() => { setAddNoteId(null); setNoteText(''); }} className="text-xs px-2 py-1.5 text-slate-500 hover:text-white">Cancel</button>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setAddNoteId(lead.id); setNoteText(''); }}
                    className="text-xs font-semibold px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                    + Note
                  </button>
                  <button onClick={() => base44.entities.SalesLead.update(lead.id, { status: 'qualified' }).then(load)}
                    className="text-xs font-semibold px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Qualify
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  return (
    <OpsLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Follow-Up Queue</h1>
            <p className="text-slate-500 text-sm">{leads.length} leads need follow-up</p>
          </div>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {loading ? <div className="p-8 text-center text-slate-500 text-sm">Loading…</div> : (
          <>
            <Section title="Overdue" items={overdue} badge="bg-red-900/40 text-red-400" />
            <Section title="Due Today" items={today} badge="bg-amber-900/40 text-amber-400" />
            <Section title="Upcoming" items={upcoming} badge="bg-blue-900/40 text-blue-400" />
            <Section title="No Follow-Up Date Set" items={noDate} badge="bg-slate-800 text-slate-400" />
            {leads.length === 0 && <div className="p-8 text-center text-slate-500 text-sm">No follow-ups needed. All caught up! 🎉</div>}
          </>
        )}
      </div>
    </OpsLayout>
  );
}