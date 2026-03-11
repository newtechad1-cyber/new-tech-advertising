import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NextBestOnboardingAction({ client }) {
  const actions = [];

  // Determine next best action
  if (!client.logo_uploaded) {
    actions.push({
      title: 'Request Logo',
      description: 'Brand assets pending',
      priority: 'high',
      icon: '📋',
    });
  }

  if (!client.facebook_connected && !client.website_publishing_ready) {
    actions.push({
      title: 'Connect Channels',
      description: 'No publishing destinations active',
      priority: 'high',
      icon: '🔗',
    });
  }

  if (!client.first_video_topic_selected && client.facebook_connected) {
    actions.push({
      title: 'Generate Campaign',
      description: 'Ready for first content',
      priority: 'medium',
      icon: '🎬',
    });
  }

  if (!client.client_portal_activated && client.onboarding_stage !== 'deal_closed') {
    actions.push({
      title: 'Activate Portal',
      description: 'Client needs visibility',
      priority: 'medium',
      icon: '🔐',
    });
  }

  if (client.first_video_topic_selected && !client.first_publish_scheduled) {
    actions.push({
      title: 'Schedule Publish',
      description: 'Content ready to go live',
      priority: 'medium',
      icon: '📅',
    });
  }

  const nextAction = actions[0];

  if (!nextAction) {
    return (
      <div className="text-center py-2 text-emerald-400 text-xs font-semibold">
        ✓ All systems ready
      </div>
    );
  }

  const priorityColor = nextAction.priority === 'high' ? 'text-red-400' : 'text-amber-400';

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-2">
      <div className="flex items-start gap-2">
        <span className="text-sm">{nextAction.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold ${priorityColor}`}>{nextAction.title}</p>
          <p className="text-xs text-slate-400">{nextAction.description}</p>
        </div>
      </div>
    </div>
  );
}