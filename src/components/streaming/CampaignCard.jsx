import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Eye, Users, DollarSign, RefreshCw, BarChart2 } from 'lucide-react';

const statusColors = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-slate-100 text-slate-600',
  draft: 'bg-blue-100 text-blue-700',
};

export default function CampaignCard({ campaign, onViewAnalytics, onSync, syncing }) {
  const fmt = (n) => n != null ? Number(n).toLocaleString() : '—';
  const fmtMoney = (n) => n != null ? `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—';

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900">{campaign.campaign_name}</h3>
          {campaign.client_name && (
            <p className="text-sm text-slate-500 mt-0.5">{campaign.client_name}</p>
          )}
        </div>
        <Badge className={statusColors[campaign.status] || 'bg-slate-100 text-slate-600'}>
          {campaign.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <Eye className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs text-slate-500">Impressions</span>
          </div>
          <p className="font-bold text-slate-900">{fmt(campaign.cached_impressions)}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs text-slate-500">Households</span>
          </div>
          <p className="font-bold text-slate-900">{fmt(campaign.cached_reach)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs text-slate-500">Total Spend</span>
          </div>
          <p className="font-bold text-slate-900">{fmtMoney(campaign.cached_spend)}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs text-slate-500">Avg CPM</span>
          </div>
          <p className="font-bold text-slate-900">{fmtMoney(campaign.cached_cpm)}</p>
        </div>
      </div>

      {campaign.last_synced_at && (
        <p className="text-xs text-slate-400 mb-3">
          Last synced: {new Date(campaign.last_synced_at).toLocaleDateString()}
        </p>
      )}

      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1" onClick={() => onViewAnalytics(campaign)}>
          <BarChart2 className="w-3.5 h-3.5 mr-1" /> Analytics
        </Button>
        <Button size="sm" variant="outline" onClick={() => onSync(campaign)} disabled={syncing === campaign.id}>
          <RefreshCw className={`w-3.5 h-3.5 ${syncing === campaign.id ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </Card>
  );
}