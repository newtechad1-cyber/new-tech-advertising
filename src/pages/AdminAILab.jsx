import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Zap, Clock } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  pending_review: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function AdminAILab() {
  const { schoolSlug } = useParams();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.AIContentJobs.filter({
          school_slug: schoolSlug,
        });
        setJobs(data.sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at)));
      } catch (error) {
        console.error('Error loading AI jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  useEffect(() => {
    let filtered = jobs;
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(j => j.status === selectedStatus);
    }
    setFilteredJobs(filtered);
  }, [jobs, selectedStatus]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Lab</h1>
        <p className="text-gray-600 mb-8">Monitor AI content generation jobs and queue</p>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'processing', 'completed', 'failed'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold mb-1">{job.job_type.replace(/_/g, ' ')}</h3>
                  <p className="text-sm text-gray-600">Entity: {job.source_entity_type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_COLORS[job.status]}`}>
                  {job.status.replace(/_/g, ' ')}
                </span>
              </div>

              {job.status === 'processing' && (
                <div className="mb-4">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Processing...
                  </p>
                </div>
              )}

              {job.output_text && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg max-h-32 overflow-hidden">
                  <p className="text-sm text-gray-700 line-clamp-4">{job.output_text}</p>
                </div>
              )}

              {job.error_log && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200 max-h-24 overflow-hidden">
                  <p className="text-sm text-red-700 font-semibold mb-1">Error</p>
                  <p className="text-xs text-red-600">{job.error_log}</p>
                </div>
              )}

              <div className="flex gap-2">
                {job.status === 'completed' && (
                  <Link
                    to={`/admin/schools/${schoolSlug}/ai-lab/${job.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                  >
                    Review & Approve
                  </Link>
                )}
                {job.status === 'failed' && (
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    Retry
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No AI jobs found</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}