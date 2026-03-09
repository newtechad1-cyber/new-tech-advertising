import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function SchoolEvents() {
  const { schoolSlug } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const eventsData = await base44.entities.SchoolEvents.filter({
          school_slug: schoolSlug,
          status: 'published',
        });
        setEvents(eventsData.sort((a, b) => new Date(a.event_date) - new Date(b.event_date)));
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  if (loading) return <PublicShell currentPath="events"><div className="text-center py-12">Loading...</div></PublicShell>;

  return (
    <PublicShell currentPath="events">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Events</h1>
          <p className="text-slate-200">Upcoming events and celebrations</p>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {events.length > 0 ? (
          <div className="space-y-6">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/schools/${schoolSlug}/events/${event.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex md:flex-row flex-col">
                  {event.cover_image_url && (
                    <img src={event.cover_image_url} alt={event.title} className="w-full md:w-48 h-48 object-cover" />
                  )}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4">{event.summary}</p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        {event.event_time && ` at ${event.event_time}`}
                      </p>
                      {event.location && (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex items-center">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No upcoming events.</p>
          </div>
        )}
      </div>
    </PublicShell>
  );
}