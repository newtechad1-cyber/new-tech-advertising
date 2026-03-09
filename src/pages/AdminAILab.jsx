import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import AIPromptTemplateCard from '@/components/school-tv/AIPromptTemplateCard';
import AIStatusBadge from '@/components/school-tv/AIStatusBadge';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Eye, Zap } from 'lucide-react';

export default function AdminAILab() {
  const { schoolSlug } = useParams();
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [templatesData, jobsData] = await Promise.all([
          base44.entities.AIPromptTemplates.filter({ is_active: true }),
          base44.entities.AIContentJobs.filter({ status: { $ne: 'archived' } }),
        ]);
        setTemplates(templatesData);
        setJobs(jobsData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
      } catch (error) {
        console.error('Error loading AI data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav />

      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 p-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Lab</h1>
          <p className="text-gray-600 mt-1">Manage AI prompts, jobs, and outputs</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 text-sm font-semibold ${
                activeTab === 'templates'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              Prompt Templates
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 text-sm font-semibold ${
                activeTab === 'jobs'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              AI Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`px-4 py-2 text-sm font-semibold ${
                activeTab === 'guidelines'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              School Safety Guidelines
            </button>
          </div>

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{templates.length} Active Templates</h2>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <AIPromptTemplateCard key={template.id} template={template} />
                ))}
              </div>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{job.job_type.replace(/_/g, ' ')}</h3>
                      <p className="text-sm text-gray-600 mt-1">{job.source_entity_type}</p>
                    </div>
                    <AIStatusBadge status={job.status} size="sm" />
                  </div>

                  {job.output_text && (
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded mb-4 line-clamp-2">
                      {job.output_text}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {job.status === 'pending_review' && (
                      <>
                        <Button variant="outline" size="sm" className="text-green-600">
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Guidelines Tab */}
          {activeTab === 'guidelines' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">🛡️ School Safety Guidelines</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ All AI content must be appropriate for all ages</li>
                  <li>✓ No inappropriate language or content</li>
                  <li>✓ Verify facts before publication</li>
                  <li>✓ Protect student privacy and consent</li>
                  <li>✓ AI-generated content requires staff review</li>
                  <li>✓ Disclose AI usage where appropriate</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                <p className="text-sm text-blue-900">
                  <strong>Remember:</strong> All AI outputs are drafts that require human review and approval before publication.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Panel */}
      {selectedJob && (
        <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
          <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">AI Job</h2>
            <button onClick={() => setSelectedJob(null)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Type</p>
              <p className="text-gray-900 font-medium">{selectedJob.job_type.replace(/_/g, ' ')}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Status</p>
              <AIStatusBadge status={selectedJob.status} showDescription />
            </div>

            {selectedJob.output_text && (
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Generated Output</p>
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 max-h-48 overflow-y-auto">
                  {selectedJob.output_text}
                </div>
              </div>
            )}

            {selectedJob.error_log && (
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
                <p className="text-xs text-red-900 font-semibold uppercase mb-2">Error</p>
                <p className="text-sm text-red-900">{selectedJob.error_log}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-6 space-y-3">
            {selectedJob.status === 'pending_review' && (
              <>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Approve
                </Button>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Reject
                </Button>
              </>
            )}
            <Button variant="outline" className="w-full">
              View Source Record
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}