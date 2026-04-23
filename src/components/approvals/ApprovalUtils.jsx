import React from 'react';

export const STATUS_COLORS = {
  'Draft':                    'bg-slate-700 text-slate-400',
  'Pending Internal Review':  'bg-amber-900/50 text-amber-300',
  'Pending Client Review':    'bg-blue-900/50 text-blue-300',
  'Approved':                 'bg-emerald-900/50 text-emerald-300',
  'Rejected':                 'bg-red-900/50 text-red-300',
  'Revision Requested':       'bg-orange-900/50 text-orange-300',
  'Expired':                  'bg-slate-800 text-slate-500',
  'Cancelled':                'bg-slate-800 text-slate-600',
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[status] || 'bg-slate-700 text-slate-400'}`}>
      {status || 'Draft'}
    </span>
  );
}

export function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

export function generateToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(20))).map(b => b.toString(16).padStart(2, '0')).join('');
}