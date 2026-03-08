import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { base44 } from '@/api/base44Client';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, Clock, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const STAGES = [
  { id: 'lead',             label: 'Lead',             header: 'bg-slate-200',   body: 'bg-slate-50 border-slate-200' },
  { id: 'proposal_sent',    label: 'Proposal Sent',    header: 'bg-blue-100',    body: 'bg-blue-50 border-blue-200' },
  { id: 'proposal_viewed',  label: 'Proposal Viewed',  header: 'bg-indigo-100',  body: 'bg-indigo-50 border-indigo-200' },
  { id: 'negotiation',      label: 'Negotiation',      header: 'bg-amber-100',   body: 'bg-amber-50 border-amber-200' },
  { id: 'decision_pending', label: 'Decision Pending', header: 'bg-orange-100',  body: 'bg-orange-50 border-orange-200' },
  { id: 'won',              label: '✅ Won',            header: 'bg-green-100',   body: 'bg-green-50 border-green-200' },
  { id: 'lost',             label: '❌ Lost',           header: 'bg-red-100',     body: 'bg-red-50 border-red-200' },
];

const SERVICE_LABELS = {
  diy_saas: 'DIY SaaS', dfy_managed: 'DFY Managed', ada_rebuild: 'ADA Rebuild',
  streaming_tv: 'Streaming TV', video_production: 'Video', other: 'Other',
};

export default function ProposalPipeline() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Proposal.list('-updated_date', 300);
    setProposals(data);
    setLoading(false);
  };

  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination || source.droppableId === destination.droppableId) return;
    const newStage = destination.droppableId;
    setProposals(prev => prev.map(p => p.id === draggableId ? { ...p, pipeline_stage: newStage } : p));
    try {
      await base44.entities.Proposal.update(draggableId, { pipeline_stage: newStage });
      toast.success(`Moved to "${STAGES.find(s => s.id === newStage)?.label}"`);
    } catch {
      toast.error('Failed to update stage'); load();
    }
  };

  const byStage = id => proposals.filter(p => (p.pipeline_stage || 'lead') === id);
  const activeValue = proposals
    .filter(p => !['won', 'lost'].includes(p.pipeline_stage || 'lead'))
    .reduce((s, p) => s + (p.estimated_value || 0), 0);

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-100">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Proposal Pipeline</h1>
              <p className="text-sm text-slate-500">
                {proposals.length} total proposals · <span className="text-green-600 font-medium">${activeValue.toLocaleString()}</span> active value
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />Refresh
              </Button>
              <Link to={createPageUrl('AdminTasks')}>
                <Button variant="outline" size="sm">📋 Tasks</Button>
              </Link>
              <Link to={createPageUrl('AdminSales')}>
                <Button variant="outline" size="sm">Sales Dashboard</Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-96 text-slate-400">Loading pipeline...</div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-3 p-5 overflow-x-auto pb-10" style={{ minHeight: 'calc(100vh - 80px)' }}>
                {STAGES.map(stage => {
                  const cards = byStage(stage.id);
                  const stageValue = cards.reduce((s, p) => s + (p.estimated_value || 0), 0);
                  return (
                    <div key={stage.id} className="flex-shrink-0 w-64 flex flex-col">
                      <div className={`rounded-t-lg px-3 py-2 ${stage.header}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-slate-700">{stage.label}</span>
                          <span className="bg-white text-slate-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {cards.length}
                          </span>
                        </div>
                        {stageValue > 0 && (
                          <p className="text-xs text-slate-500 mt-0.5">${stageValue.toLocaleString()}</p>
                        )}
                      </div>
                      <Droppable droppableId={stage.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 min-h-24 p-2 rounded-b-lg border border-t-0 space-y-2 transition-colors ${stage.body} ${snapshot.isDraggingOver ? 'ring-2 ring-violet-400 ring-inset' : ''}`}
                          >
                            {cards.map((p, idx) => (
                              <Draggable key={p.id} draggableId={p.id} index={idx}>
                                {(prov, snap) => (
                                  <Link
                                    to={createPageUrl(`ProposalDetail?id=${p.id}`)}
                                    ref={prov.innerRef}
                                    {...prov.draggableProps}
                                    {...prov.dragHandleProps}
                                    className={`block bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-all ${snap.isDragging ? 'shadow-xl rotate-1 opacity-90' : ''}`}
                                  >
                                    <p className="font-semibold text-sm text-slate-900 truncate mb-1">
                                      {p.business_name || p.title}
                                    </p>
                                    <Badge className="text-xs bg-violet-100 text-violet-700 border-0 mb-2">
                                      {SERVICE_LABELS[p.service_type] || p.service_type}
                                    </Badge>
                                    <div className="space-y-1 text-xs text-slate-500">
                                      {p.estimated_value > 0 && (
                                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                                          <DollarSign className="w-3 h-3" />${p.estimated_value.toLocaleString()}
                                        </div>
                                      )}
                                      {p.next_follow_up_date && (
                                        <div className={`flex items-center gap-1 ${new Date(p.next_follow_up_date) < new Date() ? 'text-red-500 font-semibold' : 'text-orange-500'}`}>
                                          <Calendar className="w-3 h-3" />
                                          Follow up: {format(new Date(p.next_follow_up_date), 'MMM d')}
                                        </div>
                                      )}
                                      {p.last_viewed_date && (
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          Viewed: {format(new Date(p.last_viewed_date), 'MMM d')}
                                          {p.views > 1 && <span className="text-indigo-500">({p.views}x)</span>}
                                        </div>
                                      )}
                                    </div>
                                  </Link>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {cards.length === 0 && !snapshot.isDraggingOver && (
                              <p className="text-center text-xs text-slate-400 py-4">Drop here</p>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          )}
        </div>
      </AdminNav>
    </AdminGuard>
  );
}