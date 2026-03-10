import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { ArrowLeft, Save, Plus, Zap, Eye, GripVertical } from 'lucide-react';

export default function AdminYearbookSeason() {
  const { schoolSlug: paramSlug, seasonId: paramSeasonId } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const schoolSlug = paramSlug || searchParams.get('schoolSlug') || 'hampton-dumont';
  const seasonId = paramSeasonId || searchParams.get('id') || 'new';
  const [season, setSeason] = useState(null);
  const [pages, setPages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        let seasonData;
        if (seasonId === 'new') {
          seasonData = {
            school_slug: schoolSlug,
            name: '',
            slug: '',
            school_year: new Date().getFullYear().toString(),
            status: 'draft',
            publish_status: 'unpublished',
          };
        } else {
          const data = await base44.entities.YearbookSeasons.filter({
            id: seasonId,
            school_slug: schoolSlug,
          });
          seasonData = data[0] || null;
        }

        if (seasonData) {
          setSeason(seasonData);

          if (seasonId !== 'new') {
            const [pagesData, categoriesData] = await Promise.all([
              base44.entities.YearbookPages.filter({
                season_id: seasonId,
                school_slug: schoolSlug,
              }),
              base44.entities.YearbookCategories.filter({
                season_id: seasonId,
                school_slug: schoolSlug,
              }),
            ]);
            setPages(pagesData.sort((a, b) => a.sort_order - b.sort_order));
            setCategories(categoriesData.sort((a, b) => a.sort_order - b.sort_order));
          }
        }
      } catch (error) {
        console.error('Error loading season:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, seasonId]);

  const saveSeason = async () => {
    setSaving(true);
    try {
      if (seasonId === 'new') {
        const newSeason = await base44.entities.YearbookSeasons.create(season);
        window.location.href = `${createPageUrl('AdminYearbookSeason')}?id=${newSeason.id}&schoolSlug=${schoolSlug}`;
      } else {
        await base44.entities.YearbookSeasons.update(seasonId, season);
        alert('Season saved successfully!');
      }
    } catch (error) {
      console.error('Error saving season:', error);
      alert('Error saving season');
    } finally {
      setSaving(false);
    }
  };

  const publishSeason = async () => {
    try {
      await base44.entities.YearbookSeasons.update(seasonId, {
        status: 'published',
        publish_status: 'published',
        published_date: new Date().toISOString(),
      });
      setSeason(prev => ({
        ...prev,
        status: 'published',
        publish_status: 'published',
      }));
      alert('Season published!');
    } catch (error) {
      console.error('Error publishing season:', error);
      alert('Error publishing season');
    }
  };

  const generateIntro = async () => {
    try {
      await base44.entities.AIContentJobs.create({
        school_slug: schoolSlug,
        job_type: 'yearbook_intro',
        status: 'pending',
        source_entity_type: 'YearbookSeasons',
        source_entity_id: seasonId,
        requested_by: 'admin',
      });
      alert('Yearbook intro generation queued!');
    } catch (error) {
      console.error('Error queuing AI job:', error);
      alert('Error queuing AI job');
    }
  };

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;
  if (!season) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Season not found</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <Link to={`${createPageUrl('AdminYearbookOverview')}?schoolSlug=${schoolSlug}`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2 font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to Yearbook
      </Link>

      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{season.name || 'New Season'}</h1>
          <p className="text-gray-600">School Year {season.school_year}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={saveSeason}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <Save className="h-5 w-5" /> Save
          </button>
          {season.status === 'draft' && (
            <button
              onClick={publishSeason}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Publish Season
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Season Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Season Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Season Name *</label>
                <input
                  type="text"
                  value={season.name}
                  onChange={(e) => setSeason({ ...season, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2025-2026 School Year"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">School Year *</label>
                <input
                  type="text"
                  value={season.school_year}
                  onChange={(e) => setSeason({ ...season, school_year: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={season.description || ''}
                  onChange={(e) => setSeason({ ...season, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of this yearbook season..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image URL</label>
                <input
                  type="text"
                  value={season.cover_image_url || ''}
                  onChange={(e) => setSeason({ ...season, cover_image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/cover.jpg"
                />
                {season.cover_image_url && (
                  <img src={season.cover_image_url} alt="Cover" className="w-full h-48 object-cover rounded-lg mt-4" />
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={season.featured || false}
                  onChange={(e) => setSeason({ ...season, featured: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-700 font-semibold">Featured Yearbook</span>
              </label>
            </div>
          </div>

          {/* AI Tools */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" /> AI Tools
            </h3>
            <button
              onClick={generateIntro}
              className="w-full bg-white hover:bg-blue-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold"
            >
              Generate Yearbook Intro
            </button>
          </div>
        </div>

        {/* Right Column - Pages & Categories */}
        <div className="space-y-6">
          {/* Pages Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Pages ({pages.length})</h3>
              <Link
                to={`${createPageUrl('AdminYearbookPage')}?id=new&season=${seasonId}&schoolSlug=${schoolSlug}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pages.length > 0 ? (
                pages.map((page) => (
                  <Link
                    key={page.id}
                    to={`${createPageUrl('AdminYearbookPage')}?id=${page.id}&schoolSlug=${schoolSlug}`}
                    className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg group"
                  >
                    <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{page.title}</p>
                      <p className="text-xs text-gray-600">{page.category_id ? 'Category Page' : 'General'}</p>
                    </div>
                    <Eye className="h-4 w-4 text-gray-400" />
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No pages yet</p>
              )}
            </div>
          </div>

          {/* Categories Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Categories ({categories.length})</h3>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold flex items-center gap-1">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{cat.name}</p>
                      <p className="text-xs text-gray-600 capitalize">{cat.category_type}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No categories</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}