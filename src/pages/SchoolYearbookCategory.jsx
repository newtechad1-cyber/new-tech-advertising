import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { ArrowLeft } from 'lucide-react';

export default function SchoolYearbookCategory() {
  const { schoolSlug, categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await base44.entities.YearbookCategories.filter({
          school_slug: schoolSlug,
          slug: categorySlug,
        });
        
        if (categoriesData.length > 0) {
          const currentCategory = categoriesData[0];
          setCategory(currentCategory);
          
          const pagesData = await base44.entities.YearbookPages.filter({
            school_slug: schoolSlug,
            category_id: currentCategory.id,
            status: 'published',
          });
          
          setPages(pagesData.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
        }
      } catch (error) {
        console.error('Error loading category:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, categorySlug]);

  if (loading) return <PublicShell currentPath="yearbook"><div className="text-center py-12">Loading...</div></PublicShell>;
  if (!category) return <PublicShell currentPath="yearbook"><div className="text-center py-12">Category not found</div></PublicShell>;

  return (
    <PublicShell currentPath="yearbook">
      {category.cover_image_url && (
        <div className="w-full h-80 overflow-hidden">
          <img src={category.cover_image_url} alt={category.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to={`/schools/${schoolSlug}/yearbook`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Yearbook
        </Link>

        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        {category.description && <p className="text-gray-700 text-lg mb-8">{category.description}</p>}

        {/* Pages */}
        {pages.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {pages.map((page) => (
              <Link
                key={page.id}
                to={`/schools/${schoolSlug}/yearbook/story/${page.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {page.featured_image_url && (
                  <img src={page.featured_image_url} alt={page.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{page.title}</h3>
                  {page.description && <p className="text-gray-600 line-clamp-2">{page.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No pages in this category yet.</p>
          </div>
        )}
      </div>
    </PublicShell>
  );
}