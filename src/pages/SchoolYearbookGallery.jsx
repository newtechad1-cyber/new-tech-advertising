import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { ArrowLeft } from 'lucide-react';

export default function SchoolYearbookGallery() {
  const { schoolSlug, gallerySlug } = useParams();
  const [gallery, setGallery] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const galleriesData = await base44.entities.YearbookGalleries.filter({
          school_slug: schoolSlug,
          slug: gallerySlug,
        });
        
        if (galleriesData.length > 0) {
          const currentGallery = galleriesData[0];
          setGallery(currentGallery);
          setImages(JSON.parse(currentGallery.image_urls || '[]'));
        }
      } catch (error) {
        console.error('Error loading gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, gallerySlug]);

  if (loading) return <PublicShell currentPath="yearbook"><div className="text-center py-12">Loading...</div></PublicShell>;
  if (!gallery) return <PublicShell currentPath="yearbook"><div className="text-center py-12">Gallery not found</div></PublicShell>;

  return (
    <PublicShell currentPath="yearbook">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to={`/schools/${schoolSlug}/yearbook`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Yearbook
        </Link>

        <h1 className="text-4xl font-bold mb-4">{gallery.name}</h1>
        {gallery.description && <p className="text-gray-700 text-lg mb-8">{gallery.description}</p>}

        {/* Gallery Grid */}
        {images.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {images.map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt={`${gallery.name} ${idx + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No images in this gallery.</p>
          </div>
        )}
      </div>
    </PublicShell>
  );
}