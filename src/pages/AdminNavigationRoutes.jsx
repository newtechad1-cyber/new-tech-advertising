import React, { useMemo, useState } from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Lock, AlertCircle } from 'lucide-react';

export default function AdminNavigationRoutes() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: routes = [] } = useQuery({
    queryKey: ['master-routes'],
    queryFn: () => base44.entities.MasterRouteDefinition?.list?.().catch(() => []),
  });

  const filteredRoutes = useMemo(() => {
    return routes.filter(r =>
      r.route_path?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.page_key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.route_family?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [routes, searchTerm]);

  const familyColors = {
    public: 'bg-slate-900/50 text-slate-300 border-slate-700',
    main_admin: 'bg-blue-900/50 text-blue-300 border-blue-700',
    school_admin: 'bg-cyan-900/50 text-cyan-300 border-cyan-700',
    client_portal: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
    reseller: 'bg-purple-900/50 text-purple-300 border-purple-700',
    governance: 'bg-orange-900/50 text-orange-300 border-orange-700',
    agent_ops: 'bg-indigo-900/50 text-indigo-300 border-indigo-700',
  };

  return (
    <AdminNav currentPage="AdminNavigationRoutes">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Route Registry</h1>
          <p className="text-slate-400 mt-1">All registered routes with layouts, families, and guard rules</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search routes by path, page, or family..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-700 text-white"
          />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-slate-950 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-xs text-slate-400">Total Routes</p>
              <p className="text-2xl font-bold text-white">{routes.filter(r => r.active).length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-950 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-xs text-slate-400">Canonical</p>
              <p className="text-2xl font-bold text-blue-400">{routes.filter(r => r.canonical).length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-950 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-xs text-slate-400">Dynamic</p>
              <p className="text-2xl font-bold text-amber-400">{routes.filter(r => r.dynamic_route).length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Routes List */}
        <div className="space-y-3">
          {filteredRoutes.map((route) => {
            const guardRules = route.guard_rules_json ? JSON.parse(route.guard_rules_json) : null;
            return (
              <Card key={route.id} className="bg-slate-950 border-slate-700 hover:border-slate-600 transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-slate-500" />
                          <p className="font-mono font-semibold text-white text-sm">{route.route_path}</p>
                        </div>
                        <p className="text-xs text-slate-500 ml-6">{route.page_key}</p>
                      </div>
                      <div className="flex gap-1.5">
                        {route.canonical && (
                          <Badge className="bg-blue-950/50 text-blue-300 border border-blue-700">
                            Canonical
                          </Badge>
                        )}
                        {route.dynamic_route && (
                          <Badge className="bg-amber-950/50 text-amber-300 border border-amber-700">
                            Dynamic
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Family & Layout */}
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="p-2 rounded bg-slate-900/50">
                        <p className="text-slate-500 mb-1">Family</p>
                        <Badge className={familyColors[route.route_family]}>
                          {route.route_family.replace(/_/g, ' ')}
                        </Badge>
                      </div>

                      <div className="p-2 rounded bg-slate-900/50">
                        <p className="text-slate-500 mb-1">Layout</p>
                        <p className="text-white text-xs">{route.layout_key}</p>
                      </div>

                      <div className="p-2 rounded bg-slate-900/50">
                        <p className="text-slate-500 mb-1">Fallback</p>
                        <p className="text-white text-xs font-mono">{route.fallback_route || 'None'}</p>
                      </div>
                    </div>

                    {/* Guard Rules */}
                    {guardRules && (
                      <div className="p-2 rounded bg-slate-900/50 border-l-2 border-blue-700">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Lock className="w-3 h-3 text-blue-400" />
                          <p className="text-xs text-slate-400 font-semibold">Guard Rules</p>
                        </div>
                        <p className="text-xs text-slate-300 font-mono text-xs">
                          {typeof guardRules === 'object' ? JSON.stringify(guardRules) : guardRules}
                        </p>
                      </div>
                    )}

                    {/* Query Params */}
                    {route.query_param_rules_json && (
                      <div className="text-xs text-slate-400">
                        Query Params: <span className="font-mono">{route.query_param_rules_json}</span>
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