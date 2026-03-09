import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Eye, Edit, Trash2, Calendar, Sparkles, Archive } from 'lucide-react';

export default function AdminSchoolEvents() {
  const { schoolSlug } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-700 mt-1">{events.length} events</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              {event.cover_image && (
                <img src={event.cover_image} alt={event.title} className="w-full h-40 object-cover rounded-lg mb-4" />
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Calendar className="h-4 w-4" />
                {new Date(event.event_date).toLocaleDateString()}
              </div>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{event.summary}</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(event)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No events yet</p>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedEvent && (
        <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
          <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Event Details</h2>
            <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-4">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 -mx-6 px-6 pb-4">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'content', label: 'Content' },
                { id: 'ai', label: 'AI Recap' },
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
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Title</p>
                  <p className="text-gray-900 font-medium">{selectedEvent.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Date & Location</p>
                  <p className="text-gray-700">{new Date(selectedEvent.event_date).toLocaleDateString()}</p>
                  <p className="text-gray-700">{selectedEvent.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Summary</p>
                  <p className="text-gray-700 text-sm">{selectedEvent.summary}</p>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-700">Stories, galleries, videos, and spotlights linked to this event</p>
                <Button variant="outline" className="w-full text-left">Add Content</Button>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Event Recap
                </Button>
                <p className="text-xs text-gray-600">AI will create a summary from linked submissions</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-6 space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Publish Event
            </Button>
            <Button variant="outline" className="w-full">
              Edit
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-red-600"
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