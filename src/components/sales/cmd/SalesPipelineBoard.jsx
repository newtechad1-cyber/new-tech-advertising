import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import { DollarSign } from 'lucide-react';

const STAGES = [
  { key: 'new_lead', label: 'New Lead', color: 'border-t-gray-500', dot: 'bg-gray-500' },
  { key: 'contacted', label: 'Audit Sent', color: 'border-t-blue-500', dot: 'bg-blue-500' },
  { key: 'demo_scheduled', label: 'Demo Scheduled', color: 'border-t-purple-500', dot: 'bg-purple-500' },
  { key: 'proposal_sent', label: 'Proposal Sent', color: 'border-t-orange-500', dot: 'bg-orange-500' },
  { key: 'negotiation', label: 'Negotiation', color: 'border-t-yellow-500', dot: 'bg-yellow-500' },
  { key: 'closed_won', label: 'Closed Won', color: 'border-t-green-500', dot: 'bg-green-500' },
  { key: 'closed_lost', label: 'Closed Lost', color: 'border-t-red-500', dot: 'bg-red-500' },
];

function DealCard({ deal, index }) {
  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-gray-800 border border-gray-700 rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing transition-shadow ${snapshot.isDragging ? 'shadow-lg shadow-black/40 rotate-1' : ''}`}
        >
          <p className="text-xs font-semibold text-white truncate">{deal.company_name}</p>
          {deal.contact_name && <p className="text-xs text-gray-500 mt-0.5 truncate">{deal.contact_name}</p>}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-bold text-green-400 flex items-center gap-0.5">
              <DollarSign className="w-3 h-3" />{(deal.deal_value || 0).toLocaleString()}
            </span>
            {deal.assigned_to && (
              <span className="text-xs bg-gray-700 text-gray-400 rounded-full px-2 py-0.5 truncate max-w-[80px]">
                {deal.assigned_to.split('@')[0]}
              </span>
            )}
          </div>
          {deal.probability != null && (
            <div className="mt-1.5 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500/60 rounded-full" style={{ width: `${deal.probability}%` }} />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default function SalesPipelineBoard() {
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(null);

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['sc-pipeline-deals'],
    queryFn: () => base44.entities.SalesDeals.list('-created_date', 500),
  });

  const dealsByStage = STAGES.reduce((acc, s) => {
    acc[s.key] = deals.filter(d => d.stage === s.key);
    return acc;
  }, {});

  const stageValue = (key) => dealsByStage[key].reduce((s, d) => s + (d.deal_value || 0), 0);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    const newStage = destination.droppableId;
    setUpdating(draggableId);
    try {
      await base44.entities.SalesDeals.update(draggableId, { stage: newStage });
      queryClient.invalidateQueries({ queryKey: ['sc-pipeline-deals'] });
      queryClient.invalidateQueries({ queryKey: ['sc-deals'] });
      toast.success('Deal stage updated');
    } catch {
      toast.error('Failed to update deal stage');
    }
    setUpdating(null);
  };

  if (isLoading) return <div className="text-center py-16 text-gray-500 text-sm">Loading pipeline...</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-[900px]">
          {STAGES.map(stage => (
            <div key={stage.key} className="flex-1 min-w-[140px]">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${stage.dot}`} />
                  <span className="text-xs font-semibold text-gray-400">{stage.label}</span>
                </div>
                <span className="text-xs text-gray-600">{dealsByStage[stage.key].length}</span>
              </div>
              <div className={`text-xs font-bold text-gray-500 mb-2 pl-3.5`}>
                ${stageValue(stage.key).toLocaleString()}
              </div>
              <Droppable droppableId={stage.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[300px] rounded-xl border-t-2 p-2 transition-colors ${stage.color} ${snapshot.isDraggingOver ? 'bg-gray-800/60' : 'bg-gray-900/40'}`}
                  >
                    {dealsByStage[stage.key].map((deal, i) => (
                      <DealCard key={deal.id} deal={deal} index={i} />
                    ))}
                    {provided.placeholder}
                    {dealsByStage[stage.key].length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center text-gray-700 text-xs pt-8">Drop here</div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}