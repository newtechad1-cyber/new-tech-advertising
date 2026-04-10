import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, ExternalLink, Trash2, X } from 'lucide-react';
import AgencyLayout from '../components/agency/AgencyLayout';

const STAGES = ['New Lead', 'Contacted', 'Demo Sent', 'Proposal', 'Closed'];

const STAGE_COLORS = {
  'New Lead':   { border: 'border-slate-600',  dot: 'bg-slate-400' },
  'Contacted':  { border: 'border-blue-600',   dot: 'bg-blue-400' },
  'Demo Sent':  { border: 'border-violet-600', dot: 'bg-violet-400' },
  'Proposal':   { border: 'border-amber-500',  dot: 'bg-amber-400' },
  'Closed':     { border: 'border-emerald-500',dot: 'bg-emerald-400' },
};

// Map old DemoPipelineLead statuses → new stages
function mapStatus(oldStatus) {
  const map = {
    'Lead Identified': 'New Lead',
    'Demo In Progress': 'Contacted',
    'Demo Built': 'Contacted',
    'Demo Sent': 'Demo Sent',
    'Responded': 'Contacted',
    'Call Booked': 'Proposal',
    'Proposal Sent': 'Proposal',
    'Closed Won': 'Closed',
    'Closed Lost': 'Closed',
    'New Lead': 'New Lead',
    'Contacted': 'Contacted',
    'Proposal': 'Proposal',
    'Closed': 'Closed',
  };
  return map[oldStatus] || 'New Lead';
}

const EMPTY_FORM = { business_name: '', website: '', city: '', industry: '', notes: '' };

export default function AgencyPipeline() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () =>
    base44.entities.DemoPipelineLead.filter({ archived: false }).then(data => {
      setLeads(data);
      setLoading(false);
    });

  useEffect(() => { load(); }, []);

  const stageMap = STAGES.reduce((acc, s) => {
    acc[s] = leads.filter(l => mapStatus(l.status) === s);
    return acc;
  }, {});

  const handleDragEnd = async ({ draggableId, destination, source }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    const newStage = destination.droppableId;
    setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, status: newStage } : l));
    await base44.entities.DemoPipelineLead.update(draggableId, { status: newStage });
  };

  const addLead = async () => {
    if (!form.business_name.trim()) return;
    setAdding(true);
    const lead = await base44.entities.DemoPipelineLead.create({ ...form, status: 'New Lead', archived: false });
    setLeads(prev => [lead, ...prev]);
    setForm(EMPTY_FORM);
    setAdding(false);
    setShowAdd(false);
  };

  const deleteLead = async (id) => {
    await base44.entities.DemoPipelineLead.delete(id);
    setLeads(prev => prev.filter(l => l.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <AgencyLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Sales Pipeline</h1>
            <p className="text-slate-500 text-sm mt-0.5">{leads.length} leads · drag to move between stages</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>

        {/* Add lead form */}
        {showAdd && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-white">New Lead</p>
              <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {[
                { key: 'business_name', placeholder: 'Business Name *' },
                { key: 'website', placeholder: 'Website' },
                { key: 'city', placeholder: 'City' },
                { key: 'industry', placeholder: 'Industry' },
                { key: 'notes', placeholder: 'Notes' },
              ].map(f => (
                <input
                  key={f.key}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addLead()}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              ))}
            </div>
            <button
              onClick={addLead}
              disabled={adding || !form.business_name.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
            >
              {adding ? 'Adding...' : 'Add Lead'}
            </button>
          </div>
        )}

        {/* Kanban */}
        {loading ? (
          <div className="flex gap-4">
            {STAGES.map(s => <div key={s} className="flex-1 h-64 bg-slate-900 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: '400px' }}>
              {STAGES.map(stage => {
                const { border, dot } = STAGE_COLORS[stage];
                const items = stageMap[stage];
                return (
                  <Droppable key={stage} droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-shrink-0 w-48 bg-slate-900 border rounded-xl p-3 transition-colors ${snapshot.isDraggingOver ? 'border-blue-500' : 'border-slate-800'}`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${dot}`} />
                          <p className="text-xs font-bold text-slate-300">{stage}</p>
                          <span className="ml-auto text-xs text-slate-600 font-bold">{items.length}</span>
                        </div>
                        <div className="space-y-2">
                          {items.map((lead, idx) => (
                            <Draggable key={lead.id} draggableId={lead.id} index={idx}>
                              {(p) => (
                                <div
                                  ref={p.innerRef}
                                  {...p.draggableProps}
                                  {...p.dragHandleProps}
                                  className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 group"
                                >
                                  <p className="text-xs font-semibold text-white leading-tight truncate">{lead.business_name}</p>
                                  {lead.city && <p className="text-xs text-slate-500 mt-0.5 truncate">{lead.city}</p>}
                                  {lead.industry && <p className="text-xs text-slate-600 truncate">{lead.industry}</p>}
                                  {lead.notes && <p className="text-xs text-slate-500 mt-1 truncate italic">{lead.notes}</p>}
                                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {lead.website && (
                                      <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="p-1 text-slate-500 hover:text-blue-400 rounded">
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                    <button onClick={() => setDeleteConfirm(lead.id)} className="p-1 text-slate-500 hover:text-red-400 rounded ml-auto">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                        {items.length === 0 && (
                          <p className="text-slate-700 text-xs text-center py-4">Drop here</p>
                        )}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-white mb-2">Delete Lead?</h3>
            <p className="text-slate-400 text-sm mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteLead(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg text-sm">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-800 text-white font-semibold py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}