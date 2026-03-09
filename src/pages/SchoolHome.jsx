import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { ArrowRight, Play, Calendar, Star } from 'lucide-react';

export default function SchoolHome() {
  const { schoolSlug } = useParams();
  const [branding, setBranding] = useState(null);
  const [featuredStories, setFeaturedStories] = useState([]);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [brandingData, storiesData, videosData, eventsData, spotlightsData] = await Promise.all([
          base44.entities.SchoolBranding.filter({ school_slug: schoolSlug }),
          base44.entities.Stories.filter({ school_slug: schoolSlug, featured: true, status: 'published' }),
          base44.entities.VideoProjects.filter({ school_slug: schoolSlug, status: 'published' }),
          base44.entities.SchoolEvents.filter({ school_slug: schoolSlug, featured: true, status: 'published' }),
          base44.entities.Spotlights.filter({ school_slug: schoolSlug, publish_status: 'published' }),
        ]);
        
        setBranding(brandingData[0] || null);
        setFeaturedStories(storiesData.slice(0, 3));
        setFeaturedVideos(videosData.slice(0, 3));
        setUpcomingEvents(eventsData.slice(0, 3));
        setSpotlights(spotlightsData.slice(0, 2));
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  if (loading) return <PublicShell currentPath="home"><div className="text-center py-12">Loading...</div></PublicShell>;

  return (
    <PublicShell currentPath="home">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">{branding?.network_name || 'School Story Lab'}</h1>
          <p className="text-xl text-slate-200 mb-8">Celebrating the stories, achievements, and spirit of {branding?.school_name}</p>
          <div className="flex gap-4">
            <Link to={`/schools/${schoolSlug}/stories`} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2">
              Explore Stories <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to={`/schools/${schoolSlug}/tv`} className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2">
              Watch Videos <Play className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Featured Stories</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredStories.map((story) => (
                <Link key={story.id} to={`/schools/${schoolSlug}/stories/${story.slug}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {story.featured_image_url && <img src={story.featured_image_url} alt={story.title} className="w-full h-48 object-cover" />}
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{story.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{story.excerpt || story.body?.substring(0, 100)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Videos */}
      {featuredVideos.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Latest Videos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredVideos.map((video) => (
                <Link key={video.id} to={`/schools/${schoolSlug}/tv/watch/${video.slug}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {video.cover_image_url ? (
                    <div className="relative h-48 bg-gray-900">
                      <img src={video.cover_image_url} alt={video.title} className="w-full h-full object-cover opacity-70" />
                      <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white h-12 w-12" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-300 flex items-center justify-center">
                      <Play className="text-gray-500 h-12 w-12" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-gray-600 text-sm">{video.project_type}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Spotlights */}
      {spotlights.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2"><Star className="h-8 w-8 text-yellow-500" /> Spotlights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {spotlights.map((spotlight) => (
                <Link key={spotlight.id} to={`/schools/${schoolSlug}/spotlights/${spotlight.slug}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {spotlight.featured_image_url && <img src={spotlight.featured_image_url} alt={spotlight.title} className="w-full h-48 object-cover" />}
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{spotlight.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{spotlight.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2"><Calendar className="h-8 w-8" /> Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Link key={event.id} to={`/schools/${schoolSlug}/events/${event.slug}`} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-2">{event.location}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      {event.event_time && ` at ${event.event_time}`}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a story to share?</h2>
          <p className="text-lg mb-8 text-blue-100">Submit your videos, photos, and moments to {branding?.school_name}</p>
          <Link to={`/schools/${schoolSlug}/submit`} className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold inline-block">
            Submit Content Now
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}