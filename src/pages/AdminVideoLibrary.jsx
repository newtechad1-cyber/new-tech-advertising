import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Search, Eye, Copy, Plus, Archive, LayoutGrid, List } from 'lucide-react';

const VISIBILITY_COLORS = {
  public: 'bg-green-100 text-green-800',
  staff: 'bg-blue-100 text-blue-800',
  private: 'bg-gray-100 text-gray-800',
};

export default function AdminVideoLibrary() {
  const { schoolSlug } = useParams();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.VideoProjects.filter({
          school_slug: schoolSlug,
          publish_status: 'published',
        });
        setVideos(data.sort((a, b) => new Date(b.published_date || b.created_date) - new Date(a.published_date || a.created_date)));
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  useEffect(() => {
    let filtered = videos;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(v => v.project_type === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(v =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVideos(filtered);
  }, [videos, selectedCategory, searchTerm]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Video Library</h1>
          <p className="text-gray-600">Published videos and content</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" /> Upload
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="weekly_recap">Weekly Recap</option>
              <option value="sports_highlight">Sports Highlight</option>
              <option value="classroom_spotlight">Classroom Spotlight</option>
              <option value="event_recap">Event Recap</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredVideos.length} of {videos.length} videos
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full h-40 bg-gray-900 flex items-center justify-center text-gray-400">
                Video Thumbnail
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 truncate">{video.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-semibold">
                    {video.project_type}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${VISIBILITY_COLORS[video.visibility] || 'bg-gray-100'}`}>
                    {video.visibility}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  {new Date(video.published_date || video.created_date).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  {video.public_video_url && (
                    <a
                      href={video.public_video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1"
                    >
                      <Eye className="h-4 w-4" /> View
                    </a>
                  )}
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-semibold text-xs">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredVideos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Published</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Visibility</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVideos.map((video) => (
                    <tr key={video.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 max-w-xs truncate">{video.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{video.project_type.replace(/_/g, ' ')}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(video.published_date || video.created_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${VISIBILITY_COLORS[video.visibility] || 'bg-gray-100'}`}>
                          {video.visibility}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        {video.public_video_url && (
                          <a href={video.public_video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold text-xs">
                            View
                          </a>
                        )}
                        <button className="text-gray-600 hover:text-gray-800 font-semibold text-xs">Copy</button>
                        <button className="text-gray-600 hover:text-gray-800 font-semibold text-xs">Archive</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No videos found</p>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}