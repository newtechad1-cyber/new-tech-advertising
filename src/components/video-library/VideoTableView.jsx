import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { formatDate } from '@/components/video-library/videoLibraryUtils';

const STATUS_BADGE = {
  uploaded: 'bg-slate-100 text-slate-700',
  processing: 'bg-blue-100 text-blue-700',
  ready_for_review: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  published: 'bg-emerald-100 text-emerald-700',
};

export default function VideoTableView({
  videos,
  publishJobs,
  selectedVideos,
  onSelectVideo,
  onSelectAll,
}) {
  const allSelected = videos.length > 0 && videos.every(v => selectedVideos.has(v.id));

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => onSelectAll(checked)}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Company</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Approval</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Render</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Scheduled</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Published</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {videos.map(video => {
              const videoJobs = publishJobs.filter(j => j.video_id === video.id) || [];
              const hasFailedJob = videoJobs.some(j => j.job_status === 'failed');
              
              return (
                <tr key={video.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedVideos.has(video.id)}
                      onCheckedChange={(checked) => onSelectVideo(video.id, checked)}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 max-w-xs truncate">
                    {video.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{video.brand_name || '—'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${STATUS_BADGE[video.processing_status] || STATUS_BADGE.uploaded}`}>
                      {video.processing_status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {video.approval_status === 'approved' ? (
                      <span className="flex items-center gap-1 text-green-700">
                        <CheckCircle2 className="w-4 h-4" />
                        Approved
                      </span>
                    ) : video.approval_status === 'rejected' ? (
                      <span className="text-red-700">Rejected</span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-700">
                        <Clock className="w-4 h-4" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {video.render_status === 'completed' ? (
                      <span className="text-green-700">✓ Complete</span>
                    ) : video.render_status === 'failed' ? (
                      <span className="flex items-center gap-1 text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        Failed
                      </span>
                    ) : (
                      <span className="text-slate-600">{video.render_status || 'pending'}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {video.scheduled_publish_at ? formatDate(video.scheduled_publish_at) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {video.published_at ? formatDate(video.published_at) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <Link to={createPageUrl(`AdminVideoDetail?id=${video.id}`)}>
                        <Button size="sm" variant="ghost" className="text-xs">
                          Open
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="px-2">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {video.approval_status !== 'approved' && <DropdownMenuItem>Approve</DropdownMenuItem>}
                          {!hasFailedJob && <DropdownMenuItem>Schedule</DropdownMenuItem>}
                          {hasFailedJob && <DropdownMenuItem className="text-red-700">Retry Failed</DropdownMenuItem>}
                          <DropdownMenuItem>Publish Website</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}