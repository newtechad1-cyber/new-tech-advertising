import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DealCard from './DealCard';

const PIPELINE_STAGES = [
  { id: 'new_lead', label: 'New Lead', color: 'slate' },
  { id: 'contacted', label: 'Contacted', color: 'blue' },
  { id: 'qualified', label: 'Qualified', color: 'cyan' },
  { id: 'demo_scheduled', label: 'Demo Scheduled', color: 'violet' },
  { id: 'proposal_sent', label: 'Proposal Sent', color: 'amber' },
  { id: 'negotiation', label: 'Negotiation', color: 'orange' },
  { id: 'closed_won', label: 'Closed Won', color: 'emerald' },
  { id: 'closed_lost', label: 'Closed Lost', color: 'red' },
];

export default function SalesPipelineBoard({ deals = [], onDealMove, onOpenDeal }) {
  const [collapsedStages, setCollapsedStages] = useState({});

  const stageStats = PIPELINE_STAGES.map(stage => {
    const stageDeals = deals.filter(d => d.stage === stage.id);
    return {
      ...stage,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0),
      deals: stageDeals,
    };
  });

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 overflow-x-auto">
        <div className="min-w-full flex gap-4">
          {stageStats.map(stage => (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80 bg-slate-800/50 border border-slate-700 rounded-lg p-3"
            >
              {/* Stage Header */}
              <div className="mb-3 pb-2 border-b border-slate-700">
                <div className="flex items-start justify-between">
                  <div>
                    <button
                      onClick={() => setCollapsedStages(p => ({ ...p, [stage.id]: !p[stage.id] }))}
                      className="text-sm font-bold text-white hover:text-slate-300 flex items-center gap-2"
                    >
                      <div className={`w-2 h-2 rounded-full bg-${stage.color}-500`} />
                      {stage.label}
                    </button>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="font-semibold text-white">{stage.count}</span>
                      <span>deals</span>
                      <span className="text-slate-500">•</span>
                      <span className="font-semibold text-amber-400">
                        ${(stage.value / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6 text-slate-500 hover:text-slate-300"
                    onClick={() => null}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Deal Cards */}
              {!collapsedStages[stage.id] && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {stage.deals.length === 0 ? (
                    <div className="text-center py-4 text-slate-500 text-xs">No deals</div>
                  ) : (
                    stage.deals.map(deal => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        onOpen={() => onOpenDeal?.(deal.id)}
                        stageColor={stage.color}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
}