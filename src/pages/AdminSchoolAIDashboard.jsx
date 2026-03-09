import React, { useState } from 'react';
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Settings,
  Eye,
  Trash2,
} from 'lucide-react';

export default function AdminSchoolAIDashboard() {
  const { schoolSlug, currentPath } = useSchoolRoute();
  const [activeTab, setActiveTab] = useState('jobs');

  const mockJobs = [
    {
      id: 1,
      job_type: 'generate_story',
      source: 'Robotics Submission #1204',
      status: 'completed',
      moderation_status: 'pending_review',
      created: '2 hours ago',
      generated_title: 'Robotics Team Prepares for Competition',
    },
    {
      id: 2,
      job_type: 'generate_captions',
      source: 'Football Submission #1203',
      status: 'completed',
      moderation_status: 'approved',
      created: '4 hours ago',
      generated_title: '3 caption options generated',
    },
    {
      id: 3,
      job_type: 'generate_video_script',
      source: 'Choir Performance #1202',
      status: 'processing',
      moderation_status: 'pending_review',
      created: '10 minutes ago',
      generated_title: 'Generating...',
    },
  ];

  const mockTemplates = [
    {
      id: 1,
      name: 'Student Story Generator',
      prompt_type: 'story_generator',
      usage: 342,
      is_active: true,
    },
    {
      id: 2,
      name: 'Yearbook Caption Generator',
      prompt_type: 'caption_generator',
      usage: 218,
      is_active: true,
    },
    {
      id: 3,
      name: 'Video Highlight Script',
      prompt_type: 'video_script_generator',
      usage: 156,
      is_active: true,
    },
    {
      id: 4,
      name: 'Headline Generator',
      prompt_type: 'headline_generator',
      usage: 298,
      is_active: true,
    },
    {
      id: 5,
      name: 'Interview Questions',
      prompt_type: 'interview_question_generator',
      usage: 124,
      is_active: true,
    },
    {
      id: 6,
      name: 'Story Rewriter',
      prompt_type: 'story_rewriter',
      usage: 87,
      is_active: true,
    },
    {
      id: 7,
      name: 'Event Summary Generator',
      prompt_type: 'event_summary_generator',
      usage: 42,
      is_active: true,
    },
    {
      id: 8,
      name: 'Yearbook Blurb Generator',
      prompt_type: 'yearbook_blurb_generator',
      usage: 31,
      is_active: true,
    },
  ];

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    queued: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  };

  const moderationColors = {
    pending_review: 'bg-orange-100 text-orange-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    edited: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              AI Automation Engine
            </h1>
            <p className="text-gray-600 mt-1">Manage AI content generation, templates, and outputs</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Sparkles, label: 'Jobs Completed', value: '847', color: 'bg-purple-50' },
              { icon: Clock, label: 'Pending Review', value: '12', color: 'bg-orange-50' },
              { icon: CheckCircle2, label: 'Approved', value: '835', color: 'bg-green-50' },
              { icon: BarChart3, label: 'Template Variations', value: '8', color: 'bg-blue-50' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className={`rounded-lg border border-gray-200 p-6 ${stat.color}`}>
                  <Icon className="h-6 w-6 text-gray-700 mb-2" />
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              {[
                { id: 'jobs', label: 'Recent Jobs', icon: '⚙️' },
                { id: 'templates', label: 'Prompt Templates', icon: '📋' },
                { id: 'guidelines', label: 'AI Guidelines', icon: '📚' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold flex items-center gap-2 ${
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

          {/* Recent Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Job Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Source</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Moderation</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Created</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {job.job_type.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{job.source}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${moderationColors[job.moderation_status]}`}>
                          {job.moderation_status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{job.created}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Prompt Templates Tab */}
          {activeTab === 'templates' && (
            <div className="grid md:grid-cols-2 gap-6">
              {mockTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                      <p className="text-xs text-gray-600 uppercase font-semibold mt-1">
                        {template.prompt_type.replace(/_/g, ' ')}
                      </p>
                    </div>
                    {template.is_active && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-4">{template.usage} uses this month</p>
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button variant="outline" size="sm" className="flex-1 text-blue-600">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Guidelines Tab */}
          {activeTab === 'guidelines' && (
            <div className="space-y-6">
              {[
                {
                  title: 'School-Safe Content Rules',
                  items: [
                    'No controversial or sensitive speculation',
                    'No personal judgments or criticism',
                    'No unsupported claims or exaggeration',
                    'No corporate promotional tone',
                    'Focus on activities, teamwork, learning, and community',
                  ],
                },
                {
                  title: 'Moderation Standards',
                  items: [
                    'All AI outputs are draft content first',
                    'Nothing AI-generated publishes automatically',
                    'Staff can approve, reject, or edit AI outputs',
                    'Store both original AI output and edited human version',
                    'Clear "AI Draft" status labels in admin interface',
                  ],
                },
                {
                  title: 'Output Quality Standards',
                  items: [
                    'Factually accurate and verified',
                    'Age-appropriate and school safe',
                    'Free from exaggeration or unsupported claims',
                    'Inclusive and respectful language',
                    'Suitable for public viewing by parents and community',
                  ],
                },
              ].map((section, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item, bidx) => (
                      <li key={bidx} className="flex items-start gap-3 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}