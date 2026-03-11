import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Users, Lock, Activity } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminAccess() {
  const { data: roles = [] } = useQuery({
    queryKey: ['access-roles'],
    queryFn: () => base44.entities.MasterRoleDefinition?.list?.().catch(() => []),
  });

  const { data: permissions = [] } = useQuery({
    queryKey: ['access-permissions'],
    queryFn: () => base44.entities.MasterPermissionDefinition?.list?.().catch(() => []),
  });

  const { data: rolePermMaps = [] } = useQuery({
    queryKey: ['role-permission-maps'],
    queryFn: () => base44.entities.RolePermissionMap?.list?.().catch(() => []),
  });

  const { data: audits = [] } = useQuery({
    queryKey: ['access-audits'],
    queryFn: () => base44.entities.AccessAuditLog?.list?.('-created_at', 100).catch(() => []),
  });

  const { data: impersonations = [] } = useQuery({
    queryKey: ['impersonations'],
    queryFn: () => base44.entities.ImpersonationSession?.list?.('-start_time', 20).catch(() => []),
  });

  const { data: health = [] } = useQuery({
    queryKey: ['permission-health'],
    queryFn: () => base44.entities.PermissionHealthSnapshot?.list?.('-snapshot_time', 50).catch(() => []),
  });

  const metrics = useMemo(() => {
    const activeRoles = roles.filter(r => r.active).length;
    const activePerm = permissions.filter(p => p.active).length;
    const highRiskPerm = permissions.filter(p => p.high_risk && p.active).length;
    const violations = audits.filter(a => !a.success).length;
    const activeImpersonations = impersonations.filter(i => i.active).length;
    const criticalHealth = health.filter(h => h.governance_health_score < 60).length;

    return { activeRoles, activePerm, highRiskPerm, violations, activeImpersonations, criticalHealth };
  }, [roles, permissions, audits, impersonations, health]);

  const recentSensitiveActions = useMemo(() => {
    const sensitive = ['entity_delete', 'permission_change', 'role_change', 'impersonate', 'publish'];
    return audits
      .filter(a => sensitive.includes(a.action_type))
      .slice(0, 8);
  }, [audits]);

  const tenantLeakRisks = useMemo(() => {
    return health
      .filter(h => h.tenant_leak_risk_score > 60)
      .sort((a, b) => b.tenant_leak_risk_score - a.tenant_leak_risk_score)
      .slice(0, 5);
  }, [health]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Access Governance</h1>
          <p className="text-slate-400">Centralized role, permission, and tenant scope management</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 mb-1">Active Roles</p>
              <p className="text-2xl font-bold text-white">{metrics.activeRoles}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 mb-1">Permissions</p>
              <p className="text-2xl font-bold text-white">{metrics.activePerm}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 mb-1">High-Risk</p>
              <p className="text-2xl font-bold text-red-400">{metrics.highRiskPerm}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 mb-1">Access Violations</p>
              <p className="text-2xl font-bold text-orange-400">{metrics.violations}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 mb-1">Impersonations</p>
              <p className="text-2xl font-bold text-cyan-400">{metrics.activeImpersonations}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 mb-1">Health Alerts</p>
              <p className="text-2xl font-bold text-red-400">{metrics.criticalHealth}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="risks">Risks & Violations</TabsTrigger>
            <TabsTrigger value="sensitive">Sensitive Actions</TabsTrigger>
            <TabsTrigger value="impersonation">Impersonations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-6">
              {/* Role Registry */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Role Registry
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {roles.slice(0, 5).map(role => (
                      <div key={role.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                        <p className="text-sm font-semibold text-slate-300">{role.role_name}</p>
                        <Badge variant={role.active ? 'default' : 'secondary'} className="text-xs">
                          {role.role_category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" asChild className="w-full">
                    <a href={createPageUrl('AdminAccessRoles')}>View All Roles</a>
                  </Button>
                </CardContent>
              </Card>

              {/* Permission Registry */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Permission Registry
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {permissions.slice(0, 5).map(perm => (
                      <div key={perm.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                        <p className="text-sm font-semibold text-slate-300">{perm.permission_label}</p>
                        {perm.high_risk && <Badge className="bg-red-950 text-red-300 text-xs">High Risk</Badge>}
                      </div>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" asChild className="w-full">
                    <a href={createPageUrl('AdminAccessPermissions')}>View All Permissions</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risks">
            <div className="space-y-4">
              {tenantLeakRisks.length > 0 && (
                <Card className="border-red-700/50 bg-red-950/20">
                  <CardHeader>
                    <CardTitle className="text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Tenant Leak Risks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tenantLeakRisks.map(risk => (
                        <div key={risk.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded">
                          <p className="font-semibold text-slate-300">{risk.role_key}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-700 rounded h-2">
                              <div className="bg-red-500 h-2 rounded" style={{ width: `${risk.tenant_leak_risk_score}%` }} />
                            </div>
                            <span className="text-xs text-red-300">{Math.round(risk.tenant_leak_risk_score)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Access Violations</CardTitle>
                </CardHeader>
                <CardContent>
                  {audits.filter(a => !a.success).length === 0 ? (
                    <p className="text-slate-400 text-sm">No violations detected</p>
                  ) : (
                    <div className="space-y-2">
                      {audits
                        .filter(a => !a.success)
                        .slice(0, 5)
                        .map((audit, idx) => (
                          <div key={idx} className="p-3 bg-slate-800/50 rounded border-l-2 border-red-500">
                            <p className="text-sm font-semibold text-red-300">{audit.user_email}</p>
                            <p className="text-xs text-slate-400 mt-1">{audit.action_type} on {audit.target_type}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sensitive">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>Recent Sensitive Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentSensitiveActions.length === 0 ? (
                    <p className="text-slate-400 text-sm">No sensitive actions</p>
                  ) : (
                    recentSensitiveActions.map((action, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded">
                        <div>
                          <p className="text-sm font-semibold text-slate-300">{action.user_email}</p>
                          <p className="text-xs text-slate-500">{action.action_type}</p>
                        </div>
                        <div className="text-right text-xs text-slate-400">
                          {action.success ? (
                            <Badge className="bg-emerald-950 text-emerald-300">Success</Badge>
                          ) : (
                            <Badge className="bg-red-950 text-red-300">Failed</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impersonation">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Impersonation History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {impersonations.length === 0 ? (
                  <p className="text-slate-400 text-sm">No impersonation sessions</p>
                ) : (
                  <div className="space-y-3">
                    {impersonations.slice(0, 8).map((session, idx) => (
                      <div key={idx} className="p-3 bg-slate-800/50 rounded border-l-2 border-cyan-500">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-cyan-300">{session.impersonator_user_email}</p>
                          {session.active && <Badge className="bg-cyan-950 text-cyan-300 text-xs">Active</Badge>}
                        </div>
                        <p className="text-xs text-slate-400">→ {session.target_user_email}</p>
                        <p className="text-xs text-slate-500 mt-1">{session.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <div className="grid grid-cols-4 gap-3 mt-8">
          <Button asChild variant="outline" className="h-12">
            <a href={createPageUrl('AdminAccessRoles')}>Role Registry</a>
          </Button>
          <Button asChild variant="outline" className="h-12">
            <a href={createPageUrl('AdminAccessPermissions')}>Permissions</a>
          </Button>
          <Button asChild variant="outline" className="h-12">
            <a href={createPageUrl('AdminAccessScopes')}>Tenant Scopes</a>
          </Button>
          <Button asChild variant="outline" className="h-12">
            <a href={createPageUrl('AdminAccessAudit')}>Audit Log</a>
          </Button>
        </div>
      </div>
    </div>
  );
}