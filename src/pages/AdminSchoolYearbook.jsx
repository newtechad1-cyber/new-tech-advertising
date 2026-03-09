import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Eye, Trash2 } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolAdminNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Yearbook Management</h1>

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
            <Button variant="outline" className="text-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              New Season
            </Button>
          </div>
        </div>

        {/* Pages List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Pages</h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Page
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {pages.map((page) => (
              <div key={page.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {page.cover_image && (
                  <img src={page.cover_image} alt={page.title} className="w-full h-32 object-cover rounded mb-3" />
                )}
                <h3 className="font-bold text-gray-900 mb-1">{page.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{page.slug}</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {pages.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-600">No pages in this season yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}