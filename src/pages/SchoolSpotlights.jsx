import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { Star } from 'lucide-react';

export default function SchoolSpotlights() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('school') || 'hampton-dumont';
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const spotlightsData = await base44.entities.Spotlights.filter({
          school_slug: schoolSlug,
          publish_status: 'published',
        });
        setSpotlights(spotlightsData.sort((a, b) => new Date(b.published_date) - new Date(a.published_date)));
      } catch (error) {
        console.error('Error loading spotlights:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  if (loading) return <PublicShell currentPath="spotlights" schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></PublicShell>;

  return (
    <PublicShell currentPath="spotlights" schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="bg-yellow-50 py-12 border-b-4 border-yellow-400">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Star className="h-10 w-10 text-yellow-500" /> Spotlights
          </h1>
          <p className="text-gray-700">Celebrating our students, staff, and community</p>
        </div>
      </div>

      {/* Spotlights Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {spotlights.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {spotlights.map((spotlight) => (
              <a
                key={spotlight.id}
                href={`${createPageUrl('SchoolSpotlightDetail')}?school=${schoolSlug}&id=${spotlight.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {spotlight.featured_image_url && (
                  <img src={spotlight.featured_image_url} alt={spotlight.title} className="w-full h-64 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{spotlight.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{spotlight.summary}</p>
                  <span className="text-yellow-600 font-semibold hover:underline flex items-center gap-2">
                    <Star className="h-4 w-4" /> Learn More
                  </span>
                </div>
              </a>
              ))}
              </div>
              ) : (
              <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No spotlights available yet.</p>
              </div>
              )}
              </div>
              </PublicShell>
              );
}