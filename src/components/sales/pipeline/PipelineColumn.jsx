import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import DealCard from './DealCard';

const STAGE_CONFIG = {
  new_lead:       { label: 'New Lead',       color: '#94a3b8', bg: 'from-slate-800 to-slate-900', prob: '5%'  },
  contacted:      { label: 'Contacted',      color: '#60a5fa', bg: 'from-slate-800 to-blue-950/30', prob: '10%' },
  discovery:      { label: 'Discovery',      color: '#818cf8', bg: 'from-slate-800 to-indigo-950/30', prob: '20%' },
  demo_scheduled: { label: 'Demo Scheduled', color: '#f59e0b', bg: 'from-slate-800 to-amber-950/30', prob: '35%' },
  demo_completed: { label: 'Demo Completed', color: '#fb923c', bg: 'from-slate-800 to-orange-950/30', prob: '50%' },
  proposal_sent:  { label: 'Proposal Sent',  color: '#c084fc', bg: 'from-slate-800 to-purple-950/30', prob: '65%' },
  verbal_yes:     { label: 'Verbal Yes',     color: '#34d399', bg: 'from-slate-800 to-emerald-950/40', prob: '85%' },
  closed_won:     { label: 'Closed Won',     color: '#10b981', bg: 'from-green-950/60 to-slate-900', prob: '100%' },
  closed_lost:    { label: 'Closed Lost',    color: '#ef4444', bg: 'from-red-950/60 to-slate-900', prob: '0%' },
};

const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;

export default function PipelineColumn({ stageId, opportunities, onAction, valueView }) {
  const config = STAGE_CONFIG[stageId];
  const totalValue = opportunities.reduce((s, o) => s + (o.deal_value || 0), 0);

  return (
    <div className={`flex-shrink-0 w-64 flex flex-col rounded-xl bg-gradient-to-b ${config.bg} border border-slate-700/40`}>
      {/* Column header */}
      <div className="px-4 py-3 border-b border-slate-700/40">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: config.color }} />
          <h3 className="text-white font-bold text-sm leading-tight">{config.label}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: `${config.color}22`, color: config.color }}>
            {opportunities.length} deal{opportunities.length !== 1 ? 's' : ''}
          </span>
          {valueView === 'value' && totalValue > 0 && (
            <span className="text-slate-400 text-xs">{fmt(totalValue)}</span>
          )}
          <span className="ml-auto text-slate-600 text-xs">{config.prob}</span>
        </div>
      </div>

      {/* Drop zone */}
      <Droppable droppableId={stageId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 overflow-y-auto space-y-3 min-h-32 transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-blue-500/5 border-2 border-dashed border-blue-500/30 rounded-lg' : ''
            }`}
            style={{ maxHeight: 'calc(100vh - 280px)' }}
          >
            {opportunities.map((opp, index) => (
              <Draggable key={opp.id} draggableId={opp.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    style={{
                      ...dragProvided.draggableProps.style,
                      opacity: dragSnapshot.isDragging ? 0.9 : 1,
                      transform: dragSnapshot.isDragging
                        ? `${dragProvided.draggableProps.style?.transform} rotate(2deg)`
                        : dragProvided.draggableProps.style?.transform,
                    }}
                  >
                    <DealCard
                      opportunity={opp}
                      onAction={onAction}
                      dragHandleProps={dragProvided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {opportunities.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-16 text-slate-600 text-xs italic text-center px-4">
                Drop deals here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}