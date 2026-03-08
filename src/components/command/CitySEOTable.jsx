import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';

export default function CitySEOTable() {
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['cc-city-pages'],
    queryFn: () => base44.entities.LocationPage.list('-page_views', 50)
  });

  const topPages = pages.slice(0, 12);
  const totalPages = pages.length;
  const publishedPages = pages.filter(p => p.status === 'published').length;

  return (
    <div>
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">City SEO Coverage</h2>
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-semibold text-white">Location Pages</p>
          </div>
          <div className="flex gap-3 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">{publishedPages} published</span>
            <span>/ {totalPages} total</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading city data...</div>
        ) : pages.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No city pages generated yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase border-b border-slate-700">
                  <th className="text-left px-5 py-3">City</th>
                  <th className="text-left px-5 py-3">Service</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Views</th>
                  <th className="text-left px-5 py-3">Conversions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {topPages.map((page, i) => (
                  <tr key={page.id} className="hover:bg-slate-750">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {i < 3 && <Star className="w-3.5 h-3.5 text-yellow-400" />}
                        <span className="text-white font-medium">{page.city}</span>
                        <span className="text-slate-500 text-xs">{page.state}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{page.service_slug?.replace(/-/g, ' ')}</td>
                    <td className="px-5 py-3">
                      <Badge className={`text-xs ${page.status === 'published' ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800' : 'bg-slate-700 text-slate-400'}`}>
                        {page.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-300 font-medium">{(page.page_views || 0).toLocaleString()}</td>
                    <td className="px-5 py-3 text-slate-300">{page.conversions || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}