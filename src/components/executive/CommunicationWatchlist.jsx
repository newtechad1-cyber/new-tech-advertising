import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function CommunicationWatchlist({ data }) {
  if (!data || !data.summary) return null;

  const { summary } = data;

  const communicationIssues = [
    {
      issue: 'Unread Client Messages',
      count: summary.unread_messages || 0,
      severity: summary.unread_messages > 5 ? 'high' : 'medium',
      icon: '💬'
    },
    {
      issue: 'Urgent Client Requests',
      count: summary.urgent_client_requests || 0,
      severity: summary.urgent_client_requests > 0 ? 'high' : 'low',
      icon: '🚨'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Client Communication Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {communicationIssues.map((issue, idx) => (
            <div key={idx} className="py-3 border-b last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{issue.icon}</span>
                  <span className="text-sm text-gray-700">{issue.issue}</span>
                </div>
                <Badge className={
                  issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                  issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }>
                  {issue.count}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {(summary.unread_messages > 0 || summary.urgent_client_requests > 0) && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
            <p className="text-xs font-semibold text-amber-900">⚠ Attention Needed</p>
            <p className="text-xs text-amber-700 mt-1">
              {summary.unread_messages + summary.urgent_client_requests} communication items require attention
            </p>
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full mt-4" asChild>
          <a href={createPageUrl('/admin/messages')}>View All Messages</a>
        </Button>
      </CardContent>
    </Card>
  );
}