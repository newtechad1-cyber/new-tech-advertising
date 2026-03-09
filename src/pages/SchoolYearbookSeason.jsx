import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { ArrowLeft } from 'lucide-react';

export default function SchoolYearbookSeason() {
  const { schoolSlug, seasonSlug } = useParams();
  const [season, setSeason] = useState(null);
  const [categories, setCategories] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const seasonsData = await base44.entities.YearbookSeasons.filter({
          school_slug: schoolSlug,
          slug: seasonSlug,
        });
        
        if (seasonsData.length > 0) {
          const currentSeason = seasonsData[0];
          setSeason(currentSeason);
          
          const [categoriesData, galleriesData] = await Promise.all([
            base44.entities.YearbookCategories.filter({
              school_slug: schoolSlug,
              season_id: currentSeason.id,
              status: 'published',
            }),
            base44.entities.YearbookGalleries.filter({
              school_slug: schoolSlug,
              season_id: currentSeason.id,
              status: 'published',
            }),
          ]);
          
          setCategories(categoriesData.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
          setGalleries(galleriesData.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
        }
      } catch (error) {
        console.error('Error loading season:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, seasonSlug]);

  if (loading) return <PublicShell currentPath="yearbook"><div className="text-center py-12">Loading...</div></PublicShell>;
  if (!season) return <PublicShell currentPath="yearbook"><div className="text-center py-12">Season not found</div></PublicShell>;

  return (
    <PublicShell currentPath="yearbook">
      {/* Cover Hero */}
      <div className="relative h-96 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
        {season.cover_image_url && (
          <img src={season.cover_image_url} alt={season.name} className="w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-6xl font-black mb-4">{season.name}</h1>
          {season.description && <p className="text-xl text-slate-200 max-w-2xl">{season.description}</p>}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to={`/schools/${schoolSlug}/yearbook`} className="text-blue-600 hover:text-blue-800 mb-8 flex items-center gap-2 font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to Yearbooks
        </Link>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-16">
            <div className="mb-10">
              <h2 className="text-4xl font-black mb-2">Browse by Category</h2>
              <p className="text-gray-600 text-lg">Explore memories organized by school activities and achievements</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/schools/${schoolSlug}/yearbook/category/${cat.slug}`}
                  className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    {cat.cover_image_url ? (
                      <img src={cat.cover_image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                        <span className="text-6xl">📚</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black mb-3 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                    {cat.description && <p className="text-gray-600 line-clamp-2">{cat.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Galleries */}
        {galleries.length > 0 && (
          <div>
            <div className="mb-10">
              <h2 className="text-4xl font-black mb-2">Photo Galleries</h2>
              <p className="text-gray-600 text-lg">Curated collections of moments that matter</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {galleries.map((gallery) => (
                <Link
                  key={gallery.id}
                  to={`/schools/${schoolSlug}/yearbook/gallery/${gallery.slug}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    {gallery.image_urls && JSON.parse(gallery.image_urls || '[]')[0] ? (
                      <img src={JSON.parse(gallery.image_urls)[0]} alt={gallery.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl">🖼️</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-lg mb-2 group-hover:text-blue-600 transition-colors">{gallery.name}</h3>
                    {gallery.description && <p className="text-gray-600 text-sm line-clamp-2">{gallery.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicShell>
  );
}