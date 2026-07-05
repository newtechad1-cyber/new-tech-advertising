/**
 * P-001 Publishing Engine — Workflow Bar
 * Visual workflow stepper + action buttons for state transitions.
 * Shows: Draft → Review → Approved → Queued → Published
 */
import React from 'react';
import * as LucideIcons from 'lucide-react';
import {
  ArrowRight, Archive, Eye, CheckCircle, Clock, Send, AlertTriangle
} from 'lucide-react';
import { WORKFLOW_STATES, WORKFLOW_ORDER, STATUS_COLORS } from './publishingData';

function WorkflowStep({ state, isActive, isCompleted, isLast }) {
  const ws = WORKFLOW_STATES[state];
  const c = STATUS_COLORS[ws.color];
  const Icon = LucideIcons[ws.icon] || LucideIcons.Circle;

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isCompleted
            ? 'bg-green-500 text-white'
            : isActive
              ? `${c.solid} text-white ring-2 ring-offset-2 ring-offset-slate-950 ring-${ws.color}-400/50`
              : 'bg-slate-800 text-slate-600'
        }`}>
          {isCompleted ? (
            <LucideIcons.Check className="w-4 h-4" />
          ) : (
            <Icon className="w-4 h-4" />
          )}
        </div>
        <span className={`text-[10px] font-semibold ${
          isCompleted ? 'text-green-400' : isActive ? c.text : 'text-slate-600'
        }`}>
          {ws.label}
        </span>
      </div>
      {!isLast && (
        <div className={`flex-1 h-0.5 rounded-full mt-4 mx-1 ${
          isCompleted ? 'bg-green-500' : 'bg-slate-800'
        }`} />
      )}
    </>
  );
}

export default function WorkflowBar({ article, onStatusChange, saving }) {
  const currentStatus = article?.status || 'Draft';
  const currentIdx = WORKFLOW_ORDER.indexOf(currentStatus);
  const isArchived = currentStatus === 'Archived';

  const ws = WORKFLOW_STATES[currentStatus];
  const c = STATUS_COLORS[ws?.color || 'slate'];

  // Determine available actions
  const actions = [];

  if (currentStatus === 'Draft') {
    actions.push({ label: 'Submit for Review', status: 'Review', icon: 'Eye', color: 'amber' });
  }
  if (currentStatus === 'Review') {
    actions.push({ label: 'Approve', status: 'Approved', icon: 'CheckCircle', color: 'blue' });
    actions.push({ label: 'Return to Draft', status: 'Draft', icon: 'FileEdit', color: 'slate' });
  }
  if (currentStatus === 'Approved') {
    actions.push({ label: 'Queue for Publishing', status: 'Queued', icon: 'Clock', color: 'purple' });
    actions.push({ label: 'Return to Draft', status: 'Draft', icon: 'FileEdit', color: 'slate' });
  }
  if (currentStatus === 'Queued') {
    actions.push({ label: 'Mark Published', status: 'Published', icon: 'Send', color: 'green' });
    actions.push({ label: 'Return to Approved', status: 'Approved', icon: 'CheckCircle', color: 'blue' });
  }
  if (currentStatus !== 'Archived') {
    actions.push({ label: 'Archive', status: 'Archived', icon: 'Archive', color: 'slate' });
  }
  if (currentStatus === 'Archived') {
    actions.push({ label: 'Restore to Draft', status: 'Draft', icon: 'FileEdit', color: 'blue' });
  }

  return (
    <div className="space-y-4">
      {/* Stepper */}
      <div className={`p-4 rounded-xl ${c.bg} border ${c.border}`}>
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-0 flex-1">
            {WORKFLOW_ORDER.map((state, i) => (
              <WorkflowStep
                key={state}
                state={state}
                isActive={state === currentStatus}
                isCompleted={!isArchived && i < currentIdx}
                isLast={i === WORKFLOW_ORDER.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Current status description */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${c.dot}`} />
          <p className="text-xs text-slate-400">
            <span className={`font-semibold ${c.text}`}>{ws?.label}:</span> {ws?.description}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {actions.map((action, i) => {
          const Icon = LucideIcons[action.icon] || LucideIcons.ArrowRight;
          const ac = STATUS_COLORS[action.color] || STATUS_COLORS.blue;
          const isPrimary = i === 0 && action.color !== 'slate';

          return (
            <button
              key={action.status}
              onClick={() => onStatusChange(action.status)}
              disabled={saving}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                isPrimary
                  ? `${ac.solid} text-white hover:brightness-110`
                  : `${ac.bg} border ${ac.border} ${ac.text} hover:brightness-110`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
