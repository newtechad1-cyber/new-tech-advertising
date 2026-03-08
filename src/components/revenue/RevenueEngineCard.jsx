import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function RevenueEngineCard() {
  const { data: opportunities = [] } = useQuery({
    queryKey: ['revenue_engine_summary'],
    queryFn: () => base44.asServiceRole.entities.RevenueOpportunities.filter({
      status: { $nin: ['won', 'lost', 'dismissed'] }
    })
  });

  const activeCount = opportunities.length;
  const renewalCount = opportunities.filter(o => o.opportunity_type === 'renewal').length;
  const upsellCount = opportunities.filter(o => o.opportunity_type === 'upsell').length;
  const stalledCount = opportunities.filter(o => o.opportunity_type === 'stalled_deal').length;
  const ownerApprovalCount = opportunities.filter(o => o.owner_action_required).length;

  const totalValue = opportunities
    .filter(o => o.estimated_value)
    .reduce((sum, o) => sum + o.estimated_value, 0);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-600">Revenue Engine</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{activeCount}</p>
            <p className="text-xs text-slate-500 mt-1">Active Opportunities</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200">
          <div>
            <p className="text-xs text-slate-600">Renewals</p>
            <p className="text-lg font-bold text-purple-600">{renewalCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Upsells</p>
            <p className="text-lg font-bold text-green-600">{upsellCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Stalled</p>
            <p className="text-lg font-bold text-orange-600">{stalledCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Value</p>
            <p className="text-lg font-bold text-slate-900">${(totalValue / 1000).toFixed(0)}k</p>
          </div>
        </div>

        {ownerApprovalCount > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-red-900">{ownerApprovalCount} Need Approval</p>
              </div>
            </div>
          </div>
        )}

        <a href={createPageUrl('AdminRevenueEngine')} className="text-blue-600 hover:underline text-xs mt-4 block">
          View Engine Dashboard →
        </a>
      </CardContent>
    </Card>
  );
}