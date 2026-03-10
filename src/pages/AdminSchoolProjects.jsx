import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Plus, Search, ArrowRight } from 'lucide-react';

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
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('school') || 'hampton-dumont';
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.SchoolVideoProjects.filter({ school_slug: schoolSlug });
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
    if (selectedStatus !== 'all') filtered = filtered.filter(p => p.status === selectedStatus);
    if (selectedType !== 'all') filtered = filtered.filter(p => p.project_type === selectedType);
    if (searchTerm) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredProjects(filtered);
  }, [projects, selectedStatus, selectedType, searchTerm]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  const newProjectUrl = `${createPageUrl('AdminCreateProject')}?school=${schoolSlug}`;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Video Projects</h1>
          <p className="text-gray-600">Create and manage school video projects</p>
        </div>
        <a href={newProjectUrl} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
           <Plus className="h-5 w-5" /> New Project
         </a>
      </div>

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
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
        <button onClick={() => { setSelectedStatus('all'); setSelectedType('all'); setSearchTerm(''); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">
          Clear All Filters
        </button>
      </div>

      <div className="mb-4 text-sm text-gray-600">Showing {filteredProjects.length} of {projects.length} projects</div>

      {filteredProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full h-32 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-gray-400">
                {project.cover_image ? (
                  <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold">Video Project</span>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="text-lg font-bold flex-1">{project.title}</h3>
                  {project.publish_to_gallery && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-semibold">Bulldog TV</span>
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
                {project.description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>}
                <a
                   href={`${createPageUrl('AdminSchoolProjectDetail')}?id=${project.id}&school=${schoolSlug}`}
                   className="flex w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm items-center justify-center gap-2"
                 >
                   Open <ArrowRight className="h-4 w-4" />
                 </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg">
          <div className="inline-block mb-4 p-4 bg-blue-50 rounded-full">
            <Plus className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-gray-900 text-lg font-semibold">No projects yet</p>
          <p className="text-gray-600 text-sm mt-2">Create your first video project to get started</p>
          <a href={newProjectUrl} className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
            Create Project
          </a>
        </div>
      )}
    </AdminShell>
  );
}