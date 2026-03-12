import React from 'react';
import { Facebook, Instagram, Globe, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UpcomingContentTimeline() {
  const navigate = useNavigate();

  const upcomingPosts = [
    {
      id: 1,
      title: 'Spring Service Special',
      platform: 'facebook',
      date: 'Mar 14',
      status: 'scheduled',
    },
    {
      id: 2,
      title: 'Customer Testimonial Video',
      platform: 'instagram',
      date: 'Mar 16',
      status: 'in-review',
    },
    {
      id: 3,
      title: 'New Pricing Page Launch',
      platform: 'website',
      date: 'Mar 18',
      status: 'scheduled',
    },
  ];

  const platformIcons = {
    facebook: <Facebook className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    website: <Globe className="w-4 h-4" />,
  };

  const statusStyles = {
    scheduled: 'bg-blue-50 text-blue-700 border border-blue-200',
    'in-review': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    published: 'bg-green-50 text-green-700 border border-green-200',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Next 3 Posts</h2>
        <button
          onClick={() => navigate('/client/calendar')}
          className="text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center gap-2"
        >
          Open Calendar
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {upcomingPosts.map((post) => (
          <div key={post.id} className="bg-slate-50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-100 transition-colors border border-slate-200">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-600">
                {platformIcons[post.platform]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{post.title}</p>
                <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[post.status]}`}>
              {post.status === 'scheduled' && 'Scheduled'}
              {post.status === 'in-review' && 'In Review'}
              {post.status === 'published' && 'Published'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}