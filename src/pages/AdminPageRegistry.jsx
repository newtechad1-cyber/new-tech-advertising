import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle2, AlertCircle, Navigation, Link as LinkIcon, Eye, EyeOff } from 'lucide-react';
import { validatePageRegistry } from '@/components/navigation/navigationHelpers';

export default function AdminPageRegistry() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNavGroup, setSelectedNavGroup] = useState('all');
  const [selectedPageType, setSelectedPageType] = useState('all');

  // Fetch all pages
  const { data: allPages, isLoading } = useQuery({
    queryKey: ['page-registry-all'],
    queryFn: async () => {
      return await base44.entities.PageRegistry.list('-pageKey', 500);
    }
  });

  // Validate registry
  const { data: validation } = useQuery({
    queryKey: ['page-registry-validation'],
    queryFn: async () => {
      return await validatePageRegistry();
    }
  });

  // Get inactive pages
  const { data: inactivePages } = useQuery({
    queryKey: ['page-registry-inactive'],
    queryFn: async () => {
      return await base44.entities.PageRegistry.filter(
        { isActive: false },
        '-lastUpdatedAt',
        100
      );
    }
  });

  if (isLoading) return <AdminLayout><div className="p-6 animate-pulse">Loading...</div></AdminLayout>;

  const activePages = allPages?.filter(p => p.isActive) || [];
  const pagesByNavGroup = {};
  const pagesByType = {};

  // Organize pages
  allPages?.forEach(page => {
    const navGroup = page.navGroup || 'none';
    const pageType = page.pageType || 'other';

    if (!pagesByNavGroup[navGroup]) pagesByNavGroup[navGroup] = [];
    if (!pagesByType[pageType]) pagesByType[pageType] = [];

    if (page.isActive) {
      pagesByNavGroup[navGroup].push(page);
      pagesByType[pageType].push(page);
    }
  });

  const navGroups = Object.keys(pagesByNavGroup).sort();
  const pageTypes = Object.keys(pagesByType).sort();

  // Filter pages based on selections
  const filteredPages = activePages.filter(page => {
    const navMatch = selectedNavGroup === 'all' || page.navGroup === selectedNavGroup;
    const typeMatch = selectedPageType === 'all' || page.pageType === selectedPageType;
    return navMatch && typeMatch;
  });

  const getAccessLabel = (requiredRole) => {
    const labels = {
      'public': 'Public',
      'authenticated': 'Auth Required',
      'user': 'User',
      'tenant_member': 'Tenant Member',
      'tenant_manager': 'Tenant Manager',
      'tenant_admin': 'Tenant Admin',
      'reseller_admin': 'Reseller Admin',
      'master_admin': 'Master Admin',
      'super_admin': 'Super Admin'
    };
    return labels[requiredRole] || requiredRole;
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Page Registry</h1>
          <p className="text-slate-600 mt-2">
            Master navigation and routing configuration
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Pages</p>
                <p className="text-3xl font-bold mt-2">{allPages?.length || 0}</p>
              </div>
              <Navigation className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Pages</p>
                <p className="text-3xl font-bold mt-2">{activePages.length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Inactive Pages</p>
                <p className="text-3xl font-bold mt-2">{inactivePages?.length || 0}</p>
              </div>
              <EyeOff className="w-8 h-8 text-gray-500" />
            </div>
          </Card>

          <Card className={`p-6 ${validation?.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${validation?.isValid ? 'text-green-700' : 'text-red-700'}`}>
                  Registry Health
                </p>
                <p className={`text-3xl font-bold mt-2 ${validation?.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation?.isValid ? 'Valid' : `${validation?.issues.length} Issues`}
                </p>
              </div>
              {validation?.isValid ? (
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-500" />
              )}
            </div>
          </Card>
        </div>

        {/* Validation Issues */}
        {!validation?.isValid && (
          <Card className="p-6 bg-red-50 border-red-200 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">
                  {validation?.issues.length} Registry Issues Found
                </h3>
                <div className="space-y-1 text-sm text-red-800">
                  {validation?.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-mono text-xs bg-red-100 px-2 py-1 rounded">
                        {issue.type}
                      </span>
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="all">All Pages</TabsTrigger>
            <TabsTrigger value="navigation">By Navigation Group</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Pages</TabsTrigger>
          </TabsList>

          {/* All Pages Table */}
          <TabsContent value="all">
            <Card className="p-6 mb-6">
              <div className="flex gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium">Nav Group</label>
                  <select
                    value={selectedNavGroup}
                    onChange={(e) => setSelectedNavGroup(e.target.value)}
                    className="mt-1 px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All Groups</option>
                    {navGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Page Type</label>
                  <select
                    value={selectedPageType}
                    onChange={(e) => setSelectedPageType(e.target.value)}
                    className="mt-1 px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All Types</option>
                    {pageTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Page Key</th>
                      <th className="px-4 py-3 text-left">Display Name</th>
                      <th className="px-4 py-3 text-left">Route</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Nav Group</th>
                      <th className="px-4 py-3 text-left">Access Level</th>
                      <th className="px-4 py-3 text-left">Public</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPages.map(page => (
                      <tr key={page.pageKey} className="border-b hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-xs">{page.pageKey}</td>
                        <td className="px-4 py-3 font-medium">{page.displayName}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-600">{page.routePath}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{page.pageType}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="bg-blue-100 text-blue-800">{page.navGroup}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {getAccessLabel(page.requiredRole)}
                        </td>
                        <td className="px-4 py-3">
                          {page.isPublic ? (
                            <Badge className="bg-green-100 text-green-800">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredPages.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No pages match filters
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Navigation Groups */}
          <TabsContent value="navigation">
            <div className="space-y-6">
              {navGroups.map(group => {
                const pages = pagesByNavGroup[group];
                return (
                  <Card key={group} className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Badge>{group}</Badge>
                      <span className="text-slate-600">({pages.length} pages)</span>
                    </h3>
                    <div className="space-y-2">
                      {pages.map(page => (
                        <div key={page.pageKey} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                          <div className="flex-1">
                            <p className="font-medium">{page.displayName}</p>
                            <p className="text-xs text-slate-600 font-mono">{page.routePath}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{page.pageType}</Badge>
                            <Badge variant={page.isPublic ? 'default' : 'outline'}>
                              {page.isPublic ? 'Public' : 'Private'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Inactive Pages */}
          <TabsContent value="inactive">
            <Card className="p-6">
              {inactivePages && inactivePages.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left">Page Key</th>
                        <th className="px-4 py-3 text-left">Display Name</th>
                        <th className="px-4 py-3 text-left">Route</th>
                        <th className="px-4 py-3 text-left">Last Updated</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inactivePages.map(page => (
                        <tr key={page.pageKey} className="border-b hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono text-xs">{page.pageKey}</td>
                          <td className="px-4 py-3 font-medium">{page.displayName}</td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-600">{page.routePath}</td>
                          <td className="px-4 py-3 text-xs">
                            {new Date(page.lastUpdatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button size="sm" variant="ghost">
                              Reactivate
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No inactive pages
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}