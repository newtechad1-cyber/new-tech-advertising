import React from 'react';

export const PLATFORM_ICON = {
  'Facebook': '👥',
  'Instagram': '📸',
  'LinkedIn': '💼',
  'X': '🐦',
  'YouTube': '▶️',
  'Google Business Profile': '📍',
  'TikTok': '🎵',
};

export const CAMPAIGN_STATUS_COLORS = {
  'Draft':              'bg-slate-700 text-slate-300',
  'Planned':            'bg-blue-900/40 text-blue-300 border-blue-800',
  'Awaiting Approval':  'bg-amber-900/40 text-amber-300 border-amber-800',
  'Approved':           'bg-teal-900/40 text-teal-300 border-teal-800',
  'Scheduled':          'bg-violet-900/40 text-violet-300 border-violet-800',
  'Active':             'bg-emerald-900/40 text-emerald-300 border-emerald-800',
  'Completed':          'bg-slate-800 text-slate-400',
  'Paused':             'bg-orange-900/40 text-orange-300 border-orange-800',
  'Cancelled':          'bg-red-900/40 text-red-300 border-red-800',
};

export const POST_STATUS_COLORS = {
  'Draft':      'bg-slate-700 text-slate-300',
  'Ready':      'bg-blue-900/40 text-blue-300',
  'Scheduled':  'bg-violet-900/40 text-violet-300',
  'Publishing': 'bg-amber-900/40 text-amber-300',
  'Published':  'bg-emerald-900/40 text-emerald-300',
  'Failed':     'bg-red-900/40 text-red-300',
  'Cancelled':  'bg-slate-800 text-slate-500',
};

export const APPROVAL_COLORS = {
  'Not Needed':      'bg-slate-700 text-slate-400',
  'Pending':         'bg-amber-900/40 text-amber-300',
  'Approved':        'bg-emerald-900/40 text-emerald-300',
  'Rejected':        'bg-red-900/40 text-red-300',
  'Revision Needed': 'bg-orange-900/40 text-orange-300',
};

export function CampaignStatusBadge({ status }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${CAMPAIGN_STATUS_COLORS[status] || 'bg-slate-700 text-slate-400 border-slate-600'}`}>
      {status || 'Draft'}
    </span>
  );
}

export function PostStatusBadge({ status }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${POST_STATUS_COLORS[status] || 'bg-slate-700 text-slate-400'}`}>
      {status || 'Draft'}
    </span>
  );
}

export function ApprovalBadge({ status }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${APPROVAL_COLORS[status] || 'bg-slate-700 text-slate-400'}`}>
      {status || 'Not Needed'}
    </span>
  );
}