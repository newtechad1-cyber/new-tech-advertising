import React from 'react';
import { Globe, Facebook, Instagram, Youtube, Zap } from 'lucide-react';

export default function ChannelPresenceSummary({ report }) {
  const channels = [
    { name: 'Website', status: 'active', icon: Globe, color: 'text-blue-400' },
    { name: 'Facebook', status: 'active', icon: Facebook, color: 'text-blue-600' },
    { name: 'Instagram', status: 'scheduled', icon: Instagram, color: 'text-pink-400' },
    { name: 'YouTube', status: 'in progress', icon: Youtube, color: 'text-red-400' },
  ];

  const getStatusColor = (status) => {
    if (status === 'active') return 'bg-emerald-900/20 text-emerald-400 border-emerald-700';
    if (status === 'scheduled') return 'bg-blue-900/20 text-blue-400 border-blue-700';
    return 'bg-amber-900/20 text-amber-400 border-amber-700';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Channel Presence</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {channels.map((channel, idx) => {
          const Icon = channel.icon;
          return (
            <div key={idx} className={`${getStatusColor(channel.status)} border rounded-lg p-4 flex items-start gap-3`}>
              <Icon className={`w-5 h-5 ${channel.color} flex-shrink-0`} />
              <div>
                <p className="text-sm font-semibold text-white">{channel.name}</p>
                <p className="text-xs text-slate-400 capitalize mt-1">{channel.status}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}