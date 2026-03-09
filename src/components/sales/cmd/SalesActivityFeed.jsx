import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Activity, Phone, Mail, CalendarCheck, FileText, UserCheck, MessageSquare, RefreshCw, Zap } from 'lucide-react';

const ACTIVITY_ICONS = {
  call: { icon: Phone, color: 'text-blue-400 bg-blue-900/30' },
  email: { icon: Mail, color: 'text-purple-400 bg-purple-900/30' },
  meeting: { icon: CalendarCheck, color: 'text-green-400 bg-green-900/30' },
  demo: { icon: Zap, color: 'text-yellow-400 bg-yellow-900/30' },
  proposal_sent: { icon: FileText, color: 'text-orange-400 bg-orange-900/30' },
  follow_up: { icon: RefreshCw, color: 'text-cyan-400 bg-cyan-900/30' },
  note: { icon: MessageSquare, color: 'text-gray-400 bg-gray-800' },
  stage_change: { icon: RefreshCw, color: 'text-indigo-400 bg-indigo-900/30' },
  conversion: { icon: UserCheck, color: 'text-green-400 bg-green-900/30' },
};

const ACTIVITY_LABELS = {
  call: 'Call', email: 'Email', meeting: 'Meeting', demo: 'Demo', proposal_sent: 'Proposal Sent',
  follow_up: 'Follow-up', note: 'Note', stage_change: 'Stage Change', conversion: 'Converted',
};

function timeAgo(d) {
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function SalesActivityFeed({ limit = 30 }) {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['sc-activity-feed'],
    queryFn: () => base44.entities.SalesActivities.list('-created_date', limit),
    refetchInterval: 30000,
  });
  const { data: deals = [] } = useQuery({ queryKey: ['sc-pipeline-deals'], queryFn: () => base44.entities.SalesDeals.list('-created_date', 500) });

  const dealMap = deals.reduce((m, d) => { m[d.id] = d; return m; }, {});

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 h-full flex flex-col">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
        <Activity className="w-4 h-4 text-cyan-400" />
        <h2 className="text-sm font-bold text-white">Deal Activity Feed</h2>
        <span className="ml-auto text-xs text-gray-600">Live · auto-refresh 30s</span>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[480px]">
        {isLoading ? (
          <div className="text-center py-10 text-gray-600 text-sm">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-sm">No activity yet</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {activities.map(a => {
              const cfg = ACTIVITY_ICONS[a.activity_type] || ACTIVITY_ICONS.note;
              const Icon = cfg.icon;
              const deal = dealMap[a.deal_id];
              return (
                <div key={a.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-800/30 transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-300">{ACTIVITY_LABELS[a.activity_type] || a.activity_type}</span>
                      <span className="text-xs text-gray-600 flex-shrink-0 ml-2">{timeAgo(a.created_date || a.date)}</span>
                    </div>
                    {deal && <p className="text-xs text-gray-500 mt-0.5">{deal.company_name}</p>}
                    {a.notes && <p className="text-xs text-gray-600 mt-0.5 truncate">{a.notes}</p>}
                    {a.user && <p className="text-xs text-gray-700 mt-0.5">{a.user}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}