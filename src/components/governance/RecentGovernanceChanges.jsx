import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch, Edit, Trash2, Plus, Lock } from 'lucide-react';

export default function RecentGovernanceChanges({ audits = [] }) {
  const changeIcons = {
    field_added: Plus,
    field_renamed: Edit,
    field_deprecated: Trash2,
    field_modified: Edit,
    lifecycle_updated: Lock,
    relationship_added: GitBranch,
    relationship_modified: Edit,
    visibility_changed: Lock,
    edit_rules_changed: Lock,
  };

  const changeColors = {
    field_added: 'emerald',
    field_renamed: 'blue',
    field_deprecated: 'orange',
    field_modified: 'blue',
    lifecycle_updated: 'purple',
    relationship_added: 'cyan',
    relationship_modified: 'blue',
    visibility_changed: 'purple',
    edit_rules_changed: 'purple',
  };

  if (audits.length === 0) {
    return (
      <Card className="bg-slate-950 border-slate-800">
        <CardContent className="pt-6">
          <p className="text-slate-400">No governance changes yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white text-lg">Recent Governance Changes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {audits.slice(0, 10).map((audit, idx) => {
          const Icon = changeIcons[audit.change_type] || Edit;
          const color = changeColors[audit.change_type] || 'slate';

          return (
            <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-800 last:border-b-0">
              <div className={`p-2 rounded bg-${color}-950/30 text-${color}-400 flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">
                  {audit.entity_key}
                  {audit.field_key && ` → ${audit.field_key}`}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {audit.change_type.replace(/_/g, ' ')}
                </p>
                {audit.reason && (
                  <p className="text-xs text-slate-500 mt-1">{audit.reason}</p>
                )}
                <p className="text-xs text-slate-600 mt-1">
                  by {audit.changed_by} • {new Date(audit.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}