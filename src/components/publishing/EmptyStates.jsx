import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, FileText, Zap, AlertCircle } from 'lucide-react';

export const NoReviewsEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
      <CheckCircle2 className="w-6 h-6 text-blue-600" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Videos Awaiting Review</h3>
    <p className="text-sm text-slate-600 mb-4 max-w-xs">
      All submitted videos have been reviewed. Upload new content to keep the pipeline active.
    </p>
    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
      <Zap className="w-4 h-4" />
      Upload Video
    </Button>
  </div>
);

export const NoFailuresEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
      <CheckCircle2 className="w-6 h-6 text-green-600" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">All Systems Operational</h3>
    <p className="text-sm text-slate-600 mb-4 max-w-xs">
      No failed jobs or connection issues detected. Your publishing pipeline is healthy.
    </p>
  </div>
);

export const NoScheduledEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
      <FileText className="w-6 h-6 text-amber-600" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Scheduled Posts</h3>
    <p className="text-sm text-slate-600 mb-4 max-w-xs">
      Schedule approved videos to distribute them across channels on your preferred dates and times.
    </p>
  </div>
);

export const NoPublishingEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
      <Zap className="w-6 h-6 text-purple-600" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Active Publishing Jobs</h3>
    <p className="text-sm text-slate-600 mb-4 max-w-xs">
      Publishing jobs will appear here as videos are queued for distribution to channels.
    </p>
  </div>
);

export const NoPipelineItemsEmptyState = ({ stage = 'processing' }) => (
  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
      <AlertCircle className="w-5 h-5 text-slate-400" />
    </div>
    <p className="text-sm text-slate-600">No items in {stage}</p>
  </div>
);