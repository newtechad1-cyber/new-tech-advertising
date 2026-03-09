import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { ArrowLeft, Plus, Edit2, Zap } from 'lucide-react';

const TEMPLATE_TYPES = {
  story_generator: 'Story Generator',
  caption_generator: 'Caption Generator',
  video_script_generator: 'Video Script',
  headline_generator: 'Headlines',
  interview_question_generator: 'Interview Questions',
  story_rewriter: 'Story Rewriter',
  event_summary_generator: 'Event Summary',
  yearbook_blurb_generator: 'Yearbook Blurb',
};

export default function AdminAIPrompts() {
  const { schoolSlug } = useParams();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.AIPromptTemplates.filter({
          school_slug: schoolSlug,
        });
        setTemplates(data.sort((a, b) => a.template_type.localeCompare(b.template_type)));
      } catch (error) {
        console.error('Error loading prompt templates:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <Link to={`/admin/schools/${schoolSlug}/ai-lab`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2 font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to AI Lab
      </Link>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8 text-purple-600" /> Prompt Templates
          </h1>
          <p className="text-gray-600">Manage AI prompt templates for content generation</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" /> New Template
        </button>
      </div>

      {/* Templates Grid */}
      {templates.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Type</p>
                  <h3 className="text-lg font-bold">{TEMPLATE_TYPES[template.template_type]}</h3>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit2 className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600">Tone</p>
                  <p className="text-sm text-gray-900 capitalize">{template.tone}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600">Output Format</p>
                  <p className="text-sm text-gray-900 capitalize">{template.output_format}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600">Usage</p>
                  <p className="text-sm text-gray-900">{template.usage_count || 0} times</p>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2">System Prompt</p>
                  <p className="text-xs text-gray-700 line-clamp-2">{template.system_prompt}</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold">
                    Edit
                  </button>
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm font-semibold">
                    Duplicate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4 opacity-50" />
          <p className="text-gray-500 text-lg">No prompt templates yet</p>
          <p className="text-gray-400 text-sm mt-2">Create templates to guide AI content generation</p>
        </div>
      )}
    </AdminShell>
  );
}