import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { ExternalLink, Globe } from 'lucide-react';

const SEO_PAGES = [
  { title: 'Local Lead Systems', path: '/local-lead-systems', desc: 'Core positioning page for NTA lead system services', status: 'live' },
  { title: 'Website Rebuilds', path: '/website-rebuilds', desc: 'Service page: website rebuilds for North Iowa businesses', status: 'live' },
  { title: 'SEO Pages for Local Businesses', path: '/seo-pages-for-local-businesses', desc: 'Service page: local SEO and city/service pages', status: 'live' },
  { title: 'Seasonal Campaigns', path: '/seasonal-campaigns', desc: 'Service page: seasonal marketing campaigns', status: 'live' },
  { title: 'Social Media Content System', path: '/social-media-content-system', desc: 'Service page: social media content management', status: 'live' },
  { title: 'AI Video Marketing', path: '/ai-video-marketing', desc: 'Service page: AI video production and marketing', status: 'live' },
  { title: 'Gap Audit', path: '/gap-audit', desc: 'Lead capture: free marketing gap audit offer', status: 'live' },
  { title: 'Our Work / Case Studies', path: '/our-work', desc: 'Portfolio and client success examples', status: 'live' },
  { title: 'HVAC Marketing North Iowa', path: '/hvac-marketing-north-iowa', desc: 'Industry page: HVAC contractors in North Iowa', status: 'live' },
  { title: 'Contractor Marketing North Iowa', path: '/contractor-marketing-north-iowa', desc: 'Industry page: home service contractors', status: 'live' },
  { title: 'Small Business Marketing North Iowa', path: '/small-business-marketing-north-iowa', desc: 'Industry page: local small businesses', status: 'live' },
  { title: 'Website Rebuilds — Mason City IA', path: '/website-rebuilds/mason-city-ia', desc: 'Local SEO: Mason City IA', status: 'live' },
  { title: 'Website Rebuilds — Rochester MN', path: '/website-rebuilds/rochester-mn', desc: 'Local SEO: Rochester MN', status: 'live' },
  { title: 'Website Rebuilds — Austin MN', path: '/website-rebuilds/austin-mn', desc: 'Local SEO: Austin MN', status: 'live' },
  { title: 'Website Rebuilds — Albert Lea MN', path: '/website-rebuilds/albert-lea-mn', desc: 'Local SEO: Albert Lea MN', status: 'live' },
  { title: 'Social Media — Mason City IA', path: '/social-media/mason-city-ia', desc: 'Local SEO: social media Mason City', status: 'live' },
  { title: 'Social Media — Rochester MN', path: '/social-media/rochester-mn', desc: 'Local SEO: social media Rochester', status: 'live' },
];

export default function OpsSEOPages() {
  const [search, setSearch] = useState('');
  const filtered = SEO_PAGES.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.path.includes(search.toLowerCase()));

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">SEO Pages</h1>
            <p className="text-slate-500 text-sm">{SEO_PAGES.length} pages live · All optimized for North Iowa local search</p>
          </div>
          <a href="/rebuild-intake" target="_blank" className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            <ExternalLink className="w-4 h-4" /> Preview Site
          </a>
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pages…"
          className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Page Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">URL</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(p => (
                <tr key={p.path} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                      <span className="font-semibold text-white text-sm">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs font-mono hidden sm:table-cell">{p.path}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell max-w-48 truncate">{p.desc}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-400">{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a href={p.path} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1 justify-end">
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </OpsLayout>
  );
}