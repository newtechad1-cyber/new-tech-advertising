import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import AIIntegrationPanel from './AIIntegrationPanel';
import AIHistoryPanel from './AIHistoryPanel';
import {
  Sparkles,
  Loader2,
} from 'lucide-react';

export default function ProjectAISection({ 
  project,
  schoolSlug,
  submissionIds = [],
  aiJobs = [],
  onProjectUpdate,
}) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const [drafts, setDrafts] = useState({
    story: !!project.ai_story_draft,
    videoScript: !!project.ai_video_script_draft,
    captions: !!project.ai_caption_blocks,
  });

  const handleGenerateAI = async (type) => {
    setLoading(true);
    try {
      // Create AI job for the specified type
      const jobTypes = {
        story: 'generate_story',
        videoScript: 'generate_video_script',
        captions: 'generate_captions',
      };

      const response = await base44.functions.invoke('createAIContentJob', {
        job_type: jobTypes[type],
        source_entity_type: 'SchoolVideoProjects',
        source_entity_id: project.id,
        school_slug: schoolSlug,
        submission_ids: submissionIds,
      });

      if (response.data.success) {
        setDrafts({ ...drafts, [type]: true });
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async (type) => {
    setLoading(true);
    try {
      await base44.functions.invoke('saveAIOutputToProject', {
        ai_job_id: project[`ai_${type}_job_id`],
        ai_output_id: project[`ai_${type}_output_id`],
        project_id: project.id,
        output_type: type,
      });

      onProjectUpdate?.({
        ...project,
        ai_content_status: 'draft_ready',
      });
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setLoading(false);
    }
  };

  const draftContent = {
    story: {
      title: project.ai_story_title,
      body: project.ai_story_draft,
      status: 'pending_review',
    },
    videoScript: {
      body: project.ai_video_script_draft,
      status: 'pending_review',
    },
    captions: {
      preview: 'AI-generated captions ready',
      status: 'pending_review',
    },
  };

  return (
    <div className="space-y-6">
      {/* AI History */}
      {aiJobs.length > 0 && (
        <AIHistoryPanel aiJobs={aiJobs} />
      )}

      {/* AI Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50">
          {[
            { id: 'story', label: 'Story', icon: '📝' },
            { id: 'videoScript', label: 'Video Script', icon: '🎬' },
            { id: 'captions', label: 'Captions', icon: '📸' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-semibold flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {drafts[activeTab] && draftContent[activeTab] ? (
            <AIIntegrationPanel
              entityType="project"
              aiDraft={draftContent[activeTab]}
              onSave={() => handleSaveDraft(activeTab)}
              onReject={() => setDrafts({ ...drafts, [activeTab]: false })}
              loading={loading}
            />
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
              <Sparkles className="h-6 w-6 text-purple-600 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-gray-900">
                Generate {activeTab === 'videoScript' ? 'Video Script' : activeTab === 'captions' ? 'Captions' : 'Story'}
              </h4>
              <p className="text-sm text-gray-700 mt-2 mb-4">
                Create AI-generated content from your submissions
              </p>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => handleGenerateAI(activeTab)}
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
                    Generate
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}