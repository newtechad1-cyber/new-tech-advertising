import React from 'react';

const STATUS_CONFIG = {
  approval: {
    label: 'Needs Your Approval',
    color: 'bg-amber-100 text-amber-800',
    icon: '⏳',
  },
  scheduled: {
    label: 'Scheduled',
    color: 'bg-blue-100 text-blue-800',
    icon: '📅',
  },
  published: {
    label: 'Published',
    color: 'bg-emerald-100 text-emerald-800',
    icon: '✓',
  },
  draft: {
    label: 'In Preparation',
    color: 'bg-slate-100 text-slate-800',
    icon: '✏️',
  },
  campaign: {
    label: 'Campaign',
    color: 'bg-violet-100 text-violet-800',
    icon: '🎯',
  },
};

export default function CalendarStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}