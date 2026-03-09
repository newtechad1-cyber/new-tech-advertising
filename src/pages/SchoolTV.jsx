import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { Play } from 'lucide-react';

export default function SchoolTV() {
  const { schoolSlug } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const videosData = await base44.entities.VideoProjects.filter({
          school_slug: schoolSlug,
          status: 'published',
        });
        setVideos(videosData.sort((a, b) => new Date(b.published_date) - new Date(a.published_date)));
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  if (loading) return <PublicShell currentPath="tv"><div className="text-center py-12">Loading...</div></PublicShell>;

  return (
    <PublicShell currentPath="tv">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Video Hub</h1>
          <p className="text-slate-200">Watch highlights, recaps, and stories from our school</p>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {videos.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link
                key={video.id}
                to={`/schools/${schoolSlug}/tv/watch/${video.slug}`}
                className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-48 bg-gray-900 overflow-hidden">
                  {video.cover_image_url ? (
                    <img src={video.cover_image_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full bg-gray-700" />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="bg-white p-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">{video.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{video.project_type}</p>
                  {video.published_date && (
                    <p className="text-xs text-gray-500">
                      {new Date(video.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No videos available yet.</p>
          </div>
        )}
      </div>
    </PublicShell>
  );
}