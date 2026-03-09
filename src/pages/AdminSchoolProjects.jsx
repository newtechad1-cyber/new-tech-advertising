import React, { useState } from 'react';
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Folder,
  FileText,
  Video,
  Clock,
  Users,
  AlertCircle,
} from 'lucide-react';

export default function AdminSchoolProjects() {
  const { schoolSlug, currentPath } = useSchoolRoute();
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: 'Basketball Season Recap 2026',
      description: 'Compile game highlights, player interviews, and season recap video',
      status: 'in-progress',
      progress: 75,
      team: 'Coach Davis, Emma Chen',
      assets: 12,
      dueDate: 'Mar 15',
      type: 'Video',
    },
    {
      id: 2,
      title: 'Science Fair Winners Spotlight',
      description: 'Feature top 10 projects with student interviews and AI-generated articles',
      status: 'completed',
      progress: 100,
      team: 'Ms. Johnson, Staff',
      assets: 8,
      dueDate: 'Mar 8',
      type: 'Story',
    },
    {
      id: 3,
      title: 'Spring Concert Recap',
      description: 'Performance highlights, student interviews, yearbook placement',
      status: 'in-progress',
      progress: 40,
      team: 'Mr. Martinez, Students',
      assets: 15,
      dueDate: 'Mar 20',
      type: 'Video',
    },
    {
      id: 4,
      title: 'Robotics Competition Story',
      description: 'Behind-the-scenes footage, team celebration, award highlights',
      status: 'needs-review',
      progress: 85,
      team: 'Ms. Khan, Students',
      assets: 20,
      dueDate: 'Mar 10',
      type: 'Multi-format',
    },
    {
      id: 5,
      title: 'Spring Sports Highlights Reel',
      description: 'Soccer, baseball, and track highlights compiled into one video',
      status: 'in-progress',
      progress: 60,
      team: 'Coach Wilson',
      assets: 25,
      dueDate: 'Mar 25',
      type: 'Video',
    },
  ];

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

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">Progress</span>
                    <span className="text-xs font-bold text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="h-4 w-4" />
                    {project.team}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FileText className="h-4 w-4" />
                    {project.assets} assets
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-4 w-4" />
                    Due {project.dueDate}
                  </div>
                </div>

                {/* Type Badge */}
                <div className="inline-block px-3 py-1 bg-white rounded-lg text-xs font-semibold text-gray-700 border border-gray-300">
                  {project.type}
                </div>

                {/* Action Button */}
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-blue-600 hover:text-blue-700"
                >
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
            {/* Progress */}
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Progress</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: `${selectedProject.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
              <Button className="w-full justify-start text-left font-semibold">
                📋 Overview
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                🎬 Assets
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                ✍️ AI Draft
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                🎨 Video Builder
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                📖 Yearbook
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                📤 Publishing
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Continue Editing
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}