import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Bell, Flame, FileText, Rocket, ChevronRight } from 'lucide-react';

const ROWS = [
  { label: 'Hot Leads', types: ['hot_lead', 'followup_needed'], icon: Flame, color: 'text-red-400', bg: 'bg-red-900/20' },
  { label: 'Proposal Activity', types: ['proposal_viewed', 'proposal_viewed_multiple', 'proposal_followup', 'proposal_no_response'], icon: FileText, color: 'text-blue-400', bg: 'bg-blue-900/20' },
  { label: 'Trial Follow-Up', types: ['trial_started', 'trial_incomplete'], icon: Rocket, color: 'text-violet-400', bg: 'bg-violet-900/20' },
  { label: 'Client Requests', types: ['client_request'], icon: Bell, color: 'text-orange-400', bg: 'bg-orange-900/20' },
];

export default function AlertsSummaryPanel() {
  const { data: notifications = [] } = useQuery({
    queryKey: ['admin-alerts-summary'],
    queryFn: () => base44.entities.SalesNotification.filter({ status: 'unread' }, '-created_date', 200),
    refetchInterval: 60000,
  });

  const total = notifications.length;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-400" />
          <span className="font-semibold text-white text-sm">Alert Center</span>
          {total > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{total}</span>
          )}
        </div>
        <Link to={createPageUrl('AdminAlerts')} className="text-xs text-slate-400 hover:text-orange-400 flex items-center gap-0.5">
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-slate-700/50">
        {ROWS.map(row => {
          const count = notifications.filter(n => row.types.includes(n.notification_type)).length;
          const Icon = row.icon;
          return (
            <Link key={row.label} to={createPageUrl('AdminAlerts')} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-700/40 transition-colors group">
              <div className={`p-1.5 rounded-lg ${row.bg} shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${row.color}`} />
              </div>
              <span className="text-sm text-slate-300 flex-1">{row.label}</span>
              <span className={`text-sm font-bold ${count > 0 ? row.color : 'text-slate-600'}`}>
                {count}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />
            </Link>
          );
        })}
      </div>

      {total === 0 && (
        <div className="px-5 py-6 text-center text-slate-500 text-xs">
          ✅ No unread alerts
        </div>
      )}
    </div>
  );
}