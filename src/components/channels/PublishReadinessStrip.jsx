import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Circle } from 'lucide-react';

export default function PublishReadinessStrip({ 
  contentReady = 'ready',
  channelsReady = 'partial',
  approvalReady = 'ready',
  publishSafe = 'blocked'
}) {
  const getStatus = (status) => {
    switch(status) {
      case 'ready': return { color: 'bg-green-50 border-green-200', icon: CheckCircle, iconColor: 'text-green-600', label: '✔' };
      case 'partial': return { color: 'bg-yellow-50 border-yellow-200', icon: AlertCircle, iconColor: 'text-yellow-600', label: '⚠' };
      case 'blocked': return { color: 'bg-red-50 border-red-200', icon: XCircle, iconColor: 'text-red-600', label: '✖' };
      default: return { color: 'bg-slate-50 border-slate-200', icon: Circle, iconColor: 'text-slate-400', label: '○' };
    }
  };

  const statuses = [
    { label: 'Content Ready', status: contentReady },
    { label: 'Channels Ready', status: channelsReady },
    { label: 'Approval Ready', status: approvalReady },
    { label: 'Publishing Safe', status: publishSafe },
  ];

  return (
    <div className="mb-10 border border-slate-200 rounded-xl p-6 bg-white">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-4">System Status</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statuses.map((item, idx) => {
          const s = getStatus(item.status);
          const Icon = s.icon;
          return (
            <div key={idx} className={`${s.color} border rounded-lg p-3 flex items-center gap-2`}>
              <Icon className={`w-4 h-4 ${s.iconColor}`} />
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}