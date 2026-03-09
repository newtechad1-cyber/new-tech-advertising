import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { ArrowLeft, Search, Filter } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export default function AdminAIActivity() {
  const { schoolSlug } = useParams();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.AIContentJobs.filter({
          school_slug: schoolSlug,
        });
        setJobs(data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
      } catch (error) {
        console.error('Error loading AI activity:', error);
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
    if (searchTerm) {
      filtered = filtered.filter(j =>
        j.source_entity_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.job_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, selectedStatus, searchTerm]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <Link to={`/admin/schools/${schoolSlug}/ai-lab`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2 font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to AI Lab
      </Link>

      <h1 className="text-3xl font-bold mb-8">AI Activity Log</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job type or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredJobs.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{job.job_type.replace(/_/g, ' ')}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[job.status] || 'bg-gray-100'}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {job.source_entity_type} • {job.source_entity_id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(job.created_date).toLocaleString()}
                      {job.completed_at && ` • Completed: ${new Date(job.completed_at).toLocaleString()}`}
                    </p>
                  </div>
                  {job.error_message && (
                    <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg max-w-xs">
                      {job.error_message}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No AI activity found</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}