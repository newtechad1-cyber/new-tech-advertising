import React from 'react';
import { Activity, Plus, CheckCircle, AlertCircle, FileText, Phone, TrendingUp, X } from 'lucide-react';

const ACTIVITY_ICONS = {
  deal_created: { icon: Plus, color: 'text-blue-400', bg: 'bg-blue-900/20' },
  demo_scheduled: { icon: Phone, color: 'text-violet-400', bg: 'bg-violet-900/20' },
  proposal_sent: { icon: FileText, color: 'text-amber-400', bg: 'bg-amber-900/20' },
  followup_logged: { icon: Activity, color: 'text-slate-400', bg: 'bg-slate-800/50' },
  deal_won: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-900/20' },
  deal_lost: { icon: X, color: 'text-red-400', bg: 'bg-red-900/20' },
  note_added: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
};

export default function SalesActivityFeed({ activities = [] }) {
  const sortedActivities = [...activities]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 10);

  const getActivityLabel = (activity) => {
    switch (activity.activity_type) {
      case 'deal_created':
        return `${activity.company_name} deal created`;
      case 'demo_scheduled':
        return `Demo scheduled with ${activity.company_name}`;
      case 'proposal_sent':
        return `Proposal sent to ${activity.company_name}`;
      case 'followup_logged':
        return `Follow-up logged for ${activity.company_name}`;
      case 'deal_won':
        return `🎉 ${activity.company_name} closed won`;
      case 'deal_lost':
        return `${activity.company_name} closed lost`;
      case 'note_added':
        return `Note added on ${activity.company_name}`;
      default:
        return activity.company_name;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-4 py-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-white">Recent Activity</h3>
      </div>

      <div className="divide-y divide-slate-700 max-h-80 overflow-y-auto">
        {sortedActivities.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-500 text-sm">No activity yet</div>
        ) : (
          sortedActivities.map((activity, idx) => {
            const config = ACTIVITY_ICONS[activity.activity_type] || ACTIVITY_ICONS.note_added;
            const Icon = config.icon;

            return (
              <div key={idx} className={`px-4 py-3 hover:bg-slate-800/50 transition-colors ${config.bg}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex-shrink-0 p-1.5 rounded-full ${config.bg}`}>
                    <Icon className={`w-3 h-3 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">
                      {getActivityLabel(activity)}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {new Date(activity.created_at || 0).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                {activity.notes && (
                  <p className="text-xs text-slate-400 mt-2 ml-6 italic">"{activity.notes}"</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}