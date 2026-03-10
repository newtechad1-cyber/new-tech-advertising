import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';

export default function SchoolEventDetail() {
  const { eventSlug } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const schoolSlug = searchParams.get('school') || 'hampton-dumont';
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const eventsData = await base44.entities.SchoolEvents.filter({
          school_slug: schoolSlug,
          slug: eventSlug,
        });
        if (eventsData.length > 0) {
          setEvent(eventsData[0]);
        }
      } catch (error) {
        console.error('Error loading event:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, eventSlug]);

  if (loading) return <PublicShell currentPath="events"><div className="text-center py-12">Loading...</div></PublicShell>;
  if (!event) return <PublicShell currentPath="events"><div className="text-center py-12">Event not found</div></PublicShell>;

  return (
    <PublicShell currentPath="events">
      <div className="bg-white">
        {/* Hero */}
        {event.cover_image_url && (
          <div className="w-full h-96 overflow-hidden">
            <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <article className="max-w-3xl mx-auto px-6 py-12">
          <a href={`${createPageUrl('SchoolEvents')}?school=${schoolSlug}`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2">
             <ArrowLeft className="h-4 w-4" /> Back to Events
           </a>

          <h1 className="text-4xl font-bold mb-6">{event.title}</h1>

          <div className="space-y-4 mb-8 p-6 bg-blue-50 rounded-lg">
            <p className="flex items-center gap-3 text-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span>
                {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                {event.event_time && ` at ${event.event_time}`}
              </span>
            </p>
            {event.location && (
              <p className="flex items-center gap-3 text-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
                {event.location}
              </p>
            )}
          </div>

          {event.summary && (
            <p className="text-xl text-gray-700 mb-8">{event.summary}</p>
          )}

          {event.description && (
            <div className="prose prose-lg max-w-none">
              {event.description}
            </div>
          )}
        </article>
      </div>
    </PublicShell>
  );
}