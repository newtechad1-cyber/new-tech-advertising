import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import AIStatusBadge from '@/components/school-tv/AIStatusBadge';
import {
  Plus,
  Folder,
  FileText,
  Video,
  Clock,
  Users,
  AlertCircle,
  Copy,
  Archive,
  Play,
  Sparkles,
  Loader2,
} from 'lucide-react';

export default function AdminSchoolProjects() {
  const { schoolSlug, currentPath } = useSchoolRoute();
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('overview');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.SchoolVideoProjects.filter({
          school_slug: schoolSlug,
        });
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  const handleDuplicate = async (projectId) => {
    const project = projects.find(p => p.id === projectId);
    const newProject = await base44.entities.SchoolVideoProjects.create({
      ...project,
      title: `${project.title} (Copy)`,
      status: 'draft',
    });
    setProjects([...projects, newProject]);
  };

  const handleArchive = async (projectId) => {
    await base44.entities.SchoolVideoProjects.update(projectId, { status: 'archived' });
    setProjects(projects.filter(p => p.id !== projectId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statusColors = {
    'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'completed': 'bg-green-50 text-green-700 border-green-200',
    'needs-review': 'bg-orange-50 text-orange-700 border-orange-200',
    'draft': 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">Manage story and video projects</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`rounded-xl border-2 p-6 cursor-pointer hover:shadow-lg transition-all ${statusColors[project.status]}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                  </div>
                  {project.status === 'needs-review' && (
                    <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4">{project.description}</p>

                {/* AI Content Status */}
                {project.ai_content_status && (
                  <div className="mb-4">
                    <AIStatusBadge status={project.ai_content_status} size="sm" />
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">Progress</span>
                    <span className="text-xs font-bold text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="h-4 w-4" />
                    Team assigned
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FileText className="h-4 w-4" />
                    {project.status === 'collecting_assets' ? 'Collecting assets' : 'Assets ready'}
                  </div>
                </div>

                {/* Type Badge */}
                <div className="inline-block px-3 py-1 bg-white rounded-lg text-xs font-semibold text-gray-700 border border-gray-300">
                  {project.project_type}
                </div>

                {/* Action Button */}
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-blue-600 hover:text-blue-700"
                  onClick={() => setSelectedProject(project)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Open Workspace →
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{selectedProject.title}</h2>
              <p className="text-blue-100 mt-1">{selectedProject.progress}% complete</p>
            </div>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-white hover:text-blue-100"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Workspace Tabs */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: '📋' },
                { id: 'assets', label: 'Assets', icon: '🎬' },
                { id: 'ai', label: 'AI Draft', icon: '✨' },
                { id: 'builder', label: 'Builder', icon: '🎨' },
                { id: 'yearbook', label: 'Yearbook', icon: '📖' },
                { id: 'publish', label: 'Publish', icon: '📤' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveWorkspaceTab(tab.id)}
                  className={`px-4 py-2 text-sm font-semibold whitespace-nowrap ${
                    activeWorkspaceTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeWorkspaceTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Title</p>
                  <p className="text-gray-900 font-medium">{selectedProject.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Status</p>
                  <p className="text-gray-900">{selectedProject.status}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${selectedProject.progress || 0}%` }}></div>
                  </div>
                </div>
              </div>
            )}

            {activeWorkspaceTab === 'ai' && (
              <div className="space-y-4">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Story
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Video Script
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Captions
                </Button>
              </div>
            )}

            {activeWorkspaceTab === 'yearbook' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-700 mb-4">Add this project to yearbook pages</p>
                <Button variant="outline" className="w-full">
                  Browse Yearbook Pages
                </Button>
              </div>
            )}

            {activeWorkspaceTab === 'publish' && (
              <div className="space-y-4">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Publish
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Publish
                </Button>
              </div>
            )}
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-6 space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleDuplicate(selectedProject.id)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 text-red-600"
                onClick={() => {
                  handleArchive(selectedProject.id);
                  setSelectedProject(null);
                }}
              >
                <Archive className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}