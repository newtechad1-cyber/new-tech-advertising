import React from 'react';
import { Video, FileText, Calendar, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ACTIVITY_ICONS = {
  video_published: Video,
  story_created: FileText,
  campaign_scheduled: Calendar,
  content_prepared: Zap,
  approval_requested: CheckCircle,
};

function ActivityItem({ type, title, description, timestamp, actionLink }) {
  const Icon = ACTIVITY_ICONS[type] || Zap;
  const colorMap = {
    video_published: 'bg-blue-100 text-blue-600',
    story_created: 'bg-purple-100 text-purple-600',
    campaign_scheduled: 'bg-orange-100 text-orange-600',
    content_prepared: 'bg-emerald-100 text-emerald-600',
    approval_requested: 'bg-rose-100 text-rose-600',
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
      <div className={`p-2 rounded-lg shrink-0 ${colorMap[type] || 'bg-slate-100 text-slate-600'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        <p className="text-xs text-slate-400 mt-2">{formatDistanceToNow(new Date(timestamp), { addSuffix: true })}</p>
      </div>
      {actionLink && (
        <a href={actionLink} className="text-slate-400 hover:text-slate-600 shrink-0 mt-1">
          <ArrowRight className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

export default function ActivityFeed({ activities = [] }) {
  const recentActivities = activities.slice(0, 6);

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <Zap className="w-10 h-10 text-slate-200 mx-auto mb-3" />
        <p className="text-slate-400 text-sm">No recent activity yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="font-bold text-slate-900">Recent Marketing Activity</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {recentActivities.map((activity, idx) => (
          <ActivityItem
            key={idx}
            type={activity.type}
            title={activity.title}
            description={activity.description}
            timestamp={activity.timestamp}
            actionLink={activity.actionLink}
          />
        ))}
      </div>
    </div>
  );
}