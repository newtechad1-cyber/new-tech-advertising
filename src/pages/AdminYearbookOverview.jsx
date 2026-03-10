import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Plus, Eye, Edit, Trash2, Search } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  review: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-red-100 text-red-800',
};

export default function AdminYearbookOverview() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const [seasons, setSeasons] = useState([]);
  const [filteredSeasons, setFilteredSeasons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('seasons'); // seasons, categories, pages

  useEffect(() => {
    const loadData = async () => {
      try {
        const [seasonsData, categoriesData] = await Promise.all([
          base44.entities.YearbookSeasons.filter({
            school_slug: schoolSlug,
          }),
          base44.entities.YearbookCategories.filter({
            school_slug: schoolSlug,
          }),
        ]);
        
        setSeasons(seasonsData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
        setCategories(categoriesData.sort((a, b) => a.sort_order - b.sort_order));
      } catch (error) {
        console.error('Error loading yearbook data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  useEffect(() => {
    let filtered = seasons;
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.school_year.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredSeasons(filtered);
  }, [seasons, selectedStatus, searchTerm]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Digital Yearbook</h1>
          <p className="text-gray-600">Create and manage yearbook seasons and pages</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" /> New Season
        </button>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border-b border-gray-200 flex gap-4">
        <button
          onClick={() => setActiveView('seasons')}
          className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${
            activeView === 'seasons'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Seasons
        </button>
        <button
          onClick={() => setActiveView('categories')}
          className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${
            activeView === 'categories'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveView('pages')}
          className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${
            activeView === 'pages'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Pages
        </button>
      </div>

      {/* Seasons View */}
      {activeView === 'seasons' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or year..."
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
                  <option value="in_progress">In Progress</option>
                  <option value="review">Under Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seasons Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredSeasons.map((season) => (
              <Link
                key={season.id}
                to={`${createPageUrl('AdminYearbookSeason')}?id=${season.id}&schoolSlug=${schoolSlug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {season.cover_image_url && (
                  <img src={season.cover_image_url} alt={season.name} className="w-full h-40 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold">{season.name}</h3>
                      <p className="text-sm text-gray-600">School Year {season.school_year}</p>
                    </div>
                    {season.featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[season.status] || 'bg-gray-100'} mb-4`}>
                    {season.status.replace(/_/g, ' ')}
                  </span>

                  {season.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{season.description}</p>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                      <Edit className="h-4 w-4" /> Edit
                    </button>
                    {season.publish_status === 'published' && (
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categories View */}
      {activeView === 'categories' && (
        <div className="space-y-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5" /> New Category
          </button>

          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{category.category_type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[category.status] || 'bg-gray-100'}`}>
                    {category.status}
                  </span>
                </div>
                {category.description && (
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                )}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    Edit
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Pages View */}
      {activeView === 'pages' && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center py-12">
          <p className="text-gray-500">View and manage all yearbook pages across all seasons</p>
          <p className="text-gray-400 text-sm mt-2">Select a season to manage its pages</p>
        </div>
      )}
    </AdminShell>
  );
}