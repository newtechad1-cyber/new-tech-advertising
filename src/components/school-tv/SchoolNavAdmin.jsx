import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tv2, Upload, FolderOpen, Film, Layers, Settings, BarChart2, ArrowLeft } from 'lucide-react';

const NAV = [
  { label: 'Submissions', page: 'AdminSchoolSubmissions', icon: Upload },
  { label: 'Projects', page: 'AdminSchoolProjects', icon: FolderOpen },
  { label: 'Render Queue', page: 'AdminSchoolRenderQueue', icon: Film },
  { label: 'Video Library', page: 'AdminSchoolLibrary', icon: Layers },
  { label: 'Branding', page: 'AdminSchoolBranding', icon: Settings },
];

export default function SchoolNavAdmin({ currentPage }) {
  return (
    <div className="bg-slate-900 text-white border-b border-slate-700 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto">
        <div className="flex items-center gap-2 py-3 pr-4 mr-2 border-r border-slate-700 shrink-0">
          <Tv2 className="w-5 h-5 text-yellow-400" />
          <span className="font-bold text-sm">Bulldog TV Admin</span>
        </div>
        {NAV.map(({ label, page, icon: NavIcon }) => (
          <Link key={page} to={createPageUrl(page)}>
            <button className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${currentPage === page ? 'border-yellow-400 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}>
              <NavIcon className="w-4 h-4" /> {label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}