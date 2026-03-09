import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  Copy,
  Edit,
  RefreshCw,
  Eye,
} from 'lucide-react';

export default function SubmissionAIDraftPanel({ submission }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const [expanded, setExpanded] = useState(false);

  const mockAIOutputs = {
    story: {
      headline: 'Robotics Team Tests Competition Robot Before Regional Challenge',
      body: `Students in the robotics club at Hampton-Dumont Schools recently gathered in the lab to continue building and testing their competition robot.

Working together, team members adjusted the robot's wheels and programming to improve performance ahead of an upcoming regional competition.

The project gives students the chance to apply engineering and problem-solving skills while collaborating with classmates.`,
      status: 'approved',
    },
    captions: [
      'Robotics team members test their latest design while preparing for the regional competition.',
      'Students collaborate in the robotics lab as they fine-tune their competition robot.',
      'Teamwork and engineering skills come together during robotics club build day.',
    ],
    headlines: [
      'Robotics Team Builds Competition Robot',
      'Students Prepare for Regional Robotics Challenge',
      'Robotics Club Tests New Robot Design',
      'STEM Students Collaborate on Competition Project',
      'Robotics Team Gets Ready for Regional Event',
    ],
    videoScript: `Students at Hampton-Dumont Schools are putting their creativity and engineering skills to work in the robotics lab.

During build day, team members collaborate to assemble and test their competition robot.

Every adjustment brings them one step closer to the upcoming regional challenge.

For these students, robotics is more than a competition. It's an opportunity to learn, solve problems together, and represent their school with pride.`,
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
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
              <p className="text-sm font-semibold text-blue-900">Generated Story</p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Headline</p>
                <h4 className="text-xl font-bold text-gray-900">{mockAIOutputs.story.headline}</h4>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Story Body</p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {mockAIOutputs.story.body}
                </p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="text-blue-600">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Captions Tab */}
        {activeTab === 'captions' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
              <p className="text-sm font-semibold text-blue-900">3 Caption Options</p>
            </div>

            {mockAIOutputs.captions.map((caption, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-2">CAPTION {idx + 1}</p>
                <p className="text-gray-700 mb-3">{caption}</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Captions
              </Button>
            </div>
          </div>
        )}

        {/* Headlines Tab */}
        {activeTab === 'headlines' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
              <p className="text-sm font-semibold text-blue-900">5 Headline Options</p>
            </div>

            <ul className="space-y-2">
              {mockAIOutputs.headlines.map((headline, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                  <span className="font-semibold text-gray-600 flex-shrink-0">{idx + 1}.</span>
                  <span className="text-gray-900">{headline}</span>
                  <Button variant="ghost" size="sm" className="text-blue-600 ml-auto flex-shrink-0">
                    <Copy className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Headlines
              </Button>
            </div>
          </div>
        )}

        {/* Video Script Tab */}
        {activeTab === 'videoScript' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
              <p className="text-sm font-semibold text-blue-900">Voiceover Script (60-90 words)</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {mockAIOutputs.videoScript}
              </p>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm" className="text-blue-600">
                <Copy className="h-4 w-4 mr-2" />
                Copy Script
              </Button>
              <Button variant="outline" size="sm">
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
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          Ready for review and approval
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-red-600">
            Reject Draft
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            Approve & Use in Story
          </Button>
        </div>
      </div>
    </div>
  );
}