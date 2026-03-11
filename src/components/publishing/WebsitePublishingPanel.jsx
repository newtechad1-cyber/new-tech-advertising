import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Plus, RefreshCw, Eye } from 'lucide-react';

export default function WebsitePublishingPanel({ stories, drafts, scheduled, failedCount }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">Website Publishing</h2>
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1">
            <Plus className="w-4 h-4" />
            New Story
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="px-6 py-4 grid grid-cols-4 gap-3 border-b">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stories || 0}</div>
          <div className="text-xs text-gray-600 mt-0.5">Published</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{drafts || 0}</div>
          <div className="text-xs text-gray-600 mt-0.5">Drafts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">{scheduled || 0}</div>
          <div className="text-xs text-gray-600 mt-0.5">Scheduled</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{failedCount || 0}</div>
          <div className="text-xs text-gray-600 mt-0.5">Failed</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-4 flex gap-2 flex-wrap border-b">
        <Button size="sm" variant="outline" className="gap-1">
          <Eye className="w-4 h-4" />
          View Published
        </Button>
        <Button size="sm" variant="outline" className="gap-1">
          <RefreshCw className="w-4 h-4" />
          Retry Failed
        </Button>
        <Button size="sm" variant="outline" className="gap-1">
          <Globe className="w-4 h-4" />
          Manage Stories
        </Button>
      </div>
    </div>
  );
}