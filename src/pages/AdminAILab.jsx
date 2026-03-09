import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Zap, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const JOB_TYPE_LABELS = {
  story_generation: 'Story Generation',
  caption_generation: 'Caption Generation',
  video_script: 'Video Script',
  headline: 'Headlines',
  interview_question: 'Interview Questions',
  story_rewriter: 'Story Rewrite',
  event_recap: 'Event Recap',
  yearbook_intro: 'Yearbook Intro',
};

export default function AdminAILab() {
  const { schoolSlug } = useParams();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const jobsData = await base44.entities.AIContentJobs.filter({
          school_slug: schoolSlug,
        });

        setJobs(jobsData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));

        const pending = jobsData.filter(j => j.status === 'pending').length;
        const completed = jobsData.filter(j => j.status === 'completed').length;
        const failed = jobsData.filter(j => j.status === 'failed').length;

        setStats({
          total: jobsData.length,
          pending,
          completed,
          failed,
        });
      } catch (error) {
        console.error('Error loading AI jobs:', error);
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8 text-purple-600" /> AI Lab
          </h1>
          <p className="text-gray-600">Monitor and manage AI content generation</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border-b border-gray-200 flex gap-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Dashboard
        </button>
        <Link
          to={`/admin/schools/${schoolSlug}/ai-lab/prompts`}
          className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${
            activeTab === 'prompts'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Prompt Templates
        </Link>
        <Link
          to={`/admin/schools/${schoolSlug}/ai-lab/activity`}
          className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${
            activeTab === 'activity'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Activity
        </Link>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Zap className="h-8 w-8 text-purple-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Recent AI Jobs</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {jobs.length > 0 ? (
                jobs.slice(0, 10).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{JOB_TYPE_LABELS[job.job_type] || job.job_type}</p>
                      <p className="text-xs text-gray-600">
                        {job.source_entity_type} • {new Date(job.created_date).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[job.status] || 'bg-gray-100'}`}>
                      {job.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No AI jobs yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}