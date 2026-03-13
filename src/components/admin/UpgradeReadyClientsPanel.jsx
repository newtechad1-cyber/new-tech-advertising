import React from 'react';
import { Zap, Send, Phone, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function UpgradeReadyClientsPanel({
  clients,
  onClientClick,
  onSendOffer,
  onScheduleCall,
  onTriggerOutreach,
}) {
  if (clients.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8 text-center">
        <Zap className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-400">No upgrade-ready clients at this time</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-lg border border-amber-500/20 overflow-hidden">
      <div className="p-6 border-b border-amber-500/20">
        <h3 className="font-semibold text-white text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Upgrade-Ready Clients ({clients.length})
        </h3>
        <p className="text-sm text-amber-300/70 mt-1">
          High readiness score + strong engagement signals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-slate-800/50 rounded-lg border border-amber-500/20 p-4 cursor-pointer hover:border-amber-500/40 transition-colors"
            onClick={() => onClientClick?.(client)}
          >
            <div className="mb-3">
              <div className="font-semibold text-white">{client.business_name}</div>
              <div className="text-xs text-slate-400 mt-1">{client.user_email}</div>
            </div>

            {/* Readiness Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">Upgrade Readiness</span>
                <span className="text-sm font-bold text-amber-300">
                  {client.upgrade_readiness_score}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${client.upgrade_readiness_score}%` }}
                />
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="bg-slate-900/50 p-2 rounded">
                <div className="text-slate-400">Growth Goal</div>
                <div className="text-white font-semibold">
                  {client.primary_growth_goal?.replace(/_/g, ' ') || 'N/A'}
                </div>
              </div>
              <div className="bg-slate-900/50 p-2 rounded">
                <div className="text-slate-400">Leads Logged</div>
                <div className="text-white font-semibold">
                  {client.retention?.leads_logged || 0}
                </div>
              </div>
            </div>

            {/* Recommended Plan Badge */}
            <div className="mb-4">
              <Badge className="bg-amber-600 text-white">
                {client.recommended_next_plan?.replace(/_/g, ' ')}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pointer-events-auto">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onSendOffer?.(client);
                }}
                size="sm"
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Send Offer
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onScheduleCall?.(client);
                }}
                size="sm"
                variant="outline"
              >
                <Phone className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}