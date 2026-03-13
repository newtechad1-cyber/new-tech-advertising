import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Building2, Users, Palette, Package, TrendingUp } from 'lucide-react';

export default function AdminTenantGovernance() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch all tenants
  const { data: tenants, isLoading } = useQuery({
    queryKey: ['all-tenants'],
    queryFn: async () => {
      return await base44.entities.Tenant.list('-createdAt', 100);
    }
  });

  // Fetch tenant data
  const { data: tenantData } = useQuery({
    queryKey: ['tenant-data', tenants],
    enabled: !!tenants,
    queryFn: async () => {
      const data = {};
      
      for (const tenant of tenants || []) {
        const [maps, users, brand, reseller, plans] = await Promise.all([
          base44.entities.TenantOrganizationMap.filter({ tenantId: tenant.tenantId }),
          base44.entities.TenantUserAssignment.filter({ tenantId: tenant.tenantId }),
          base44.entities.BrandProfile.filter({ tenantId: tenant.tenantId }, null, 1),
          base44.entities.ResellerProfile.filter({ tenantId: tenant.tenantId }, null, 1),
          base44.entities.TenantPlanCatalog.filter({ tenantId: tenant.tenantId })
        ]);

        data[tenant.tenantId] = {
          maps: maps || [],
          users: users || [],
          brand: brand?.[0],
          reseller: reseller?.[0],
          plans: plans || []
        };
      }
      
      return data;
    }
  });

  // Count warnings
  const warnings = {};
  if (tenantData && tenants) {
    tenants.forEach(tenant => {
      const data = tenantData[tenant.tenantId];
      const w = [];
      
      if (!data?.brand) w.push('No brand profile');
      if (!data?.users?.length) w.push('No users assigned');
      if (!data?.maps?.length) w.push('No organizations assigned');
      if (tenant.status === 'suspended') w.push('Tenant suspended');
      if (!data?.plans?.length && tenant.tenantType === 'reseller') w.push('No plan catalog');
      
      warnings[tenant.tenantId] = w;
    });
  }

  const warningCount = Object.values(warnings).reduce((sum, w) => sum + w.length, 0);

  if (isLoading) return <AdminLayout><div className="p-6 animate-spin">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Tenant Governance</h1>
          <p className="text-slate-600 mt-2">
            Manage white-label resellers, organizations, and multi-tenant configuration
          </p>
        </div>

        {/* Warning Banner */}
        {warningCount > 0 && (
          <Card className="p-4 bg-red-50 border-red-200 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">
                <strong>{warningCount} configuration warnings</strong> across tenants
              </p>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="orgs">Organizations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Tenants</p>
                    <p className="text-3xl font-bold mt-2">{tenants?.length || 0}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-blue-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Resellers</p>
                    <p className="text-3xl font-bold mt-2">
                      {tenants?.filter(t => t.tenantType === 'reseller').length || 0}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Organizations</p>
                    <p className="text-3xl font-bold mt-2">
                      {Object.values(tenantData || {}).reduce((sum, t) => sum + t.maps.length, 0)}
                    </p>
                  </div>
                  <Building2 className="w-8 h-8 text-purple-500" />
                </div>
              </Card>

              <Card className="p-6 bg-red-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700">Configuration Issues</p>
                    <p className="text-3xl font-bold mt-2 text-red-600">{warningCount}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </Card>
            </div>

            {/* Warnings by Tenant */}
            {Object.entries(warnings).some(([_, w]) => w.length > 0) && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Configuration Warnings</h3>
                <div className="space-y-3">
                  {Object.entries(warnings).map(([tenantId, warns]) => (
                    warns.length > 0 && (
                      <div key={tenantId} className="flex items-start gap-3 pb-3 border-b last:border-0">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {tenants?.find(t => t.tenantId === tenantId)?.tenantName}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {warns.map((w, i) => (
                              <Badge key={i} variant="outline" className="bg-red-50 border-red-200">
                                {w}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Tenants Table */}
          <TabsContent value="tenants">
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Tenant Name</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-right">Organizations</th>
                      <th className="px-4 py-3 text-right">Users</th>
                      <th className="px-4 py-3 text-left">Brand</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants?.map(tenant => {
                      const data = tenantData?.[tenant.tenantId];
                      const w = warnings[tenant.tenantId] || [];
                      
                      return (
                        <tr key={tenant.tenantId} className="border-b hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium">{tenant.tenantName}</p>
                              {w.length > 0 && (
                                <Badge className="mt-1 bg-red-100 text-red-800">
                                  {w.length} issues
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{tenant.tenantType}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                              {tenant.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">{data?.maps.length || 0}</td>
                          <td className="px-4 py-3 text-right">{data?.users.length || 0}</td>
                          <td className="px-4 py-3">
                            {data?.brand ? (
                              <div className="flex items-center gap-2">
                                <Palette className="w-4 h-4 text-blue-500" />
                                <span className="text-xs">Configured</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-500">Missing</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button size="sm" variant="ghost">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Plan Catalog */}
          <TabsContent value="plans">
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Tenant</th>
                      <th className="px-4 py-3 text-left">Base Plan</th>
                      <th className="px-4 py-3 text-left">Display Name</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-left">Visible</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenantData && Object.entries(tenantData).flatMap(([tenantId, data]) =>
                      data.plans?.map(plan => {
                        const tenant = tenants?.find(t => t.tenantId === tenantId);
                        return (
                          <tr key={plan.id} className="border-b hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm">{tenant?.tenantName}</td>
                            <td className="px-4 py-3"><Badge variant="outline">{plan.basePlanKey}</Badge></td>
                            <td className="px-4 py-3 font-medium">{plan.displayPlanName}</td>
                            <td className="px-4 py-3 text-right">${(plan.displayPrice / 100).toFixed(2)}</td>
                            <td className="px-4 py-3">
                              {plan.visibleToClients ? '✓' : '✗'}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button size="sm" variant="ghost">Edit</Button>
                            </td>
                          </tr>
                        );
                      }) || []
                    )}
                  </tbody>
                </table>
              </div>
              {!tenantData || Object.values(tenantData).every(d => !d.plans?.length) && (
                <div className="text-center py-8 text-slate-500">
                  No plan catalogs configured.
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Organizations */}
          <TabsContent value="orgs">
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Organization</th>
                      <th className="px-4 py-3 text-left">Tenant</th>
                      <th className="px-4 py-3 text-left">Relationship</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Assigned</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenantData && Object.entries(tenantData).flatMap(([tenantId, data]) =>
                      data.maps?.map(map => {
                        const tenant = tenants?.find(t => t.tenantId === tenantId);
                        return (
                          <tr key={map.id} className="border-b hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium">{map.organizationId}</td>
                            <td className="px-4 py-3">{tenant?.tenantName}</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline">{map.relationshipType}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={map.status === 'active' ? 'default' : 'secondary'}>
                                {map.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {new Date(map.assignedAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button size="sm" variant="ghost">Edit</Button>
                            </td>
                          </tr>
                        );
                      }) || []
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">User</th>
                      <th className="px-4 py-3 text-left">Tenant</th>
                      <th className="px-4 py-3 text-left">Tenant Role</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Assigned</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenantData && Object.entries(tenantData).flatMap(([tenantId, data]) =>
                      data.users?.map(user => {
                        const tenant = tenants?.find(t => t.tenantId === tenantId);
                        return (
                          <tr key={user.id} className="border-b hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium">{user.userId}</td>
                            <td className="px-4 py-3">{tenant?.tenantName}</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline">{user.tenantRole}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {new Date(user.assignedAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button size="sm" variant="ghost">Edit</Button>
                            </td>
                          </tr>
                        );
                      }) || []
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}