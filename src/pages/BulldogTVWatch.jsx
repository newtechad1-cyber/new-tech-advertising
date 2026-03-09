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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 mb-8">
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
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.activity_type && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold capitalize">{project.activity_type.replace(/_/g,' ')}</span>}
                  {project.project_type && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 capitalize">{project.project_type.replace(/_/g,' ')}</span>}
                  {project.team_or_group && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{project.team_or_group}</span>}
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">{project.generated_title || project.title}</h1>
                <p className="text-slate-500 leading-relaxed">{project.generated_description || project.description}</p>
                {date && <div className="flex items-center gap-1.5 mt-3 text-sm text-slate-400"><Calendar className="w-4 h-4" /> {date}</div>}
              </div>
              <button onClick={copyUrl} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm transition-colors shrink-0">
                <Share2 className="w-4 h-4" /> {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-bold text-slate-800 text-lg mb-4">More from {branding.network_name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(p => <VideoCard key={p.id} project={p} />)}
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to={createPageUrl('BulldogTV')} className="text-blue-600 hover:underline text-sm">← Back to {branding.network_name}</Link>
        </div>
      </div>

      <footer style={{ backgroundColor: branding.primary_color }} className="mt-16 py-8 px-4 text-center text-white/60 text-sm">
        <p>{branding.district_name} · {branding.outro_text}</p>
      </footer>
    </div>
  );
}