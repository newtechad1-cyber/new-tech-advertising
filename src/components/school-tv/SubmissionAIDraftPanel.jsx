import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AIStatusBadge from './AIStatusBadge';
import AIOutputEditor from './AIOutputEditor';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  Copy,
  Edit,
  RefreshCw,
  Eye,
  ArrowRight,
} from 'lucide-react';

export default function SubmissionAIDraftPanel({ submission }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const [expanded, setExpanded] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const mockAIOutputs = {
    story: {
      headline: 'Robotics Team Tests Competition Robot Before Regional Challenge',
      body: `Students in the Hampton-Dumont High School robotics club recently gathered in the lab to continue building and testing their competition robot.

Working together, team members adjusted the robot's wheels, suspension system, and programming to improve performance ahead of the upcoming regional competition. They spent the afternoon troubleshooting mechanical issues and testing different configurations.

"It takes all of us working as a team to get this right," said one student involved in the testing. The project gives students the chance to apply engineering and problem-solving skills while collaborating with classmates toward a shared goal.

The team will compete in the regional robotics challenge next month.`,
      status: 'pending_review',
    },
    captions: [
      'Robotics team members test their latest design while preparing for the regional competition.',
      'Students collaborate in the robotics lab as they fine-tune their competition robot during build day.',
      'Teamwork and engineering skills come together as students solve problems and adjust their robot design.',
    ],
    headlines: [
      'Robotics Team Prepares for Regional Competition',
      'Students Engineer Solutions in Robotics Lab',
      'Collaboration Powers Hampton-Dumont Robotics Club',
      'Building Champions: Local Robotics Team Tests New Design',
      'STEM Comes Alive in Robotics Club Workshop',
    ],
    videoScript: `Students at Hampton-Dumont High School are putting their creativity and engineering skills to work in the robotics lab.

During today's build day, team members collaborate to assemble, test, and improve their competition robot. Every adjustment, every problem solved, brings them one step closer to the regional challenge ahead.

Robotics isn't just about competition for these students. It's about teamwork, persistence, and learning together. It's about representing their school and their community with pride.`,
  };

  const handleGenerateAI = async (contentType) => {
    setLoading(true);
    try {
      // In real app, would call backend function
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setLoading(false);
    }
  };

  if (!expanded) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <div>
              <p className="font-semibold text-gray-900">AI Draft Available</p>
              <p className="text-sm text-gray-700">This submission has AI-generated content ready for review</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setExpanded(true)}
            className="text-purple-600"
          >
            View & Review
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6" />
          <div>
            <h3 className="text-lg font-bold">AI-Generated Draft Content</h3>
            <p className="text-purple-100 text-sm">Ready for staff review and approval</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-white hover:text-purple-100"
          onClick={() => setExpanded(false)}
        >
          ✕
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {[
          { id: 'story', label: 'Story', icon: '📝' },
          { id: 'captions', label: 'Captions', icon: '📸' },
          { id: 'headlines', label: 'Headlines', icon: '📰' },
          { id: 'videoScript', label: 'Video Script', icon: '🎬' },
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

      {/* Content */}
      <div className="p-6">
        {/* Story Tab */}
        {activeTab === 'story' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">AI-Generated Story</h4>
                <p className="text-sm text-gray-600 mt-1">Draft ready for staff review</p>
              </div>
              <AIStatusBadge status={mockAIOutputs.story.status} size="sm" />
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-gray-200 space-y-4">
              <div>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">
                  AI-Generated Headline
                </p>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                  {mockAIOutputs.story.headline}
                </h3>
              </div>

              <hr className="border-gray-300" />

              <div>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">
                  Story Body
                </p>
                <div className="prose prose-sm prose-gray max-w-none">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {mockAIOutputs.story.body}
                  </p>
                </div>
              </div>

              <div className="bg-white/50 rounded p-3 border border-gray-300 mt-4">
                <p className="text-xs text-gray-700">
                  <span className="font-semibold">💡 Tip:</span> Review this content carefully. You can edit it before approving for publication.
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600"
                onClick={() => navigator.clipboard.writeText(mockAIOutputs.story.headline + '\n\n' + mockAIOutputs.story.body)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditor(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit & Review
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        )}

        {/* Captions Tab */}
        {activeTab === 'captions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Caption Options</h4>
                <p className="text-sm text-gray-600 mt-1">Choose one or create your own</p>
              </div>
              <AIStatusBadge status="pending_review" size="sm" />
            </div>

            <div className="space-y-3">
              {mockAIOutputs.captions.map((caption, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">
                      Option {idx + 1}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600"
                      onClick={() => navigator.clipboard.writeText(caption)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{caption}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    {caption.split(' ').length} words
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        )}

        {/* Headlines Tab */}
        {activeTab === 'headlines' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Headline Options</h4>
                <p className="text-sm text-gray-600 mt-1">Pick the one that best fits your story</p>
              </div>
              <AIStatusBadge status="pending_review" size="sm" />
            </div>

            <ul className="space-y-2">
              {mockAIOutputs.headlines.map((headline, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer"
                >
                  <span className="font-bold text-gray-600 flex-shrink-0 mt-0.5 text-lg">{idx + 1}</span>
                  <span className="text-gray-900 font-semibold flex-1">{headline}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 flex-shrink-0"
                    onClick={() => navigator.clipboard.writeText(headline)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        )}

        {/* Video Script Tab */}
        {activeTab === 'videoScript' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Video Narration Script</h4>
                <p className="text-sm text-gray-600 mt-1">60–90 second voiceover for highlight video</p>
              </div>
              <AIStatusBadge status="pending_review" size="sm" />
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-gray-200">
              <div className="bg-white/50 rounded p-4 border border-gray-300">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-semibold">
                  {mockAIOutputs.videoScript}
                </p>
                <p className="text-xs text-gray-600 mt-3">
                  ~{Math.round(mockAIOutputs.videoScript.split(' ').length / 130 * 60)} seconds at natural speech pace
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600"
                onClick={() => navigator.clipboard.writeText(mockAIOutputs.videoScript)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Script
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowEditor(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-gray-200 px-6 py-4 flex gap-3 justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span>All AI content ready for staff review</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-red-600">
            Reject All
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
            Approve & Use
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <AIOutputEditor
          output={mockAIOutputs.story}
          onClose={() => setShowEditor(false)}
          onSave={(content) => {
            console.log('Saved:', content);
            setShowEditor(false);
          }}
        />
      )}
    </div>
  );
}