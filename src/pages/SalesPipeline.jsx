import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DealCard from '@/components/sales/DealCard';
import DealModal from '@/components/sales/DealModal';
import AddDealModal from '@/components/sales/AddDealModal';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

const STAGES = [
  { key: 'new_lead', label: 'New Lead', color: 'bg-slate-200', headerColor: 'bg-slate-600' },
  { key: 'contacted', label: 'Contacted', color: 'bg-blue-100', headerColor: 'bg-blue-600' },
  { key: 'demo_scheduled', label: 'Demo Scheduled', color: 'bg-purple-100', headerColor: 'bg-purple-600' },
  { key: 'proposal_sent', label: 'Proposal Sent', color: 'bg-orange-100', headerColor: 'bg-orange-500' },
  { key: 'negotiation', label: 'Negotiation', color: 'bg-yellow-100', headerColor: 'bg-yellow-500' },
  { key: 'closed_won', label: 'Closed Won', color: 'bg-green-100', headerColor: 'bg-green-600' },
  { key: 'closed_lost', label: 'Closed Lost', color: 'bg-red-100', headerColor: 'bg-red-500' },
];

export default function SalesPipeline() {
  const queryClient = useQueryClient();
  const [selectedDeal, setSelectedDeal] = useState(null);

  const { data: deals = [] } = useQuery({
    queryKey: ['sales_deals'],
    queryFn: () => base44.asServiceRole.entities.SalesDeal.list('-created_date', 300)
  });

  const updateDeal = useMutation({
    mutationFn: ({ id, data }) => base44.asServiceRole.entities.SalesDeal.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales_deals'] })
  });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStage = destination.droppableId;
    updateDeal.mutate({ id: draggableId, data: { stage: newStage } });

    // Auto-log stage change activity
    base44.asServiceRole.entities.SalesActivity.create({
      deal_id: draggableId,
      activity_type: 'stage_change',
      notes: `Moved to: ${STAGES.find(s => s.key === newStage)?.label}`,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getDealsForStage = (stageKey) => deals.filter(d => d.stage === stageKey);
  const getStageValue = (stageKey) => getDealsForStage(stageKey).reduce((s, d) => s + (d.deal_value || 0), 0);

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = createPageUrl('SalesDashboard')}>
              ← Dashboard
            </Button>
            <h1 className="text-xl font-bold text-slate-900">Pipeline Board</h1>
            <Badge variant="outline">{deals.filter(d => !['closed_won','closed_lost'].includes(d.stage)).length} active deals</Badge>
          </div>
          <AddDealModal />
        </div>

        {/* Kanban Board */}
        <div className="p-6 overflow-x-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 min-w-max">
              {STAGES.map(stage => {
                const stageDeals = getDealsForStage(stage.key);
                const stageValue = getStageValue(stage.key);
                return (
                  <div key={stage.key} className="w-64 flex flex-col">
                    {/* Column Header */}
                    <div className={`${stage.headerColor} text-white rounded-t-xl px-3 py-2.5`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{stage.label}</span>
                        <Badge className="bg-white/20 text-white text-xs">{stageDeals.length}</Badge>
                      </div>
                      {stageValue > 0 && (
                        <p className="text-xs text-white/80 mt-0.5">${stageValue.toLocaleString()}</p>
                      )}
                    </div>

                    {/* Droppable Column */}
                    <Droppable droppableId={stage.key}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 min-h-32 p-2 rounded-b-xl space-y-2 transition-colors ${
                            snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : stage.color
                          }`}
                        >
                          {stageDeals.map((deal, index) => (
                            <Draggable key={deal.id} draggableId={deal.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <DealCard
                                    deal={deal}
                                    isDragging={snapshot.isDragging}
                                    onClick={() => setSelectedDeal(deal)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {stageDeals.length === 0 && !snapshot.isDraggingOver && (
                            <div className="text-center py-6 text-xs text-slate-400">Drop deals here</div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>

        {/* Deal Detail Modal */}
        <DealModal
          deal={selectedDeal}
          open={!!selectedDeal}
          onClose={() => setSelectedDeal(null)}
        />
      </div>
    </AdminNav>
  );
}