import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { BookOpen } from 'lucide-react';

export default function SchoolYearbook() {
  const { schoolSlug } = useParams();
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const seasonsData = await base44.entities.YearbookSeasons.filter({
          school_slug: schoolSlug,
          publish_status: 'published',
        });
        setSeasons(seasonsData.sort((a, b) => new Date(b.end_date) - new Date(a.end_date)));
      } catch (error) {
        console.error('Error loading yearbooks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  if (loading) return <PublicShell currentPath="yearbook"><div className="text-center py-12">Loading...</div></PublicShell>;

  return (
    <PublicShell currentPath="yearbook">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="h-10 w-10" /> Digital Yearbook
          </h1>
          <p className="text-slate-200">Browse memories from past years</p>
        </div>
      </div>

      {/* Seasons Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {seasons.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {seasons.map((season) => (
              <Link
                key={season.id}
                to={`/schools/${schoolSlug}/yearbook/season/${season.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {season.cover_image_url && (
                  <img src={season.cover_image_url} alt={season.name} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{season.name}</h3>
                  {season.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{season.description}</p>
                  )}
                  <span className="text-blue-600 font-semibold hover:underline">Browse →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No yearbooks available yet.</p>
          </div>
        )}
      </div>
    </PublicShell>
  );
}