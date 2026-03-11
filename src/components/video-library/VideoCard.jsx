import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Play, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MoreVertical,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { getVideoIssues, formatDate } from '@/components/video-library/videoLibraryUtils';
import WorkflowProgressBar from '@/components/video-library/WorkflowProgressBar';
import ChannelDistributionSummary from '@/components/video-library/ChannelDistributionSummary';
import NextBestAction from '@/components/video-library/NextBestAction';

const STATUS_COLORS = {
  uploaded: 'bg-slate-100 text-slate-700',
  processing: 'bg-blue-100 text-blue-700',
  ready_for_review: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rendering: 'bg-purple-100 text-purple-700',
  published: 'bg-emerald-100 text-emerald-700',
};

const APPROVAL_COLORS = {
  pending: 'bg-amber-50 border border-amber-200',
  approved: 'bg-green-50 border border-green-200',
  rejected: 'bg-red-50 border border-red-200',
};

export default function VideoCard({ video, publishJobs }) {
  const issues = getVideoIssues(video, publishJobs);
  const videoJobs = publishJobs.filter(j => j.video_id === video.id) || [];
  const hasFailedJob = videoJobs.some(j => j.job_status === 'failed');

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center overflow-hidden group/thumb">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Play className="w-8 h-8" />
            <span className="text-xs">No preview</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[video.processing_status] || STATUS_COLORS.uploaded}`}>
          {video.processing_status?.replace(/_/g, ' ')}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div>
          <h3 className="font-semibold text-slate-900 line-clamp-2">{video.title}</h3>
          <p className="text-xs text-slate-500 mt-1">{video.brand_name}</p>
        </div>

        {/* Issues */}
        {issues.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {issues.map((issue, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-red-50 text-red-700 rounded border border-red-200">
                <AlertTriangle className="w-3 h-3" />
                {issue}
              </span>
            ))}
          </div>
        )}

        {/* Approval Status */}
        {video.approval_status && (
          <div className={`text-xs font-medium px-2 py-1 rounded ${APPROVAL_COLORS[video.approval_status] || ''}`}>
            {video.approval_status === 'pending' && '⏱️ Awaiting Review'}
            {video.approval_status === 'approved' && '✓ Approved'}
            {video.approval_status === 'rejected' && '✗ Rejected'}
          </div>
        )}

        {/* Meta */}
        <div className="text-xs text-slate-500 space-y-1">
          {video.duration && <p>Duration: {video.duration}s</p>}
          <p>Created: {formatDate(video.created_date)}</p>
          {video.scheduled_publish_at && (
            <p className="flex items-center gap-1 text-blue-600">
              <Clock className="w-3 h-3" />
              Scheduled: {formatDate(video.scheduled_publish_at)}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
        <Link to={createPageUrl(`AdminVideoDetail?id=${video.id}`)}>
          <Button size="sm" variant="default" className="w-full gap-2">
            <ExternalLink className="w-4 h-4" />
            Open Workspace
          </Button>
        </Link>
        <div className="flex gap-2">
          {video.approval_status !== 'approved' && (
            <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => console.log('Approve:', video.id)}>
              Approve
            </Button>
          )}
          {!hasFailedJob && (
            <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => console.log('Schedule:', video.id)}>
              Schedule
            </Button>
          )}
          {hasFailedJob && (
            <Button size="sm" variant="outline" className="flex-1 text-xs border-red-200 text-red-700" onClick={() => console.log('Retry:', video.id)}>
              Retry
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="px-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Publish Website Only</DropdownMenuItem>
              <DropdownMenuItem>Generate Captions</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}