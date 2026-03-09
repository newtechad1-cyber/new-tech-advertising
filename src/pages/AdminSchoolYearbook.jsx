import React, { useState } from 'react';
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Calendar,
  FileText,
} from 'lucide-react';

export default function AdminSchoolYearbook() {
  const { schoolSlug, currentPath } = useSchoolRoute();
  const [activeTab, setActiveTab] = useState('seasons');

  const seasons = [
    { id: 1, name: '2025-2026 School Year', pages: 45, stories: 23, videos: 12, status: 'active' },
    { id: 2, name: '2024-2025 School Year', pages: 52, stories: 28, videos: 15, status: 'archived' },
  ];

  const categories = [
    { id: 1, name: 'Sports', stories: 12, videos: 8 },
    { id: 2, name: 'Academics', stories: 8, videos: 4 },
    { id: 3, name: 'Arts', stories: 6, videos: 5 },
    { id: 4, name: 'Clubs & Activities', stories: 10, videos: 6 },
    { id: 5, name: 'Graduation & Seniors', stories: 5, videos: 3 },
  ];

  const pages = [
    { id: 1, title: 'Basketball Season', category: 'Sports', stories: 4, videos: 2, status: 'complete' },
    { id: 2, title: 'Science Fair Winners', category: 'Academics', stories: 3, videos: 1, status: 'complete' },
    { id: 3, title: 'Spring Concert', category: 'Arts', stories: 2, videos: 2, status: 'complete' },
    { id: 4, title: 'Robotics Team', category: 'Clubs & Activities', stories: 3, videos: 1, status: 'in-progress' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Yearbook</h1>
              <p className="text-gray-600 mt-1">Manage seasons, categories, and pages</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Page
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              {['seasons', 'categories', 'pages'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Seasons Tab */}
          {activeTab === 'seasons' && (
            <div className="space-y-4">
              {seasons.map((season) => (
                <div key={season.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{season.name}</h3>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Pages</p>
                          <p className="text-2xl font-bold text-gray-900">{season.pages}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Stories</p>
                          <p className="text-2xl font-bold text-gray-900">{season.stories}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Videos</p>
                          <p className="text-2xl font-bold text-gray-900">{season.videos}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        season.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {season.status === 'active' ? 'Active' : 'Archived'}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{category.name}</h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Stories</span>
                      <span className="font-bold text-gray-900">{category.stories}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Videos</span>
                      <span className="font-bold text-gray-900">{category.videos}</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full text-blue-600">
                    Edit Category →
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Pages Tab */}
          {activeTab === 'pages' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Stories</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Videos</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                      <td className="px-6 py-4 text-gray-700">{page.category}</td>
                      <td className="px-6 py-4 text-gray-700">{page.stories}</td>
                      <td className="px-6 py-4 text-gray-700">{page.videos}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          page.status === 'complete'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {page.status === 'complete' ? 'Complete' : 'In Progress'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}