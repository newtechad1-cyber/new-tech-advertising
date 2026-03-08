import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Settings, Shield } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

export default function AdminClientSettings() {
  const [search, setSearch] = useState('');

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => base44.asServiceRole.entities.Companies.list()
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => base44.asServiceRole.entities.ClientUserAssignments.list()
  });

  const { data: approvalPolicies = [] } = useQuery({
    queryKey: ['approval_policies'],
    queryFn: () => base44.asServiceRole.entities.ClientApprovalPolicies.list()
  });

  const { data: visibilitySettings = [] } = useQuery({
    queryKey: ['visibility_settings'],
    queryFn: () => base44.asServiceRole.entities.ClientPortalVisibilitySettings.list()
  });

  // Metrics
  const companiesWithUsers = new Set(assignments.map(a => a.company_id)).size;
  const policiesConfigured = approvalPolicies.length;
  const sectionsManaged = visibilitySettings.length;

  let filtered = companies;
  if (search) {
    filtered = filtered.filter(c => c.company_name.toLowerCase().includes(search.toLowerCase()));
  }

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Client Portal Settings</h1>
            <p className="text-slate-600">Manage client portal roles, permissions, and visibility</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-slate-600 mb-1">Companies with Portal Users</p>
                <p className="text-3xl font-bold text-slate-900">{companiesWithUsers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-slate-600 mb-1">Portal User Assignments</p>
                <p className="text-3xl font-bold text-blue-600">{assignments.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-slate-600 mb-1">Approval Policies Configured</p>
                <p className="text-3xl font-bold text-green-600">{policiesConfigured}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-slate-600 mb-1">Visibility Settings</p>
                <p className="text-3xl font-bold text-purple-600">{sectionsManaged}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="companies">
            <TabsList className="mb-6">
              <TabsTrigger value="companies">Companies</TabsTrigger>
              <TabsTrigger value="users">User Assignments</TabsTrigger>
              <TabsTrigger value="policies">Approval Policies</TabsTrigger>
            </TabsList>

            {/* Companies Tab */}
            <TabsContent value="companies" className="space-y-6">
              <div className="mb-4">
                <Input
                  placeholder="Search companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Company</th>
                          <th className="text-left py-3 px-4 font-semibold">Portal Users</th>
                          <th className="text-left py-3 px-4 font-semibold">Approval Policies</th>
                          <th className="text-left py-3 px-4 font-semibold">Visibility Config</th>
                          <th className="text-left py-3 px-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(company => {
                          const companyUsers = assignments.filter(a => a.company_id === company.id).length;
                          const companyPolicies = approvalPolicies.filter(p => p.company_id === company.id).length;
                          const companySettings = visibilitySettings.filter(s => s.company_id === company.id).length;
                          
                          return (
                            <tr key={company.id} className="border-b hover:bg-slate-50">
                              <td className="py-3 px-4 font-semibold">{company.company_name}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline">{companyUsers}</Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={companyPolicies > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                  {companyPolicies}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={companySettings > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                                  {companySettings}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.location.href = createPageUrl(`AdminClientSettingsCompany?id=${company.id}`)}
                                >
                                  Manage
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portal User Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Company</th>
                          <th className="text-left py-3 px-4 font-semibold">User</th>
                          <th className="text-left py-3 px-4 font-semibold">Role</th>
                          <th className="text-left py-3 px-4 font-semibold">Contacts</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments.slice(0, 50).map(assignment => {
                          const company = companies.find(c => c.id === assignment.company_id);
                          return (
                            <tr key={assignment.id} className="border-b hover:bg-slate-50">
                              <td className="py-3 px-4">{company?.company_name}</td>
                              <td className="py-3 px-4 text-slate-600">{assignment.user_id}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline">Role</Badge>
                              </td>
                              <td className="py-3 px-4 text-xs">
                                {assignment.is_primary_contact && <Badge className="mr-1">Primary</Badge>}
                                {assignment.is_billing_contact && <Badge className="bg-blue-100 text-blue-800">Billing</Badge>}
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={assignment.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                  {assignment.active ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Policies Tab */}
            <TabsContent value="policies" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Approval Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {approvalPolicies.slice(0, 20).map(policy => {
                      const company = companies.find(c => c.id === policy.company_id);
                      return (
                        <div key={policy.id} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{company?.company_name}</p>
                            <p className="text-xs text-slate-600 mt-1 capitalize">{policy.approval_type.replace(/_/g, ' ')}</p>
                          </div>
                          <Badge className={policy.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {policy.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminNav>
  );
}