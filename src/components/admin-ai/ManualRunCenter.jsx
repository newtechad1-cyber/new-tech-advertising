import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Eye, FileOutput, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  GenerateSchoolStoryContentModal,
  GenerateBlogArticleModal,
  AuthorityPlannerModal,
  MonthlyReportModal,
  SchoolVideoScriptModal,
  GenerateContentFromTopicModal,
  AdaSalesAssistantModal,
  CreateAIContentJobModal,
} from './LaunchModals';
import { createPageUrl } from '@/utils';

const MANUAL_FUNCTIONS = [
  {
    name: 'generateSchoolStoryContent',
    category: 'content_generation',
    description: 'Generate story, captions, headlines, video script, interview questions from school submission',
    outputType: 'Multiple (story, captions, script, headlines, questions)',
    triggerSource: 'Manual / AdminSchoolSubmissions',
  },
  {
    name: 'schoolVideoScriptGeneration',
    category: 'video',
    description: 'Generate professional video script from selected clips and project context',
    outputType: 'Video Script',
    triggerSource: 'Manual / AdminSchoolProjectDetail',
  },
  {
    name: 'generateBlogArticle',
    category: 'content_generation',
    description: 'Generate SEO-optimized 1200-1800 word blog article with video script and metadata',
    outputType: 'Blog Article',
    triggerSource: 'Manual / AdminBlog',
  },
  {
    name: 'aiVideoStudio',
    category: 'video',
    description: 'Multi-action video studio: generate script, slides, captions, overlays, and create HeyGen videos',
    outputType: 'Video (via HeyGen)',
    triggerSource: 'Manual / AiVideoStudio',
  },
  {
    name: 'authorityPlanner',
    category: 'planning',
    description: 'Generate topical authority map with 5 pillars and cluster topics, schedule content queue',
    outputType: 'Authority Map + Content Queue',
    triggerSource: 'Manual / Scheduled',
  },
  {
    name: 'monthlyReportGenerator',
    category: 'reporting',
    description: 'Generate monthly performance reports for all active companies via reporting_agent',
    outputType: 'Performance Report',
    triggerSource: 'Scheduled / Manual',
  },
  {
    name: 'createAIContentJob',
    category: 'utilities',
    description: 'Queue an AI content job (story, yearbook, captions, etc.) for async processing',
    outputType: 'AI Job Queue Entry',
    triggerSource: 'Manual / AdminSchoolSubmissions',
  },
  {
    name: 'generateContentFromTopic',
    category: 'content_generation',
    description: 'Generate blog, landing page, video script, social series, email sequence from topic',
    outputType: 'Multiple (blog, landing page, video, social, email)',
    triggerSource: 'Automation / ContentTopics',
  },
  {
    name: 'adaSalesAssistant',
    category: 'sales_intelligence',
    description: 'AI sales intelligence: draft emails, analyze leads, answer questions, CRM analysis',
    outputType: 'Sales Intelligence (JSON)',
    triggerSource: 'Manual / AdaSalesAssistant page',
  },
];

function FunctionCard({ func }) {
  // Functions that need modals (collect input before launch)
  const modalFunctions = [
    'generateSchoolStoryContent',
    'generateBlogArticle',
    'authorityPlanner',
    'monthlyReportGenerator',
    'schoolVideoScriptGeneration',
    'generateContentFromTopic',
    'adaSalesAssistant',
    'createAIContentJob',
  ];

  // Functions that need dedicated pages
  const pageFunctions = ['aiVideoStudio'];

  const needsModal = modalFunctions.includes(func.name);
  const needsPage = pageFunctions.includes(func.name);

  // Get modal component for this function
  const getModalComponent = () => {
    const buttonProps = {
      className: 'flex-1 bg-blue-600 hover:bg-blue-700 gap-1',
      children: (
        <>
          <Play className="w-4 h-4" />
          Run Now
        </>
      ),
    };

    switch (func.name) {
      case 'generateSchoolStoryContent':
        return <GenerateSchoolStoryContentModal trigger={<Button {...buttonProps} />} />;
      case 'generateBlogArticle':
        return <GenerateBlogArticleModal trigger={<Button {...buttonProps} />} />;
      case 'authorityPlanner':
        return <AuthorityPlannerModal trigger={<Button {...buttonProps} />} />;
      case 'monthlyReportGenerator':
        return <MonthlyReportModal trigger={<Button {...buttonProps} />} />;
      case 'schoolVideoScriptGeneration':
        return <SchoolVideoScriptModal trigger={<Button {...buttonProps} />} />;
      case 'generateContentFromTopic':
        return <GenerateContentFromTopicModal trigger={<Button {...buttonProps} />} />;
      case 'adaSalesAssistant':
        return <AdaSalesAssistantModal trigger={<Button {...buttonProps} />} />;
      case 'createAIContentJob':
        return <CreateAIContentJobModal trigger={<Button {...buttonProps} />} />;
      default:
        return null;
    }
  };

  // Get page link for functions that need dedicated pages
  const getPageLink = () => {
    if (func.name === 'aiVideoStudio') {
      return (
        <Button
          className="flex-1 bg-purple-600 hover:bg-purple-700 gap-1"
          onClick={() => window.location.href = createPageUrl('AdminAIVideoStudio')}
        >
          <Play className="w-4 h-4" />
          Open Studio
        </Button>
      );
    }
    return null;
  };

  const categoryColors = {
    content_generation: 'bg-blue-50 border-blue-200',
    video: 'bg-purple-50 border-purple-200',
    planning: 'bg-green-50 border-green-200',
    reporting: 'bg-indigo-50 border-indigo-200',
    sales_intelligence: 'bg-orange-50 border-orange-200',
    utilities: 'bg-gray-50 border-gray-200',
  };

  return (
    <Card className={`${categoryColors[func.category]} border`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-gray-900">
              {func.name}
            </CardTitle>
            <p className="text-xs text-gray-600 mt-1">{func.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs space-y-1">
          <div>
            <span className="font-semibold text-gray-700">Output Type:</span>
            <p className="text-gray-600">{func.outputType}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Trigger Source:</span>
            <p className="text-gray-600">{func.triggerSource}</p>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          {needsPage ? getPageLink() : needsModal ? getModalComponent() : (
            <Button
              onClick={async () => {
                try {
                  await base44.asServiceRole.entities.AIJobs.create({
                    function_name: func.name,
                    status: 'pending',
                    trigger_source: 'manual',
                    triggered_by_email: (await base44.auth.me()).email,
                  });
                  toast.success(`Job queued: ${func.name}`);
                } catch (error) {
                  toast.error(`Error: ${error.message}`);
                }
              }}
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 gap-1"
            >
              <Play className="w-4 h-4" />
              Run Now
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <Eye className="w-4 h-4" />
            View Jobs
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <FileOutput className="w-4 h-4" />
            Outputs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ManualRunCenter() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">Manual Run Center</p>
          <p>Click "Run Now" to immediately trigger an AI function. Jobs are logged and can be monitored in the Job Queue tab.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MANUAL_FUNCTIONS.map((func) => (
          <FunctionCard key={func.name} func={func} />
        ))}
      </div>
    </div>
  );
}