import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Target, ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PipelineSnapshot() {
  const { data: deals = [] } = useQuery({
    queryKey: ['pipeline-snapshot'],
    queryFn: () => base44.entities.SalesDeals?.list?.('-created_date', 500).catch(() => []),
  });

  const stages = [
    { id: 'new_lead', label: 'New Leads', color: 'bg-slate-700/50' },
    { id: 'contacted', label: 'Contacted', color: 'bg-blue-700/50' },
    { id: 'qualified', label: 'Qualified', color: 'bg-cyan-700/50' },
    { id: 'demo_scheduled', label: 'Demos', color: 'bg-violet-700/50' },
    { id: 'proposal_sent', label: 'Proposals', color: 'bg-amber-700/50' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-700/50' },
  ];

  const stageData = stages.map(stage => {
    const stageDeals = deals.filter(d => d.stage === stage.id);
    return {
      ...stage,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0),
    };
  });

  const topDeals = deals
    .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .sort((a, b) => (b.deal_value || 0) - (a.deal_value || 0))
    .slice(0, 3);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
        <Target className="w-5 h-5 text-amber-400" />
        Pipeline Snapshot
      </h3>

      {/* Stage Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {stageData.map((stage, idx) => (
          <div key={idx} className={`${stage.color} border border-slate-700 rounded-lg p-3 text-center`}>
            <p className="text-xs text-slate-400 mb-1">{stage.label}</p>
            <p className="text-lg font-bold text-white">{stage.count}</p>
            <p className="text-xs text-slate-500">${(stage.value / 1000).toFixed(0)}k</p>
          </div>
        ))}
      </div>

      {/* Top 3 High-Value Deals */}
      <div className="border-t border-slate-700 pt-4">
        <h4 className="text-xs font-semibold text-slate-400 mb-3">Top 3 Deals</h4>
        <div className="space-y-2">
          {topDeals.map(deal => (
            <div key={deal.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{deal.company_name}</p>
                <p className="text-xs text-slate-400">{deal.stage.replace(/_/g, ' ')}</p>
              </div>
              <p className="text-sm font-bold text-amber-400 ml-2">${(deal.deal_value / 1000).toFixed(0)}k</p>
            </div>
          ))}
        </div>
      </div>

      <Link to={createPageUrl('AdminSales')}>
        <Button size="sm" variant="ghost" className="w-full mt-4 text-slate-400 hover:text-white gap-1.5">
          View Sales Board <ArrowRight className="w-3 h-3" />
        </Button>
      </Link>
    </div>
  );
}