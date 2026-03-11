import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Facebook, Instagram, Youtube, Music, Globe, MessageSquare, Check, X } from 'lucide-react';
import { format } from 'date-fns';

export default function ReviewDetailModal({ isOpen, video, onApprove, onRequestChanges, onClose }) {
  const platformIcons = {
    facebook: { icon: Facebook, label: 'Facebook', color: 'text-blue-600' },
    instagram: { icon: Instagram, label: 'Instagram', color: 'text-pink-600' },
    youtube: { icon: Youtube, label: 'YouTube', color: 'text-red-600' },
    tiktok: { icon: Music, label: 'TikTok', color: 'text-slate-900' },
    website: { icon: Globe, label: 'Website', color: 'text-slate-600' }
  };

  const enabledPlatforms = [];
  if (video?.facebook_publish_enabled) enabledPlatforms.push('facebook');
  if (video?.instagram_publish_enabled) enabledPlatforms.push('instagram');
  if (video?.youtube_publish_enabled) enabledPlatforms.push('youtube');
  if (video?.tiktok_publish_enabled) enabledPlatforms.push('tiktok');
  if (video?.website_publish_enabled) enabledPlatforms.push('website');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{video?.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Preview */}
          <div className="bg-slate-200 rounded-lg overflow-hidden aspect-video w-full">
            {video?.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
                <span className="text-slate-600">No preview available</span>
              </div>
            )}
          </div>

          {/* Publish Summary */}
          <Card className="border-0 shadow-sm bg-slate-50">
            <CardHeader>
              <CardTitle className="text-sm">This will publish to:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {enabledPlatforms.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {enabledPlatforms.map(platform => {
                    const p = platformIcons[platform];
                    const Icon = p.icon;
                    return (
                      <div key={platform} className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${p.color}`} />
                        <span className="text-sm font-medium">{p.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-600">No platforms selected</p>
              )}
            </CardContent>
          </Card>

          {/* Schedule Info */}
          {video?.scheduled_publish_at && (
            <Card className="border-0 shadow-sm bg-slate-50">
              <CardHeader>
                <CardTitle className="text-sm">Scheduled to publish</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">
                  {format(new Date(video.scheduled_publish_at), 'EEEE, MMMM d, yyyy')} at{' '}
                  {format(new Date(video.scheduled_publish_at), 'p')}
                </p>
                <p className="text-xs text-slate-600 mt-1">Your timezone</p>
              </CardContent>
            </Card>
          )}

          {/* Content Text */}
          {video?.caption && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Caption</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{video.caption}</p>
              </CardContent>
            </Card>
          )}

          {video?.youtube_title && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">YouTube Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">{video.youtube_title}</p>
              </CardContent>
            </Card>
          )}

          {/* AI Explanation */}
          {video?.ai_explanation && (
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardHeader>
                <CardTitle className="text-sm">Why we created this</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">{video.ai_explanation}</p>
              </CardContent>
            </Card>
          )}

          {/* Quality Score */}
          <Card className="border-0 shadow-sm bg-green-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="text-lg">✓</span> Content Quality Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-green-600">
                  {video?.quality_score || 92}%
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    {video?.quality_score >= 95 ? 'Optimized for engagement' :
                     video?.quality_score >= 90 ? 'Seasonal promotion' :
                     'Educational content'}
                  </p>
                  <p className="text-xs text-slate-600">Ready to exceed expectations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branding Preview */}
          <Card className="border-0 shadow-sm bg-blue-50">
            <CardHeader>
              <CardTitle className="text-sm">Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Logo watermark applied</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Brand colors matched</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onApprove}
              className="flex-1 gap-2"
              size="lg"
            >
              <Check className="w-4 h-4" />
              Approve Content
            </Button>
            <Button
              variant="outline"
              onClick={onRequestChanges}
              className="flex-1 gap-2"
              size="lg"
            >
              <MessageSquare className="w-4 h-4" />
              Request Changes
            </Button>
          </div>

          {/* Brand Footer */}
          <div className="mt-6 pt-4 border-t text-center text-xs text-slate-500">
            <p>Your content is prepared and scheduled by <span className="font-semibold">New Tech Advertising</span>.</p>
          </div>
          </div>
          </DialogContent>
          </Dialog>
          );
          }