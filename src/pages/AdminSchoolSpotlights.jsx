import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Plus, Search, Eye } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-red-100 text-red-800',
};

export default function AdminSchoolSpotlights() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const [spotlights, setSpotlights] = useState([]);
  const [filteredSpotlights, setFilteredSpotlights] = useState([]);
  const [spotlightTypes, setSpotlightTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFeatured, setSelectedFeatured] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [spotlightsData, typesData] = await Promise.all([
          base44.entities.Spotlights.filter({
            school_slug: schoolSlug,
          }),
          base44.entities.SpotlightTypes.filter({
            school_slug: schoolSlug,
          }),
        ]);

        setSpotlights(spotlightsData.sort((a, b) => new Date(b.updated_date || b.created_date) - new Date(a.updated_date || a.created_date)));
        setSpotlightTypes(typesData);
      } catch (error) {
        console.error('Error loading spotlights:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  useEffect(() => {
    let filtered = spotlights;

    if (selectedType !== 'all') {
      filtered = filtered.filter(s => s.spotlight_type_id === selectedType);
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }
    if (selectedFeatured !== 'all') {
      filtered = filtered.filter(s => 
        selectedFeatured === 'featured' ? s.featured : !s.featured
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.subject_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSpotlights(filtered);
  }, [spotlights, selectedType, selectedStatus, selectedFeatured, searchTerm]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Spotlights</h1>
          <p className="text-gray-600">Create and manage student and staff spotlights</p>
        </div>
        <Link
          to={`/admin/schools/${schoolSlug}/spotlights/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> New Spotlight
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Spotlight Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {spotlightTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
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
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
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
        </div>

        <button
          onClick={() => {
            setSelectedType('all');
            setSelectedStatus('all');
            setSelectedFeatured('all');
            setSearchTerm('');
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
        >
          Clear All Filters
        </button>
      </div>

      {/* Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredSpotlights.length} of {spotlights.length} spotlights
      </div>

      {/* Spotlights Grid */}
      {filteredSpotlights.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredSpotlights.map((spotlight) => (
            <Link
              key={spotlight.id}
              to={`/admin/schools/${schoolSlug}/spotlights/${spotlight.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {spotlight.featured_image_url && (
                <img src={spotlight.featured_image_url} alt={spotlight.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-bold">{spotlight.title}</h3>
                    <p className="text-sm text-gray-600">{spotlight.summary ? spotlight.summary.substring(0, 80) + '...' : ''}</p>
                  </div>
                  {spotlight.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
                      Featured
                    </span>
                  )}
                </div>

                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[spotlight.status] || 'bg-gray-100'} mb-4`}>
                  {spotlight.status}
                </span>

                {spotlight.summary && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{spotlight.summary}</p>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    Edit
                  </button>
                  {spotlight.status === 'published' && spotlight.public_url && (
                    <a
                      href={spotlight.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg mb-2">No spotlights found</p>
          <p className="text-sm text-gray-400 mb-6">Celebrate students and staff by creating your first spotlight.</p>
          <Link
            to={`/admin/schools/${schoolSlug}/spotlights/new`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            <Plus className="h-4 w-4" /> Create First Spotlight
          </Link>
        </div>
      )}
    </AdminShell>
  );
}