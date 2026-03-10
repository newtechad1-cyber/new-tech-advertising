import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams, Link } from 'react-router-dom';
import AdminShell from '@/components/school-tv/AdminShell';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Eye, Trash2, BookOpen } from 'lucide-react';

export default function AdminSchoolYearbook() {
  const { schoolSlug } = useParams();
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const seasonsData = await base44.entities.YearbookSeasons.filter({
          school_slug: schoolSlug,
        });
        setSeasons(seasonsData);
        if (seasonsData.length > 0) {
          setSelectedSeason(seasonsData[0].id);
          const pagesData = await base44.entities.YearbookPages.filter({
            season_id: seasonsData[0].id,
          });
          setPages(pagesData);
        }
      } catch (error) {
        console.error('Error loading yearbook:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  const handleSeasonChange = async (seasonId) => {
    setSelectedSeason(seasonId);
    try {
      const pagesData = await base44.entities.YearbookPages.filter({
        season_id: seasonId,
      });
      setPages(pagesData);
    } catch (error) {
      console.error('Error loading pages:', error);
    }
  };

  if (loading) {
    return (
      <AdminShell schoolSlug={schoolSlug}>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell schoolSlug={schoolSlug}>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Digital Yearbook</h1>
        <p className="text-gray-600 mb-8">Organize and manage yearbook seasons and pages</p>

        {/* Season Selector */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <p className="font-semibold text-gray-900 mb-4">Select Season</p>
          <div className="flex gap-3 flex-wrap">
            {seasons.map((season) => (
              <Button
                key={season.id}
                variant={selectedSeason === season.id ? 'default' : 'outline'}
                onClick={() => handleSeasonChange(season.id)}
              >
                {season.name}
              </Button>
            ))}
            <Link
              to={`/admin/schools/${schoolSlug}/yearbook/seasons/new`}
              className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold"
            >
              <Plus className="h-4 w-4" />
              New Season
            </Link>
          </div>
        </div>

        {/* Pages List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Pages</h2>
            {selectedSeason && (
              <Link
                to={`/admin/schools/${schoolSlug}/yearbook/pages/new?season=${selectedSeason}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                <Plus className="h-4 w-4" />
                New Page
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {pages.map((page) => (
              <div key={page.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {page.cover_image && (
                  <img src={page.cover_image} alt={page.title} className="w-full h-32 object-cover rounded mb-3" />
                )}
                <h3 className="font-bold text-gray-900 mb-1">{page.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{page.slug}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-3 ${
                  page.status === 'published' ? 'bg-green-100 text-green-800' :
                  page.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {page.status || 'draft'}
                </span>
                <div className="flex gap-2">
                  {page.public_url && (
                    <a 
                      href={page.public_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                  )}
                  <Link 
                    to={`/admin/schools/${schoolSlug}/yearbook/pages/${page.id}`}
                    className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button 
                    onClick={async () => {
                      if (confirm('Delete this page?')) {
                        try {
                          await base44.entities.YearbookPages.delete(page.id);
                          setPages(pages.filter(p => p.id !== page.id));
                        } catch (error) {
                          console.error('Error deleting page:', error);
                        }
                      }
                    }}
                    className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pages.length === 0 && (
            <div className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No pages created yet</p>
              {selectedSeason && (
                <Link
                  to={`/admin/schools/${schoolSlug}/yearbook/pages/new?season=${selectedSeason}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  Create First Page
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}