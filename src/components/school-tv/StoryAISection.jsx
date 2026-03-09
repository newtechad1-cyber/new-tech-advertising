import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import AIIntegrationPanel from './AIIntegrationPanel';
import AIHistoryPanel from './AIHistoryPanel';
import SubmissionAIDraftPanel from './SubmissionAIDraftPanel';
import {
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export default function StoryAISection({ 
  story,
  schoolSlug,
  submissionId,
  aiJobs = [],
  onStoryUpdate,
}) {
  const [loading, setLoading] = useState(false);
  const [showDraft, setShowDraft] = useState(!!story.ai_draft_text);

  const handleGenerateFromSubmission = async () => {
    if (!submissionId) return;
    
    setLoading(true);
    try {
      // Call backend to generate AI content from submission
      const response = await base44.functions.invoke('generateSchoolStoryContent', {
        submission_id: submissionId,
        school_slug: schoolSlug,
      });

      if (response.data.success) {
        setShowDraft(true);
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!story.ai_draft_text) return;

    setLoading(true);
    try {
      // Update story with AI draft
      await base44.functions.invoke('saveAIOutputToStory', {
        ai_job_id: story.ai_job_id,
        ai_output_id: story.ai_output_id,
        school_slug: schoolSlug,
        submission_id: submissionId,
      });

      onStoryUpdate?.({
        ...story,
        ai_approval_status: 'pending_review',
      });
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI History */}
      {aiJobs.length > 0 && (
        <AIHistoryPanel aiJobs={aiJobs} />
      )}

      {/* AI Draft Integration */}
      {showDraft && story.ai_draft_text ? (
        <AIIntegrationPanel
          entityType="story"
          aiDraft={{
            title: story.ai_draft_title,
            body: story.ai_draft_text,
            status: story.ai_approval_status || 'pending_review',
          }}
          onSave={handleSaveDraft}
          onReject={() => setShowDraft(false)}
          loading={loading}
        />
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Generate AI Story
              </h4>
              <p className="text-sm text-gray-700 mt-1">
                Use AI to create a story draft from this submission
              </p>
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleGenerateFromSubmission}
              disabled={loading || !submissionId}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Story
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}