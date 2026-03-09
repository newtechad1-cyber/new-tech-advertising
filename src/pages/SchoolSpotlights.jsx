import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, Star } from 'lucide-react';

export default function SchoolSpotlights() {
  const { schoolSlug } = useParams();
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.Spotlights.filter({
          school_slug: schoolSlug,
          publish_status: 'published',
          visibility: { $in: ['public', 'staff'] },
        });
        setSpotlights(data);
      } catch (error) {
        console.error('Error loading spotlights:', error);
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Spotlights</h1>
          <p className="text-lg text-gray-700">Meet the people making a difference at our school</p>
        </div>
      </div>

      {/* Spotlights Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {spotlights.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No spotlights available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {spotlights.map((spotlight) => (
              <article
                key={spotlight.id}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
              >
                {spotlight.cover_image && (
                  <img src={spotlight.cover_image} alt={spotlight.featured_name} className="w-full h-56 object-cover" />
                )}
                <div className="p-6">
                  {spotlight.featured && <Star className="h-5 w-5 text-yellow-500 mb-2" />}
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{spotlight.featured_name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{spotlight.featured_role}</p>
                  <p className="text-gray-700 mb-4 line-clamp-3">{spotlight.excerpt || spotlight.body}</p>
                  {spotlight.quote_text && (
                    <blockquote className="text-sm italic text-gray-700 border-l-4 border-blue-600 pl-4 mb-4">
                      {spotlight.quote_text}
                    </blockquote>
                  )}
                  <Button variant="outline" size="sm">
                    Read Full Profile
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}