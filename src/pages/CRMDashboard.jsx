import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, ExternalLink, Archive, Trash2, AlertTriangle, CheckCircle, Clock, Phone, Send } from 'lucide-react';
import CRMLayout from '../components/crm-dashboard/CRMLayout';

const STAGES = [
  'Lead Identified', 'Demo In Progress', 'Demo Built', 'Demo Sent',
  'Responded', 'Call Booked', 'Proposal Sent', 'Closed Won', 'Closed Lost',
];

const STAGE_COLORS = {
  'Lead Identified': 'border-slate-600',
  'Demo In Progress': 'border-blue-600',
  'Demo Built': 'border-violet-600',
  'Demo Sent': 'border-indigo-500',
  'Responded': 'border-amber-500',
  'Call Booked': 'border-orange-500',
  'Proposal Sent': 'border-teal-500',
  'Closed Won': 'border-emerald-500',
  'Closed Lost': 'border-red-700',
};

const today = () => new Date().toISOString().split('T')[0];
const daysAgo = (dateStr) => {
  if (!dateStr) return 999;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
};

// LEGACY PAGE — DemoPipelineLead is deprecated as the canonical lead model.
// Canonical lead/deal models are SalesLead + SalesDeal.
// This page is READ-ONLY and preserved for historical reference only.
// New lead creation is disabled here. Use /agency/leads instead.
export default function CRMDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ business_name: '', website: '', city: '', industry: '' });
  const [adding, setAdding] = useState(false);

  const loadLeads = async () => {
    // LEGACY: DemoPipelineLead — read-only, do not add new records here
    const data = await base44.entities.DemoPipelineLead.filter({ archived: false });
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => { loadLeads(); }, []);

  const activeLeads = leads.filter(l => !l.archived);

  // Scoreboard metrics
  const todayStr = today();
  const leadsToday = activeLeads.filter(l => l.created_date?.startsWith(todayStr)).length;
  const demosBuiltToday = activeLeads.filter(l => l.demo_built_date === todayStr).length;
  const demosSentToday = activeLeads.filter(l => l.demo_sent_date === todayStr).length;
  const respondedToday = activeLeads.filter(l => l.status === 'Responded' && l.last_contact_date === todayStr).length;
  const callsBooked = activeLeads.filter(l => l.status === 'Call Booked').length;
  const closedWon = activeLeads.filter(l => l.status === 'Closed Won').length;

  // Action queues
  const followUpsDue = activeLeads.filter(l => daysAgo(l.last_contact_date) >= 2 && !['Closed Won','Closed Lost'].includes(l.status));
  const demosReady = activeLeads.filter(l => l.status === 'Demo Built');
  const warmLeads = activeLeads.filter(l => l.status === 'Responded');

  const handleDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    const newStatus = destination.droppableId;
    setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, status: newStatus } : l));
    await base44.entities.DemoPipelineLead.update(draggableId, {
      status: newStatus,
      last_contact_date: today(),
      ...(newStatus === 'Demo Built' ? { demo_built_date: today() } : {}),
      ...(newStatus === 'Demo Sent' ? { demo_sent_date: today() } : {}),
    });
  };

  const archiveLead = async (id) => {
    await base44.entities.DemoPipelineLead.update(id, { archived: true });
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const deleteLead = async (id) => {
    await base44.entities.DemoPipelineLead.delete(id);
    setLeads(prev => prev.filter(l => l.id !== id));
    setDeleteConfirm(null);
  };

  const addLead = async () => {
    if (!form.business_name.trim()) return;
    setAdding(true);
    const newLead = await base44.entities.DemoPipelineLead.create({
      ...form,
      status: 'Lead Identified',
      archived: false,
      last_contact_date: today(),
    });
    setLeads(prev => [newLead, ...prev]);
    setForm({ business_name: '', website: '', city: '', industry: '' });
    setAdding(false);
  };

  const stageMap = STAGES.reduce((acc, s) => {
    acc[s] = activeLeads.filter(l => l.status === s);
    return acc;
  }, {});

  return (
    <CRMLayout>
      <div className="p-6 space-y-8 min-h-screen">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Daily Command Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* LEGACY BANNER */}
        <div className="bg-amber-950/50 border border-amber-700/60 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-amber-400">⚠️ Legacy Page — Read Only</p>
            <p className="text-xs text-amber-600 mt-0.5">This dashboard uses the deprecated DemoPipelineLead model. New leads and deals are managed in the Agency CRM.</p>
          </div>
          <a href="/agency/leads" className="flex-shrink-0 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 px-3 py-1.5 rounded-lg transition-colors">
            Go to Agency CRM →
          </a>
        </div>

        {/* Scoreboard */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Today's Scoreboard</h2>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Leads Added', value: leadsToday, color: 'text-blue-400' },
              { label: 'Demos Built', value: demosBuiltToday, color: 'text-violet-400' },
              { label: 'Demos Sent', value: demosSentToday, color: 'text-indigo-400' },
              { label: 'Responses', value: respondedToday, color: 'text-amber-400' },
              { label: 'Calls Booked', value: callsBooked, color: 'text-orange-400' },
              { label: 'Closed Won', value: closedWon, color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-slate-500 text-xs mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Queue */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Action Queue</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionQueue icon={Clock} color="text-amber-400 bg-amber-400/10" title="Follow-Ups Due" leads={followUpsDue} onArchive={archiveLead} onDelete={setDeleteConfirm} />
            <ActionQueue icon={Send} color="text-violet-400 bg-violet-400/10" title="Demos Ready to Send" leads={demosReady} onArchive={archiveLead} onDelete={setDeleteConfirm} />
            <ActionQueue icon={Phone} color="text-emerald-400 bg-emerald-400/10" title="Warm Leads" leads={warmLeads} onArchive={archiveLead} onDelete={setDeleteConfirm} />
          </div>
        </section>

        {/* Quick Add Lead — DISABLED (legacy model) */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Add Lead</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 opacity-50 pointer-events-none select-none">
            <p className="text-xs text-amber-500 mb-3 font-semibold">⚠️ Disabled — new leads must be created in <span className="underline">/agency/leads</span></p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {['Business Name', 'Website URL', 'City', 'Industry'].map(p => (
                <input key={p} placeholder={p} disabled className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-600 placeholder-slate-600 cursor-not-allowed" />
              ))}
            </div>
            <button disabled className="inline-flex items-center gap-2 bg-slate-700 text-slate-500 font-semibold text-sm px-5 py-2.5 rounded-lg cursor-not-allowed">
              <Plus className="w-4 h-4" /> Add Lead (disabled)
            </button>
          </div>
        </section>

        {/* Kanban Pipeline */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">NTA Demo Pipeline</h2>
          {loading ? (
            <p className="text-slate-500 text-sm">Loading...</p>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: '320px' }}>
                {STAGES.map(stage => (
                  <Droppable key={stage} droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-shrink-0 w-44 bg-slate-900 border rounded-xl p-3 ${snapshot.isDraggingOver ? 'border-blue-500' : 'border-slate-800'}`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-1.5 h-1.5 rounded-full border-2 ${STAGE_COLORS[stage]}`} style={{ borderColor: 'currentColor' }} />
                          <p className="text-xs font-bold text-slate-300 leading-tight">{stage}</p>
                          <span className="ml-auto text-xs text-slate-600 font-bold">{stageMap[stage].length}</span>
                        </div>
                        <div className="space-y-2">
                          {stageMap[stage].map((lead, idx) => (
                            <Draggable key={lead.id} draggableId={lead.id} index={idx}>
                              {(p) => (
                                <div
                                  ref={p.innerRef}
                                  {...p.draggableProps}
                                  {...p.dragHandleProps}
                                  className={`bg-slate-800 border border-slate-700 rounded-lg p-2.5 group ${daysAgo(lead.last_contact_date) >= 30 ? 'border-amber-700' : ''}`}
                                >
                                  <p className="text-xs font-semibold text-white leading-tight truncate">{lead.business_name}</p>
                                  {lead.city && <p className="text-xs text-slate-500 mt-0.5 truncate">{lead.city}</p>}
                                  {daysAgo(lead.last_contact_date) >= 30 && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                                      <span className="text-xs text-amber-500">Inactive</span>
                                    </div>
                                  )}
                                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {lead.website && (
                                      <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer"
                                        className="p-1 text-slate-500 hover:text-blue-400 rounded">
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                    <button onClick={() => archiveLead(lead.id)} className="p-1 text-slate-500 hover:text-amber-400 rounded" title="Archive">
                                      <Archive className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => setDeleteConfirm(lead.id)} className="p-1 text-slate-500 hover:text-red-400 rounded" title="Delete">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  {stage === 'Closed Lost' && (
                                    <button onClick={() => archiveLead(lead.id)} className="mt-1 w-full text-xs text-amber-500 hover:text-amber-300 text-left">
                                      → Archive this lead
                                    </button>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          )}
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Recent Activity</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
            {[...activeLeads]
              .sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date))
              .slice(0, 10)
              .map(lead => (
                <div key={lead.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{lead.business_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{lead.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{lead.updated_date ? new Date(lead.updated_date).toLocaleDateString() : '—'}</p>
                    {lead.city && <p className="text-xs text-slate-600">{lead.city}</p>}
                  </div>
                </div>
              ))}
            {activeLeads.length === 0 && (
              <p className="px-4 py-6 text-slate-600 text-sm text-center">No leads yet. Add your first lead above.</p>
            )}
          </div>
        </section>
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-white mb-2">Delete Lead?</h3>
            <p className="text-slate-400 text-sm mb-5">This action is permanent and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteLead(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg text-sm transition-colors">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </CRMLayout>
  );
}

function ActionQueue({ icon: Icon, color, title, leads, onArchive, onDelete }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-bold text-slate-200">{title}</span>
        <span className="ml-auto text-xs font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{leads.length}</span>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {leads.length === 0 && <p className="text-slate-600 text-xs py-2">Nothing here — nice work.</p>}
        {leads.map(lead => (
          <div key={lead.id} className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2 group">
            <div>
              <p className="text-xs font-semibold text-white truncate max-w-[120px]">{lead.business_name}</p>
              {lead.city && <p className="text-xs text-slate-500">{lead.city}</p>}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onArchive(lead.id)} className="p-1 text-slate-500 hover:text-amber-400 rounded">
                <Archive className="w-3 h-3" />
              </button>
              <button onClick={() => onDelete(lead.id)} className="p-1 text-slate-500 hover:text-red-400 rounded">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}