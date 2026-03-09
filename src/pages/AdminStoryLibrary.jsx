import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import AIStatusBadge from '@/components/school-tv/AIStatusBadge';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Eye, Edit, Trash2, Archive } from 'lucide-react';

export default function AdminStoryLibrary() {
  const { schoolSlug } = useParams();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.Stories.filter({
          school_slug: schoolSlug,
        });
        setStories(data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800',
  };

  const handlePublish = async (storyId) => {
    await base44.entities.Stories.update(storyId, { 
      status: 'published', 
      publish_status: 'published',
      published_date: new Date().toISOString()
    });
    setStories(stories.map(s => s.id === storyId ? { ...s, status: 'published' } : s));
    setSelectedStory(null);
  };

  const handleArchive = async (storyId) => {
    await base44.entities.Stories.update(storyId, { status: 'archived' });
    setStories(stories.filter(s => s.id !== storyId));
    setSelectedStory(null);
  };

  const filteredStories = filterStatus === 'all' 
    ? stories 
    : stories.filter(s => s.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav />

      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Story Library</h1>
              <p className="text-gray-700 mt-1">{filteredStories.length} stories</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Story
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Stories Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">AI Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Published</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStories.map((story) => (
                  <tr key={story.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{story.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{story.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[story.status]}`}>
                        {story.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {story.ai_job_id ? (
                        <AIStatusBadge status={story.ai_approval_status} size="sm" />
                      ) : (
                        <span className="text-xs text-gray-600">No AI draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {story.published_date ? new Date(story.published_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedStory(story)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
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
        </div>
      </div>

      {/* Detail Panel */}
      {selectedStory && (
        <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
          <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Story Details</h2>
            <button onClick={() => setSelectedStory(null)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-4">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 -mx-6 px-6 pb-4">
              {[
                { id: 'content', label: 'Content' },
                { id: 'media', label: 'Media' },
                { id: 'ai', label: 'AI' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-sm font-semibold ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Status</p>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[selectedStory.status]}`}>
                    {selectedStory.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Excerpt</p>
                  <p className="text-sm text-gray-700">{selectedStory.excerpt}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Body</p>
                  <p className="text-sm text-gray-700 line-clamp-5">{selectedStory.body}</p>
                </div>
              </div>
            )}

            {activeTab === 'ai' && selectedStory.ai_job_id && (
              <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                <p className="font-semibold text-purple-900 mb-2">AI Generated</p>
                <AIStatusBadge status={selectedStory.ai_approval_status} showDescription />
                {selectedStory.ai_draft_text && (
                  <div className="mt-3 bg-white p-2 rounded text-xs text-gray-700 max-h-32 overflow-y-auto">
                    {selectedStory.ai_draft_text}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-6 space-y-3">
            {selectedStory.status === 'draft' && (
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                Submit for Review
              </Button>
            )}
            {selectedStory.status === 'approved' && (
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => handlePublish(selectedStory.id)}
              >
                Publish
              </Button>
            )}
            <Button variant="outline" className="w-full">
              Edit
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-red-600"
              onClick={() => handleArchive(selectedStory.id)}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}