import React from 'react';
import { MessageSquare, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DIYSocialPlanner({ subscription }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Social Media Planner</h2>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Posts Scheduled', value: '12', icon: MessageSquare },
          { label: 'This Month', value: '18/20', icon: Calendar },
          { label: 'Engagement Rate', value: '3.2%', icon: BarChart3 },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <Icon className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Connected Platforms</h3>
        <div className="space-y-3">
          {['Facebook', 'Instagram', 'LinkedIn', 'Twitter'].map((platform, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-800 rounded-lg"
            >
              <span className="text-white font-semibold">{platform}</span>
              <span className="text-green-400 text-sm">Connected</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button className="flex-1 bg-violet-600 hover:bg-violet-700">
          Schedule Posts
        </Button>
        <Button variant="outline" className="flex-1">
          View Calendar
        </Button>
      </div>
    </div>
  );
}