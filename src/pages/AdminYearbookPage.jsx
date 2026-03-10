import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { ArrowLeft, Save, Plus, Trash2, Eye, Zap } from 'lucide-react';

export default function AdminYearbookPage() {
  const { schoolSlug: paramSlug, pageId: paramPageId } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const schoolSlug = paramSlug || searchParams.get('schoolSlug') || 'hampton-dumont';
  const pageId = paramPageId || searchParams.get('id') || 'new';
  const [page, setPage] = useState(null);
  const [season, setSeason] = useState(null);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        let pageData;
        if (pageId === 'new') {
          const params = new URLSearchParams(window.location.search);
          const seasonId = params.get('season');
          
          pageData = {
            school_slug: schoolSlug,
            season_id: seasonId,
            title: '',
            slug: '',
            status: 'draft',
            publish_status: 'unpublished',
            category_id: null,
          };
        } else {
          const data = await base44.entities.YearbookPages.filter({
            id: pageId,
            school_slug: schoolSlug,
          });
          pageData = data[0] || null;
        }

        if (pageData) {
          setPage(pageData);

          if (pageData.season_id) {
            const seasonData = await base44.entities.YearbookSeasons.filter({
              id: pageData.season_id,
            });
            if (seasonData.length > 0) {
              setSeason(seasonData[0]);
            }
          }

          if (pageId !== 'new') {
            const itemsData = await base44.entities.YearbookPageItems.filter({
              page_id: pageId,
            });
            setItems(itemsData.sort((a, b) => a.sort_order - b.sort_order));
          }
        }
      } catch (error) {
        console.error('Error loading page:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, pageId]);

  const savePage = async () => {
    if (!page.title) {
      alert('Please enter a page title');
      return;
    }
    setSaving(true);
    try {
      // Auto-generate slug if not set
      const pageToSave = {
        ...page,
        slug: page.slug || page.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        public_url: page.public_url || `${createPageUrl('SchoolYearbookPage')}?slug=${page.slug || page.title.toLowerCase().replace(/\s+/g, '-')}&schoolSlug=${schoolSlug}`,
        canonical_route: page.canonical_route || createPageUrl('SchoolYearbook'),
        // Preserve all publishing settings on save
        status: page.status || 'draft',
        publish_status: page.publish_status || 'unpublished',
        visibility: page.visibility || 'staff',
      };
      
      if (pageId === 'new') {
        const newPage = await base44.entities.YearbookPages.create(pageToSave);
        window.location.href = `${createPageUrl('AdminYearbookPage')}?id=${newPage.id}&schoolSlug=${schoolSlug}`;
      } else {
        await base44.entities.YearbookPages.update(pageId, pageToSave);
        setPage(pageToSave);
        alert('Page saved successfully!');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page');
    } finally {
      setSaving(false);
    }
  };

  const publishPage = async () => {
    setSaving(true);
    try {
      const updatedPage = {
        ...page,
        status: 'published',
        publish_status: 'published',
        published_date: new Date().toISOString(),
      };
      await base44.entities.YearbookPages.update(pageId, updatedPage);
      setPage(updatedPage);
      alert('Page published successfully!');
    } catch (error) {
      console.error('Error publishing page:', error);
      alert('Error publishing page');
    } finally {
      setSaving(false);
    }
  };

  const addItem = async (itemType) => {
    try {
      const newItem = await base44.entities.YearbookPageItems.create({
        school_slug: schoolSlug,
        page_id: pageId,
        item_type: itemType,
        title: `New ${itemType}`,
        sort_order: items.length,
      });
      setItems([...items, newItem]);
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await base44.entities.YearbookPageItems.delete(itemId);
      setItems(items.filter(i => i.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Error removing item');
    }
  };

  const createAIJob = async (jobType) => {
    try {
      await base44.entities.AIContentJobs.create({
        school_slug: schoolSlug,
        job_type: jobType,
        status: 'pending',
        source_entity_type: 'YearbookPages',
        source_entity_id: pageId,
        requested_by: 'admin',
      });
      alert(`${jobType.replace(/_/g, ' ')} job queued!`);
    } catch (error) {
      console.error('Error creating AI job:', error);
      alert('Error queuing AI job');
    }
  };

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;
  if (!page) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Page not found</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <Link to={`${createPageUrl('AdminYearbookOverview')}?schoolSlug=${schoolSlug}`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2 font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to Yearbook
      </Link>

      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{page.title || 'New Page'}</h1>
          {season && <p className="text-gray-600">{season.name}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={savePage}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <Save className="h-5 w-5" /> Save
          </button>
          {page.status === 'draft' && (
            <button
              onClick={publishPage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {['overview', 'content', 'ai-tools', 'design', 'publishing'].map(tab => (
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Page Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={page.title}
                  onChange={(e) => setPage({ ...page, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Page title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={page.description || ''}
                  onChange={(e) => setPage({ ...page, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Page description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image</label>
                <input
                  type="text"
                  value={page.featured_image_url || ''}
                  onChange={(e) => setPage({ ...page, featured_image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                {page.featured_image_url && (
                  <img src={page.featured_image_url} alt="Featured" className="w-full h-48 object-cover rounded-lg mt-4" />
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={page.featured || false}
                  onChange={(e) => setPage({ ...page, featured: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-700 font-semibold">Featured Page</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Content Blocks Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Content Blocks ({items.length})</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => addItem('text')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  + Text
                </button>
                <button
                  onClick={() => addItem('gallery')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  + Gallery
                </button>
              </div>
            </div>

            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-600 capitalize">{item.item_type}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No content blocks yet. Add one to get started.</p>
            )}
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
            <p className="text-sm text-gray-700 mb-4">Generate AI-assisted content to enhance your yearbook pages</p>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => createAIJob('yearbook_intro')}
                className="bg-white hover:bg-blue-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Generate Intro
              </button>
              <button
                onClick={() => createAIJob('caption_generation')}
                className="bg-white hover:bg-blue-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Generate Captions
              </button>
              <button
                onClick={() => createAIJob('story_generation')}
                className="bg-white hover:bg-blue-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Suggest Highlights
              </button>
            </div>
          </div>

          {page.ai_draft_text && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">AI Draft Ready</h4>
              <div className="bg-white rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
                <p className="text-sm text-gray-700">{page.ai_draft_text}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setPage(prev => ({ ...prev, body_text: page.ai_draft_text, ai_approval_status: 'approved' }));
                    alert('AI draft applied to page content');
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                  Accept & Apply
                </button>
                <button 
                  onClick={() => setPage(prev => ({ ...prev, ai_draft_text: null }))}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Design Tab */}
      {activeTab === 'design' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-6">Layout & Design</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Layout Type</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Standard (Title + Content Blocks)</option>
                <option>Gallery First</option>
                <option>Hero Image</option>
                <option>Timeline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Theme Variant</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Default</option>
                <option>Modern</option>
                <option>Classic</option>
                <option>Bold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Block Style</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Large (Full Width)</option>
                <option>Medium (2/3 Width)</option>
                <option>Compact (Sidebar)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Publishing Tab */}
      {activeTab === 'publishing' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-6">Publishing</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={page.status}
                onChange={(e) => setPage({ ...page, status: e.target.value })}
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
                value={page.visibility || 'staff'}
                onChange={(e) => setPage({ ...page, visibility: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public</option>
                <option value="staff">Staff Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Scheduled Publish (Optional)</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {page.status === 'published' && page.public_url && (
              <a href={page.public_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold">
                <Eye className="h-4 w-4" /> View Published Page
              </a>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}