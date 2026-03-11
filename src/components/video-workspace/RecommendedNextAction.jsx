import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight } from 'lucide-react';

export default function RecommendedNextAction({ video, onAction }) {
  let action = null;

  // Determine the next best action
  if (!video.transcript_text || video.transcript_status !== 'completed') {
    action = {
      title: 'Generate Transcript',
      description: 'Extract speech from video to enable captions and publishing copy',
      icon: '📝',
      key: 'transcript',
      priority: 1
    };
  } else if (!video.captions_json || video.captions_status !== 'completed') {
    action = {
      title: 'Generate AI Captions',
      description: 'Create accessible captions for all viewing contexts',
      icon: '📺',
      key: 'captions',
      priority: 2
    };
  } else if (!video.primary_logo_url || video.branding_status !== 'applied') {
    action = {
      title: 'Complete Branding',
      description: 'Add logos, colors, and brand assets to the video',
      icon: '🎨',
      key: 'branding',
      priority: 3
    };
  } else if (video.render_status !== 'completed') {
    action = {
      title: 'Create Branded Render',
      description: 'Render final video with branding applied',
      icon: '🎬',
      key: 'render',
      priority: 4
    };
  } else if (!video.website_title && !video.facebook_caption) {
    action = {
      title: 'Generate Publishing Copy',
      description: 'Create channel-specific titles and captions',
      icon: '✍️',
      key: 'copy',
      priority: 5
    };
  } else if (!(video.website_publish_enabled || video.facebook_publish_enabled || video.instagram_publish_enabled || video.youtube_publish_enabled)) {
    action = {
      title: 'Select Destinations',
      description: 'Choose which channels to publish to',
      icon: '📤',
      key: 'destinations',
      priority: 6
    };
  } else if (video.review_status !== 'pending_review' && video.review_status !== 'in_review') {
    action = {
      title: 'Mark Ready for Review',
      description: 'Submit to approval workflow',
      icon: '✅',
      key: 'review',
      priority: 7
    };
  } else if (video.review_status === 'pending_review' || video.review_status === 'in_review') {
    action = {
      title: 'Approve & Publish',
      description: 'Approve and deploy to all selected destinations',
      icon: '🚀',
      key: 'publish',
      priority: 8
    };
  }

  if (!action) return null;

  return (
    <Card className="border-blue-300 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">{action.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 text-xs font-semibold">
                <Zap className="w-3 h-3" />
                Next Step
              </span>
            </div>
            <h3 className="text-lg font-bold">{action.title}</h3>
            <p className="text-sm text-blue-100 mt-1">{action.description}</p>
          </div>
          <Button
            onClick={() => onAction(action.key)}
            className="flex-shrink-0 gap-2 bg-white text-blue-600 hover:bg-blue-50"
            size="sm"
          >
            Start
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}