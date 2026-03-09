import React, { useState } from 'react';
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Edit,
  Check,
  X,
  Copy,
  RefreshCw,
  Eye,
} from 'lucide-react';

export default function AdminSchoolAIContentReview() {
  const { schoolSlug, currentPath } = useSchoolRoute();
  const [activeTab, setActiveTab] = useState('story');
  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock generated content - in real app would come from backend
  const mockContent = {
    school_name: 'Hampton-Dumont Schools',
    activity_type: 'robotics club',
    event_name: 'robotics build day',
    generatedContent: {
      story: `HEADLINE
Robotics Team Prepares for Regional Competition

STORY
Students in the robotics club at Hampton-Dumont Schools recently gathered in the lab to continue building and testing their competition robot.

Working together, team members adjusted the robot's wheels and programming to improve performance ahead of an upcoming regional competition.

The project gives students the chance to apply engineering and problem-solving skills while collaborating with classmates.

Team members say the most rewarding part of robotics is learning how to overcome challenges together.

As the competition approaches, the students are excited to represent their school and showcase the work they have completed throughout the season.`,

      captions: `CAPTION 1
Robotics team members test their latest design while preparing for the regional competition.

CAPTION 2
Students collaborate in the robotics lab as they fine-tune their competition robot.

CAPTION 3
Teamwork and engineering skills come together during robotics club build day.`,

      videoScript: `Students at Hampton-Dumont Schools are putting their creativity and engineering skills to work in the robotics lab.

During build day, team members collaborate to assemble and test their competition robot.

Every adjustment brings them one step closer to the upcoming regional challenge.

For these students, robotics is more than a competition. It's an opportunity to learn, solve problems together, and represent their school with pride.`,

      headlines: `HEADLINE 1
Robotics Team Builds Competition Robot

HEADLINE 2
Students Prepare for Regional Robotics Challenge

HEADLINE 3
Robotics Club Tests New Robot Design

HEADLINE 4
STEM Students Collaborate on Competition Project

HEADLINE 5
Robotics Team Gets Ready for Regional Event`,

      interviewQuestions: `QUESTION 1
What inspired you to join the robotics team?

QUESTION 2
What has been the biggest challenge while building the robot?

QUESTION 3
What skills have you learned during this project?

QUESTION 4
How do team members work together to solve problems?

QUESTION 5
What are you most excited about for the upcoming competition?`,
    },
  };

  const tabs = [
    { id: 'story', label: 'Story', icon: '📝' },
    { id: 'captions', label: 'Captions', icon: '📸' },
    { id: 'videoScript', label: 'Video Script', icon: '🎬' },
    { id: 'headlines', label: 'Headlines', icon: '📰' },
    { id: 'questions', label: 'Interview Q&A', icon: '❓' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                  AI Content Generation
                </h1>
                <p className="text-gray-600 mt-1">Robotics Build Day - Ready for Review</p>
              </div>
              <div className="space-y-2">
                <Button className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? 'Generating...' : 'Publish All'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          {/* Upload Info Card */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs text-purple-600 uppercase font-semibold mb-1">School</p>
                <p className="text-lg font-bold text-gray-900">{mockContent.school_name}</p>
              </div>
              <div>
                <p className="text-xs text-purple-600 uppercase font-semibold mb-1">Activity</p>
                <p className="text-lg font-bold text-gray-900">{mockContent.activity_type}</p>
              </div>
              <div>
                <p className="text-xs text-purple-600 uppercase font-semibold mb-1">Event</p>
                <p className="text-lg font-bold text-gray-900">{mockContent.event_name}</p>
              </div>
              <div>
                <p className="text-xs text-purple-600 uppercase font-semibold mb-1">AI Status</p>
                <p className="text-lg font-bold text-green-600">✓ Content Generated</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Display */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="max-w-4xl">
                {/* Story Tab */}
                {activeTab === 'story' && (
                  <div className="space-y-6">
                    <div className="prose prose-sm max-w-none">
                      <pre className="bg-gray-50 p-6 rounded-lg overflow-auto text-sm whitespace-pre-wrap font-mono text-gray-700 border border-gray-200">
                        {mockContent.generatedContent.story}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Captions Tab */}
                {activeTab === 'captions' && (
                  <div className="space-y-4">
                    <pre className="bg-gray-50 p-6 rounded-lg overflow-auto text-sm whitespace-pre-wrap font-mono text-gray-700 border border-gray-200">
                      {mockContent.generatedContent.captions}
                    </pre>
                  </div>
                )}

                {/* Video Script Tab */}
                {activeTab === 'videoScript' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
                      <p className="text-sm text-blue-900 font-semibold">Voiceover Script (60-90 words)</p>
                    </div>
                    <pre className="bg-gray-50 p-6 rounded-lg overflow-auto text-sm whitespace-pre-wrap font-mono text-gray-700 border border-gray-200">
                      {mockContent.generatedContent.videoScript}
                    </pre>
                  </div>
                )}

                {/* Headlines Tab */}
                {activeTab === 'headlines' && (
                  <div className="space-y-3">
                    <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-4">
                      <p className="text-sm text-yellow-900 font-semibold">5 Headline Options</p>
                    </div>
                    <pre className="bg-gray-50 p-6 rounded-lg overflow-auto text-sm whitespace-pre-wrap font-mono text-gray-700 border border-gray-200">
                      {mockContent.generatedContent.headlines}
                    </pre>
                  </div>
                )}

                {/* Interview Questions Tab */}
                {activeTab === 'questions' && (
                  <div className="space-y-3">
                    <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-4">
                      <p className="text-sm text-green-900 font-semibold">5 Interview Questions</p>
                    </div>
                    <pre className="bg-gray-50 p-6 rounded-lg overflow-auto text-sm whitespace-pre-wrap font-mono text-gray-700 border border-gray-200">
                      {mockContent.generatedContent.interviewQuestions}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 border-t border-gray-200 px-8 py-6 flex gap-3 justify-between">
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="text-red-600">
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4 mr-2" />
                  Approve & Publish
                </Button>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">How AI Content Generation Works</h2>
            <div className="grid md:grid-cols-6 gap-4">
              {[
                { step: 1, label: 'Upload', emoji: '📤' },
                { step: 2, label: 'Analyze', emoji: '🔍' },
                { step: 3, label: 'Generate', emoji: '✨' },
                { step: 4, label: 'Review', emoji: '👀' },
                { step: 5, label: 'Edit', emoji: '✏️' },
                { step: 6, label: 'Publish', emoji: '📢' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <p className="font-semibold text-gray-900">{item.step}. {item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}