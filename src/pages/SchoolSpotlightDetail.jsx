import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { ArrowLeft, Star } from 'lucide-react';

export default function SchoolSpotlightDetail() {
  const { schoolSlug, spotlightSlug } = useParams();
  const [spotlight, setSpotlight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const spotlightsData = await base44.entities.Spotlights.filter({
          school_slug: schoolSlug,
          slug: spotlightSlug,
        });
        if (spotlightsData.length > 0) {
          setSpotlight(spotlightsData[0]);
        }
      } catch (error) {
        console.error('Error loading spotlight:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, spotlightSlug]);

  if (loading) return <PublicShell currentPath="spotlights"><div className="text-center py-12">Loading...</div></PublicShell>;
  if (!spotlight) return <PublicShell currentPath="spotlights"><div className="text-center py-12">Spotlight not found</div></PublicShell>;

  return (
    <PublicShell currentPath="spotlights">
      <div className="bg-white">
        {/* Hero */}
        {spotlight.featured_image_url && (
          <div className="w-full h-96 overflow-hidden">
            <img src={spotlight.featured_image_url} alt={spotlight.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <article className="max-w-3xl mx-auto px-6 py-12">
          <Link to={`/schools/${schoolSlug}/spotlights`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Spotlights
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Star className="h-6 w-6 text-yellow-500" />
            <span className="text-yellow-600 font-bold">Featured Spotlight</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{spotlight.title}</h1>

          {spotlight.featured_person_names && (
            <p className="text-lg text-gray-700 mb-8">
              Featuring: {JSON.parse(spotlight.featured_person_names || '[]').join(', ')}
            </p>
          )}

          {spotlight.summary && (
            <p className="text-xl text-gray-700 mb-8 font-semibold">{spotlight.summary}</p>
          )}

          {/* Media Gallery */}
          {spotlight.media_urls && JSON.parse(spotlight.media_urls || '[]').length > 0 && (
            <div className="my-12 grid md:grid-cols-2 gap-6">
              {JSON.parse(spotlight.media_urls).map((url, idx) => (
                <img key={idx} src={url} alt={`Media ${idx + 1}`} className="w-full rounded-lg shadow-md" />
              ))}
            </div>
          )}

          {/* Full Text */}
          {spotlight.full_text && (
            <div className="prose prose-lg max-w-none">
              {spotlight.full_text}
            </div>
          )}
        </article>
      </div>
    </PublicShell>
  );
}