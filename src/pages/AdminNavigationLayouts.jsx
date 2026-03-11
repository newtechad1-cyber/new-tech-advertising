import React, { useMemo, useState } from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, AlertTriangle } from 'lucide-react';

export default function AdminNavigationLayouts() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: layouts = [] } = useQuery({
    queryKey: ['layout-definitions'],
    queryFn: () => base44.entities.LayoutDefinition?.list?.().catch(() => []),
  });

  const { data: pages = [] } = useQuery({
    queryKey: ['master-pages'],
    queryFn: () => base44.entities.MasterPageDefinition?.list?.().catch(() => []),
  });

  const { data: routes = [] } = useQuery({
    queryKey: ['master-routes'],
    queryFn: () => base44.entities.MasterRouteDefinition?.list?.().catch(() => []),
  });

  const filteredLayouts = useMemo(() => {
    return layouts.filter(l =>
      l.layout_key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.layout_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.layout_family?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [layouts, searchTerm]);

  const familyColors = {
    admin: 'bg-blue-900/50 text-blue-300 border-blue-700',
    school_admin: 'bg-cyan-900/50 text-cyan-300 border-cyan-700',
    client: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
    reseller: 'bg-purple-900/50 text-purple-300 border-purple-700',
    public: 'bg-slate-900/50 text-slate-300 border-slate-700',
    blank: 'bg-slate-900/50 text-slate-300 border-slate-700',
  };

  return (
    <AdminNav currentPage="AdminNavigationLayouts">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Layout Governance</h1>
          <p className="text-slate-400 mt-1">Monitor layouts, allowed families, and mismatch alerts</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search layouts by key, name, or family..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-700 text-white"
          />
        </div>

        {/* Summary */}
        <Card className="bg-slate-950 border-slate-700">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-slate-400">Total Layouts</p>
                <p className="text-2xl font-bold text-white">{layouts.filter(l => l.active).length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Pages Using</p>
                <p className="text-2xl font-bold text-white">{pages.filter(p => p.active && layouts.some(l => l.layout_key === p.layout_key)).length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Layout Mismatches</p>
                <p className="text-2xl font-bold text-orange-400">
                  {pages.filter(p => {
                    const layout = layouts.find(l => l.layout_key === p.layout_key);
                    if (!layout) return true;
                    const allowedFamilies = layout.allowed_route_families_json
                      ? JSON.parse(layout.allowed_route_families_json)
                      : [];
                    return allowedFamilies.length > 0 && !allowedFamilies.includes(p.route_family);
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layouts */}
        <div className="space-y-4">
          {filteredLayouts.map((layout) => {
            const allowedFamilies = layout.allowed_route_families_json
              ? JSON.parse(layout.allowed_route_families_json)
              : [];
            const allowedCategories = layout.allowed_page_categories_json
              ? JSON.parse(layout.allowed_page_categories_json)
              : [];

            const pagesUsingLayout = pages.filter(p => p.layout_key === layout.layout_key && p.active);
            const mismatches = pagesUsingLayout.filter(p => {
              if (allowedFamilies.length === 0) return false;
              return !allowedFamilies.includes(p.route_family);
            });

            return (
              <Card key={layout.id} className="bg-slate-950 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{layout.layout_name}</CardTitle>
                      <p className="text-xs text-slate-500 font-mono mt-1">{layout.layout_key}</p>
                    </div>
                    <Badge className={familyColors[layout.layout_family]}>
                      {layout.layout_family}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {layout.description && (
                    <p className="text-xs text-slate-400">{layout.description}</p>
                  )}

                  {/* Restrictions */}
                  <div className="space-y-2">
                    {allowedFamilies.length > 0 && (
                      <div className="p-2 rounded bg-blue-950/30 border border-blue-700/50">
                        <p className="text-xs text-slate-400 mb-1 font-semibold">Allowed Route Families</p>
                        <div className="flex flex-wrap gap-1">
                          {allowedFamilies.map((family) => (
                            <Badge
                              key={family}
                              className="bg-blue-900/50 text-blue-300 border border-blue-700 text-xs"
                            >
                              {family}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {allowedCategories.length > 0 && (
                      <div className="p-2 rounded bg-emerald-950/30 border border-emerald-700/50">
                        <p className="text-xs text-slate-400 mb-1 font-semibold">Allowed Page Categories</p>
                        <div className="flex flex-wrap gap-1">
                          {allowedCategories.map((cat) => (
                            <Badge
                              key={cat}
                              className="bg-emerald-900/50 text-emerald-300 border border-emerald-700 text-xs"
                            >
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pages Using This Layout */}
                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-xs text-slate-400 font-semibold mb-2">
                      Pages Using This Layout ({pagesUsingLayout.length})
                    </p>
                    {pagesUsingLayout.length === 0 ? (
                      <p className="text-xs text-slate-500">No pages currently using this layout</p>
                    ) : (
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {pagesUsingLayout.map((page) => {
                          const hasMismatch = mismatches.some(m => m.id === page.id);

                          return (
                            <div
                              key={page.id}
                              className={`p-2 rounded text-xs flex items-center justify-between ${
                                hasMismatch ? 'bg-orange-900/30' : 'bg-slate-900/30'
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                {hasMismatch && <AlertTriangle className="w-3 h-3 text-orange-400" />}
                                <span className="text-white">{page.page_name}</span>
                                <Badge className="bg-slate-800 text-slate-300 text-xs">
                                  {page.route_family.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminNav>
  );
}