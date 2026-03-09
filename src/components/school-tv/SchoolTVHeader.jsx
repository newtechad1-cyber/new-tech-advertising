import { Tv2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SchoolTVHeader({ branding, variant = 'public' }) {
  const bg = branding?.primary_color || '#1e3a5f';
  const accent = branding?.secondary_color || '#f59e0b';

  return (
    <header style={{ backgroundColor: bg }} className="px-4 py-3 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to={createPageUrl('BulldogTV')} className="flex items-center gap-3">
          {branding?.logo ? (
            <img src={branding.logo} alt="logo" className="h-10 w-auto object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: accent }}>
                <Tv2 className="w-5 h-5" style={{ color: bg }} />
              </div>
              <div>
                <div className="font-black text-white text-lg leading-none">{branding?.network_name || 'School TV'}</div>
                <div className="text-xs leading-none" style={{ color: `${accent}cc` }}>{branding?.school_name}</div>
              </div>
            </div>
          )}
        </Link>
        <div className="flex items-center gap-3">
          <Link to={createPageUrl('BulldogTV')} className="text-white/80 hover:text-white text-sm font-medium transition-colors">Watch</Link>
          <Link to={createPageUrl('BulldogTVSubmit')}>
            <button className="px-4 py-1.5 rounded-lg text-sm font-bold transition-colors" style={{ backgroundColor: accent, color: bg }}>
              Submit a Clip
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}