import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Plus, Search, Play, Copy, Archive } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  collecting_assets: 'bg-blue-100 text-blue-800',
  ready_for_ai: 'bg-purple-100 text-purple-800',
  script_generated: 'bg-cyan-100 text-cyan-800',
  queued_for_render: 'bg-orange-100 text-orange-800',
  rendering: 'bg-yellow-100 text-yellow-800',
  review_ready: 'bg-green-100 text-green-800',
  approved: 'bg-green-200 text-green-900',
  published: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export default function AdminSchoolProjects() {
  const { schoolSlug } = useParams();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
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
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.project_type === selectedType);
    }
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [projects, selectedStatus, selectedType, searchTerm]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Video Projects</h1>
          <p className="text-gray-600">Create and manage school video projects</p>
        </div>
        <Link
          to={`/admin/schools/${schoolSlug}/projects/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by project title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="weekly_recap">Weekly Recap</option>
              <option value="sports_highlight">Sports Highlight</option>
              <option value="classroom_spotlight">Classroom Spotlight</option>
              <option value="event_recap">Event Recap</option>
              <option value="student_story">Student Story</option>
              <option value="custom">Custom</option>
            </select>
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
            <option value="draft">Draft</option>
            <option value="collecting_assets">Collecting Assets</option>
            <option value="ready_for_ai">Ready for AI</option>
            <option value="script_generated">Script Generated</option>
            <option value="queued_for_render">Queued for Render</option>
            <option value="rendering">Rendering</option>
            <option value="review_ready">Review Ready</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSelectedStatus('all');
            setSelectedType('all');
            setSearchTerm('');
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
        >
          Clear All Filters
        </button>
      </div>

      {/* Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {project.cover_image && (
                <img src={project.cover_image} alt={project.title} className="w-full h-40 object-cover bg-gray-900" />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="text-lg font-bold flex-1">{project.title}</h3>
                  {project.publish_to_gallery && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-semibold">
                      Bulldog TV
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[project.status] || 'bg-gray-100'}`}>
                    {project.status.replace(/_/g, ' ')}
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-semibold">
                    {project.project_type.replace(/_/g, ' ')}
                  </span>
                </div>

                {project.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                )}

                <div className="flex gap-2">
                  <Link
                    to={`/admin/schools/${schoolSlug}/projects/${project.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Play className="h-4 w-4" /> Open
                  </Link>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-semibold text-sm">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg font-semibold text-sm">
                    <Archive className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No projects found</p>
          <p className="text-gray-400 text-sm mt-2">Create a new project to get started</p>
        </div>
      )}
    </AdminShell>
  );
}