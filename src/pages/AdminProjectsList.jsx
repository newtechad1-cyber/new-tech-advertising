import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Plus, Eye, Archive } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  collecting_assets: 'bg-blue-100 text-blue-800',
  ready_for_ai: 'bg-purple-100 text-purple-800',
  script_generated: 'bg-indigo-100 text-indigo-800',
  queued_for_render: 'bg-yellow-100 text-yellow-800',
  rendering: 'bg-orange-100 text-orange-800',
  review_ready: 'bg-cyan-100 text-cyan-800',
  approved: 'bg-green-100 text-green-800',
  published: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export default function AdminProjectsList() {
  const { schoolSlug } = useParams();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.VideoProjects.filter({
          school_slug: schoolSlug,
        });
        setProjects(data.sort((a, b) => new Date(b.updated_date || b.created_date) - new Date(a.updated_date || a.created_date)));
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  useEffect(() => {
    let filtered = projects;
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProjects(filtered);
  }, [projects, selectedStatus, searchTerm]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Video Projects</h1>
          <p className="text-gray-600">Create and manage video production workflows</p>
        </div>
        <Link
          to={`/admin/schools/${schoolSlug}/projects/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> New Project
        </Link>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Status</label>
        <div className="grid md:grid-cols-5 gap-2">
          {['all', 'draft', 'collecting_assets', 'ready_for_ai', 'published'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-4" style={{ borderColor: '#3b82f6' }}>
              {project.cover_image_url && (
                <img src={project.cover_image_url} alt={project.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[project.status] || 'bg-gray-100 text-gray-800'}`}>
                    {project.status.replace(/_/g, ' ')}
                  </span>
                </div>
                {project.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                )}
                <div className="flex gap-2">
                  <Link
                    to={`/admin/schools/${schoolSlug}/projects/${project.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm text-center"
                  >
                    Edit
                  </Link>
                  {project.status === 'published' && project.public_video_url && (
                    <a
                      href={project.public_video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" /> View
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No projects found</p>
        </div>
      )}
    </AdminShell>
  );
}