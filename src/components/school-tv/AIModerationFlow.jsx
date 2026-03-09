import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AIStatusBadge from './AIStatusBadge';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit,
  Copy,
  MessageSquare,
} from 'lucide-react';

export default function AIModerationFlow({ job, content, onApprove, onReject, onEdit }) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [action, setAction] = useState(null);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-gray-900">{job.job_type.replace(/_/g, ' ')}</h4>
            <p className="text-sm text-gray-600 mt-1">Source: {job.source}</p>
          </div>
          <AIStatusBadge status={job.moderation_status} showDescription={true} />
        </div>
      </div>

      {/* Content Preview */}
      <div className="p-6 border-b border-gray-200">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-gray-200">
          {content.title && (
            <div className="mb-4">
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">
                Title
              </p>
              <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
            </div>
          )}

          {content.body && (
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">
                Content
              </p>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {content.body}
              </p>
            </div>
          )}

          {Array.isArray(content.options) && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">
                Options
              </p>
              {content.options.map((option, idx) => (
                <p key={idx} className="text-gray-800 p-2 bg-white/50 rounded border border-gray-300">
                  {idx + 1}. {option}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="px-6 py-4 bg-green-50 border-b border-gray-200">
        <p className="text-sm font-semibold text-green-900 mb-3">AI Compliance Checks</p>
        <div className="space-y-2">
          {[
            'School-safe and appropriate for all ages',
            'Community-focused tone',
            'No exaggeration or unsupported claims',
            'Positive and inclusive language',
            'Suitable for parent and community viewing',
          ].map((check, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm text-green-900">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              {check}
            </div>
          ))}
        </div>
      </div>

      {/* Action Section */}
      <div className="p-6 space-y-4">
        {action === null ? (
          <>
            <p className="text-sm text-gray-700 font-semibold">What would you like to do?</p>
            <div className="grid md:grid-cols-3 gap-3">
              <Button
                className="h-12 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                onClick={() => setAction('approve')}
              >
                <CheckCircle2 className="h-5 w-5" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="h-12 flex items-center justify-center gap-2"
                onClick={() => setAction('edit')}
              >
                <Edit className="h-5 w-5" />
                Edit First
              </Button>
              <Button
                variant="outline"
                className="h-12 text-red-600 flex items-center justify-center gap-2"
                onClick={() => setAction('reject')}
              >
                <XCircle className="h-5 w-5" />
                Reject
              </Button>
            </div>
          </>
        ) : action === 'approve' ? (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Ready to approve</p>
                <p className="text-sm text-green-800 mt-1">
                  This content will be marked as approved and available for use in stories and projects.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setAction(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  onApprove();
                  setAction(null);
                }}
              >
                Confirm Approval
              </Button>
            </div>
          </div>
        ) : action === 'reject' ? (
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">Reject this content</p>
                  <p className="text-sm text-red-800 mt-1">
                    Please let the team know why you're rejecting this. You can regenerate the content afterward.
                  </p>
                </div>
              </div>
            </div>
            <textarea
              placeholder="Why are you rejecting this content? What needs to change?"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setAction(null)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  onReject(notes);
                  setAction(null);
                }}
              >
                Reject
              </Button>
            </div>
          </div>
        ) : action === 'edit' ? (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Edit className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900">Edit before approving</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Open the editor to make changes to this content.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setAction(null)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  onEdit();
                  setAction(null);
                }}
              >
                Open Editor
              </Button>
            </div>
          </div>
        ) : null}

        {/* Additional Actions */}
        {action === null && (
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button variant="ghost" size="sm" className="text-blue-600">
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              Add Note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}