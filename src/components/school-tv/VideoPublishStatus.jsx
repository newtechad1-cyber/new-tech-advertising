import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Link as LinkIcon } from 'lucide-react';

const PUBLISH_STATUS_CONFIG = {
  not_ready: { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Not Ready' },
  queued: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Queued' },
  published: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Published' },
  partial: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Partial' },
  failed: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Failed' },
};

export default function VideoPublishStatus({ publishStatus, destinations = [] }) {
  const config = PUBLISH_STATUS_CONFIG[publishStatus] || PUBLISH_STATUS_CONFIG.not_ready;
  const Icon = config.icon;

  return (
    <div className={`rounded-lg p-3 border ${config.bg}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${config.color}`} />
        <p className={`text-xs font-semibold ${config.color}`}>{config.label}</p>
      </div>
      {destinations.length > 0 && (
        <div className="space-y-1">
          {destinations.map((dest, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
              <LinkIcon className="h-3 w-3" />
              <span className="capitalize">{dest.destination}</span>
              {dest.destination_status && (
                <span className={`text-xs font-semibold ${dest.destination_status === 'published' ? 'text-green-600' : 'text-gray-500'}`}>
                  {dest.destination_status === 'published' ? '✓' : '○'}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}