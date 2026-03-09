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
        <div className="space-y-8">
          {/* AI Tools Guide */}
          <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-8">
            <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
              ⚡ AI Content Generation
            </h3>
            <p className="text-gray-700 mb-6">Your AI assistant helps create quality content. All outputs are reviewed by staff before publishing.</p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-purple-600 mb-2">✓ Save Time</p>
                <p className="text-gray-700">Generate headlines, captions, and scripts instantly</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-purple-600 mb-2">✓ Consistent Quality</p>
                <p className="text-gray-700">Maintain school voice and tone across all content</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-purple-600 mb-2">✓ School-Safe</p>
                <p className="text-gray-700">Moderation-ready and appropriate for all ages</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div>
          <h3 className="text-lg font-black text-gray-900 mb-4">Activity Summary</h3>
          <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-700">Total Jobs</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{stats.total}</p>
                </div>
                <Zap className="h-10 w-10 text-purple-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md p-6 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-yellow-700">Pending</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.pending}</p>
                </div>
                <Clock className="h-10 w-10 text-yellow-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-700">Completed</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{stats.completed}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-700">Failed</p>
                  <p className="text-3xl font-bold text-red-900 mt-2">{stats.failed}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-red-400" />
              </div>
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-2">Recent AI Jobs</h3>
            <p className="text-gray-600 text-sm mb-6">These content pieces are waiting for your review and approval</p>
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