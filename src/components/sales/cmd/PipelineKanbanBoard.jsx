import React from 'react';
import { GripHorizontal, DollarSign, Calendar, AlertCircle } from 'lucide-react';

export default function PipelineKanbanBoard() {
  const stages = [
    { id: 'new', name: 'New Opportunities', color: 'bg-slate-50', borderColor: 'border-slate-200' },
    { id: 'strategy', name: 'Strategy Scheduled', color: 'bg-blue-50', borderColor: 'border-blue-200' },
    { id: 'demo', name: 'Demo Completed', color: 'bg-purple-50', borderColor: 'border-purple-200' },
    { id: 'dealroom', name: 'Deal Room Active', color: 'bg-orange-50', borderColor: 'border-orange-200' },
    { id: 'commitment', name: 'Committed', color: 'bg-green-50', borderColor: 'border-green-200' },
    { id: 'activated', name: 'Activated', color: 'bg-emerald-50', borderColor: 'border-emerald-200' },
    { id: 'expansion', name: 'Expansion Ready', color: 'bg-indigo-50', borderColor: 'border-indigo-200' }
  ];

  // Sample deals
  const deals = {
    new: [
      { company: 'Local Dental Group', value: '$1,800/mo', industry: 'Dental', lastActivity: 'Today' }
    ],
    strategy: [
      { company: 'Green Landscaping', value: '$2,200/mo', industry: 'Landscaping', lastActivity: 'Yesterday' },
      { company: 'Fitness Plus', value: '$1,500/mo', industry: 'Fitness', lastActivity: '2 days ago' }
    ],
    demo: [
      { company: 'Elite Roofing', value: '$2,500/mo', industry: 'Roofing', lastActivity: '1 day ago', urgent: true },
      { company: 'Smart Home Tech', value: '$3,000/mo', industry: 'Tech', lastActivity: '3 days ago' }
    ],
    dealroom: [
      { company: 'ABC HVAC', value: '$2,800/mo', industry: 'HVAC', lastActivity: '2 days ago', urgent: true },
      { company: 'Summit Plumbing', value: '$2,200/mo', industry: 'Plumbing', lastActivity: '4 days ago', urgent: true },
      { company: 'Quality Painting', value: '$1,600/mo', industry: 'Painting', lastActivity: '1 day ago' }
    ],
    commitment: [
      { company: 'Metro Electric', value: '$2,400/mo', industry: 'Electric', lastActivity: 'Today' }
    ],
    activated: [],
    expansion: []
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-full">
        {stages.map((stage) => (
          <div key={stage.id} className="flex-1 min-w-[300px]">
            {/* Stage Header */}
            <div className={`${stage.color} border ${stage.borderColor} rounded-t-lg p-4 border-b-0`}>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">{stage.name}</h3>
              <p className="text-lg font-bold text-slate-900">{deals[stage.id]?.length || 0}</p>
            </div>

            {/* Stage Cards */}
            <div className={`${stage.color} border ${stage.borderColor} border-t-0 rounded-b-lg p-4 space-y-3 min-h-[500px]`}>
              {deals[stage.id]?.map((deal, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-move group"
                >
                  {/* Deal Card Header */}
                  <div className="flex items-start gap-2 mb-3">
                    <GripHorizontal className="w-4 h-4 text-slate-300 group-hover:text-slate-400 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm">{deal.company}</h4>
                      <p className="text-xs text-slate-600">{deal.industry}</p>
                    </div>
                    {deal.urgent && (
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Deal Metrics */}
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3 text-green-600" />
                      <span className="font-semibold">{deal.value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{deal.lastActivity}</span>
                    </div>
                  </div>

                  {/* Deal Card CTA */}
                  <button className="w-full mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 py-2 border-t border-slate-100">
                    Open Deal
                  </button>
                </div>
              ))}

              {/* Empty State */}
              {(!deals[stage.id] || deals[stage.id].length === 0) && (
                <div className="flex items-center justify-center h-32 text-slate-500">
                  <p className="text-sm">No deals in this stage</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}