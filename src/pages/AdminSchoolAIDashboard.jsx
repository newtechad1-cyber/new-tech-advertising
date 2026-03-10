import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminShell from '@/components/school-tv/AdminShell';
import AIStatusBadge from '@/components/school-tv/AIStatusBadge';
import AIPromptTemplateCard from '@/components/school-tv/AIPromptTemplateCard';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Settings,
  Eye,
  Zap,
  TrendingUp,
} from 'lucide-react';

export default function AdminSchoolAIDashboard() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const [activeTab, setActiveTab] = useState('jobs');

  const mockJobs = [
    {
      id: 1,
      job_type: 'generate_story',
      source: 'Robotics Submission #1204',
      status: 'completed',
      moderation_status: 'approved',
      created: '2 hours ago',
      generated_title: 'Robotics Team Prepares for Regional Competition',
    },
    {
      id: 2,
      job_type: 'generate_captions',
      source: 'Football Game #1203',
      status: 'completed',
      moderation_status: 'approved',
      created: '4 hours ago',
      generated_title: '3 caption options',
    },
    {
      id: 3,
      job_type: 'generate_video_script',
      source: 'Football Game #1203',
      status: 'completed',
      moderation_status: 'approved',
      created: '3 hours ago',
      generated_title: 'Voiceover script generated',
    },
    {
      id: 4,
      job_type: 'generate_story',
      source: 'Choir Concert #1202',
      status: 'completed',
      moderation_status: 'pending_review',
      created: '45 minutes ago',
      generated_title: 'Spring Concert Highlights Excellence',
    },
    {
      id: 5,
      job_type: 'generate_headlines',
      source: 'STEM Showcase #1201',
      status: 'completed',
      moderation_status: 'pending_review',
      created: '30 minutes ago',
      generated_title: '5 headline options',
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
              { icon: Zap, label: 'Jobs Completed', value: '847', color: 'from-purple-50 to-purple-100', trend: '+23% this month' },
              { icon: AlertCircle, label: 'Pending Review', value: '12', color: 'from-orange-50 to-orange-100', trend: 'Needs approval' },
              { icon: CheckCircle2, label: 'Approved', value: '835', color: 'from-green-50 to-green-100', trend: '98.6% approval' },
              { icon: BarChart3, label: 'Templates', value: '8', color: 'from-blue-50 to-blue-100', trend: 'All active' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className={`rounded-lg border border-gray-200 bg-gradient-to-br ${stat.color} p-6 hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="h-6 w-6 text-gray-700" />
                    <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded">
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
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
            <div className="space-y-3">
              {mockJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-900 uppercase">
                          {job.job_type.replace(/_/g, ' ')}
                        </span>
                        <AIStatusBadge status={job.status} size="sm" />
                      </div>
                      <p className="text-sm text-gray-700 font-semibold">{job.generated_title}</p>
                      <p className="text-xs text-gray-600 mt-1">From: {job.source}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <AIStatusBadge status={job.moderation_status} size="sm" />
                      <p className="text-xs text-gray-600 mt-2">{job.created}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    {job.moderation_status === 'pending_review' && (
                      <>
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Prompt Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <p className="text-sm text-blue-900">
                  <strong>8 templates ready:</strong> These are optimized prompt templates that guide AI generation while keeping content school-safe, community-focused, and appropriate for all ages.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mockTemplates.map((template) => (
                  <AIPromptTemplateCard key={template.id} template={template} />
                ))}
              </div>
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