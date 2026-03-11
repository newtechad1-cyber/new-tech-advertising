import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCommit, AlertCircle, CheckCircle2, Edit2, Plus } from 'lucide-react';

export default function RecentPageGovernanceChanges({ audits = [] }) {
  const changeIcons = {
    page_created: Plus,
    page_updated: Edit2,
    page_deprecated: AlertCircle,
    route_added: Plus,
    route_changed: Edit2,
    layout_changed: Edit2,
    nav_family_changed: Edit2,
    access_rules_updated: Edit2,
    page_archived: AlertCircle,
  };

  const changeColors = {
    page_created: 'text-emerald-400 bg-emerald-950/40',
    page_updated: 'text-blue-400 bg-blue-950/40',
    page_deprecated: 'text-orange-400 bg-orange-950/40',
    route_added: 'text-cyan-400 bg-cyan-950/40',
    route_changed: 'text-purple-400 bg-purple-950/40',
    layout_changed: 'text-indigo-400 bg-indigo-950/40',
    nav_family_changed: 'text-pink-400 bg-pink-950/40',
    access_rules_updated: 'text-amber-400 bg-amber-950/40',
    page_archived: 'text-red-400 bg-red-950/40',
  };

  const recentChanges = audits.slice(0, 10);

  return (
    <Card className="bg-slate-950 border-slate-700">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-white">Recent Changes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentChanges.length === 0 ? (
          <p className="text-xs text-slate-500">No changes yet</p>
        ) : (
          recentChanges.map((audit, idx) => {
            const Icon = changeIcons[audit.change_type] || GitCommit;
            const colorClass = changeColors[audit.change_type];

            return (
              <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-900/50">
                <div className={`p-1.5 rounded ${colorClass}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {audit.change_type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {audit.page_key} {audit.route_path && `(${audit.route_path})`}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    by <span className="font-mono">{audit.changed_by.split('@')[0]}</span>
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}