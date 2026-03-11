import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Check, Clock, X, MessageSquare } from 'lucide-react';

export default function ApprovalQueuePanel({ videos, isLoading }) {
  const [expandedId, setExpandedId] = useState(null);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500 py-8">Loading approval queue...</div>
      </Card>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Eye className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No videos awaiting review</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">Awaiting Review ({videos.length})</h2>
        <Badge variant="destructive">{videos.length}</Badge>
      </div>

      {videos.map(video => (
        <Card key={video.id} className="hover:shadow-md transition-shadow">
          <div className="p-4">
            {/* Header Row */}
            <div className="flex gap-4">
              {/* Thumbnail */}
              {video.thumbnail_url && (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{video.title}</h3>
                  <Badge variant="outline">{video.request_type}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Company:</span>
                    <p className="font-medium text-gray-900">{video.brand_name || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Captions:</span>
                    <p className="font-medium text-gray-900">{video.caption_style || 'Not Set'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Branding:</span>
                    <p className="font-medium text-gray-900">{video.branding_status || 'pending'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Render:</span>
                    <p className="font-medium text-gray-900">{video.render_status || 'pending'}</p>
                  </div>
                </div>

                {/* Destinations */}
                <div className="text-sm mb-3">
                  <span className="text-gray-600">Publishing to: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {video.facebook_publish_enabled && (
                      <Badge className="bg-blue-100 text-blue-800">Facebook</Badge>
                    )}
                    {video.instagram_publish_enabled && (
                      <Badge className="bg-pink-100 text-pink-800">Instagram</Badge>
                    )}
                    {video.youtube_publish_enabled && (
                      <Badge className="bg-red-100 text-red-800">YouTube</Badge>
                    )}
                    {video.tiktok_publish_enabled && (
                      <Badge className="bg-black text-white">TikTok</Badge>
                    )}
                    {video.website_publish_enabled && (
                      <Badge className="bg-green-100 text-green-800">Website</Badge>
                    )}
                    {video.gbp_publish_enabled && (
                      <Badge className="bg-yellow-100 text-yellow-800">GBP</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                  onClick={() => console.log('Approve & Publish', video.id)}
                >
                  <Check className="w-4 h-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() => console.log('Schedule', video.id)}
                >
                  <Clock className="w-4 h-4" />
                  Schedule
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1 text-red-600 hover:bg-red-50"
                  onClick={() => console.log('Reject', video.id)}
                >
                  <X className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            </div>

            {/* Review Notes */}
            {video.review_notes && (
              <div className="mt-3 p-3 bg-amber-50 rounded border border-amber-200 text-sm">
                <div className="flex gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-900">{video.review_notes}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}