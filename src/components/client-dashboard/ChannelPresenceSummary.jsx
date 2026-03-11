import React from 'react';
import { Globe, Facebook, Instagram, Youtube, TrendingUp } from 'lucide-react';
import { CheckCircle, Clock, Zap } from 'lucide-react';

const CHANNELS = [
  { name: 'Website', icon: Globe, color: 'bg-slate-100 text-slate-700' },
  { name: 'Facebook', icon: Facebook, color: 'bg-blue-100 text-blue-700' },
  { name: 'Instagram', icon: Instagram, color: 'bg-pink-100 text-pink-700' },
  { name: 'YouTube', icon: Youtube, color: 'bg-red-100 text-red-700' },
  { name: 'TikTok', icon: TrendingUp, color: 'bg-slate-900 text-white' },
  { name: 'Google', icon: Zap, color: 'bg-amber-100 text-amber-700' },
];

const STATUS_CONFIG = {
  active: { icon: CheckCircle, label: 'Active', color: 'text-emerald-600' },
  scheduled: { icon: Clock, label: 'Scheduled', color: 'text-blue-600' },
  preparing: { icon: Zap, label: 'Preparing', color: 'text-amber-600' },
  setup: { icon: Zap, label: 'Setup in Progress', color: 'text-slate-600' },
};

function ChannelCard({ name, icon: Icon, status = 'active', color }) {
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.setup;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${statusConfig.color}`}>
          <StatusIcon className="w-3 h-3" />
          {statusConfig.label}
        </div>
      </div>
      <p className="font-semibold text-slate-900 text-sm">{name}</p>
    </div>
  );
}

export default function ChannelPresenceSummary({ channelStatus = {} }) {
  // Default statuses if none provided
  const defaultStatus = {
    Website: 'active',
    Facebook: 'active',
    Instagram: 'scheduled',
    YouTube: 'preparing',
    TikTok: 'setup',
    Google: 'active',
  };

  const displayStatus = Object.keys(channelStatus).length > 0 ? channelStatus : defaultStatus;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="font-bold text-slate-900">Your Channel Presence</h2>
      </div>
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CHANNELS.map((channel) => (
          <ChannelCard
            key={channel.name}
            name={channel.name}
            icon={channel.icon}
            status={displayStatus[channel.name] || 'setup'}
            color={channel.color}
          />
        ))}
      </div>
    </div>
  );
}