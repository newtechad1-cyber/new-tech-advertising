import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AIStatusBadge from './AIStatusBadge';
import {
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  Copy,
} from 'lucide-react';

export default function AIHistoryPanel({ aiJobs = [], aiOutputs = [] }) {
  const [expanded, setExpanded] = useState(false);

  if (!aiJobs || aiJobs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-gray-700" />
          <div className="text-left">
            <p className="font-semibold text-gray-900">AI Generation History</p>
            <p className="text-xs text-gray-600 mt-0.5">{aiJobs.length} AI operations</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-700" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-700" />
        )}
      </button>

      {/* Timeline */}
      {expanded && (
        <div className="p-6 space-y-4">
          {aiJobs.map((job, idx) => (
            <div key={job.id || idx} className="flex gap-4">
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-purple-600 mt-1.5" />
                {idx < aiJobs.length - 1 && (
                  <div className="h-8 w-0.5 bg-gray-300 my-1" />
                )}
              </div>

              {/* Job details */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {job.job_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {job.created_at || job.created || 'Recently'}
                    </p>
                  </div>
                  <AIStatusBadge status={job.status} size="sm" />
                </div>

                {/* Content preview */}
                {job.output_text && (
                  <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-200 mt-2 line-clamp-2">
                    "{job.output_text.substring(0, 100)}..."
                  </p>
                )}

                {/* Actions */}
                {job.status === 'completed' && (
                  <div className="flex gap-2 mt-3">
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}