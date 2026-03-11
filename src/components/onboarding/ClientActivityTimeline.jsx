import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function ClientActivityTimeline({ client }) {
  const activities = [];
  const now = new Date();

  // Build activity timeline from client data
  if (client.created_date) {
    activities.push({
      date: new Date(client.created_date),
      label: 'Deal closed',
      type: 'success',
    });
  }

  if (client.onboarding_started_date) {
    activities.push({
      date: new Date(client.onboarding_started_date),
      label: 'Onboarding started',
      type: 'info',
    });
  }

  if (client.logo_uploaded) {
    activities.push({
      date: new Date(client.logo_uploaded_date || client.updated_date),
      label: 'Logo uploaded',
      type: 'success',
    });
  }

  if (client.facebook_connected) {
    activities.push({
      date: new Date(client.facebook_connected_date || client.updated_date),
      label: 'Facebook connected',
      type: 'success',
    });
  }

  if (client.first_video_topic_selected) {
    activities.push({
      date: new Date(client.first_video_topic_selected_date || client.updated_date),
      label: 'First campaign created',
      type: 'success',
    });
  }

  if (client.onboarding_stage === 'content_approved') {
    activities.push({
      date: new Date(client.updated_date),
      label: 'Ready to launch',
      type: 'success',
    });
  }

  // Sort by date descending
  activities.sort((a, b) => b.date - a.date);

  const getIcon = (type) => {
    if (type === 'success') return <CheckCircle2 className="w-3 h-3 text-emerald-400" />;
    if (type === 'warning') return <AlertCircle className="w-3 h-3 text-orange-400" />;
    return <Clock className="w-3 h-3 text-slate-400" />;
  };

  return (
    <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
      {activities.slice(0, 3).map((activity, idx) => (
        <div key={idx} className="flex items-center gap-2 text-slate-400">
          {getIcon(activity.type)}
          <span className="truncate">{activity.label}</span>
        </div>
      ))}
      {activities.length === 0 && (
        <p className="text-slate-500 text-xs italic">No activity yet</p>
      )}
    </div>
  );
}