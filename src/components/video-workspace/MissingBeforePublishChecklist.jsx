import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Circle } from 'lucide-react';

export default function MissingBeforePublishChecklist({ video, publishJobs }) {
  const items = [
    {
      key: 'transcript',
      label: 'Transcript',
      required: true,
      completed: video.transcript_status === 'completed',
      action: 'Generate transcript from video'
    },
    {
      key: 'captions',
      label: 'Captions',
      required: true,
      completed: video.captions_status === 'completed',
      action: 'Generate AI captions'
    },
    {
      key: 'branding',
      label: 'Branding',
      required: true,
      completed: video.branding_status === 'applied',
      action: 'Add brand assets and colors'
    },
    {
      key: 'render',
      label: 'Render',
      required: true,
      completed: video.render_status === 'completed',
      action: 'Create branded render'
    },
    {
      key: 'copy',
      label: 'Publishing Copy',
      required: true,
      completed: !!(video.website_title || video.facebook_caption || video.youtube_title),
      action: 'Generate channel-specific copy'
    },
    {
      key: 'destinations',
      label: 'Destination Ready',
      required: true,
      completed: !!(video.website_publish_enabled || video.facebook_publish_enabled || video.instagram_publish_enabled || video.youtube_publish_enabled),
      action: 'Select at least one destination'
    },
    {
      key: 'approval',
      label: 'Approved',
      required: true,
      completed: video.review_status === 'approved',
      action: 'Mark ready for review & approve'
    },
  ];

  const completedCount = items.filter(i => i.completed).length;
  const allComplete = items.every(i => i.completed);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Missing Before Publish
          </span>
          <span className="text-sm font-normal text-slate-600">{completedCount}/{items.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map(item => (
          <div key={item.key} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
            item.completed 
              ? 'bg-green-50 border-green-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex-shrink-0 mt-0.5">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${item.completed ? 'text-green-900' : 'text-amber-900'}`}>
                {item.label}
              </p>
              {!item.completed && (
                <p className="text-xs text-amber-700 mt-0.5">{item.action}</p>
              )}
            </div>
          </div>
        ))}

        {allComplete && (
          <div className="p-3 rounded-lg bg-green-100 border border-green-300 text-center">
            <p className="text-sm font-semibold text-green-900">✓ All requirements met. Ready to publish!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}