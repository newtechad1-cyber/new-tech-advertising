import React from 'react';
import { Calendar, Facebook, Instagram, Youtube, Globe } from 'lucide-react';
import { formatDate } from 'date-fns';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

const PLATFORM_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
};

function UpcomingCard({ title, thumbnail, publishDate, platforms = [] }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow">
      {thumbnail && (
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
      )}
      <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-2">{title}</h3>
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-500">{formatDate(new Date(publishDate), 'MMM dd')}</span>
      </div>
      <div className="flex gap-1">
        {platforms.map((platform) => {
          const Icon = PLATFORM_ICONS[platform] || Globe;
          return (
            <div key={platform} className="bg-white rounded-lg p-1.5 border border-slate-200">
              <Icon className="w-3.5 h-3.5 text-slate-600" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function UpcomingContentPanel({ content = [] }) {
  const upcomingContent = content.slice(0, 4);

  if (content.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
        <p className="text-slate-400 text-sm mb-4">No upcoming content scheduled</p>
        <a href={createPageUrl('ScheduledQueue')}>
          <Button size="sm" variant="outline">View Calendar</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h2 className="font-bold text-slate-900">Upcoming Content</h2>
        <a href={createPageUrl('ScheduledQueue')} className="text-xs text-blue-600 hover:underline">View Calendar →</a>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {upcomingContent.map((item, idx) => (
          <UpcomingCard
            key={idx}
            title={item.title}
            thumbnail={item.thumbnail}
            publishDate={item.publishDate}
            platforms={item.platforms}
          />
        ))}
      </div>
    </div>
  );
}