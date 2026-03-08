import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ChevronRight } from 'lucide-react';

export default function OwnerActionQueue({ data }) {
  if (!data || !data.owner_action_queue) return null;

  const { owner_action_queue } = data;

  const typeLabels = {
    'sla_critical': '🚨 Critical SLA Breach',
    'rescue_playbook': '🆘 Account Rescue',
    'proposal_viewed': '📋 Proposal Viewed',
    'renewal_due': '🔄 Renewal Due',
    'overdue_review': '📊 Overdue Review'
  };

  const urgencyColors = {
    'critical': 'bg-red-100 text-red-800',
    'high': 'bg-orange-100 text-orange-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'low': 'bg-blue-100 text-blue-800'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Owner Action Queue - This Week's Priorities
        </CardTitle>
      </CardHeader>
      <CardContent>
        {owner_action_queue.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No priority actions at this time</p>
          </div>
        ) : (
          <div className="space-y-3">
            {owner_action_queue.slice(0, 10).map((action, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={urgencyColors[action.urgency]}>
                        {action.urgency.toUpperCase()}
                      </Badge>
                      <span className="text-xs font-semibold text-gray-600">
                        {typeLabels[action.type] || action.type}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{action.company_name}</p>
                    {action.notes && (
                      <p className="text-xs text-gray-500 mt-2">{action.notes}</p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}

        {owner_action_queue.length > 10 && (
          <p className="text-xs text-gray-500 mt-4">
            Showing 10 of {owner_action_queue.length} priority items
          </p>
        )}
      </CardContent>
    </Card>
  );
}