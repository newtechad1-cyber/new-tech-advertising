import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Plus, Eye, RotateCcw, Settings } from 'lucide-react';

export default function EnhancedWebsitePublishingPanel({ stats = {} }) {
  const {
    publishedCount = 0,
    draftCount = 0,
    scheduledCount = 0,
    failedCount = 0,
  } = stats;

  const totalStories = publishedCount + draftCount + scheduledCount + failedCount;

  return (
    <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100">
              <Globe className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <CardTitle className="text-lg">Website Publishing</CardTitle>
              <p className="text-xs text-slate-600 mt-1">Most reliable destination — highest trust</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800">Primary Channel</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-lg border border-slate-200 p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
            <p className="text-xs text-slate-600 mt-1">Published</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{scheduledCount}</div>
            <p className="text-xs text-slate-600 mt-1">Scheduled</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{draftCount}</div>
            <p className="text-xs text-slate-600 mt-1">Drafts</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <p className="text-xs text-slate-600 mt-1">Failed</p>
          </div>
        </div>

        {/* Progress Bar */}
        {totalStories > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Publishing Progress</span>
              <span>{publishedCount}/{totalStories}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all"
                style={{ width: `${(publishedCount / totalStories) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs"
          >
            <Plus className="w-3 h-3" />
            New Story
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs"
          >
            <Eye className="w-3 h-3" />
            View Published
          </Button>
          {failedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs col-span-2 text-red-600 hover:text-red-700 border-red-200"
            >
              <RotateCcw className="w-3 h-3" />
              Retry {failedCount} Failed
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Pro Tip:</strong> Website stories build authority and drive organic search traffic. 
            Prioritize website publishing for SEO impact.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}