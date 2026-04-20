import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Phone, Mail, Trash2, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
import AgencyLayout from '../components/agency/AgencyLayout';
import { scoreLead, PRIORITY_STYLES } from '../lib/leadPriority.js';
import AddLeadModal from '../components/agency/AddLeadModal';
import LeadDetailModal from '../components/agency/LeadDetailModal.jsx';

function isIncomplete(lead) {
  if (!lead) return false;
  const hasName = !!(lead.contact_name || lead.first_name || lead.last_name);
  const hasContact = !!(lead.phone || lead.email);
  return !hasName || !hasContact;
}

function fmtFollowUp(d) {
  if (!d) return '';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(d) {
  if (!d) return false;
  return new Date(d + 'T12:00:00') < new Date();
}

const STAGES = ['New Lead', 'Contacted', 'Demo Sent', 'Proposal', 'Closed Won', 'Closed Lost'];

const STAGE_STYLES = {
  'New Lead':    { border: 'border-slate-700',   dot: 'bg-slate-400',   header: 'text-slate-400',   bg: 'bg-slate-900' },
  'Contacted':   { border: 'border-blue-700',    dot: 'bg-blue-400',    header: 'text-blue-400',    bg: 'bg-slate-900' },
  'Demo Sent':   { border: 'border-violet-700',  dot: 'bg-violet-400',  header: 'text-violet-400',  bg: 'bg-slate-900' },
  'Proposal':    { border: 'border-amber-600',   dot: 'bg-amber-400',   header: 'text-amber-400',   bg: 'bg-slate-900' },
  'Closed Won':  { border: 'border-emerald-600', dot: 'bg-emerald-400', header: 'text-emerald-400', bg: 'bg-emerald-950/20' },
  'Closed Lost': { border: 'border-red-800',     dot: 'bg-red-600',     header: 'text-red-400',     bg: 'bg-red-950/20' },
};

export default function AgencyPipeline() {
  const [deals, setDeals] = useState([]);
  const [leadsMap, setLeadsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [stageChanging, setStageChanging] = useState(null); // deal id being changed via dropdown

  const load = async () => {
    setLoading(true);
    const [d, l] = await Promise.all([
      base44.entities.SalesDeal.filter({ archived: false }),
      base44.entities.SalesLead.list('-created_date', 500),
    ]);
    const map = {};
    l.forEach(lead => { map[lead.id] = lead; });
    setDeals(d);
    setLeadsMap(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stageMap = STAGES.reduce((acc, s) => {
    acc[s] = deals.filter(d => d.stage === s);
    return acc;
  }, {});

  const handleDragEnd = async ({ draggableId, destination, source }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    const newStage = destination.droppableId;
    setDeals(prev => prev.map(d => d.id === draggableId ? { ...d, stage: newStage } : d));
    await base44.entities.SalesDeal.update(draggableId, { stage: newStage });
  };

  const quickMoveStage = async (e, deal, newStage) => {
    e.stopPropagation();
    if (deal.stage === newStage) return;
    setStageChanging(deal.id);
    setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, stage: newStage } : d));
    await base44.entities.SalesDeal.update(deal.id, { stage: newStage });
    setStageChanging(null);
  };

  const onLeadSaved = ({ lead, deal }) => {
    setLeadsMap(prev => ({ ...prev, [lead.id]: lead }));
    setDeals(prev => [deal, ...prev]);
    setShowAdd(false);
  };

  const onDealUpdated = (updated, updatedLead) => {
    if (updated?.id) {
      setDeals(prev => prev.map(d => d.id === updated.id ? updated : d));
    }
    if (selected?.deal?.id === updated?.id) {
      setSelected(s => ({ ...s, deal: updated, lead: updatedLead || s?.lead }));
    }
    if (updatedLead?.id) {
      setLeadsMap(prev => ({ ...prev, [updatedLead.id]: updatedLead }));
    }
  };

  const deleteDeal = async (id) => {
    await base44.entities.SalesDeal.update(id, { archived: true });
    setDeals(prev => prev.filter(d => d.id !== id));
    setDeleteConfirm(null);
  };

  const openDetail = (deal) => {
    const lead = leadsMap[deal.lead_id] || null;
    setSelected({ deal, lead });
  };

  const totalActive = deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).length;
  const closedWon = deals.filter(d => d.stage === 'Closed Won').length;
  const totalValue = deals
    .filter(d => d.stage !== 'Closed Lost' && d.value)
    .reduce((sum, d) => sum + (Number(d.value) || 0), 0);

  return (
    <AgencyLayout>
      <div className="p-6 flex flex-col" style={{ height: 'calc(100vh - 0px)' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Sales Pipeline</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {totalActive} active · {closedWon} closed won
              {totalValue > 0 && <span className="ml-2 text-emerald-400 font-semibold">· ${totalValue.toLocaleString()} pipeline value</span>}
              <span className="ml-2 text-slate-600">· drag cards or use ↕ to move stages</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Lead
            </button>
          </div>
        </div>

        {/* Kanban board */}
        {loading ? (
          <div className="flex gap-3 overflow-x-auto">
            {STAGES.map(s => <div key={s} className="flex-shrink-0 w-60 h-64 bg-slate-900 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-3 overflow-x-auto pb-4 flex-1">
              {STAGES.map(stage => {
                const style = STAGE_STYLES[stage];
                const items = stageMap[stage];
                return (
                  <Droppable key={stage} droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-shrink-0 w-60 border rounded-xl p-3 flex flex-col transition-colors ${style.bg} ${
                          snapshot.isDraggingOver ? 'border-blue-500 bg-blue-950/30' : style.border
                        }`}
                        style={{ minHeight: '300px' }}
                      >
                        {/* Column header */}
                        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
                          <p className={`text-xs font-bold ${style.header}`}>{stage}</p>
                          <span className="ml-auto text-xs font-bold text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded-full">{items.length}</span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-2 flex-1">
                          {items.length === 0 && !snapshot.isDraggingOver && (
                            <div className="text-center py-8">
                              <p className="text-slate-700 text-xs">Drop cards here</p>
                            </div>
                          )}
                          {items.map((deal, idx) => {
                            const lead = leadsMap[deal.lead_id];
                            const contactName = lead
                              ? (lead.contact_name || [lead.first_name, lead.last_name].filter(Boolean).join(' ') || null)
                              : null;
                            const overdue = lead && isOverdue(lead.next_follow_up);
                            const { label: pLabel } = scoreLead(lead, deal);
                            const ps = PRIORITY_STYLES[pLabel];

                            return (
                              <Draggable key={deal.id} draggableId={deal.id} index={idx}>
                                {(p, snap) => (
                                  <div
                                    ref={p.innerRef}
                                    {...p.draggableProps}
                                    {...p.dragHandleProps}
                                    className={`bg-slate-800 border rounded-xl p-3 group cursor-pointer transition-colors ${
                                      snap.isDragging ? 'border-blue-500 shadow-xl shadow-blue-900/40' : overdue ? 'border-red-800 hover:border-red-600' : 'border-slate-700 hover:border-slate-500'
                                    }`}
                                    onClick={() => openDetail(deal)}
                                  >
                                    {/* Business name */}
                                    <p className="text-sm font-semibold text-white leading-tight truncate">
                                      {deal.deal_name}
                                    </p>

                                    {/* Contact name */}
                                    {contactName && (
                                      <p className="text-xs text-slate-400 mt-0.5 truncate">{contactName}</p>
                                    )}

                                    {/* Quick call/email actions */}
                                    {(lead?.phone || lead?.email) && (
                                      <div className="flex gap-1.5 mt-2.5" onClick={e => e.stopPropagation()}>
                                        {lead.phone && (
                                          <a href={`tel:${lead.phone.replace(/\D/g, '')}`}
                                            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/20 px-2 py-1 rounded-lg transition-colors"
                                            title={`Call ${lead.phone}`}>
                                            <Phone className="w-3 h-3" />
                                            <span className="truncate max-w-[70px]">{lead.phone}</span>
                                          </a>
                                        )}
                                        {lead.email && (
                                          <a href={`mailto:${lead.email}`}
                                            className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-400/10 hover:bg-blue-400/20 rounded-lg transition-colors flex-shrink-0"
                                            title={`Email ${lead.email}`}>
                                            <Mail className="w-3 h-3" />
                                          </a>
                                        )}
                                      </div>
                                    )}

                                    {/* Follow-up date */}
                                    {lead?.next_follow_up && (
                                      <div className={`mt-2 text-xs flex items-center gap-1 ${overdue ? 'text-red-400 font-semibold' : 'text-slate-500'}`}>
                                        📅 {fmtFollowUp(lead.next_follow_up)}{overdue ? ' — OVERDUE' : ''}
                                      </div>
                                    )}

                                    {/* Quick stage move dropdown */}
                                    <div className="mt-2.5 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                                      <div className="relative flex-1 mr-1">
                                        <select
                                          value={deal.stage}
                                          onChange={e => quickMoveStage(e, deal, e.target.value)}
                                          disabled={stageChanging === deal.id}
                                          className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 text-xs text-slate-300 rounded-lg px-2 py-1 appearance-none pr-5 cursor-pointer focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                        >
                                          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-1.5 top-1 w-3 h-3 text-slate-500 pointer-events-none" />
                                      </div>
                                      <button
                                        onClick={() => setDeleteConfirm(deal.id)}
                                        className="p-1 text-slate-600 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>

                                    {/* Priority + Value */}
                                    <div className="flex items-center justify-between mt-1.5">
                                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${ps.badge}`}>{pLabel}</span>
                                      {deal.value ? (
                                        <span className="text-xs font-semibold text-emerald-400">${Number(deal.value).toLocaleString()}</span>
                                      ) : null}
                                    </div>

                                    {/* Warnings */}
                                    {!lead && deal.lead_id && (
                                      <p className="text-xs text-amber-500 mt-1.5 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Lead not found
                                      </p>
                                    )}
                                    {isIncomplete(lead) && (
                                      <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Incomplete info
                                      </p>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                        </div>

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </div>

      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} onSaved={onLeadSaved} />}

      {selected && (
        <LeadDetailModal
          deal={selected.deal}
          lead={selected.lead}
          onClose={() => setSelected(null)}
          onUpdated={onDealUpdated}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-white mb-2">Archive Deal?</h3>
            <p className="text-slate-400 text-sm mb-5">This hides the deal from the pipeline. Lead data is preserved.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteDeal(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg text-sm">Archive</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-800 text-white font-semibold py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}