import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useSchoolBranding } from '@/components/school-tv/useSchoolBranding';
import SchoolTVHeader from '@/components/school-tv/SchoolTVHeader';
import VideoCard from '@/components/school-tv/VideoCard';
import { createPageUrl } from '@/utils';
import { Play, Share2, Calendar, Tag } from 'lucide-react';

export default function BulldogTVWatch() {
  const { branding } = useSchoolBranding();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [copied, setCopied] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  useEffect(() => {
    if (!slug) return;
    base44.entities.SchoolVideoProjects.filter({ status: 'published' }).then(all => {
      const found = all.find(p => p.slug === slug || p.id === slug);
      if (found) {
        setProject(found);
        const rel = all.filter(p => p.id !== found.id && (p.activity_type === found.activity_type || p.project_type === found.project_type)).slice(0, 3);
        setRelated(rel);
      }
    });
  }, [slug]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!project) return (
    <div className="min-h-screen bg-slate-50">
      <SchoolTVHeader branding={branding} />
      <div className="flex items-center justify-center py-32 text-slate-400">Loading...</div>
    </div>
  );

  const date = project.published_date ? new Date(project.published_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div className="min-h-screen bg-slate-50">
      <SchoolTVHeader branding={branding} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 mb-10">
          {/* Video player area */}
          <div className="relative aspect-video bg-slate-900">
            {project.public_video_url ? (
              <video src={project.public_video_url} controls className="w-full h-full" poster={project.cover_image} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                {project.cover_image && <img src={project.cover_image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3"><Play className="w-8 h-8 text-white ml-1" /></div>
                  <p className="text-white/70 text-sm">Video coming soon</p>
                </div>
              </div>
            )}
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.activity_type && <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold capitalize">{project.activity_type === 'sports' && '⚽'} {project.activity_type === 'music' && '🎵'} {project.activity_type === 'arts' && '🎨'} {project.activity_type === 'clubs' && '🎯'} {project.activity_type.replace(/_/g,' ')}</span>}
                  {project.project_type && <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold capitalize">{project.project_type.replace(/_/g,' ')}</span>}
                  {project.team_or_group && <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">👥 {project.team_or_group}</span>}
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 leading-tight">{project.generated_title || project.title}</h1>
                <p className="text-slate-600 text-base leading-relaxed">{project.generated_description || project.description}</p>
              </div>
              <button onClick={copyUrl} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors shrink-0">
                <Share2 className="w-4 h-4" /> {copied ? '✓ Copied' : 'Share'}
              </button>
            </div>
            {date && <div className="flex items-center gap-2 text-sm text-slate-500"><Calendar className="w-4 h-4" /> <span className="font-medium">{date}</span></div>}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-bold text-slate-800 text-lg uppercase tracking-wide mb-6">📺 More Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map(p => <VideoCard key={p.id} project={p} />)}
            </div>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-slate-200 text-center">
          <Link to={createPageUrl('BulldogTV')} style={{ color: branding.primary_color }} className="font-semibold hover:underline text-base">← Back to {branding.network_name}</Link>
        </div>
      </div>

      <footer style={{ backgroundColor: branding.primary_color }} className="mt-16 py-8 px-4 text-center text-white/60 text-sm">
        <p>{branding.district_name} · {branding.outro_text}</p>
      </footer>
    </div>
  );
}