import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function SchoolVideoDetail() {
  const { schoolSlug, videoSlug } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const videosData = await base44.entities.VideoProjects.filter({
          school_slug: schoolSlug,
          slug: videoSlug,
        });
        if (videosData.length > 0) {
          setVideo(videosData[0]);
        }
      } catch (error) {
        console.error('Error loading video:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, videoSlug]);

  if (loading) return <PublicShell currentPath="tv"><div className="text-center py-12">Loading...</div></PublicShell>;
  if (!video) return <PublicShell currentPath="tv"><div className="text-center py-12">Video not found</div></PublicShell>;

  return (
    <PublicShell currentPath="tv">
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <Link to={`/schools/${schoolSlug}/tv`} className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Videos
          </Link>
          
          {video.public_video_url && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-8 shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${extractYouTubeId(video.public_video_url)}`}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}

          <h1 className="text-4xl font-bold mb-4">{video.title}</h1>
          
          {video.published_date && (
            <p className="text-slate-300 flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5" />
              {new Date(video.published_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}

          {video.description && (
            <p className="text-slate-200 text-lg">{video.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {video.objective && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About This Video</h2>
            <p className="text-gray-700">{video.objective}</p>
          </div>
        )}

        {video.target_audience && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">Target Audience</h3>
              <p className="text-gray-700">{video.target_audience}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">Tone</h3>
              <p className="text-gray-700 capitalize">{video.tone}</p>
            </div>
          </div>
        )}
      </div>
    </PublicShell>
  );
}

function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
}