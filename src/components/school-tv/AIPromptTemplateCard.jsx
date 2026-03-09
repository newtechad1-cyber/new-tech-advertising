import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Edit,
  Copy,
  BarChart3,
  Shield,
  Zap,
} from 'lucide-react';

const promptTypeIcons = {
  story_generator: '📝',
  caption_generator: '📸',
  video_script_generator: '🎬',
  headline_generator: '📰',
  interview_question_generator: '🎤',
  story_rewriter: '✏️',
  event_summary_generator: '📊',
  yearbook_blurb_generator: '📖',
};

const promptTypeLabels = {
  story_generator: 'Generate Stories',
  caption_generator: 'Generate Captions',
  video_script_generator: 'Generate Video Scripts',
  headline_generator: 'Generate Headlines',
  interview_question_generator: 'Generate Interview Qs',
  story_rewriter: 'Rewrite Stories',
  event_summary_generator: 'Event Summaries',
  yearbook_blurb_generator: 'Yearbook Blurbs',
};

export default function AIPromptTemplateCard({ template }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{promptTypeIcons[template.prompt_type] || '✨'}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                <p className="text-xs text-gray-600 uppercase font-semibold mt-0.5">
                  {promptTypeLabels[template.prompt_type]}
                </p>
              </div>
            </div>
          </div>
          {template.is_active && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex-shrink-0">
              Active
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Usage Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-semibold text-blue-900">Monthly Uses</p>
            </div>
            <p className="text-2xl font-bold text-blue-900">{template.usage}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-green-600" />
              <p className="text-xs font-semibold text-green-900">School-Safe</p>
            </div>
            <p className="text-2xl font-bold text-green-900">✓</p>
          </div>
        </div>

        {/* Template Preview */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-600 font-bold uppercase mb-2">Purpose</p>
          <p className="text-sm text-gray-700 line-clamp-2">
            {template.tone_profile || 'Community-focused and school-appropriate content generation'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-blue-600"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Eye className="h-4 w-4 mr-1" />
            {showDetails ? 'Hide' : 'View'}
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>

        {/* Details Section */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase mb-2">System Prompt</p>
              <p className="text-xs text-gray-700 bg-gray-100 p-2 rounded border border-gray-300 max-h-24 overflow-y-auto font-mono">
                {template.system_prompt}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase mb-2">Output Format</p>
              <p className="text-xs text-gray-700 bg-gray-100 p-2 rounded border border-gray-300">
                {template.output_format}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}