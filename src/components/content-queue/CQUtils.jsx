import React from 'react';

export const QUEUE_STATUS_COLORS = {
  'Backlog':              'bg-slate-700 text-slate-400',
  'Ready to Schedule':    'bg-blue-900/40 text-blue-300',
  'Assigned to Campaign': 'bg-violet-900/40 text-violet-300',
  'Scheduled':            'bg-amber-900/40 text-amber-300',
  'Published':            'bg-emerald-900/40 text-emerald-300',
  'Archived':             'bg-slate-800 text-slate-500',
};

export const APPROVAL_STATUS_COLORS = {
  'Pending':         'bg-amber-900/40 text-amber-300',
  'Approved':        'bg-emerald-900/40 text-emerald-300',
  'Rejected':        'bg-red-900/40 text-red-300',
  'Revision Needed': 'bg-orange-900/40 text-orange-300',
  'Not Needed':      'bg-slate-700 text-slate-400',
};

export const ASSET_STATUS_COLORS = {
  'Draft':             'bg-slate-700 text-slate-400',
  'Ready for Review':  'bg-violet-900/40 text-violet-300',
  'Approved Asset':    'bg-emerald-900/40 text-emerald-300',
  'Rejected Asset':    'bg-red-900/40 text-red-300',
  'Needs Revision':    'bg-orange-900/40 text-orange-300',
  'Archived':          'bg-slate-800 text-slate-500',
};

export function CQStatusBadge({ status }) {
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${QUEUE_STATUS_COLORS[status] || 'bg-slate-700 text-slate-400'}`}>{status || 'Backlog'}</span>;
}

export function CQApprovalBadge({ status }) {
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${APPROVAL_STATUS_COLORS[status] || 'bg-slate-700 text-slate-400'}`}>{status || 'Pending'}</span>;
}

export function CQAssetBadge({ status }) {
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ASSET_STATUS_COLORS[status] || 'bg-slate-700 text-slate-400'}`}>{status || 'Draft'}</span>;
}