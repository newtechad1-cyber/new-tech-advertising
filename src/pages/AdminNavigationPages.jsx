import React, { useMemo, useState } from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminNavigationPages() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: pages = [] } = useQuery({
    queryKey: ['master-pages'],
    queryFn: () => base44.entities.MasterPageDefinition?.list?.().catch(() => []),
  });

  const { data: routes = [] } = useQuery({
    queryKey: ['master-routes'],
    queryFn: () => base44.entities.MasterRouteDefinition?.list?.().catch(() => []),
  });

  const filteredPages = useMemo(() => {
    return pages.filter(p =>
      p.page_key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.page_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.route_path?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pages, searchTerm]);

  const familyColors = {
    public: 'bg-slate-900/50 text-slate-300 border-slate-700',
    main_admin: 'bg-blue-900/50 text-blue-300 border-blue-700',
    school_admin: 'bg-cyan-900/50 text-cyan-300 border-cyan-700',
    client_portal: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
    reseller: 'bg-purple-900/50 text-purple-300 border-purple-700',
    governance: 'bg-orange-900/50 text-orange-300 border-orange-700',
    agent_ops: 'bg-indigo-900/50 text-indigo-300 border-indigo-700',
  };

  const statusColors = {
    active: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
    deprecated: 'bg-orange-900/50 text-orange-300 border-orange-700',
    experimental: 'bg-amber-900/50 text-amber-300 border-amber-700',
    archived: 'bg-slate-900/50 text-slate-300 border-slate-700',
  };

  return (
    <AdminNav currentPage="AdminNavigationPages">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Page Registry</h1>
          <p className="text-slate-400 mt-1">All registered pages with routes, layouts, and governance metadata</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search pages by key, name, or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-700 text-white"
          />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-slate-950 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-xs text-slate-400">Total Pages</p>
              <p className="text-2xl font-bold text-white">{pages.filter(p => p.active).length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-950 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-xs text-slate-400">Active Routes</p>
              <p className="text-2xl font-bold text-white">{routes.filter(r => r.active).length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-950 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-xs text-slate-400">Deprecated</p>
              <p className="text-2xl font-bold text-orange-400">{pages.filter(p => p.deprecated).length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-950 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-xs text-slate-400">Orphan Pages</p>
              <p className="text-2xl font-bold text-red-400">
                {pages.filter(p => p.active && !routes.some(r => r.page_key === p.page_key)).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pages List */}
        <div className="space-y-3">
          {filteredPages.map((page) => {
            const hasRoute = routes.some(r => r.page_key === page.page_key && r.active);
            return (
              <Card key={page.id} className="bg-slate-950 border-slate-700 hover:border-slate-600 transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-white">{page.page_name}</p>
                          {!hasRoute && (
                            <div title="No active route" className="p-1 rounded bg-red-950/40 text-red-400">
                              <AlertCircle className="w-3 h-3" />
                            </div>
                          )}
                          {hasRoute && (
                            <div title="Route exists" className="p-1 rounded bg-emerald-950/40 text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-mono">{page.page_key}</p>
                      </div>
                      <Badge className={statusColors[page.page_status]}>
                        {page.page_status}
                      </Badge>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="p-2 rounded bg-slate-900/50">
                        <p className="text-slate-500 text-xs mb-1">Route</p>
                        <p className="text-white font-mono text-xs">{page.route_path}</p>
                      </div>

                      <div className="p-2 rounded bg-slate-900/50">
                        <p className="text-slate-500 text-xs mb-1">Family</p>
                        <Badge className={familyColors[page.route_family]}>
                          {page.route_family.replace(/_/g, ' ')}
                        </Badge>
                      </div>

                      <div className="p-2 rounded bg-slate-900/50">
                        <p className="text-slate-500 text-xs mb-1">Layout</p>
                        <p className="text-white text-xs">{page.layout_key}</p>
                      </div>

                      <div className="p-2 rounded bg-slate-900/50">
                        <p className="text-slate-500 text-xs mb-1">Nav Family</p>
                        <p className="text-white text-xs">{page.nav_family}</p>
                      </div>
                    </div>

                    {/* Owner & Entity */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-400">Owner: <span className="text-white">{page.owner_team || 'N/A'}</span></span>
                      </div>
                      {page.primary_entity_key && (
                        <div className="text-slate-400">
                          Primary: <span className="text-white font-mono text-xs">{page.primary_entity_key}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {page.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">{page.description}</p>
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