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
      <div style={{ backgroundColor: branding.primary_color }} className="py-20 md:py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight">{branding.network_name}</h1>
          <p className="text-white/90 text-lg md:text-2xl leading-relaxed font-semibold mb-8">{branding.public_gallery_title || branding.intro_text}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-white/80 text-sm md:text-base font-medium">
            <span>🎬 Videos</span> <span className="text-white/40">•</span> <span>🏆 Highlights</span> <span className="text-white/40">•</span> <span>❤️ Community Pride</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Featured */}
        {featured && (
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white/20 backdrop-blur border border-white/30">
              <span className="text-sm font-bold text-white">⭐ NOW PLAYING</span>
            </div>
            <Link to={`${createPageUrl('BulldogTVWatch')}?slug=${featured.slug || featured.id}`}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row hover:shadow-4xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative w-full md:w-3/5 aspect-video overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
                  {featured.cover_image ? (
                    <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${branding.primary_color}, #0f172a)` }}>
                      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center"><Play className="w-10 h-10 text-white ml-1" /></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/95 group-hover:scale-125 transition-transform flex items-center justify-center shadow-2xl">
                      <Play className="w-8 h-8 text-slate-900 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center w-full md:w-2/5">
                  {featured.activity_type && <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{featured.activity_type.replace(/_/g,' ')} •</span>}
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">{featured.generated_title || featured.title}</h3>
                  <p className="text-slate-700 text-base mb-8 leading-relaxed">{featured.generated_description || featured.description}</p>
                  <span className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white w-fit transition-all hover:scale-110 hover:shadow-xl" style={{ backgroundColor: branding.secondary_color }}>
                    <Play className="w-6 h-6" /> Watch Now
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Filters */}
        <div className="mb-10">
          <h2 className="font-black text-slate-800 text-sm uppercase tracking-wider mb-5">Browse by Category</h2>
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
            <h2 className="font-black text-slate-800 text-sm uppercase tracking-wider mb-6">More From {branding.network_name}</h2>
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