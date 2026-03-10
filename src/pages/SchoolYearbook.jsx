import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function SchoolYearbook() {
  const { schoolSlug: paramSlug } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const schoolSlug = paramSlug || searchParams.get('schoolSlug') || 'hampton-dumont';
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

  if (loading) return <PublicShell currentPath="yearbook" schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></PublicShell>;

  return (
    <PublicShell currentPath="yearbook" schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 80% 80%, #3b82f6 0%, transparent 50%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-5xl md:text-7xl font-black mb-4 flex items-center gap-4 leading-tight">
            <BookOpen className="h-14 md:h-16 w-14 md:w-16" /> Digital Yearbook
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 font-semibold">Preserve memories. Celebrate milestones. Honor achievements.</p>
        </div>
      </div>

      {/* Seasons Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        {seasons.length > 0 ? (
          <>
            <div className="mb-12">
              <p className="text-center text-gray-600 text-lg md:text-xl mb-4">Explore our digital archives</p>
              <p className="text-center text-gray-500">{seasons.length} {seasons.length === 1 ? 'yearbook' : 'yearbooks'} capturing the spirit of our school</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {seasons.map((season) => (
                <Link
                  key={season.id}
                  to={`/schools/${schoolSlug}/yearbook/season/${season.slug}`}
                  className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-gray-100"
                >
                  <div className="relative h-72 bg-gradient-to-br from-slate-300 to-slate-400 overflow-hidden">
                    {season.cover_image_url && (
                      <img src={season.cover_image_url} alt={season.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-end p-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-bold text-lg">Explore this yearbook →</p>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-3xl font-black mb-3 text-gray-900">{season.name}</h3>
                    {season.description && (
                      <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{season.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:gap-3 transition-all">Browse <ArrowRight className="h-5 w-5" /></div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-semibold">No yearbooks published yet</p>
            <p className="text-gray-400 mt-2">Digital yearbooks will be available soon. Check back regularly!</p>
          </div>
        )}
      </div>
    </PublicShell>
  );
}