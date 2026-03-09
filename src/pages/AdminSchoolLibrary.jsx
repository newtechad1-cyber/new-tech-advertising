import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import SchoolNavAdmin from '@/components/school-tv/SchoolNavAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Eye, FolderOpen, Search } from 'lucide-react';

export default function AdminSchoolLibrary() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    base44.entities.SchoolVideoProjects.filter({ status: 'published' }, '-published_date').then(setProjects);
  }, []);

  const filtered = projects.filter(p => {
    if (search) return (p.title || '').toLowerCase().includes(search.toLowerCase()) || (p.generated_title || '').toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SchoolNavAdmin currentPage="AdminSchoolLibrary" />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Published Video Library</h1>
          <p className="text-slate-500 text-sm">Finished videos ready for sharing and distribution</p>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search videos..." className="pl-9 max-w-md" />
          </div>
          <span className="text-sm text-slate-400 self-center">{filtered.length} published</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 bg-white rounded-xl border border-slate-200">
            <FolderOpen className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p>{search ? 'No videos match your search.' : 'No published videos yet.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-slate-200 relative">
                  {p.cover_image ? (
                    <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900" />
                  )}
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">Published</div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-1">{p.generated_title || p.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{p.project_type?.replace(/_/g,' ')} · {new Date(p.published_date).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <Link to={`${createPageUrl('BulldogTVWatch')}?slug=${p.slug || p.id}`}>
                      <Button size="sm" variant="outline" className="gap-1.5"><Eye className="w-3.5 h-3.5" /> View Public</Button>
                    </Link>
                    {p.public_video_url && (
                      <Button size="sm" variant="outline" onClick={() => copy(p.public_video_url, p.id)} className="gap-1.5">
                        <Copy className="w-3.5 h-3.5" /> {copied === p.id ? 'Copied!' : 'URL'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}