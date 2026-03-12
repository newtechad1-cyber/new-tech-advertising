import React from 'react';
import { Play, Zap } from 'lucide-react';

const topPosts = [
  {
    id: 1,
    platform: 'Facebook',
    platformIcon: '👍',
    headline: 'Spring Service Special - 20% Off This Month',
    engagement: 124,
    badge: 'Strong Engagement',
    thumbnail: 'bg-blue-100'
  },
  {
    id: 2,
    platform: 'Instagram',
    platformIcon: '📷',
    headline: 'Before & After Home Transformation',
    engagement: 89,
    badge: 'High Reach',
    thumbnail: 'bg-pink-100'
  },
  {
    id: 3,
    platform: 'YouTube',
    platformIcon: '📺',
    headline: 'How to Prepare Your Home for Summer',
    engagement: 156,
    badge: 'Top Performer',
    thumbnail: 'bg-red-100'
  }
];

export default function ContentPerformance() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Top Performing Content</h2>
      <p className="text-slate-600 mb-6">
        These posts generated the strongest customer response.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topPosts.map((post) => (
          <div key={post.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors">
            <div className={`${post.thumbnail} h-40 flex items-center justify-center text-4xl`}>
              {post.platform === 'YouTube' ? <Play className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{post.platformIcon}</span>
                <span className="text-xs font-medium text-slate-600">{post.platform}</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-3 text-sm leading-snug">
                {post.headline}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{post.engagement} interactions</span>
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                  {post.badge}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}