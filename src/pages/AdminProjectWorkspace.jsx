import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { ArrowLeft, Save, Zap, Play, Upload } from 'lucide-react';

export default function AdminProjectWorkspace() {
  const { schoolSlug, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [clips, setClips] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectData = await base44.entities.VideoProjects.filter({
          id: projectId,
          school_slug: schoolSlug,
        });

        if (projectData.length > 0) {
          setProject(projectData[0]);

          const clipsData = await base44.entities.VideoClips.filter({
            project_id: projectId,
          });
          setClips(clipsData.sort((a, b) => a.recommended_order - b.recommended_order));
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, projectId]);

  const createAIJob = async (jobType) => {
    try {
      await base44.entities.AIContentJobs.create({
        school_slug: schoolSlug,
        job_type: jobType,
        status: 'pending',
        source_entity_type: 'VideoProjects',
        source_entity_id: projectId,
        requested_by: 'admin',
      });
      alert(`${jobType.replace(/_/g, ' ')} job queued!`);
    } catch (error) {
      console.error('Error creating AI job:', error);
      alert('Error queuing AI job');
    }
  };

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;
  if (!project) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Project not found</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <Link to={`/admin/schools/${schoolSlug}/projects`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2 font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800`}>
              {project.status.replace(/_/g, ' ')}
            </span>
            {project.project_type.replace(/_/g, ' ')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: '📋' },
            { id: 'assets', label: 'Assets', icon: '🎬' },
            { id: 'ai-draft', label: 'AI Tools', icon: '⚡' },
            { id: 'video-builder', label: 'Builder', icon: '🎨' },
            { id: 'yearbook', label: 'Yearbook', icon: '📚' },
            { id: 'publishing', label: 'Publish', icon: '🚀' },
            { id: 'notes', label: 'Notes', icon: '📝' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-6 py-4 font-semibold text-sm whitespace-nowrap transition-all flex items-center gap-2 border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Project Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{project.project_type.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration Target</p>
                  <p className="font-semibold text-gray-900">{project.duration_target}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tone</p>
                  <p className="font-semibold text-gray-900 capitalize">{project.tone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-900 mb-3">Assets Ready</p>
              <p className="text-2xl font-bold text-green-600">{clips.length}</p>
              <p className="text-xs text-green-700">clips and photos</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-3">AI Status</p>
              <p className="text-xs text-blue-700">Ready for script generation</p>
            </div>
          </div>
        </div>
      )}

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Media Assets ({clips.length})</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm">
              <Upload className="h-4 w-4" /> Add Assets
            </button>
          </div>

          {clips.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {clips.map((clip, idx) => (
                <div key={clip.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="w-full h-32 bg-gray-900 flex items-center justify-center text-gray-400">
                    {clip.media_type === 'video' ? 'Video' : 'Photo'}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm text-gray-900 truncate">{clip.clip_title}</p>
                    <p className="text-xs text-gray-600">Order: {idx + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No assets yet. Add submissions to get started.</p>
          )}
        </div>
      )}

      {/* AI Tools Tab */}
      {activeTab === 'ai-draft' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" /> AI Content Generation
            </h3>
            <p className="text-sm text-gray-700 mb-6">Generate helpful content drafts. All AI outputs require staff review before use.</p>
            
            <div className="grid md:grid-cols-2 gap-3">
              <button
                onClick={() => createAIJob('video_script')}
                className="bg-white hover:bg-purple-50 border-2 border-purple-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                📝 Video Script
              </button>
              <button
                onClick={() => createAIJob('story_generation')}
                className="bg-white hover:bg-purple-50 border-2 border-purple-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                📖 Story Draft
              </button>
              <button
                onClick={() => createAIJob('caption_generation')}
                className="bg-white hover:bg-purple-50 border-2 border-purple-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                💬 Captions
              </button>
              <button
                onClick={() => createAIJob('headline')}
                className="bg-white hover:bg-purple-50 border-2 border-purple-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                ✨ Headlines
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-purple-50 rounded-full mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-gray-900 font-semibold">No AI drafts yet</p>
              <p className="text-gray-600 text-sm mt-2">Generate content above to see previews here</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Builder Tab */}
      {activeTab === 'video-builder' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-6">Video Assembly</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Script</h4>
              <textarea
                rows="10"
                placeholder="Video script will appear here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                Save Script
              </button>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Video Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Music Style</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option>Uplifting</option>
                    <option>Inspirational</option>
                    <option>Energetic</option>
                    <option>Documentary</option>
                  </select>
                </div>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                  Suggest Music
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                  <Play className="h-4 w-4" /> Queue Render
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yearbook Tab */}
      {activeTab === 'yearbook' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              📚 Yearbook Placement
            </h3>
            <p className="text-sm text-gray-600 mb-6">Link this video to your yearbook for archival and visibility</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Yearbook Season</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select a season...</option>
                  <option>2025-2026</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select a category...</option>
                  <option>Sports</option>
                  <option>Academics</option>
                  <option>Arts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Specific Page</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select a page...</option>
                </select>
              </div>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold">
            Link to Yearbook
          </button>
        </div>
      )}

      {/* Publishing Tab */}
      {activeTab === 'publishing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              🚀 Publishing Destinations
            </h3>
            <p className="text-sm text-gray-600 mb-6">Choose where this video will appear</p>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Bulldog TV (School Hub)</p>
                  <p className="text-xs text-gray-600">Featured on the main media hub</p>
                </div>
              </label>
              <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 accent-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Link to Event</p>
                  <p className="text-xs text-gray-600">Connect to a school event</p>
                </div>
              </label>
              <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 accent-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Link to Yearbook</p>
                  <p className="text-xs text-gray-600">Add to a yearbook page</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold text-base flex items-center justify-center gap-2">
              ✓ Publish This Project
            </button>
            <p className="text-xs text-green-700 text-center mt-3">Video will go live and be visible to your school community</p>
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Notes & Activity</h3>
          <textarea
            rows="6"
            placeholder="Add notes about this project..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
            Save Notes
          </button>
        </div>
      )}
    </AdminShell>
  );
}