import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Eye, Edit, Trash2, Calendar } from 'lucide-react';

export default function AdminSchoolEvents() {
  const { schoolSlug } = useParams();
  const [events, setEvents] = useState([]);
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
                <Button variant="ghost" size="sm">
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
    </div>
  );
}