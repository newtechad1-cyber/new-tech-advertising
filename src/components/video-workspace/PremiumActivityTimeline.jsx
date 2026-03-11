import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Clock, Upload, Zap, Share2 } from 'lucide-react';

const EVENT_GROUPS = {
  processing: { label: 'Processing', icon: Zap, color: 'bg-blue-100 text-blue-700' },
  review: { label: 'Review', icon: Clock, color: 'bg-purple-100 text-purple-700' },
  publishing: { label: 'Publishing', icon: Share2, color: 'bg-green-100 text-green-700' },
  failures: { label: 'Failures & Retries', icon: AlertCircle, color: 'bg-red-100 text-red-700' },
};

export default function PremiumActivityTimeline({ auditLogs = [], video }) {
  const groupedEvents = useMemo(() => {
    const events = [...(auditLogs || [])].sort((a, b) => 
      new Date(b.logged_at) - new Date(a.logged_at)
    );

    const groups = {
      processing: [],
      review: [],
      publishing: [],
      failures: [],
    };

    const processingEvents = ['uploaded', 'transcript_generated', 'captions_generated', 'branding_saved', 'render_completed'];
    const reviewEvents = ['marked_ready_for_review', 'approved', 'rejected', 'changes_requested'];
    const publishingEvents = ['publish_started', 'publish_succeeded', 'scheduled_activated'];
    const failureEvents = ['publish_failed', 'retry_requested', 'token_expired', 'needs_connection'];

    events.forEach(event => {
      if (processingEvents.includes(event.event_type)) groups.processing.push(event);
      else if (reviewEvents.includes(event.event_type)) groups.review.push(event);
      else if (publishingEvents.includes(event.event_type)) groups.publishing.push(event);
      else if (failureEvents.includes(event.event_type)) groups.failures.push(event);
    });

    return groups;
  }, [auditLogs]);

  const renderEventIcon = (eventType) => {
    if (eventType.includes('success') || eventType === 'approved') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (eventType.includes('failed') || eventType.includes('error')) return <AlertCircle className="w-5 h-5 text-red-600" />;
    if (eventType === 'uploaded') return <Upload className="w-5 h-5 text-blue-600" />;
    return <Clock className="w-5 h-5 text-slate-400" />;
  };

  const renderEventLabel = (eventType) => {
    const labels = {
      uploaded: 'Video uploaded',
      transcript_generated: 'Transcript generated',
      captions_generated: 'Captions generated',
      branding_saved: 'Branding applied',
      render_completed: 'Render completed',
      marked_ready_for_review: 'Marked ready for review',
      approved: 'Approved',
      rejected: 'Rejected',
      changes_requested: 'Changes requested',
      publish_started: 'Publishing started',
      publish_succeeded: 'Published successfully',
      publish_failed: 'Publishing failed',
      scheduled_activated: 'Scheduled publish',
      token_expired: 'Token expired',
      needs_connection: 'Connection needed',
      retry_requested: 'Retry requested',
    };
    return labels[eventType] || eventType.replace(/_/g, ' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedEvents).map(([groupKey, events]) => {
          if (events.length === 0) return null;

          const groupConfig = EVENT_GROUPS[groupKey];
          const GroupIcon = groupConfig.icon;

          return (
            <div key={groupKey} className="space-y-3">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${groupConfig.color}`}>
                <GroupIcon className="w-3.5 h-3.5" />
                {groupConfig.label}
              </div>

              <div className="space-y-2 pl-6 border-l-2 border-slate-200">
                {events.map((event, idx) => (
                  <div key={idx} className="relative space-y-0.5">
                    <div className="absolute -left-8 top-1.5">
                      {renderEventIcon(event.event_type)}
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {renderEventLabel(event.event_type)}
                    </p>
                    {event.event_details && (
                      <p className="text-xs text-slate-600">{event.event_details}</p>
                    )}
                    {event.logged_at && (
                      <p className="text-xs text-slate-500">
                        {new Date(event.logged_at).toLocaleDateString()} {new Date(event.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {Object.values(groupedEvents).every(arr => arr.length === 0) && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-600">No activity yet. Start processing this video.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}