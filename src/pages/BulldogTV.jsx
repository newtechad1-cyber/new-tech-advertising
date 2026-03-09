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
      <div style={{ backgroundColor: branding.primary_color }} className="py-10 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{branding.network_name}</h1>
        <p className="text-white/75 text-lg">{branding.public_gallery_title || branding.intro_text}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Featured */}
        {featured && (
          <div className="mb-10">
            <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-3">Latest Video</h2>
            <Link to={`${createPageUrl('BulldogTVWatch')}?slug=${featured.slug || featured.id}`}>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 flex flex-col md:flex-row">
                <div className="relative md:w-1/2 aspect-video md:aspect-auto overflow-hidden" style={{ minHeight: 220 }}>
                  {featured.cover_image ? (
                    <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${branding.primary_color}, #0f172a)` }}>
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"><Play className="w-8 h-8 text-white ml-1" /></div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3"><span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: branding.secondary_color, color: branding.primary_color }}>LATEST</span></div>
                </div>
                <div className="p-6 flex flex-col justify-center md:w-1/2">
                  {featured.activity_type && <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{featured.activity_type.replace(/_/g,' ')}</span>}
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{featured.generated_title || featured.title}</h3>
                  <p className="text-slate-500 mb-4">{featured.generated_description || featured.description}</p>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white w-fit" style={{ backgroundColor: branding.primary_color }}>
                    <Play className="w-4 h-4" /> Watch Now
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search videos..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white" />
          </div>
          <select value={actFilter} onChange={e => setActFilter(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none capitalize">
            {ACTIVITY_FILTERS.map(f => <option key={f} value={f}>{f === 'all' ? 'All Categories' : f.replace(/_/g,' ')}</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none capitalize">
            {TYPE_FILTERS.map(f => <option key={f} value={f}>{f === 'all' ? 'All Types' : f.replace(/_/g,' ')}</option>)}
          </select>
        </div>

        {/* Grid */}
        {rest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map(p => <VideoCard key={p.id} project={p} />)}
          </div>
        ) : (
          !featured && <div className="text-center py-20 text-slate-400">No videos published yet. Check back soon!</div>
        )}
      </div>

      <footer style={{ backgroundColor: branding.primary_color }} className="mt-16 py-8 px-4 text-center text-white/60 text-sm">
        <p className="text-white font-bold text-lg mb-1">{branding.network_name}</p>
        <p>{branding.district_name} · {branding.outro_text}</p>
      </footer>
    </div>
  );
}