import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Plus, Archive, Trash2, RotateCcw, ChevronDown, ChevronUp,
  AlertTriangle, Clock, CheckCircle, Phone, Send, Eye
} from 'lucide-react';

const STAGES = [
  'Lead Identified', 'Demo In Progress', 'Demo Built', 'Demo Sent',
  'Responded', 'Call Booked', 'Proposal Sent', 'Closed Won', 'Closed Lost'
];

const STAGE_COLORS = {
  'Lead Identified':  'bg-slate-100 border-slate-300',
  'Demo In Progress': 'bg-blue-50 border-blue-300',
  'Demo Built':       'bg-indigo-50 border-indigo-300',
  'Demo Sent':        'bg-violet-50 border-violet-300',
  'Responded':        'bg-amber-50 border-amber-300',
  'Call Booked':      'bg-orange-50 border-orange-300',
  'Proposal Sent':    'bg-yellow-50 border-yellow-300',
  'Closed Won':       'bg-green-50 border-green-300',
  'Closed Lost':      'bg-red-50 border-red-300',
};

const STAGE_BADGE = {
  'Lead Identified':  'bg-slate-200 text-slate-700',
  'Demo In Progress': 'bg-blue-100 text-blue-700',
  'Demo Built':       'bg-indigo-100 text-indigo-700',
  'Demo Sent':        'bg-violet-100 text-violet-700',
  'Responded':        'bg-amber-100 text-amber-700',
  'Call Booked':      'bg-orange-100 text-orange-700',
  'Proposal Sent':    'bg-yellow-100 text-yellow-700',
  'Closed Won':       'bg-green-100 text-green-700',
  'Closed Lost':      'bg-red-100 text-red-700',
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function daysSince(dateStr) {
  if (!dateStr) return 999;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function addActivity(lead, message) {
  const log = JSON.parse(lead.activity_log || '[]');
  log.unshift({ message, at: new Date().toISOString() });
  return JSON.stringify(log.slice(0, 50));
}

export default function DailyCommandDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [quickAdd, setQuickAdd] = useState({ business_name: '', website: '', city: '', industry: '' });
  const [adding, setAdding] = useState(false);

  const fetchLeads = useCallback(async () => {
    const data = await base44.entities.NTADemoLead.list('-created_date', 500);
    setLeads(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const activeLeads = leads.filter(l => !l.archived);
  const archivedLeads = leads.filter(l => l.archived);

  // Scoreboard counts (today)
  const todayStr = today();
  const score = {
    added:    activeLeads.filter(l => (l.created_date || '').startsWith(todayStr)).length,
    built:    activeLeads.filter(l => (l.demo_built_at || '').startsWith(todayStr)).length,
    sent:     activeLeads.filter(l => (l.demo_sent_at || '').startsWith(todayStr)).length,
    responded:activeLeads.filter(l => l.status === 'Responded' && (l.updated_date || '').startsWith(todayStr)).length,
    calls:    activeLeads.filter(l => (l.call_booked_at || '').startsWith(todayStr)).length,
    closed:   activeLeads.filter(l => l.status === 'Closed Won' && (l.updated_date || '').startsWith(todayStr)).length,
  };

  // Action Queue
  const followUpsDue   = activeLeads.filter(l => daysSince(l.last_contact_date) >= 2 && !['Closed Won','Closed Lost'].includes(l.status));
  const demosReadySend = activeLeads.filter(l => l.status === 'Demo Built');
  const warmLeads      = activeLeads.filter(l => l.status === 'Responded');
  const staleLeads     = activeLeads.filter(l => daysSince(l.last_contact_date) >= 30 && !['Closed Won','Closed Lost'].includes(l.status));

  // Recent activity (across all leads)
  const recentActivity = leads
    .flatMap(l => {
      try {
        return JSON.parse(l.activity_log || '[]').map(a => ({ ...a, business: l.business_name, id: l.id }));
      } catch { return []; }
    })
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 10);

  async function handleStatusChange(lead, newStatus) {
    const extra = {};
    if (newStatus === 'Demo Built') extra.demo_built_at = new Date().toISOString();
    if (newStatus === 'Demo Sent')  extra.demo_sent_at  = new Date().toISOString();
    if (newStatus === 'Call Booked') extra.call_booked_at = new Date().toISOString();
    const log = addActivity(lead, `Status changed to "${newStatus}"`);
    await base44.entities.NTADemoLead.update(lead.id, { status: newStatus, activity_log: log, last_contact_date: today(), ...extra });
    fetchLeads();
  }

  async function handleArchive(lead) {
    const log = addActivity(lead, 'Archived');
    await base44.entities.NTADemoLead.update(lead.id, { archived: true, archived_at: new Date().toISOString(), activity_log: log });
    fetchLeads();
  }

  async function handleRestore(lead) {
    const log = addActivity(lead, 'Restored from archive');
    await base44.entities.NTADemoLead.update(lead.id, { archived: false, archived_at: null, activity_log: log });
    fetchLeads();
  }

  async function handleDelete(lead) {
    await base44.entities.NTADemoLead.delete(lead.id);
    setDeleteConfirm(null);
    fetchLeads();
  }

  async function handleQuickAdd(e) {
    e.preventDefault();
    if (!quickAdd.business_name.trim()) return;
    setAdding(true);
    const log = JSON.stringify([{ message: 'Lead added', at: new Date().toISOString() }]);
    await base44.entities.NTADemoLead.create({ ...quickAdd, status: 'Lead Identified', activity_log: log, last_contact_date: today() });
    setQuickAdd({ business_name: '', website: '', city: '', industry: '' });
    setAdding(false);
    fetchLeads();
  }

  async function handleSaveNote(lead) {
    if (!noteText.trim()) { setNoteModal(null); return; }
    const log = addActivity(lead, `Note added: ${noteText.slice(0, 60)}`);
    await base44.entities.NTADemoLead.update(lead.id, { notes: noteText, activity_log: log });
    setNoteModal(null);
    setNoteText('');
    fetchLeads();
  }

  async function onDragEnd(result) {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    const lead = leads.find(l => l.id === draggableId);
    if (!lead || lead.status === newStatus) return;
    await handleStatusChange(lead, newStatus);
  }

  function ScoreCard({ label, value, color }) {
    return (
      <div className={`rounded-xl border-2 p-4 text-center ${color}`}>
        <div className="text-3xl font-extrabold">{value}</div>
        <div className="text-xs font-semibold mt-1 text-slate-600">{label}</div>
      </div>
    );
  }

  function LeadCard({ lead, provided }) {
    const stale = daysSince(lead.last_contact_date) >= 30;
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="bg-white border border-slate-200 rounded-lg p-3 mb-2 shadow-sm hover:shadow transition-shadow"
      >
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 text-sm truncate">{lead.business_name}</div>
            {lead.city && <div className="text-xs text-slate-500">{lead.city}{lead.industry ? ` · ${lead.industry}` : ''}</div>}
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => { setNoteModal(lead); setNoteText(lead.notes || ''); }} title="Note" className="p-1 text-slate-400 hover:text-blue-500 rounded transition-colors"><Eye className="w-3.5 h-3.5" /></button>
            <button onClick={() => handleArchive(lead)} title="Archive" className="p-1 text-slate-400 hover:text-amber-500 rounded transition-colors"><Archive className="w-3.5 h-3.5" /></button>
            <button onClick={() => setDeleteConfirm(lead)} title="Delete" className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        {stale && (
          <div className="mt-1.5 text-xs text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Inactive 30+ days</div>
        )}
        {lead.website && <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block mt-1">{lead.website}</a>}
        <select
          value={lead.status}
          onChange={e => handleStatusChange(lead, e.target.value)}
          className="mt-2 w-full text-xs border border-slate-200 rounded px-1.5 py-1 bg-slate-50 focus:outline-none"
          onClick={e => e.stopPropagation()}
        >
          {STAGES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
    );
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Daily Command Dashboard</h1>
            <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Archive className="w-4 h-4" />
            Archived Leads ({archivedLeads.length})
            {showArchived ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-8">

        {/* 1. SCOREBOARD */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <ScoreCard label="Leads Added Today"  value={score.added}     color="border-slate-300 bg-white" />
          <ScoreCard label="Demos Built Today"  value={score.built}     color="border-indigo-200 bg-indigo-50" />
          <ScoreCard label="Demos Sent Today"   value={score.sent}      color="border-violet-200 bg-violet-50" />
          <ScoreCard label="Responses Today"    value={score.responded} color="border-amber-200 bg-amber-50" />
          <ScoreCard label="Calls Booked"       value={score.calls}     color="border-orange-200 bg-orange-50" />
          <ScoreCard label="Deals Closed"       value={score.closed}    color="border-green-200 bg-green-50" />
        </div>

        {/* 2. ACTION QUEUE */}
        {(followUpsDue.length > 0 || demosReadySend.length > 0 || warmLeads.length > 0) && (
          <div>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">⚡ Action Queue</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {demosReadySend.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 font-semibold text-indigo-700 mb-2 text-sm"><Send className="w-4 h-4" /> Demos Ready to Send ({demosReadySend.length})</div>
                  {demosReadySend.slice(0,5).map(l => (
                    <div key={l.id} className="flex items-center justify-between py-1.5 border-b border-indigo-100 last:border-0">
                      <span className="text-sm text-slate-800 truncate">{l.business_name}</span>
                      <button onClick={() => handleStatusChange(l, 'Demo Sent')} className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded font-semibold hover:bg-indigo-700">Mark Sent</button>
                    </div>
                  ))}
                </div>
              )}
              {warmLeads.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 font-semibold text-amber-700 mb-2 text-sm"><Phone className="w-4 h-4" /> Warm Leads ({warmLeads.length})</div>
                  {warmLeads.slice(0,5).map(l => (
                    <div key={l.id} className="flex items-center justify-between py-1.5 border-b border-amber-100 last:border-0">
                      <span className="text-sm text-slate-800 truncate">{l.business_name}</span>
                      <button onClick={() => handleStatusChange(l, 'Call Booked')} className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded font-semibold hover:bg-amber-700">Book Call</button>
                    </div>
                  ))}
                </div>
              )}
              {followUpsDue.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 font-semibold text-red-700 mb-2 text-sm"><Clock className="w-4 h-4" /> Follow-Ups Due ({followUpsDue.length})</div>
                  {followUpsDue.slice(0,5).map(l => (
                    <div key={l.id} className="flex items-center justify-between py-1.5 border-b border-red-100 last:border-0">
                      <span className="text-sm text-slate-800 truncate">{l.business_name}</span>
                      <span className="text-xs text-red-500">{daysSince(l.last_contact_date)}d ago</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. QUICK ADD LEAD */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">➕ Quick Add Lead</h2>
          <form onSubmit={handleQuickAdd} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3 items-end">
            {[['business_name','Business Name*'],['website','Website'],['city','City'],['industry','Industry']].map(([k,lbl]) => (
              <div key={k} className="flex-1 min-w-[140px]">
                <label className="block text-xs text-slate-500 mb-1">{lbl}</label>
                <input
                  value={quickAdd[k]}
                  onChange={e => setQuickAdd(q => ({ ...q, [k]: e.target.value }))}
                  placeholder={lbl.replace('*','')}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={adding || !quickAdd.business_name.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> {adding ? 'Adding…' : 'Add Lead'}
            </button>
          </form>
        </div>

        {/* 4. KANBAN PIPELINE */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">📋 NTA Demo Pipeline</h2>
          <div className="overflow-x-auto pb-2">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-3 min-w-max">
                {STAGES.map(stage => {
                  const stageLeads = activeLeads.filter(l => l.status === stage);
                  return (
                    <div key={stage} className={`w-52 rounded-xl border-2 p-3 flex-shrink-0 ${STAGE_COLORS[stage]}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700">{stage}</span>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${STAGE_BADGE[stage]}`}>{stageLeads.length}</span>
                      </div>
                      <Droppable droppableId={stage}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-h-[60px] rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                          >
                            {stageLeads.map((lead, index) => (
                              <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                {(provided) => <LeadCard lead={lead} provided={provided} />}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          </div>
        </div>

        {/* 5. RECENT ACTIVITY */}
        {recentActivity.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">🕐 Recent Activity</h2>
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-slate-700 flex-1"><span className="font-semibold">{a.business}</span> — {a.message}</span>
                  <span className="text-xs text-slate-400">{new Date(a.at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. ARCHIVED LEADS */}
        {showArchived && (
          <div>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">🗄 Archived Leads ({archivedLeads.length})</h2>
            {archivedLeads.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-400 text-sm">No archived leads.</div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
                {archivedLeads.map(lead => (
                  <div key={lead.id} className="flex items-center justify-between px-4 py-3 gap-4">
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{lead.business_name}</div>
                      <div className="text-xs text-slate-500">{lead.city}{lead.industry ? ` · ${lead.industry}` : ''} · {lead.status}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleRestore(lead)} className="flex items-center gap-1 text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
                        <RotateCcw className="w-3 h-3" /> Restore
                      </button>
                      <button onClick={() => setDeleteConfirm(lead)} className="flex items-center gap-1 text-xs bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Note Modal */}
      {noteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setNoteModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-900 mb-1">{noteModal.business_name}</h3>
            <p className="text-xs text-slate-500 mb-3">{noteModal.status}</p>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={5}
              placeholder="Add a note…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="flex gap-2 mt-3 justify-end">
              <button onClick={() => setNoteModal(null)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleSaveNote(noteModal)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Save Note</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-900 mb-2">Delete Lead?</h3>
            <p className="text-sm text-slate-600 mb-4"><span className="font-semibold">{deleteConfirm.business_name}</span> will be permanently removed. This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}