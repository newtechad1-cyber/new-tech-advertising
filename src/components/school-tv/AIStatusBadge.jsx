import React from 'react';
import {
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit,
} from 'lucide-react';

const statusConfig = {
  queued: {
    icon: Clock,
    color: 'bg-slate-100 text-slate-800 border-slate-300',
    label: 'Queued',
    description: 'Waiting to be processed',
  },
  processing: {
    icon: Zap,
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    label: 'Processing',
    description: 'AI is generating content',
  },
  completed: {
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-800 border-green-300',
    label: 'Completed',
    description: 'Ready for review',
  },
  failed: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-300',
    label: 'Failed',
    description: 'Error during generation',
  },
  pending_review: {
    icon: AlertCircle,
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    label: 'Pending Review',
    description: 'Awaiting staff approval',
  },
  approved: {
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-800 border-green-300',
    label: 'Approved',
    description: 'Staff approved this output',
  },
  rejected: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-300',
    label: 'Rejected',
    description: 'Staff rejected this output',
  },
  edited: {
    icon: Edit,
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    label: 'Edited',
    description: 'Staff made edits',
  },
};

export default function AIStatusBadge({ status, size = 'md', showDescription = false }) {
  const config = statusConfig[status] || statusConfig.queued;
  const Icon = config.icon;

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${config.color}`}>
      <Icon className="h-5 w-5" />
      <div>
        <p className="font-semibold text-sm">{config.label}</p>
        {showDescription && <p className="text-xs opacity-75">{config.description}</p>}
      </div>
    </div>
  );
}