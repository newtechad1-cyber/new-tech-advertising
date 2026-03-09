import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Plus, Eye, Search, Copy } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-red-100 text-red-800',
};

export default function AdminStoryLibrary() {
  const { schoolSlug } = useParams();
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFeatured, setSelectedFeatured] = useState('all');
  const [selectedAIDraft, setSelectedAIDraft] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.Stories.filter({
          school_slug: schoolSlug,
        });
        setStories(data.sort((a, b) => new Date(b.updated_date || b.created_date) - new Date(a.updated_date || a.created_date)));
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  useEffect(() => {
    let filtered = stories;
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }
    if (selectedFeatured !== 'all') {
      filtered = filtered.filter(s => 
        selectedFeatured === 'featured' ? s.featured : !s.featured
      );
    }
    if (selectedAIDraft !== 'all') {
      filtered = filtered.filter(s => 
        selectedAIDraft === 'with-draft' ? s.ai_draft_text : !s.ai_draft_text
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredStories(filtered);
  }, [stories, selectedStatus, selectedFeatured, selectedAIDraft, searchTerm]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Stories</h1>
          <p className="text-gray-600">Create and manage story content</p>
        </div>
        <Link
          to={`/admin/schools/${schoolSlug}/story-library/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> New Story
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Stories</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Featured</label>
            <select
              value={selectedFeatured}
              onChange={(e) => setSelectedFeatured(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="featured">Featured Only</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">AI Drafts</label>
            <select
              value={selectedAIDraft}
              onChange={(e) => setSelectedAIDraft(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="with-draft">Has AI Draft</option>
              <option value="no-draft">No AI Draft</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedStatus('all');
            setSelectedFeatured('all');
            setSelectedAIDraft('all');
            setSearchTerm('');
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
        >
          Clear All Filters
        </button>
      </div>

      {/* Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredStories.length} of {stories.length} stories
      </div>

      {/* Stories Grid */}
      {filteredStories.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredStories.map((story) => (
            <div key={story.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {story.featured_image_url && (
                <img src={story.featured_image_url} alt={story.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="text-lg font-bold flex-1">{story.title}</h3>
                  {story.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[story.status] || 'bg-gray-100'}`}>
                    {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                  </span>
                  {story.ai_draft_text && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-semibold">
                      AI Draft
                    </span>
                  )}
                </div>
                {story.excerpt && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{story.excerpt}</p>
                )}
                <div className="flex gap-2">
                  <Link
                    to={`/admin/schools/${schoolSlug}/story-library/${story.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm text-center"
                  >
                    Edit
                  </Link>
                  {story.status === 'published' && story.public_url && (
                    <a
                      href={story.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                  )}
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No stories found</p>
        </div>
      )}
    </AdminShell>
  );
}