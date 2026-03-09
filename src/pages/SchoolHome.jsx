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
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="mb-6 inline-block px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30">
            <p className="text-sm font-semibold text-blue-200">✨ School Stories</p>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-4 leading-tight">{branding?.network_name || 'School Story Lab'}</h1>
          <p className="text-2xl text-slate-200 mb-6 max-w-2xl leading-relaxed">Celebrating every achievement, moment, and memory that makes {branding?.school_name} special</p>
          <p className="text-slate-300 mb-8 text-lg">A digital archive of pride, innovation, and community</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={`/schools/${schoolSlug}/tv`} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 text-lg">
              <Play className="h-6 w-6" /> Watch Videos
            </Link>
            <Link to={`/schools/${schoolSlug}/stories`} className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 text-lg">
              Read Stories <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-4xl font-black mb-3">Featured Stories</h2>
              <p className="text-gray-600 text-lg">Real moments from our school community</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredStories.map((story) => (
                <Link key={story.id} to={`/schools/${schoolSlug}/stories/${story.slug}`} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    {story.featured_image_url && <img src={story.featured_image_url} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{story.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{story.excerpt || story.body?.substring(0, 100)}</p>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">Read More <ArrowRight className="h-4 w-4" /></div>
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-4">Share Your Story</h2>
          <p className="text-xl mb-2 text-blue-100">Your voice matters. Contribute to {branding?.school_name}</p>
          <p className="text-blue-100 mb-8">Videos, photos, moments—anything that celebrates our community</p>
          <Link to={`/schools/${schoolSlug}/submit`} className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-lg font-bold transition-all hover:scale-105 text-lg">
            Submit Content Now
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}