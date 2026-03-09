import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, MapPin } from 'lucide-react';

export default function SchoolEvents() {
  const { schoolSlug } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const eventsData = await base44.entities.SchoolEvents.filter({
          school_slug: schoolSlug,
          publish_status: 'published',
          visibility: { $in: ['public', 'staff'] },
        });
        setEvents(eventsData.sort((a, b) => new Date(b.event_date) - new Date(a.event_date)));
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-lg text-gray-700">Upcoming and past school events</p>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No events found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                {event.cover_image && (
                  <img src={event.cover_image} alt={event.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex gap-6 text-gray-700 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {new Date(event.event_date).toLocaleDateString()}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">{event.summary}</p>
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}