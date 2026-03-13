import React from 'react';
import { TrendingUp, Target, Calendar, AlertCircle } from 'lucide-react';

export default function DIYCommandCenter({ subscription }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Marketing Command Center</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'This Month Leads', value: '24', trend: '+12%' },
          { label: 'Content Posts', value: '18', trend: '4 pending' },
          { label: 'Campaign Performance', value: '2.4x', trend: 'ROI' },
          { label: 'Active Campaigns', value: '3', trend: 'All active' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-violet-400 text-sm mt-2">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-400" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-semibold transition-colors">
              Generate New Content
            </button>
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-semibold transition-colors">
              Schedule Social Posts
            </button>
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-semibold transition-colors">
              Create Video Campaign
            </button>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-400" />
            This Week
          </h3>
          <div className="space-y-3">
            {[
              { task: 'Publish blog post on services', date: 'Today' },
              { task: 'Schedule 8 social media posts', date: 'Tomorrow' },
              { task: 'Create product video', date: 'Wed' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-800 last:border-0">
                <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white text-sm">{item.task}</p>
                  <p className="text-slate-500 text-xs">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}