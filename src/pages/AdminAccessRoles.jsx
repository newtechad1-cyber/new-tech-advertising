import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Shield } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminAccessRoles() {
  const [search, setSearch] = useState('');

  const { data: roles = [] } = useQuery({
    queryKey: ['access-roles'],
    queryFn: () => base44.entities.MasterRoleDefinition?.list?.().catch(() => []),
  });

  const { data: maps = [] } = useQuery({
    queryKey: ['role-permission-maps'],
    queryFn: () => base44.entities.RolePermissionMap?.list?.().catch(() => []),
  });

  const filteredRoles = useMemo(() => {
    return roles.filter(r =>
      r.role_name.toLowerCase().includes(search.toLowerCase()) ||
      r.role_key.toLowerCase().includes(search.toLowerCase())
    );
  }, [roles, search]);

  const categoryColors = {
    platform: 'bg-purple-950/30 border-purple-700/50 text-purple-300',
    reseller: 'bg-blue-950/30 border-blue-700/50 text-blue-300',
    client: 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300',
    school: 'bg-amber-950/30 border-amber-700/50 text-amber-300',
    system: 'bg-slate-950/30 border-slate-700/50 text-slate-300',
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
            <h1 className="text-3xl font-bold text-white">Role Registry</h1>
            <p className="text-slate-400 text-sm">Manage platform roles and responsibilities</p>
          </div>
        </div>

        {/* Search */}
        <Input
          placeholder="Search roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 border-slate-700"
        />

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRoles.map(role => {
            const permissions = maps.filter(m => m.role_key === role.role_key && m.active).length;
            return (
              <Card key={role.id} className={`${categoryColors[role.role_category]} border`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{role.role_name}</CardTitle>
                      <p className="text-xs text-slate-400 mt-1 font-mono">{role.role_key}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {!role.active && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                      <Badge variant="outline" className="text-xs">{role.role_category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-300">{role.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>
                      <p className="text-slate-500 mb-1">Scope</p>
                      <p className="font-semibold">{role.default_scope_type}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Permissions</p>
                      <p className="font-semibold">{permissions}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Priority</p>
                      <p className="font-semibold">{role.priority_level}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Status</p>
                      <p className="font-semibold">{role.active ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredRoles.length === 0 && (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-6 text-center text-slate-400">
              No roles found
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}