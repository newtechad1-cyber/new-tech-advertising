import React from 'react';
import { AlertTriangle, TrendingDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LowActivityAlert({ client, report }) {
  const isLowActivity = (report?.content_published_count || 0) < 2 && 
                        (report?.campaigns_active || 0) < 1 &&
                        (report?.approval_activity_count || 0) < 3;

  if (!isLowActivity) return null;

  const daysInactive = report?.content_published_count === 0 
    ? Math.floor((new Date() - new Date(report?.report_start_date || 0)) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-orange-900/30 border-l-4 border-orange-500 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-orange-200 mb-1">Low Marketing Activity Detected</h4>
          <p className="text-sm text-orange-100 mb-3">
            {client.name} has minimal marketing activity this period. 
            {daysInactive && ` No content published in ${daysInactive} days.`}
            Consider reaching out to provide support or identify blockers.
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1 text-orange-400 hover:text-orange-300 bg-orange-900/40">
              <MessageSquare className="w-3 h-3" /> Reach Out
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1 text-orange-400 hover:text-orange-300 bg-orange-900/40">
              <TrendingDown className="w-3 h-3" /> Review Strategy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}