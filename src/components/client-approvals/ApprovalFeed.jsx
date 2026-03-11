import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ApprovalCard from './ApprovalCard';

export default function ApprovalFeed({ videos, onViewDetails, onApprove, onRejectSwipe, onApproveAll }) {
  if (videos.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-16 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">You're all caught up</h3>
          <p className="text-slate-600 mb-6">
            We'll notify you when new content is ready for your review.
          </p>
          <Button variant="outline">View Content Calendar</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Pending Approval ({videos.length})
        </h2>
        {videos.length > 1 && (
          <Button
            size="sm"
            variant="outline"
            onClick={onApproveAll}
            className="gap-2"
          >
            ✓ Approve All Ready Items
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {videos.map(video => (
          <ApprovalCard
            key={video.id}
            video={video}
            onViewDetails={onViewDetails}
            onApprove={onApprove}
            onRejectSwipe={onRejectSwipe}
          />
        ))}
      </div>
    </div>
  );
}