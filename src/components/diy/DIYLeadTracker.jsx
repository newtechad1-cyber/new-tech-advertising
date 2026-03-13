import React from 'react';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

export default function DIYLeadTracker({ subscription }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Lead & ROI Tracker</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: 'Leads This Month', value: '24', trend: '+12%' },
          { icon: Target, label: 'Conversion Rate', value: '8.3%', trend: '+2.1%' },
          { icon: DollarSign, label: 'Revenue Generated', value: '$18.5K', trend: '+28%' },
          { icon: TrendingUp, label: 'Cost Per Lead', value: '$4.12', trend: '-8%' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <Icon className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-green-400 text-sm mt-1">{stat.trend}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
        <h3 className="text-lg font-bold text-white mb-4">Recent Leads</h3>
        <div className="space-y-4">
          {[
            { name: 'John Smith', email: 'john@example.com', source: 'Social Media', date: '2 hours ago' },
            { name: 'Sarah Johnson', email: 'sarah@example.com', source: 'Website Form', date: '5 hours ago' },
            { name: 'Mike Wilson', email: 'mike@example.com', source: 'Chat', date: '1 day ago' },
          ].map((lead, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-800 rounded-lg"
            >
              <div className="flex-1">
                <p className="text-white font-semibold">{lead.name}</p>
                <p className="text-slate-400 text-sm">{lead.email}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-300 text-sm">{lead.source}</p>
                <p className="text-slate-500 text-xs">{lead.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}