import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { ArrowLeft, Save, CheckCircle2, Zap, Eye, Trash2 } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-red-100 text-red-800',
};

export default function AdminStoryDetail() {
  const { schoolSlug, storyId } = useParams();
  const [story, setStory] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mediaLinks, setMediaLinks] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        let storyData;
        if (storyId === 'new') {
          storyData = {
            school_slug: schoolSlug,
            title: '',
            slug: '',
            excerpt: '',
            body: '',
            status: 'draft',
            featured: false,
            visibility: 'staff',
          };
        } else {
          const data = await base44.entities.Stories.filter({
            id: storyId,
            school_slug: schoolSlug,
          });
          storyData = data[0] || null;
        }

        if (storyData) {
          setStory(storyData);
          
          if (storyId !== 'new') {
            const [mediaData, authorsData] = await Promise.all([
              base44.entities.StoryMediaLinks.filter({
                story_id: storyId,
                school_slug: schoolSlug,
              }),
              base44.entities.StoryAuthors.filter({
                story_id: storyId,
                school_slug: schoolSlug,
              }),
            ]);
            setMediaLinks(mediaData.sort((a, b) => (a.order || 0) - (b.order || 0)));
            setAuthors(authorsData.sort((a, b) => (a.order || 0) - (b.order || 0)));
          }
        }
      } catch (error) {
        console.error('Error loading story:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, storyId]);

  const saveStory = async () => {
    setSaving(true);
    try {
      // Auto-generate slug if not set
      const storyToSave = {
        ...story,
        slug: story.slug || story.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        public_url: story.public_url || `/schools/${schoolSlug}/stories/${story.slug || story.title.toLowerCase().replace(/\s+/g, '-')}`,
        canonical_route: story.canonical_route || `/schools/${schoolSlug}/stories`,
      };
      
      if (storyId === 'new') {
        const newStory = await base44.entities.Stories.create(storyToSave);
        window.location.href = `/admin/schools/${schoolSlug}/story-library/${newStory.id}`;
      } else {
        await base44.entities.Stories.update(storyId, storyToSave);
        setStory(storyToSave);
        alert('Story saved successfully!');
      }
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Error saving story');
    } finally {
      setSaving(false);
    }
  };

  const updateStoryField = (field, value) => {
    setStory(prev => ({ ...prev, [field]: value }));
  };

  const createAIJob = async (jobType) => {
    try {
      await base44.entities.AIContentJobs.create({
        school_slug: schoolSlug,
        job_type: jobType,
        status: 'pending',
        source_entity_type: 'Stories',
        source_entity_id: storyId,
        requested_by: 'admin',
      });
      alert(`${jobType.replace(/_/g, ' ')} job queued!`);
    } catch (error) {
      console.error('Error creating AI job:', error);
      alert('Error queuing AI job');
    }
  };

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;
  if (!story) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Story not found</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <Link to={`/admin/schools/${schoolSlug}/story-library`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2 font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to Stories
      </Link>

      <div className="flex justify-between items-start gap-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{story.title || 'New Story'}</h1>
          <p className="text-gray-600">Edit and publish story content</p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${STATUS_COLORS[story.status]}`}>
            {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
          </span>
          <button
            onClick={saveStory}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <Save className="h-5 w-5" /> Save
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {['content', 'media', 'ai-tools', 'publishing', 'links', 'activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-4 font-semibold text-center border-b-2 transition-colors text-sm whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'ai-tools' ? 'AI Tools' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Story Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={story.title}
                  onChange={(e) => updateStoryField('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Story title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  value={story.slug}
                  onChange={(e) => updateStoryField('slug', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="story-url-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt</label>
                <input
                  type="text"
                  value={story.excerpt || ''}
                  onChange={(e) => updateStoryField('excerpt', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief summary for preview"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Body Content</label>
                <textarea
                  value={story.body || ''}
                  onChange={(e) => updateStoryField('body', e.target.value)}
                  rows="12"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Write your story here... Markdown supported"
                />
              </div>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Display Options</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={story.featured}
                onChange={(e) => updateStoryField('featured', e.target.checked)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700 font-semibold">Featured Story</span>
            </label>
            <p className="text-sm text-gray-600 mt-2 ml-7">Show this story prominently on the home page</p>
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Media & Images</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image URL</label>
              <input
                type="text"
                value={story.featured_image_url || ''}
                onChange={(e) => updateStoryField('featured_image_url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {story.featured_image_url && (
                <img src={story.featured_image_url} alt="Featured" className="w-full h-48 object-cover rounded-lg mt-4" />
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Media Gallery</h4>
              {mediaLinks.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {mediaLinks.map((media, idx) => (
                    <div key={media.id} className="border border-gray-200 rounded-lg p-4">
                      {media.media_type === 'image' && (
                        <img src={media.media_url} alt={media.caption} className="w-full h-32 object-cover rounded-lg mb-2" />
                      )}
                      <p className="text-sm text-gray-600 mb-2">{media.caption || 'No caption'}</p>
                      <a href={media.media_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs font-semibold">
                        View Full →
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No media added yet</p>
              )}
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
              Add Media
            </button>
          </div>
        </div>
      )}

      {/* AI Tools Tab */}
      {activeTab === 'ai-tools' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" /> AI Content Tools
            </h3>
            <p className="text-gray-700 mb-4">Generate AI-assisted content improvements and variations</p>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => createAIJob('story_generation')}
                className="bg-white hover:bg-gray-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm"
              >
                Generate Draft
              </button>
              <button
                onClick={() => createAIJob('story_generation')}
                className="bg-white hover:bg-gray-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm"
              >
                Improve Story
              </button>
              <button
                onClick={() => createAIJob('headline')}
                className="bg-white hover:bg-gray-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm"
              >
                Generate Headlines
              </button>
              <button
                onClick={() => createAIJob('story_generation')}
                className="bg-white hover:bg-gray-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm"
              >
                Interview Questions
              </button>
            </div>
          </div>

          {story.ai_draft_text && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">AI Draft Available</h4>
              <div className="bg-white rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
                <p className="text-sm text-gray-700">{story.ai_draft_text}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                  Accept Draft
                </button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Publishing Tab */}
      {activeTab === 'publishing' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-6">Publishing Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={story.status}
                onChange={(e) => updateStoryField('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Visibility</label>
              <select
                value={story.visibility || 'staff'}
                onChange={(e) => updateStoryField('visibility', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public</option>
                <option value="staff">Staff Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Title</label>
              <input
                type="text"
                placeholder="Title for search engines"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Description</label>
              <textarea
                placeholder="Description for search results"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Publish
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold">
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Links Tab */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Link Story to Other Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Linked Event</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select an event...</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Linked Yearbook Page</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select a yearbook page...</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Linked Spotlight</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select a spotlight...</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Linked Video Project</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select a video project...</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Activity Log</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold">Story Created</p>
              <p className="text-gray-600">{new Date(story.created_date).toLocaleString()}</p>
            </div>
            {story.updated_date && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">Last Updated</p>
                <p className="text-gray-600">{new Date(story.updated_date).toLocaleString()}</p>
              </div>
            )}
            {story.published_date && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold text-blue-900">Published</p>
                <p className="text-blue-800">{new Date(story.published_date).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}