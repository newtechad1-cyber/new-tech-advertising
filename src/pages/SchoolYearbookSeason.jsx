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
      {season.cover_image_url && (
        <div className="w-full h-96 overflow-hidden">
          <img src={season.cover_image_url} alt={season.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to={`/schools/${schoolSlug}/yearbook`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Yearbooks
        </Link>

        <h1 className="text-4xl font-bold mb-4">{season.name}</h1>
        {season.description && <p className="text-gray-700 text-lg mb-12">{season.description}</p>}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Categories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/schools/${schoolSlug}/yearbook/category/${cat.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {cat.cover_image_url && (
                    <img src={cat.cover_image_url} alt={cat.name} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
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
            <h2 className="text-2xl font-bold mb-6">Galleries</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {galleries.map((gallery) => (
                <Link
                  key={gallery.id}
                  to={`/schools/${schoolSlug}/yearbook/gallery/${gallery.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {gallery.image_urls && JSON.parse(gallery.image_urls || '[]')[0] && (
                    <img src={JSON.parse(gallery.image_urls)[0]} alt={gallery.name} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{gallery.name}</h3>
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