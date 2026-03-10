import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Plus, Search, Eye, Zap } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-red-100 text-red-800',
};

const EVENT_TYPE_COLORS = {
  game: 'bg-red-100 text-red-800',
  concert: 'bg-purple-100 text-purple-800',
  play: 'bg-pink-100 text-pink-800',
  assembly: 'bg-blue-100 text-blue-800',
  competition: 'bg-orange-100 text-orange-800',
  celebration: 'bg-green-100 text-green-800',
  academic: 'bg-indigo-100 text-indigo-800',
  social: 'bg-cyan-100 text-cyan-800',
  other: 'bg-gray-100 text-gray-800',
};

export default function AdminSchoolEvents() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFeatured, setSelectedFeatured] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.SchoolEvents.filter({
          school_slug: schoolSlug,
        });
        setEvents(data.sort((a, b) => new Date(b.event_date) - new Date(a.event_date)));
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  useEffect(() => {
    let filtered = events;

    if (selectedType !== 'all') {
      filtered = filtered.filter(e => e.event_type === selectedType);
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(e => e.status === selectedStatus);
    }
    if (selectedFeatured !== 'all') {
      filtered = filtered.filter(e => 
        selectedFeatured === 'featured' ? e.featured : !e.featured
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, selectedType, selectedStatus, selectedFeatured, searchTerm]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">School Events</h1>
          <p className="text-gray-600">Organize upcoming events and link to content</p>
        </div>
        <Link
          to={`/admin/schools/${schoolSlug}/events/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> New Event
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
                placeholder="Search by event name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="game">Game</option>
              <option value="concert">Concert</option>
              <option value="play">Play</option>
              <option value="assembly">Assembly</option>
              <option value="competition">Competition</option>
              <option value="celebration">Celebration</option>
              <option value="academic">Academic</option>
              <option value="social">Social</option>
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
        Showing {filteredEvents.length} of {events.length} events
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Content</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEvents.map((event) => {
                  const linkedCount = event.linked_story_ids 
                    ? JSON.parse(event.linked_story_ids || '[]').length 
                    : 0;
                  
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 max-w-xs truncate">
                        {event.featured && <span className="inline-block mr-2 text-yellow-500">⭐</span>}
                        {event.title}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.other}`}>
                          {event.event_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(event.event_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[event.status] || 'bg-gray-100'}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {linkedCount} items
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          to={`/admin/schools/${schoolSlug}/events/${event.id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}