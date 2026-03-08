import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { base44 } from '@/api/base44Client';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DollarSign, Calendar, Clock, RefreshCw, TrendingUp, Target, Award, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';

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
    // Optimistic update
    setProposals(prev => prev.map(p => p.id === draggableId ? { ...p, pipeline_stage: newStage } : p));
    try {
      const updates = { pipeline_stage: newStage };
      if (newStage === 'won') updates.status = 'accepted';
      if (newStage === 'lost') updates.status = 'rejected';
      await base44.entities.Proposal.update(draggableId, updates);
      toast.success(`Moved to "${STAGES.find(s => s.id === newStage)?.label}"`);
    } catch {
      toast.error('Failed to update stage'); load();
    }
  };

  const byStage = id => proposals.filter(p => (p.pipeline_stage || 'lead') === id);
  const now = new Date();

  // Metrics
  const active = proposals.filter(p => !['won', 'lost'].includes(p.pipeline_stage || 'lead'));
  const won = proposals.filter(p => p.pipeline_stage === 'won');
  const activeValue = active.reduce((s, p) => s + (p.estimated_value || 0), 0);
  const wonValue = won.reduce((s, p) => s + (p.estimated_value || 0), 0);
  const winRate = proposals.length > 0
    ? Math.round((won.length / proposals.length) * 100)
    : 0;
  const avgDeal = won.length > 0 ? Math.round(wonValue / won.length) : 0;
  const thisMonth = proposals.filter(p => {
    const d = new Date(p.created_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const viewedThisWeek = proposals.filter(p => {
    if (!p.last_viewed_date) return false;
    return differenceInDays(now, new Date(p.last_viewed_date)) <= 7;
  }).length;

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-100">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Proposal Pipeline</h1>
              <p className="text-sm text-slate-500">
                {proposals.length} total · <span className="text-green-600 font-medium">${activeValue.toLocaleString()}</span> active value
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />Refresh
              </Button>
              <Link to={createPageUrl('AdminTasks')}>
                <Button variant="outline" size="sm">📋 Tasks</Button>
              </Link>
              <Link to={createPageUrl('AdminAlerts')}>
                <Button variant="outline" size="sm">🔔 Alerts</Button>
              </Link>
            </div>
          </div>

          {/* Pipeline Metrics */}
          <div className="px-6 pt-5 pb-2">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'Active Proposals', value: active.length, icon: Target, color: 'text-violet-600' },
                { label: 'Pipeline Value', value: `$${activeValue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
                { label: 'Won This Month', value: won.filter(p => {
                    const d = new Date(p.updated_date || p.created_date);
                    return d.getMonth() === now.getMonth();
                  }).length, icon: Award, color: 'text-emerald-600' },
                { label: 'Win Rate', value: `${winRate}%`, icon: TrendingUp, color: 'text-blue-600' },
                { label: 'Avg Deal Size', value: avgDeal > 0 ? `$${avgDeal.toLocaleString()}` : '—', icon: DollarSign, color: 'text-indigo-600' },
                { label: 'Sent This Month', value: thisMonth.length, icon: Timer, color: 'text-amber-600' },
                { label: 'Viewed This Week', value: viewedThisWeek, icon: Clock, color: 'text-orange-600' },
              ].map(m => (
                <Card key={m.label} className="p-3 bg-white border-0 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
                    <p className="text-xs text-slate-500">{m.label}</p>
                  </div>
                  <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                </Card>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-400">Loading pipeline...</div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-3 p-5 overflow-x-auto pb-10" style={{ minHeight: 'calc(100vh - 220px)' }}>
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
                            {cards.map((p, idx) => {
                              const stuckDays = p.updated_date ? differenceInDays(now, new Date(p.updated_date)) : 0;
                              const isStuck = stuckDays >= 5 && !['won', 'lost'].includes(stage.id);
                              return (
                                <Draggable key={p.id} draggableId={p.id} index={idx}>
                                  {(prov, snap) => (
                                    <Link
                                      to={createPageUrl(`ProposalDetail?id=${p.id}`)}
                                      ref={prov.innerRef}
                                      {...prov.draggableProps}
                                      {...prov.dragHandleProps}
                                      className={`block bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-all ${snap.isDragging ? 'shadow-xl rotate-1 opacity-90' : ''} ${isStuck ? 'border-orange-300' : 'border-slate-200'}`}
                                    >
                                      {isStuck && (
                                        <p className="text-xs text-orange-500 font-semibold mb-1">⚠️ Stalled {stuckDays}d</p>
                                      )}
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
                                          <div className={`flex items-center gap-1 ${new Date(p.next_follow_up_date) < now ? 'text-red-500 font-semibold' : 'text-orange-500'}`}>
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(p.next_follow_up_date), 'MMM d')}
                                            {new Date(p.next_follow_up_date) < now && ' ⚠️'}
                                          </div>
                                        )}
                                        {p.last_viewed_date && (
                                          <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {format(new Date(p.last_viewed_date), 'MMM d')}
                                            {(p.views || 0) > 1 && <span className="text-indigo-500">({p.views}x)</span>}
                                          </div>
                                        )}
                                      </div>
                                    </Link>
                                  )}
                                </Draggable>
                              );
                            })}
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