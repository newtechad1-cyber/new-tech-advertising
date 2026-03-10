import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminShell from '@/components/school-tv/AdminShell';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Copy,
  Edit,
  BarChart3,
} from 'lucide-react';

export default function AdminSchoolAILab() {
  const { schoolSlug, currentPath } = useSchoolRoute();
  const [activeTab, setActiveTab] = useState('templates');

  const templates = [
    {
      id: 1,
      name: 'Story Title Ideas',
      description: 'Generate creative headline options for your story',
      usage: 342,
      category: 'Writing',
    },
    {
      id: 2,
      name: 'Article Draft',
      description: 'Outline and draft full articles from notes',
      usage: 218,
      category: 'Writing',
    },
    {
      id: 3,
      name: 'Video Script Generator',
      description: 'Create engaging scripts for video narration',
      usage: 156,
      category: 'Video',
    },
    {
      id: 4,
      name: 'Caption Writer',
      description: 'Write engaging captions for photos and videos',
      usage: 298,
      category: 'Writing',
    },
    {
      id: 5,
      name: 'Interview Questions',
      description: 'Generate thoughtful interview questions',
      usage: 124,
      category: 'Journalism',
    },
    {
      id: 6,
      name: 'Event Summary',
      description: 'Write summaries of events and activities',
      usage: 187,
      category: 'Writing',
    },
  ];

  const guidelines = [
    {
      id: 1,
      title: 'AI Writing Ethics',
      description: 'Teach students to use AI as a starting point, not as copying',
      status: 'active',
    },
    {
      id: 2,
      title: 'Attribution & Credit',
      description: 'Explain when and how to credit AI-assisted work',
      status: 'active',
    },
    {
      id: 3,
      title: 'Fact-Checking & Accuracy',
      description: 'How to verify AI-generated information',
      status: 'active',
    },
    {
      id: 4,
      title: 'Privacy & Data Protection',
      description: 'What information students should never share with AI tools',
      status: 'active',
    },
  ];

  const activity = [
    { action: 'Emma Chen used Story Title Ideas', time: '2 hours ago', tool: 'Story Title Ideas' },
    { action: 'Jake Morrison used Caption Writer', time: '4 hours ago', tool: 'Caption Writer' },
    { action: 'Ms. Johnson used Article Draft', time: '1 day ago', tool: 'Article Draft' },
    { action: 'Sarah Kim used Video Script Generator', time: '1 day ago', tool: 'Video Script Generator' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              AI Lab
            </h1>
            <p className="text-gray-600 mt-1">Manage AI tools, templates, and guidelines</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              {['templates', 'guidelines', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold ${
                    activeTab === tab
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {tab === 'activity' ? 'Activity' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="grid md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                      <p className="text-xs text-gray-500 uppercase font-semibold mt-1">{template.category}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {template.usage} uses
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{template.description}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Stats
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Guidelines Tab */}
          {activeTab === 'guidelines' && (
            <div className="space-y-4">
              {guidelines.map((guideline) => (
                <div key={guideline.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                        {guideline.title}
                      </h3>
                      <p className="text-gray-700 mt-2">{guideline.description}</p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        guideline.status === 'active'
                          ? 'bg-green-100 text-green-800 flex items-center gap-1'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" className="mt-4 text-blue-600">
                    Edit Guideline →
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="divide-y divide-gray-200">
                {activity.map((item, idx) => (
                  <div key={idx} className="p-6 flex items-start justify-between hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{item.action}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.time}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {item.tool}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}