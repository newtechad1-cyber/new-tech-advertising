import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AIStatusBadge from './AIStatusBadge';
import {
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function AIIntegrationPanel({ 
  entityType, // 'story', 'project', 'yearbook'
  aiDraft,
  onSave,
  onReject,
  loading = false,
}) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!aiDraft) {
    return null;
  }

  const getTitle = () => {
    if (entityType === 'story') return 'AI-Generated Story Ready';
    if (entityType === 'project') return 'AI-Generated Content Ready';
    if (entityType === 'yearbook') return 'AI-Generated Yearbook Content Ready';
    return 'AI-Generated Content Ready';
  };

  const getDescription = () => {
    if (entityType === 'story') return 'This AI draft can be saved to your Story Library';
    if (entityType === 'project') return 'This AI content can be used in your video project';
    if (entityType === 'yearbook') return 'This AI content can be added to your yearbook page';
    return 'Ready to use in your content';
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex-shrink-0">
            <Sparkles className="h-6 w-6 text-purple-600 mt-1" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              {getTitle()}
              <AIStatusBadge status={aiDraft.status} size="sm" />
            </h4>
            <p className="text-sm text-gray-700 mt-1">{getDescription()}</p>

            {/* Preview */}
            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
              {aiDraft.title && (
                <p className="font-semibold text-gray-900 mb-2">{aiDraft.title}</p>
              )}
              <p className="text-sm text-gray-700 line-clamp-3">{aiDraft.body || aiDraft.preview}</p>
            </div>

            {/* Info */}
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-3 rounded text-sm text-blue-900">
              <p className="font-semibold mb-1">💡 This is a draft</p>
              <p>Review the content carefully. You can edit it after saving.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 flex-shrink-0 ml-4">
          <Button
            className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
            onClick={handleSave}
            disabled={loading || saved}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved!
              </>
            ) : loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="text-red-600 whitespace-nowrap"
            onClick={onReject}
            disabled={loading}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}