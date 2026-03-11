import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminAccessScopes() {
  const [selectedTenant, setSelectedTenant] = useState('all');

  const { data: scopes = [] } = useQuery({
    queryKey: ['tenant-scopes'],
    queryFn: () => base44.entities.TenantAccessScope?.list?.().catch(() => []),
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['access-roles'],
    queryFn: () => base44.entities.MasterRoleDefinition?.list?.().catch(() => []),
  });

  const { data: features = [] } = useQuery({
    queryKey: ['feature-policies'],
    queryFn: () => base44.entities.FeatureAccessPolicy?.list?.().catch(() => []),
  });

  const filteredScopes = useMemo(() => {
    return selectedTenant === 'all'
      ? scopes
      : scopes.filter(s => s.tenant_level === selectedTenant);
  }, [scopes, selectedTenant]);

  const tenantLevels = [...new Set(scopes.map(s => s.tenant_level))];

  const scopeColors = {
    global: 'bg-purple-950/30 border-purple-700/50 text-purple-300',
    agency: 'bg-blue-950/30 border-blue-700/50 text-blue-300',
    reseller: 'bg-indigo-950/30 border-indigo-700/50 text-indigo-300',
    client: 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300',
    school: 'bg-amber-950/30 border-amber-700/50 text-amber-300',
  };

  const depthColors = {
    full_access: 'bg-green-950 text-green-300',
    parent_only: 'bg-blue-950 text-blue-300',
    sibling_only: 'bg-slate-950 text-slate-300',
    self_only: 'bg-orange-950 text-orange-300',
    restricted: 'bg-red-950 text-red-300',
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
            <h1 className="text-3xl font-bold text-white">Tenant Access Scopes</h1>
            <p className="text-slate-400 text-sm">Data isolation and visibility enforcement</p>
          </div>
        </div>

        {/* Tenant Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedTenant === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTenant('all')}
          >
            All Scopes
          </Button>
          {tenantLevels.map(level => (
            <Button
              key={level}
              variant={selectedTenant === level ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTenant(level)}
            >
              {level}
            </Button>
          ))}
        </div>

        {/* Scopes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredScopes.map(scope => {
            const role = roles.find(r => r.role_key === scope.role_key);
            return (
              <Card key={scope.id} className={`${scopeColors[scope.tenant_level]} border`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm">{role?.role_name || scope.role_key}</CardTitle>
                      <p className="text-xs text-slate-400 mt-1 font-mono">{scope.role_key}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{scope.tenant_level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Access Depth</p>
                      <Badge className={`text-xs ${depthColors[scope.access_depth]}`}>
                        {scope.access_depth}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Status</p>
                      <Badge variant={scope.active ? 'default' : 'secondary'} className="text-xs">
                        {scope.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  {scope.data_visibility_rules_json && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Visibility Rules</p>
                      <div className="bg-slate-800/50 rounded p-2 text-xs">
                        <pre className="text-slate-300 overflow-auto max-h-40">
                          {JSON.stringify(JSON.parse(scope.data_visibility_rules_json), null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredScopes.length === 0 && (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-6 text-center text-slate-400">
              No scopes found
            </CardContent>
          </Card>
        )}

        {/* Feature Access Policies */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">Feature Access Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.slice(0, 8).map(policy => (
              <Card key={policy.id} className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-slate-300">{policy.feature_key}</p>
                    <Badge variant={policy.enabled ? 'default' : 'secondary'} className="text-xs">
                      {policy.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{policy.role_key}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-500">Tenant Level</p>
                      <p className="text-slate-300">{policy.tenant_level}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Plan</p>
                      <p className="text-slate-300">{policy.plan_required || 'All'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}