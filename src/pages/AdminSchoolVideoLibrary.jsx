import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminShell from '@/components/school-tv/AdminShell';
import { Button } from '@/components/ui/button';
import {
  Search,
  Grid,
  List,
  Eye,
  Share2,
  Trash2,
  MoreVertical,
} from 'lucide-react';

export default function AdminSchoolVideoLibrary() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const [viewMode, setViewMode] = useState('grid');

  const videos = [
    {
      id: 1,
      title: 'Regional Basketball Tournament',
      thumbnail: '🏀',
      category: 'Sports',
      date: 'Mar 8, 2026',
      duration: '8:42',
      views: 342,
      visibility: 'public',
    },
    {
      id: 2,
      title: 'Science Fair Winners',
      thumbnail: '🔬',
      category: 'Academics',
      date: 'Mar 7, 2026',
      duration: '6:15',
      views: 156,
      visibility: 'public',
    },
    {
      id: 3,
      title: 'Spring Concert Highlights',
      thumbnail: '🎵',
      category: 'Arts',
      date: 'Mar 6, 2026',
      duration: '5:30',
      views: 289,
      visibility: 'public',
    },
    {
      id: 4,
      title: 'Robotics Competition Finals',
      thumbnail: '🤖',
      category: 'STEM',
      date: 'Mar 5, 2026',
      duration: '12:08',
      views: 421,
      visibility: 'public',
    },
    {
      id: 5,
      title: 'Drama Club Production',
      thumbnail: '🎭',
      category: 'Arts',
      date: 'Mar 4, 2026',
      duration: '9:45',
      views: 198,
      visibility: 'draft',
    },
  ];

  return (
    <AdminShell schoolSlug={schoolSlug}>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Video Library</h1>
            <p className="text-gray-600 mt-1">{videos.length} published videos</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Toolbar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative max-w-xs">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40 bg-gray-200 flex items-center justify-center text-6xl group">
                    {video.thumbnail}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{video.title}</h3>
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <p>{video.category}</p>
                      <p>{video.date}</p>
                      <p>{video.views} views</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        video.visibility === 'public'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {video.visibility === 'public' ? 'Published' : 'Draft'}
                      </span>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Views</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {videos.map((video) => (
                    <tr key={video.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{video.thumbnail}</span>
                          <span className="text-gray-900 font-medium">{video.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{video.category}</td>
                      <td className="px-6 py-4 text-gray-700">{video.date}</td>
                      <td className="px-6 py-4 text-gray-700">{video.views}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          video.visibility === 'public'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {video.visibility === 'public' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
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