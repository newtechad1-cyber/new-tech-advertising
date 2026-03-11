import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminAccessPermissions() {
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');

  const { data: permissions = [] } = useQuery({
    queryKey: ['access-permissions'],
    queryFn: () => base44.entities.MasterPermissionDefinition?.list?.().catch(() => []),
  });

  const { data: maps = [] } = useQuery({
    queryKey: ['role-permission-maps'],
    queryFn: () => base44.entities.RolePermissionMap?.list?.().catch(() => []),
  });

  const filteredPermissions = useMemo(() => {
    return permissions.filter(p => {
      const matchesSearch = p.permission_label.toLowerCase().includes(search.toLowerCase()) ||
        p.permission_key.toLowerCase().includes(search.toLowerCase());
      const matchesRisk = filterRisk === 'all' || (filterRisk === 'high' ? p.high_risk : !p.high_risk);
      return matchesSearch && matchesRisk;
    });
  }, [permissions, search, filterRisk]);

  const categoryColors = {
    page_access: 'bg-indigo-950/30 border-indigo-700/50',
    entity_crud: 'bg-blue-950/30 border-blue-700/50',
    agent_execution: 'bg-purple-950/30 border-purple-700/50',
    automation: 'bg-cyan-950/30 border-cyan-700/50',
    reporting: 'bg-emerald-950/30 border-emerald-700/50',
    billing: 'bg-amber-950/30 border-amber-700/50',
    admin: 'bg-red-950/30 border-red-700/50',
    system: 'bg-slate-950/30 border-slate-700/50',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild className="text-slate-400">
            <a href={createPageUrl('AdminAccess')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Permission Registry</h1>
            <p className="text-slate-400 text-sm">{permissions.length} permissions defined</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <Input
            placeholder="Search permissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800 border-slate-700"
          />
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-300"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk Only</option>
            <option value="low">Low Risk Only</option>
          </select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="grid">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="high-risk">High-Risk ({permissions.filter(p => p.high_risk).length})</TabsTrigger>
            <TabsTrigger value="tenant">Tenant-Sensitive ({permissions.filter(p => p.tenant_sensitive).length})</TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPermissions.map(perm => (
                <Card key={perm.id} className={`${categoryColors[perm.permission_category]} border`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm">{perm.permission_label}</CardTitle>
                        <p className="text-xs text-slate-400 mt-1 font-mono">{perm.permission_key}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {perm.high_risk && (
                          <Badge className="bg-red-950 text-red-300 text-xs">High Risk</Badge>
                        )}
                        {perm.tenant_sensitive && (
                          <Badge className="bg-orange-950 text-orange-300 text-xs">Tenant Data</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-slate-300">{perm.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <div>
                        <p className="text-slate-500 mb-1">Category</p>
                        <Badge variant="outline" className="text-xs">{perm.permission_category}</Badge>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Action</p>
                        <Badge variant="outline" className="text-xs">{perm.action_type}</Badge>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 pt-2">
                      Target: <span className="text-slate-300 font-mono">{perm.target_type}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="high-risk">
            <div className="space-y-3">
              {permissions.filter(p => p.high_risk).length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No high-risk permissions
                  </CardContent>
                </Card>
              ) : (
                permissions.filter(p => p.high_risk).map(perm => (
                  <Card key={perm.id} className="bg-red-950/20 border-red-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-red-300 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {perm.permission_label}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{perm.description}</p>
                        </div>
                        <div className="text-right text-xs">
                          <p className="text-slate-500 mb-1">Used by</p>
                          <p className="font-semibold text-red-300">
                            {maps.filter(m => m.permission_key === perm.permission_key && m.active).length} roles
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="tenant">
            <div className="space-y-3">
              {permissions.filter(p => p.tenant_sensitive).length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-6 text-center text-slate-400">
                    No tenant-sensitive permissions
                  </CardContent>
                </Card>
              ) : (
                permissions.filter(p => p.tenant_sensitive).map(perm => (
                  <Card key={perm.id} className="bg-orange-950/20 border-orange-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-orange-300">{perm.permission_label}</p>
                          <p className="text-xs text-slate-400 mt-1">{perm.description}</p>
                        </div>
                        <div className="text-right text-xs">
                          <p className="text-slate-500 mb-1">Assigned to</p>
                          <p className="font-semibold text-orange-300">
                            {maps.filter(m => m.permission_key === perm.permission_key && m.active).length} roles
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}