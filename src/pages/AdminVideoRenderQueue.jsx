import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Play, RotateCcw, ExternalLink, Search, Filter, Zap } from 'lucide-react';

const STATUS_COLORS = {
  queued: 'bg-gray-100 text-gray-800',
  preparing: 'bg-blue-100 text-blue-800',
  processing: 'bg-blue-100 text-blue-800',
  rendering: 'bg-cyan-100 text-cyan-800',
  post_processing: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-200 text-gray-700',
};

export default function AdminVideoRenderQueue() {
  const { schoolSlug } = useParams();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEngine, setSelectedEngine] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.VideoRenderJobs.filter({
          school_slug: schoolSlug,
        });
        setJobs(data.sort((a, b) => {
          const orderMap = { queued: 0, preparing: 1, processing: 2, rendering: 3, post_processing: 4, completed: 5, failed: 6, cancelled: 7 };
          return (orderMap[a.status] || 99) - (orderMap[b.status] || 99);
        }));
      } catch (error) {
        console.error('Error loading render jobs:', error);
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
    if (selectedEngine !== 'all') {
      filtered = filtered.filter(j => j.render_engine === selectedEngine);
    }
    if (searchTerm) {
      filtered = filtered.filter(j =>
        j.render_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.project_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, selectedStatus, selectedEngine, searchTerm]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8 text-orange-600" /> Render Queue
          </h1>
          <p className="text-gray-600">Monitor video rendering jobs</p>
        </div>
        <div className="text-sm font-semibold flex gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
            <span>{jobs.filter(j => ['processing', 'rendering'].includes(j.status)).length} rendering</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-600 rounded-full"></div>
            <span>{jobs.filter(j => j.status === 'completed').length} done</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or project..."
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
              <option value="queued">Queued</option>
              <option value="preparing">Preparing</option>
              <option value="processing">Processing</option>
              <option value="rendering">Rendering</option>
              <option value="post_processing">Post-Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Engine</label>
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Engines</option>
              <option value="internal">Internal</option>
              <option value="heygen">HeyGen</option>
              <option value="synthesia">Synthesia</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedStatus('all');
            setSelectedEngine('all');
            setSearchTerm('');
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
        >
          Clear Filters
        </button>
      </div>

      {/* Summary Bar */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-orange-50 border border-orange-200 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 font-semibold">Showing</p>
            <p className="text-2xl font-bold text-gray-900">{filteredJobs.length}</p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Total</p>
            <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Avg Progress</p>
            <p className="text-2xl font-bold text-orange-600">
              {filteredJobs.length > 0 ? Math.round(filteredJobs.reduce((sum, j) => sum + j.progress_percent, 0) / filteredJobs.length) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-600 cursor-pointer"
              onClick={() => window.location.href = `/admin/schools/${schoolSlug}/render-queue/${job.id}`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{job.render_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[job.status] || 'bg-gray-100'}`}>
                      {job.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Project: {job.project_id}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{job.progress_percent}%</p>
                  <p className="text-xs text-gray-600">Progress</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${job.progress_percent}%` }}
                />
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-xs text-gray-600">Engine</p>
                  <p className="font-semibold text-gray-900 capitalize">{job.render_engine}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Resolution</p>
                  <p className="font-semibold text-gray-900">{job.resolution}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Queue Position</p>
                  <p className="font-semibold text-gray-900">#{job.queue_position + 1}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Retries</p>
                  <p className="font-semibold text-gray-900">{job.retry_count}/{job.max_retries}</p>
                </div>
              </div>

              {/* Error Alert */}
              {job.status === 'failed' && job.failure_stage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-red-900">Failed at: {job.failure_stage}</p>
                  <p className="text-xs text-red-800 mt-1 line-clamp-1">{job.error_message}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <button className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                  <Play className="h-4 w-4" /> Details
                </button>
                {job.status === 'failed' && job.retry_count < job.max_retries && (
                  <button className="flex-1 min-w-[140px] bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                    <RotateCcw className="h-4 w-4" /> Retry
                  </button>
                )}
                {job.output_url && (
                  <a
                    href={job.output_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg font-semibold text-sm flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" /> View
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="inline-block mb-4 p-4 bg-orange-50 rounded-full">
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-gray-900 text-lg font-semibold">No render jobs yet</p>
            <p className="text-gray-600 text-sm mt-2">When you queue a render, it will appear here</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}