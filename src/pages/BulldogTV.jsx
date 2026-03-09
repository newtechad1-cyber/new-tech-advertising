import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useSchoolBranding } from '@/components/school-tv/useSchoolBranding';
import SchoolTVHeader from '@/components/school-tv/SchoolTVHeader';
import VideoCard from '@/components/school-tv/VideoCard';
import { Search, Play } from 'lucide-react';
import { createPageUrl } from '@/utils';

const ACTIVITY_FILTERS = ['all','sports','classroom','arts','music','clubs','student_life','event'];
const TYPE_FILTERS = ['all','weekly_recap','sports_highlight','classroom_spotlight','club_feature','arts_feature','event_recap'];

export default function BulldogTV() {
  const { branding } = useSchoolBranding();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [actFilter, setActFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    base44.entities.SchoolVideoProjects.filter({ status: 'published', publish_to_gallery: true }, '-published_date').then(setProjects);
  }, []);

  const filtered = projects.filter(p => {
    if (actFilter !== 'all' && p.activity_type !== actFilter) return false;
    if (typeFilter !== 'all' && p.project_type !== typeFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (p.title || '').toLowerCase().includes(s) || (p.generated_title || '').toLowerCase().includes(s) || (p.team_or_group || '').toLowerCase().includes(s);
    }
    return true;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-slate-50">
      <SchoolTVHeader branding={branding} />

      {/* Hero */}
      <div style={{ backgroundColor: branding.primary_color }} className="py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-3 leading-tight">{branding.network_name}</h1>
          <p className="text-white/80 text-lg md:text-xl leading-relaxed">{branding.public_gallery_title || branding.intro_text}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-white/70 text-sm">
            <span>🎬 Videos</span> <span className="text-white/30">•</span> <span>🏆 Stories</span> <span className="text-white/30">•</span> <span>❤️ Community</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Featured */}
        {featured && (
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: `${branding.secondary_color}20` }}>
              <span className="text-sm font-bold" style={{ color: branding.secondary_color }}>⭐ LATEST</span>
            </div>
            <Link to={`${createPageUrl('BulldogTVWatch')}?slug=${featured.slug || featured.id}`}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row hover:shadow-2xl transition-all duration-300">
                <div className="relative w-full md:w-1/2 aspect-video overflow-hidden">
                  {featured.cover_image ? (
                    <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${branding.primary_color}, #0f172a)` }}>
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"><Play className="w-8 h-8 text-white ml-1" /></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-slate-900 ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center w-full md:w-1/2">
                  {featured.activity_type && <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{featured.activity_type.replace(/_/g,' ')} 🎯</span>}
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 leading-tight">{featured.generated_title || featured.title}</h3>
                  <p className="text-slate-600 text-base mb-5 leading-relaxed">{featured.generated_description || featured.description}</p>
                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white w-fit transition-all hover:scale-105" style={{ backgroundColor: branding.secondary_color }}>
                    <Play className="w-5 h-5" /> Watch Now
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-4">Find Videos</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or team..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white" />
            </div>
            <select value={actFilter} onChange={e => setActFilter(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none capitalize font-medium">
              {ACTIVITY_FILTERS.map(f => <option key={f} value={f}>{f === 'all' ? '📺 All Categories' : f.replace(/_/g,' ')}</option>)}
            </select>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none capitalize font-medium">
              {TYPE_FILTERS.map(f => <option key={f} value={f}>{f === 'all' ? '⭐ All Types' : f.replace(/_/g,' ')}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {rest.length > 0 ? (
          <>
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-4">More Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map(p => <VideoCard key={p.id} project={p} />)}
            </div>
          </>
        ) : (
          !featured && <div className="text-center py-20"><div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3"><Play className="w-6 h-6 text-slate-300" /></div><p className="text-slate-400">No videos published yet.</p><p className="text-slate-300 text-sm">Check back soon!</p></div>
        )}
      </div>

      <footer style={{ backgroundColor: branding.primary_color }} className="mt-16 py-8 px-4 text-center text-white/60 text-sm">
        <p className="text-white font-bold text-lg mb-1">{branding.network_name}</p>
        <p>{branding.district_name} · {branding.outro_text}</p>
      </footer>
    </div>
  );
}