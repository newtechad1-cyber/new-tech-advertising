import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import DealCard from './DealCard';
import { Plus } from 'lucide-react';

const stageConfig = {
  new_lead: { title: 'New Lead', color: 'bg-slate-500', count: 0 },
  discovery: { title: 'Discovery', color: 'bg-blue-500', count: 0 },
  demo: { title: 'Demo / Strategy', color: 'bg-purple-500', count: 0 },
  proposal: { title: 'Proposal', color: 'bg-amber-500', count: 0 },
  decision: { title: 'Decision', color: 'bg-rose-500', count: 0 },
  closed_won: { title: 'Closed Won', color: 'bg-green-500', count: 0 },
  closed_lost: { title: 'Closed Lost', color: 'bg-red-500', count: 0 },
};

export default function PipelineStageColumn({
  stage,
  opportunities,
  onCardClick,
  onAddNew,
}) {
  const config = stageConfig[stage];

  return (
    <div className="flex flex-col w-80 bg-slate-900 rounded-lg border border-slate-700">
      {/* Header */}
      <div className={`${config.color} text-white px-4 py-3 rounded-t-lg`}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm">{config.title}</h3>
          <span className="bg-black/30 px-2 py-1 rounded text-xs font-bold">
            {opportunities.length}
          </span>
        </div>
        <p className="text-xs text-white/70">
          ${opportunities.reduce((sum, opp) => sum + (opp.estimated_deal_value || 0), 0).toLocaleString()}
        </p>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 space-y-3 min-h-96 overflow-y-auto ${
              snapshot.isDraggingOver ? 'bg-slate-800/50' : ''
            }`}
          >
            {opportunities.map((opp, idx) => (
              <Draggable key={opp.id} draggableId={opp.id} index={idx}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${
                      snapshot.isDragging ? 'shadow-lg scale-105' : ''
                    } transition-transform`}
                  >
                    <DealCard
                      opportunity={opp}
                      onClick={() => onCardClick(opp)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add New Button */}
      <div className="p-3 border-t border-slate-700">
        <button
          onClick={() => onAddNew(stage)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Deal
        </button>
      </div>
    </div>
  );
}