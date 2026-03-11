import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function WebsiteFirstCard({ video, websiteStory, onPublish, onRetry, isPublishing = false }) {
  const [showDetails, setShowDetails] = useState(false);

  const isPublished = websiteStory?.publish_status === 'published';
  const publicUrl = websiteStory?.public_url;

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Globe className="w-5 h-5 text-blue-600" />
          Website Story
          {isPublished && <span className="text-xs font-normal bg-green-100 text-green-700 px-2 py-1 rounded-full">Published</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Summary */}
        <div className="space-y-2">
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">Status:</span>{' '}
            {websiteStory ? (
              <span className="text-blue-600 font-medium">{websiteStory.publish_status || 'draft'}</span>
            ) : (
              <span className="text-slate-600">Not created yet</span>
            )}
          </p>

          {websiteStory?.title && (
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">Title:</span>{' '}
              <span className="text-slate-700">{websiteStory.title}</span>
            </p>
          )}

          {isPublished && publicUrl && (
            <div className="p-2 bg-green-100 rounded border border-green-300">
              <p className="text-xs text-green-900 font-medium mb-1">Live on website:</p>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-700 break-all flex items-center gap-1">
                {publicUrl}
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2 border-t">
          {isPublished ? (
            <>
              <Button
                disabled={isPublishing}
                className="w-full gap-2 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                {isPublishing && <Loader2 className="w-4 h-4 animate-spin" />}
                <ExternalLink className="w-4 h-4" />
                View Website Story
              </Button>
              <Button
                onClick={onRetry}
                disabled={isPublishing}
                variant="outline"
                size="sm"
                className="w-full gap-2"
              >
                {isPublishing && <Loader2 className="w-4 h-4 animate-spin" />}
                <RefreshCw className="w-4 h-4" />
                Update
              </Button>
            </>
          ) : (
            <Button
              onClick={onPublish}
              disabled={isPublishing || !video.website_title}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              {isPublishing && <Loader2 className="w-4 h-4 animate-spin" />}
              <Globe className="w-4 h-4" />
              Publish to Website
            </Button>
          )}
        </div>

        {/* Details Toggle */}
        {websiteStory && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {showDetails ? 'Hide details' : 'Show details'}
          </button>
        )}

        {/* Expanded Details */}
        {showDetails && websiteStory && (
          <div className="space-y-2 border-t pt-3">
            {websiteStory.summary && (
              <div>
                <p className="text-xs font-medium text-slate-600">Summary</p>
                <p className="text-xs text-slate-700 line-clamp-2">{websiteStory.summary}</p>
              </div>
            )}
            {websiteStory.seo_title && (
              <div>
                <p className="text-xs font-medium text-slate-600">SEO Title</p>
                <p className="text-xs text-slate-700">{websiteStory.seo_title}</p>
              </div>
            )}
            {websiteStory.published_at && (
              <div>
                <p className="text-xs font-medium text-slate-600">Published</p>
                <p className="text-xs text-slate-700">{new Date(websiteStory.published_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}