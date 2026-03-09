import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import AIIntegrationPanel from './AIIntegrationPanel';
import AIHistoryPanel from './AIHistoryPanel';
import {
  Sparkles,
  Loader2,
} from 'lucide-react';

export default function YearbookAISection({ 
  yearbookPage,
  schoolSlug,
  seasonOrCategory,
  aiJobs = [],
  onPageUpdate,
}) {
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(!!yearbookPage.ai_intro_text);
  const [showCaptions, setShowCaptions] = useState(!!yearbookPage.ai_caption_options);

  const handleGenerateIntro = async () => {
    setLoading(true);
    try {
      await base44.functions.invoke('generateYearbookIntro', {
        school_slug: schoolSlug,
        season_or_category: seasonOrCategory || yearbookPage.title,
        summary_notes: yearbookPage.notes || '',
        yearbook_page_id: yearbookPage.id,
      });
      setShowIntro(true);
    } catch (error) {
      console.error('Error generating intro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIntro = async () => {
    setLoading(true);
    try {
      await base44.functions.invoke('saveAIOutputToYearbook', {
        ai_job_id: yearbookPage.ai_intro_job_id,
        ai_output_id: yearbookPage.ai_intro_output_id,
        yearbook_page_id: yearbookPage.id,
        output_type: 'yearbook_blurb',
      });

      onPageUpdate?.({
        ...yearbookPage,
        ai_intro_status: 'pending_review',
      });
    } catch (error) {
      console.error('Error saving intro:', error);
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

      {/* Intro Section */}
      {showIntro && yearbookPage.ai_intro_text ? (
        <AIIntegrationPanel
          entityType="yearbook"
          aiDraft={{
            body: yearbookPage.ai_intro_text,
            status: yearbookPage.ai_intro_status || 'pending_review',
          }}
          onSave={handleSaveIntro}
          onReject={() => setShowIntro(false)}
          loading={loading}
        />
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Generate Yearbook Intro
              </h4>
              <p className="text-sm text-gray-700 mt-1">
                Create an AI-generated introduction for {seasonOrCategory || 'this section'}
              </p>
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleGenerateIntro}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Intro
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Captions Section */}
      {showCaptions && yearbookPage.ai_caption_options ? (
        <AIIntegrationPanel
          entityType="yearbook"
          aiDraft={{
            body: 'AI-generated captions ready for review',
            status: yearbookPage.ai_captions_status || 'pending_review',
          }}
          onSave={() => handleSaveIntro()}
          onReject={() => setShowCaptions(false)}
          loading={loading}
        />
      ) : null}
    </div>
  );
}