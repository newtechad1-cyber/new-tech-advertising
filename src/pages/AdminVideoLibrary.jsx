import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Plus, Play, BarChart3 } from 'lucide-react';

const STATUS_COLORS = {
  queued: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  rendering: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export default function AdminVideoLibrary() {
  const { schoolSlug } = useParams();
  const [videos, setVideos] = useState([]);
  const [renders, setRenders] = useState([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [videosData, rendersData] = await Promise.all([
          base44.entities.VideoProjects.filter({ school_slug: schoolSlug }),
          base44.entities.VideoRenderJobs.filter({ school_slug: schoolSlug }),
        ]);
        setVideos(videosData.sort((a, b) => new Date(b.updated_date || b.created_date) - new Date(a.updated_date || a.created_date)));
        setRenders(rendersData.sort((a, b) => new Date(b.updated_date || b.created_date) - new Date(a.updated_date || a.created_date)));
        setFilteredItems(videosData);
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilteredItems(tab === 'videos' ? videos : renders);
  };

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Video Library</h1>
          <p className="text-gray-600">Manage videos and render jobs</p>
        </div>
        <Link
          to={`/admin/schools/${schoolSlug}/projects/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> New Project
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6 border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => handleTabChange('videos')}
            className={`flex-1 px-6 py-4 font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'videos'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <Play className="h-4 w-4 inline mr-2" /> Videos ({videos.length})
          </button>
          <button
            onClick={() => handleTabChange('renders')}
            className={`flex-1 px-6 py-4 font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'renders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" /> Render Queue ({renders.length})
          </button>
        </div>
      </div>

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="grid md:grid-cols-2 gap-6">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {video.cover_image_url && (
                  <img src={video.cover_image_url} alt={video.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">{video.title}</h3>
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      video.status === 'published' ? 'bg-green-100 text-green-800' :
                      video.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {video.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/schools/${schoolSlug}/projects/${video.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm text-center"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No videos yet</p>
            </div>
          )}
        </div>
      )}

      {/* Renders Tab */}
      {activeTab === 'renders' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {renders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Job ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Queue Position</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {renders.map((render) => (
                    <tr key={render.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold">{render.render_name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[render.status] || 'bg-gray-100'}`}>
                          {render.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">#{render.queue_position || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              render.status === 'completed' ? 'bg-green-500' :
                              render.status === 'failed' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: render.status === 'completed' ? '100%' : render.status === 'rendering' ? '66%' : '33%' }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No render jobs yet</p>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}