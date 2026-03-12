import React from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';

export default function NTAPipelineStages({ deals }) {
  const stages = [
    { id: 'new', name: 'New Opportunity', color: 'bg-slate-100', textColor: 'text-slate-900' },
    { id: 'strategy', name: 'Strategy Scheduled', color: 'bg-blue-100', textColor: 'text-blue-900' },
    { id: 'demo', name: 'Demo Delivered', color: 'bg-purple-100', textColor: 'text-purple-900' },
    { id: 'dealroom', name: 'Deal Room Active', color: 'bg-orange-100', textColor: 'text-orange-900' },
    { id: 'commitment', name: 'Commitment', color: 'bg-green-100', textColor: 'text-green-900' },
    { id: 'activated', name: 'Trial Activated', color: 'bg-emerald-100', textColor: 'text-emerald-900' },
    { id: 'expansion', name: 'Expansion Ready', color: 'bg-indigo-100', textColor: 'text-indigo-900' }
  ];

  const groupedByStage = stages.map(stage => ({
    ...stage,
    count: Math.floor(Math.random() * 8) + 1, // Placeholder
    deals: []
  }));

  return (
    <div className="bg-white p-8 rounded-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Pipeline Flow</h2>
      
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4 min-w-full">
          {groupedByStage.map((stage, idx) => (
            <div key={stage.id} className="flex-1 min-w-[220px]">
              <div className={`${stage.color} rounded-lg p-4 mb-3`}>
                <h3 className={`${stage.textColor} font-semibold text-sm mb-1`}>{stage.name}</h3>
                <p className={`${stage.textColor} text-2xl font-bold`}>{stage.count}</p>
              </div>
              
              {/* Sample deal cards */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {stage.count > 0 && (
                  <div className={`${stage.color} p-3 rounded border border-slate-200 text-xs`}>
                    <p className="font-semibold text-slate-900">Active Deal</p>
                    <p className="text-slate-600">Est: $2,500/mo</p>
                  </div>
                )}
              </div>

              {/* Arrow to next stage */}
              {idx < groupedByStage.length - 1 && (
                <ArrowRight className="text-slate-300 mx-auto mt-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Pipeline Health:</strong> 7 New Opportunities → 4 Strategy Scheduled → 2 Demos This Week
        </p>
      </div>
    </div>
  );
}