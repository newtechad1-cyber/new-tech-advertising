import React, { useMemo, useState } from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Menu, AlertCircle } from 'lucide-react';

export default function AdminNavigationNav() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: navs = [] } = useQuery({
    queryKey: ['navigation-definitions'],
    queryFn: () => base44.entities.NavigationDefinition?.list?.().catch(() => []),
  });

  const { data: navItems = [] } = useQuery({
    queryKey: ['navigation-items'],
    queryFn: () => base44.entities.NavigationItemDefinition?.list?.().catch(() => []),
  });

  const { data: pages = [] } = useQuery({
    queryKey: ['master-pages'],
    queryFn: () => base44.entities.MasterPageDefinition?.list?.().catch(() => []),
  });

  const filteredNavs = useMemo(() => {
    return navs.filter(n =>
      n.nav_key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.nav_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.nav_family?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [navs, searchTerm]);

  const familyColors = {
    admin: 'bg-blue-900/50 text-blue-300 border-blue-700',
    school_admin: 'bg-cyan-900/50 text-cyan-300 border-cyan-700',
    client: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
    reseller: 'bg-purple-900/50 text-purple-300 border-purple-700',
    public: 'bg-slate-900/50 text-slate-300 border-slate-700',
    governance: 'bg-orange-900/50 text-orange-300 border-orange-700',
  };

  return (
    <AdminNav currentPage="AdminNavigationNav">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Navigation Families</h1>
          <p className="text-slate-400 mt-1">All navigation definitions and their items</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search navs by key, name, or family..."
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
                <p className="text-xs text-slate-400">Total Nav Families</p>
                <p className="text-2xl font-bold text-white">{navs.filter(n => n.active).length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Items</p>
                <p className="text-2xl font-bold text-white">{navItems.filter(ni => ni.active).length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Deprecated Targets</p>
                <p className="text-2xl font-bold text-orange-400">
                  {navItems.filter(ni => {
                    const targetPage = pages.find(p => p.page_key === ni.page_key);
                    return targetPage?.deprecated;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Families */}
        <div className="space-y-4">
          {filteredNavs.map((nav) => {
            const navItemsForFamily = navItems.filter(ni => ni.nav_key === nav.nav_key && ni.active);
            const deprecatedItems = navItemsForFamily.filter(ni => {
              const targetPage = pages.find(p => p.page_key === ni.page_key);
              return targetPage?.deprecated;
            });

            return (
              <Card key={nav.id} className="bg-slate-950 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Menu className="w-4 h-4 text-slate-500" />
                        <CardTitle className="text-white">{nav.nav_name}</CardTitle>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">{nav.nav_key}</p>
                    </div>
                    <Badge className={familyColors[nav.nav_family]}>
                      {nav.nav_family}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {nav.description && (
                    <p className="text-xs text-slate-400">{nav.description}</p>
                  )}

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-2 rounded bg-slate-900/50">
                      <p className="text-slate-500 mb-1">Layout</p>
                      <p className="text-white">{nav.layout_key}</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900/50">
                      <p className="text-slate-500 mb-1">Items</p>
                      <p className="text-white font-bold">{navItemsForFamily.length}</p>
                    </div>
                    <div className={`p-2 rounded ${deprecatedItems.length > 0 ? 'bg-orange-900/50' : 'bg-slate-900/50'}`}>
                      <p className="text-slate-500 mb-1">Deprecated Targets</p>
                      <p className={`font-bold ${deprecatedItems.length > 0 ? 'text-orange-400' : 'text-white'}`}>
                        {deprecatedItems.length}
                      </p>
                    </div>
                  </div>

                  {/* Nav Items */}
                  {navItemsForFamily.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-400 font-semibold mb-2">Navigation Items</p>
                      <div className="space-y-1">
                        {navItemsForFamily.map((item) => {
                          const targetPage = pages.find(p => p.page_key === item.page_key);
                          const isDeprecated = targetPage?.deprecated;

                          return (
                            <div
                              key={item.id}
                              className={`p-2 rounded text-xs flex items-center justify-between ${
                                isDeprecated ? 'bg-orange-900/30' : 'bg-slate-900/30'
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                {item.icon_key && <span>{item.icon_key}</span>}
                                <span className="text-white">{item.label}</span>
                                <span className="text-slate-500 font-mono text-xs">({item.page_key})</span>
                              </div>
                              {isDeprecated && (
                                <div className="flex items-center gap-1 text-orange-400">
                                  <AlertCircle className="w-3 h-3" />
                                  <span className="text-xs">Deprecated</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminNav>
  );
}