import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Play, Calendar } from 'lucide-react';

const ACTIVITY_COLORS = {
  sports: 'bg-red-100 text-red-700',
  classroom: 'bg-blue-100 text-blue-700',
  arts: 'bg-purple-100 text-purple-700',
  music: 'bg-indigo-100 text-indigo-700',
  clubs: 'bg-green-100 text-green-700',
  student_life: 'bg-yellow-100 text-yellow-700',
  event: 'bg-orange-100 text-orange-700',
};

export default function VideoCard({ project }) {
  const slug = project.slug || project.id;
  const activityColor = ACTIVITY_COLORS[project.activity_type] || 'bg-slate-100 text-slate-600';
  const date = project.published_date ? new Date(project.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

  return (
    <Link to={`${createPageUrl('BulldogTVWatch')}?slug=${slug}`}>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all cursor-pointer h-full flex flex-col">
        <div className="relative aspect-video bg-slate-200 overflow-hidden">
          {project.cover_image ? (
            <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="w-6 h-6 text-white ml-0.5" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="w-5 h-5 text-slate-900 ml-0.5" />
            </div>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            {project.activity_type && (
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${activityColor}`}>
                {project.activity_type.replace(/_/g, ' ')}
              </span>
            )}
            {project.project_type && (
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold capitalize">
                {project.project_type === 'weekly_recap' ? '📅' : project.project_type === 'sports_highlight' ? '⚡' : project.project_type === 'classroom_spotlight' ? '📚' : project.project_type === 'club_feature' ? '🎯' : project.project_type === 'arts_feature' ? '🎨' : '⭐'} {project.project_type.replace(/_/g, ' ')}
              </span>
            )}
          </div>
          <h3 className="font-bold text-slate-900 leading-tight mb-1.5 line-clamp-2 text-sm">{project.generated_title || project.title}</h3>
          <p className="text-slate-500 text-xs line-clamp-2 flex-1">{project.generated_description || project.description}</p>
          {date && (
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
              <Calendar className="w-3 h-3" /> {date}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}