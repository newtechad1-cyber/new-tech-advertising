import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import AIStatusBadge from '@/components/school-tv/AIStatusBadge';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Eye, Edit, Trash2 } from 'lucide-react';

export default function AdminStoryLibrary() {
  const { schoolSlug } = useParams();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
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
  };

  const handleArchive = async (storyId) => {
    await base44.entities.Stories.update(storyId, { status: 'archived' });
    setStories(stories.filter(s => s.id !== storyId));
  };

  const filteredStories = stories.filter(s => {
    const statusMatch = filterStatus === 'all' || s.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || JSON.parse(s.categories || '[]').includes(filterCategory);
    return statusMatch && categoryMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolAdminNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Story Library</h1>
            <p className="text-gray-700 mt-1">{filteredStories.length} stories</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Story
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex gap-4">
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">AI Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Published</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
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

      {/* Detail Panel */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-w-2xl h-full overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedStory.title}</h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedStory(null)}
                  className="text-gray-600"
                >
                  ✕
                </Button>
              </div>

              {/* AI Section */}
              {selectedStory.ai_job_id && (
                <div className="bg-purple-50 rounded-lg border border-purple-200 p-4 mb-6">
                  <p className="font-semibold text-purple-900 mb-2">AI Generated Content</p>
                  <AIStatusBadge status={selectedStory.ai_approval_status} showDescription />
                  {selectedStory.ai_draft_text && (
                    <div className="mt-4 bg-white p-3 rounded text-sm text-gray-700 max-h-48 overflow-y-auto">
                      {selectedStory.ai_draft_text}
                    </div>
                  )}
                </div>
              )}

              {/* Content Preview */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Status</p>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[selectedStory.status]}`}>
                    {selectedStory.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Excerpt</p>
                  <p className="text-gray-700">{selectedStory.excerpt}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Body</p>
                  <p className="text-gray-700 line-clamp-5">{selectedStory.body}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}