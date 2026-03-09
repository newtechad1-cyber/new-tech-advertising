import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen } from 'lucide-react';

export default function SchoolYearbook() {
  const { schoolSlug } = useParams();
  const [season, setSeason] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const seasons = await base44.entities.YearbookSeasons.filter({
          school_slug: schoolSlug,
          publish_status: 'published',
        });
        if (seasons.length > 0) {
          setSeason(seasons[0]);
          const cats = await base44.entities.YearbookCategories.filter({
            season_id: seasons[0].id,
            status: 'published',
          });
          setCategories(cats);
        }
      } catch (error) {
        console.error('Error loading yearbook:', error);
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

  if (!season) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No yearbook available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div
        className="h-96 bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: `url(${season.cover_image})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative text-center text-white px-6">
          <BookOpen className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-2">{season.title}</h1>
          <p className="text-xl">{season.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {season.intro_text && (
          <div className="prose prose-lg max-w-3xl mx-auto mb-12">
            <p>{season.intro_text}</p>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer">
              {cat.cover_image && (
                <img src={cat.cover_image} alt={cat.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-gray-700 mb-4">{cat.description}</p>
                <Button variant="outline">Explore</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}