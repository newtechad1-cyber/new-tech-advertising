import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';

export default function NextBestAction({ video, publishJobs, onAction }) {
  const determineNextAction = () => {
    if (!video?.source_file_url) return { action: 'upload', label: 'Upload video file', icon: 'upload' };
    if (video?.transcript_status !== 'completed') return { action: 'transcript', label: 'Generate captions', icon: 'captions' };
    if (video?.branding_status !== 'applied') return { action: 'branding', label: 'Complete branding', icon: 'branding' };
    if (video?.render_status !== 'completed') return { action: 'render', label: 'Create render', icon: 'render' };
    if (video?.review_status !== 'approved') return { action: 'approval', label: 'Approve video', icon: 'approval' };
    if (video?.export_landscape && !publishJobs?.find(j => j.destination_type === 'website' && j.job_status === 'published')) {
      return { action: 'publish_website', label: 'Publish to website', icon: 'publish' };
    }
    return { action: 'distribute', label: 'Distribute to channels', icon: 'distribute' };
  };

  const next = determineNextAction();

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-amber-900">Next Best Action</p>
            <p className="text-sm text-amber-800">{next.label}</p>
          </div>
        </div>
        <Button 
          onClick={() => onAction?.(next.action)}
          size="sm"
          variant="outline"
          className="flex-shrink-0 gap-1 border-amber-300 text-amber-700 hover:bg-amber-100"
        >
          <span className="hidden sm:inline">Go</span>
          <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}