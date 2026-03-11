import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { History, Palette, Settings, Users, Link as LinkIcon, Check } from 'lucide-react';

export default function ResellerAuditLog({ resellerId, limit = 10 }) {
  const { data: logs = [] } = useQuery({
    queryKey: ['reseller-audit-log', resellerId],
    queryFn: async () => {
      if (!resellerId) return [];
      return base44.entities.ResellerAuditLog?.filter?.(
        { reseller_id: resellerId },
        '-created_at',
        limit
      ).catch(() => []);
    },
    enabled: !!resellerId,
  });

  const getEventIcon = (eventType) => {
    const iconMap = {
      branding_updated: Palette,
      domain_configured: LinkIcon,
      feature_enabled: Settings,
      user_invited: Users,
      account_created: Check,
    };
    return iconMap[eventType] || History;
  };

  const getEventColor = (eventType) => {
    if (eventType.includes('branding')) return 'text-purple-400';
    if (eventType.includes('domain')) return 'text-blue-400';
    if (eventType.includes('feature')) return 'text-violet-400';
    if (eventType.includes('user') || eventType.includes('invited')) return 'text-green-400';
    return 'text-slate-400';
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-slate-400" />
        Recent Activity
      </h3>

      {logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log, idx) => {
            const Icon = getEventIcon(log.event_type);
            const color = getEventColor(log.event_type);

            return (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <Icon className={`w-4 h-4 ${color} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{log.event_label || log.event_type}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-slate-400">
                      {log.actor_name && `by ${log.actor_name}`}
                    </p>
                    <span className="text-xs text-slate-500">
                      {log.created_at && new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {log.details && (
                    <p className="text-xs text-slate-400 mt-1">{log.details}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500">
          <p className="text-sm">No activity yet</p>
        </div>
      )}
    </div>
  );
}