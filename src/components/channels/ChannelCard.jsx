import React from 'react';
import { CheckCircle, AlertCircle, Circle } from 'lucide-react';

export default function ChannelCard({ 
  logo,
  name,
  description,
  status = 'disconnected',
  lastSync,
  onConnect,
  onReconnect,
  onTest
}) {
  const getStatusBadge = () => {
    switch(status) {
      case 'connected':
        return { icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200', label: 'Connected' };
      case 'attention':
        return { icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: 'Needs Attention' };
      case 'reconnect':
        return { icon: AlertCircle, color: 'text-orange-600 bg-orange-50 border-orange-200', label: 'Reconnect Required' };
      default:
        return { icon: Circle, color: 'text-slate-400 bg-slate-50 border-slate-200', label: 'Not Connected' };
    }
  };

  const badge = getStatusBadge();
  const BadgeIcon = badge.icon;

  const getPrimaryAction = () => {
    if (status === 'disconnected') return { label: 'Connect', action: onConnect, color: 'bg-slate-900 hover:bg-slate-800' };
    if (status === 'reconnect') return { label: 'Reconnect', action: onReconnect, color: 'bg-orange-600 hover:bg-orange-700' };
    if (status === 'connected') return { label: 'Test Post', action: onTest, color: 'bg-blue-600 hover:bg-blue-700' };
    return { label: 'Connect', action: onConnect, color: 'bg-slate-900 hover:bg-slate-800' };
  };

  const action = getPrimaryAction();

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col h-full hover:border-slate-300 transition-colors">
      {/* Header with logo and badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-lg font-bold">
            {logo}
          </div>
          <h3 className="font-semibold text-slate-900">{name}</h3>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${badge.color}`}>
          <BadgeIcon className="w-3.5 h-3.5" />
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-3">{description}</p>

      {/* Health / Sync info */}
      {lastSync && (
        <p className="text-xs text-slate-500 mb-4">{lastSync}</p>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Button */}
      <button
        onClick={action.action}
        className={`${action.color} text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors w-full`}
      >
        {action.label}
      </button>
    </div>
  );
}