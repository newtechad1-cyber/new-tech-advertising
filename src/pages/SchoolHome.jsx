import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { ArrowRight, Play, Calendar, Star } from 'lucide-react';
import { getSchoolColors } from '@/components/school-tv/useSchoolBrandingColors';

export default function SchoolHome() {
  const { schoolSlug: paramSlug } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const schoolSlug = paramSlug || searchParams.get('school') || 'hampton-dumont';
  const schoolColors = getSchoolColors(schoolSlug);
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
          base44.entities.Stories.filter({ school_slug: schoolSlug, featured: true, visibility: 'public', status: 'published' }),
          base44.entities.VideoProjects.filter({ school_slug: schoolSlug, status: 'published', publish_to_gallery: true }),
          base44.entities.SchoolEvents.filter({ school_slug: schoolSlug, featured: true, status: 'published' }),
          base44.entities.Spotlights.filter({ school_slug: schoolSlug, featured: true, status: 'published' }),
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

  if (loading) return <PublicShell currentPath="home" schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></PublicShell>;

  return (
    <PublicShell currentPath="home" schoolSlug={schoolSlug}>
      {/* Hero */}
      <div className={`relative bg-gradient-to-br ${schoolSlug === 'hampton-dumont' ? 'from-red-700 via-red-600 to-black' : 'from-slate-950 via-slate-900 to-slate-800'} text-white py-20 md:py-32 overflow-hidden`}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: schoolSlug === 'hampton-dumont' ? 'radial-gradient(circle at 20% 50%, #dc2626 0%, transparent 50%), radial-gradient(circle at 80% 80%, #000000 0%, transparent 50%)' : 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 80%, #8b5cf6 0%, transparent 50%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">
          <div className={`mb-6 inline-flex items-center px-4 py-2 rounded-full ${schoolSlug === 'hampton-dumont' ? 'bg-red-500/30 border border-red-400/50' : 'bg-blue-500/30 border border-blue-400/50'} backdrop-blur`}>
            <p className={`text-xs md:text-sm font-semibold ${schoolSlug === 'hampton-dumont' ? 'text-red-100' : 'text-blue-100'}`}>✨ Share Your Story</p>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight tracking-tight">{branding?.network_name || 'School Story Lab'}</h1>
          <p className="text-xl md:text-3xl text-slate-100 mb-6 md:mb-8 max-w-3xl leading-relaxed font-semibold">{branding?.intro_text || 'Celebrating every achievement, moment, and memory that makes our school community special'}</p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <Link to={`/schools/${schoolSlug}/tv`} className={`bg-gradient-to-r ${schoolSlug === 'hampton-dumont' ? 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' : 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:shadow-2xl text-base md:text-lg shadow-lg`}>
              <Play className="h-6 md:h-7 w-6 md:w-7" /> Watch Videos
            </Link>
            <Link to={`/schools/${schoolSlug}/stories`} className="bg-white/15 hover:bg-white/25 backdrop-blur text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all border border-white/30 hover:border-white/50 text-base md:text-lg">
              Read Stories <ArrowRight className="h-6 md:h-7 w-6 md:w-7" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="py-16 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="mb-12 md:mb-16">
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${schoolSlug === 'hampton-dumont' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} font-semibold text-sm mb-4`}>📖 Featured Stories</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">Stories That Matter</h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl">Real achievements, real moments, real pride from our school community</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {featuredStories.map((story) => (
                <Link key={story.id} to={`/schools/${schoolSlug}/stories/${story.slug}`} className="group bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-gray-100">
                  <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                    {story.featured_image_url && <img src={story.featured_image_url} alt={story.title} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-8">
                    <h3 className={`font-black text-xl mb-3 line-clamp-2 group-hover:${schoolSlug === 'hampton-dumont' ? 'text-red-600' : 'text-blue-600'} transition-colors leading-tight`}>{story.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed">{story.excerpt || story.body?.substring(0, 100)}</p>
                    <div className={`flex items-center gap-2 ${schoolSlug === 'hampton-dumont' ? 'text-red-600' : 'text-blue-600'} font-bold text-sm group-hover:gap-3 transition-all`}>Read Story <ArrowRight className="h-5 w-5" /></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Videos */}
      {featuredVideos.length > 0 && (
        <section className="py-16 md:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="mb-12 md:mb-16">
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${schoolSlug === 'hampton-dumont' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} font-semibold text-sm mb-4`}>🎬 Video Gallery</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">Watch Our Videos</h2>
              <p className="text-gray-600 text-lg md:text-xl">Curated highlights celebrating our school community</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {featuredVideos.map((video) => (
                <Link key={video.id} to={`/schools/${schoolSlug}/tv/watch/${video.slug}`} className="group bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-gray-100">
                  {video.cover_image_url ? (
                    <div className="relative h-56 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
                      <img src={video.cover_image_url} alt={video.title} className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-125 flex items-center justify-center transition-all shadow-lg">
                          <Play className="text-slate-900 h-7 w-7 ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                      <Play className="text-white h-16 w-16" />
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className={`font-bold text-lg mb-2 line-clamp-2 group-hover:${schoolSlug === 'hampton-dumont' ? 'text-red-600' : 'text-blue-600'} transition-colors`}>{video.title}</h3>
                    <p className="text-gray-600 text-sm capitalize">{video.project_type?.replace(/_/g, ' ') || 'Video'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Spotlights */}
      {spotlights.length > 0 && (
        <section className="py-16 md:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="mb-12 md:mb-16 flex items-center gap-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
                <Star className="h-4 w-4 mr-2" /> Spotlights
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">Meet Our Community Stars</h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-12">Celebrating the students, staff, and community members who make H-D special</p>
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              {spotlights.map((spotlight) => (
                <Link key={spotlight.id} to={`/schools/${schoolSlug}/spotlights/${spotlight.slug}`} className="group bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-gray-100">
                  <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                    {spotlight.featured_image_url && <img src={spotlight.featured_image_url} alt={spotlight.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-8">
                    <h3 className="font-black text-2xl mb-2 text-gray-900 group-hover:text-yellow-600 transition-colors">{spotlight.title}</h3>
                    <p className="text-gray-600 line-clamp-2 leading-relaxed">{spotlight.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 md:py-28">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="mb-12 md:mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-semibold text-sm mb-4">
                <Calendar className="h-4 w-4 mr-2" /> Events
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">What's Coming Up</h2>
              <p className="text-gray-600 text-lg md:text-xl">Don't miss these important Bulldog events and celebrations</p>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Link key={event.id} to={`/schools/${schoolSlug}/events/${event.slug}`} className="group bg-white rounded-2xl shadow-md p-8 hover:shadow-xl hover:bg-gray-50 transition-all duration-300 border border-gray-100 hover:border-pink-200 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-pink-600 transition-colors">{event.title}</h3>
                    <div className="space-y-2">
                      {event.location && <p className="text-gray-700 font-semibold">📍 {event.location}</p>}
                      <p className="text-lg text-gray-700 font-semibold">
                        📅 {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        {event.event_time && ` • ${event.event_time}`}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-pink-400 group-hover:text-pink-600 transition-colors flex-shrink-0 ml-4" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={`py-20 md:py-32 bg-gradient-to-br ${schoolSlug === 'hampton-dumont' ? 'from-red-700 via-red-600 to-black' : 'from-blue-700 via-blue-600 to-purple-700'} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 0%, transparent 50%), radial-gradient(circle at 80% 80%, #ffffff 0%, transparent 50%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Have a Story to Share?</h2>
          <p className="text-lg md:text-xl mb-4 text-blue-50 font-semibold">Your voice matters. Contribute to {branding?.school_name}</p>
          <p className="text-sm md:text-base text-blue-100 mb-10">{branding?.upload_instructions || 'Videos, photos, moments—anything that celebrates our community'}</p>
          <Link to={`/schools/${schoolSlug}/submit`} className={`inline-block bg-white ${schoolSlug === 'hampton-dumont' ? 'text-red-700 hover:bg-red-50' : 'text-blue-700 hover:bg-blue-50'} px-10 md:px-12 py-4 md:py-5 rounded-xl font-bold transition-all hover:shadow-2xl text-base md:text-lg shadow-xl hover:scale-105`}>
            Submit Your Content →
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}