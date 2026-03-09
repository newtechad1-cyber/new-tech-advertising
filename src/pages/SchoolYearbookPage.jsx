import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { ArrowLeft } from 'lucide-react';

export default function SchoolYearbookPage() {
  const { schoolSlug, storySlug } = useParams();
  const [page, setPage] = useState(null);
  const [pageItems, setPageItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pagesData = await base44.entities.YearbookPages.filter({
          school_slug: schoolSlug,
          slug: storySlug,
        });
        
        if (pagesData.length > 0) {
          const currentPage = pagesData[0];
          setPage(currentPage);
          
          const itemsData = await base44.entities.YearbookPageItems.filter({
            school_slug: schoolSlug,
            page_id: currentPage.id,
          });
          
          setPageItems(itemsData.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
        }
      } catch (error) {
        console.error('Error loading page:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, storySlug]);

  if (loading) return <PublicShell currentPath="yearbook"><div className="text-center py-12">Loading...</div></PublicShell>;
  if (!page) return <PublicShell currentPath="yearbook"><div className="text-center py-12">Page not found</div></PublicShell>;

  return (
    <PublicShell currentPath="yearbook">
      <div className="bg-white">
        {page.featured_image_url && (
          <div className="w-full h-96 overflow-hidden">
            <img src={page.featured_image_url} alt={page.title} className="w-full h-full object-cover" />
          </div>
        )}

        <article className="max-w-3xl mx-auto px-6 py-12">
          <Link to={`/schools/${schoolSlug}/yearbook`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Yearbook
          </Link>

          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>

          {page.description && (
            <p className="text-xl text-gray-700 mb-8">{page.description}</p>
          )}

          {/* Page Items */}
          {pageItems.length > 0 && (
            <div className="my-12 space-y-8">
              {pageItems.map((item) => (
                <div key={item.id}>
                  {item.content_url && item.item_type === 'photo' && (
                    <img src={item.content_url} alt={item.title} className="w-full rounded-lg shadow-md mb-4" />
                  )}
                  {item.title && <h3 className="text-2xl font-bold mb-2">{item.title}</h3>}
                  {item.description && <p className="text-gray-700 mb-4">{item.description}</p>}
                </div>
              ))}
            </div>
          )}

          {page.body_text && (
            <div className="prose prose-lg max-w-none">
              {page.body_text}
            </div>
          )}
        </article>
      </div>
    </PublicShell>
  );
}