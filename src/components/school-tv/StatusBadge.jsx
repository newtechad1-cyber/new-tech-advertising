const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  archived: 'bg-slate-200 text-slate-500',
  assigned_to_project: 'bg-purple-100 text-purple-700',
  processing: 'bg-cyan-100 text-cyan-800',
  draft: 'bg-slate-200 text-slate-600',
  collecting_assets: 'bg-yellow-100 text-yellow-700',
  ready_for_ai: 'bg-indigo-100 text-indigo-700',
  script_generated: 'bg-blue-100 text-blue-700',
  queued_for_render: 'bg-orange-100 text-orange-700',
  rendering: 'bg-purple-100 text-purple-700',
  review_ready: 'bg-cyan-100 text-cyan-800',
  published: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  queued: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-slate-200 text-slate-500',
  not_ready: 'bg-slate-200 text-slate-500',
};

export default function StatusBadge({ status, size = 'sm' }) {
  const style = STATUS_STYLES[status] || 'bg-slate-100 text-slate-600';
  const label = status?.replace(/_/g, ' ') || '—';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold capitalize ${size === 'xs' ? 'text-xs' : 'text-xs'} ${style}`}>
      {label}
    </span>
  );
}