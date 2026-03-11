import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, Eye, Settings, RotateCcw } from 'lucide-react';

const ISSUE_TYPES = {
  failed_publish: { label: 'Failed Publish', icon: AlertCircle, color: 'bg-red-50', border: 'border-red-200' },
  blocked_connection: { label: 'Blocked by Connection', icon: AlertTriangle, color: 'bg-amber-50', border: 'border-amber-200' },
  approval_missing: { label: 'Approval Missing', icon: Eye, color: 'bg-blue-50', border: 'border-blue-200' },
  missing_render: { label: 'Missing Render', icon: AlertTriangle, color: 'bg-amber-50', border: 'border-amber-200' },
};

const ACTION_BUTTONS = {
  failed_publish: { label: 'Retry', icon: RotateCcw },
  blocked_connection: { label: 'Fix Setup', icon: Settings },
  approval_missing: { label: 'Review Now', icon: Eye },
  missing_render: { label: 'Render Video', icon: RotateCcw },
};

export default function IssuesPanel({ issues }) {
  if (!issues || issues.length === 0) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">No issues to address</p>
      </Card>
    );
  }

  const groupedByType = {};
  issues.forEach(issue => {
    if (!groupedByType[issue.type]) {
      groupedByType[issue.type] = [];
    }
    groupedByType[issue.type].push(issue);
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">Needs Attention</h2>
        <Badge variant="destructive">{issues.length}</Badge>
      </div>

      {/* Issues by Type */}
      <div className="px-6 pb-6 space-y-4">
        {Object.entries(groupedByType).map(([type, typeIssues]) => {
          const typeConfig = ISSUE_TYPES[type];
          const Icon = typeConfig?.icon || AlertCircle;

          return (
            <div key={type}>
              {/* Type Header */}
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-semibold text-gray-900">{typeConfig?.label || type}</h3>
                <Badge variant="outline" className="text-xs">{typeIssues.length}</Badge>
              </div>

              {/* Issue Cards */}
              <div className="space-y-2">
                {typeIssues.map(issue => {
                  const action = ACTION_BUTTONS[type];

                  return (
                    <Card key={issue.id} className="p-3">
                      <div className="flex gap-3">
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {issue.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-0.5">{issue.company}</p>
                          
                          {issue.affected_destination && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {issue.affected_destination}
                            </Badge>
                          )}

                          {issue.reason && (
                            <p className="text-xs text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                              {issue.reason}
                            </p>
                          )}

                          {issue.recommended_next_step && (
                            <p className="text-xs text-blue-700 mt-2 font-medium">
                              💡 {issue.recommended_next_step}
                            </p>
                          )}
                        </div>

                        {/* Action Button */}
                        {action && (
                          <div className="flex flex-col gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-xs whitespace-nowrap"
                              onClick={() => console.log('Action', type, issue.id)}
                            >
                              <action.icon className="w-3 h-3" />
                              {action.label}
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}