import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Plus, Eye } from 'lucide-react';

export default function AdminYearbookLibrary() {
  const { schoolSlug } = useParams();
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.YearbookSeasons.filter({
          school_slug: schoolSlug,
        });
        setSeasons(data.sort((a, b) => new Date(b.end_date) - new Date(a.end_date)));
      } catch (error) {
        console.error('Error loading seasons:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Yearbook</h1>
          <p className="text-gray-600">Create and manage digital yearbook seasons</p>
        </div>
        <Link
          to={`/admin/schools/${schoolSlug}/yearbook/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> New Season
        </Link>
      </div>

      {/* Seasons Cards */}
      {seasons.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {seasons.map((season) => (
            <div key={season.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {season.cover_image_url && (
                <img src={season.cover_image_url} alt={season.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="text-xl font-bold">{season.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    season.publish_status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {season.publish_status}
                  </span>
                </div>
                {season.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{season.description}</p>
                )}
                <div className="flex gap-2">
                  <Link
                    to={`/admin/schools/${schoolSlug}/yearbook/${season.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm text-center"
                  >
                    Edit
                  </Link>
                  {season.publish_status === 'published' && season.public_url && (
                    <a
                      href={season.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No yearbook seasons yet</p>
        </div>
      )}
    </AdminShell>
  );
}