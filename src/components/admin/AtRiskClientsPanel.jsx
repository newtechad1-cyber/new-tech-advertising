import React, { useState } from 'react';
import { AlertTriangle, Mail, Calendar, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const RISK_COLORS = {
  critical: 'bg-red-500/20 text-red-300 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  low: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

export default function AtRiskClientsPanel({
  clients,
  onClientClick,
  onSendMessage,
  onScheduleCall,
  onUpgradeClick,
}) {
  const [selectedRows, setSelectedRows] = useState([]);

  if (clients.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8 text-center">
        <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-400">No at-risk clients detected</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <h3 className="font-semibold text-white text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          At-Risk Clients ({clients.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">
                Business
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">
                Momentum
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">
                Inactive Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors cursor-pointer"
                onClick={() => onClientClick?.(client)}
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-white">
                      {client.business_name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {client.user_email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="capitalize">
                    {client.current_plan?.replace(/_/g, ' ')}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          client.retention?.growth_score >= 50
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min(client.retention?.growth_score || 0, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">
                      {client.retention?.growth_score || 0}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-300">
                    {client.retention?.inactive_days || 0} days
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge className={RISK_COLORS[client.churnRisk]}>
                    {client.churnRisk}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 pointer-events-auto">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendMessage?.(client);
                      }}
                      size="sm"
                      variant="ghost"
                      title="Send message"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onScheduleCall?.(client);
                      }}
                      size="sm"
                      variant="ghost"
                      title="Schedule call"
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpgradeClick?.(client);
                      }}
                      size="sm"
                      variant="ghost"
                      title="Recommend upgrade"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}