import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { Eye, EyeOff } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';

export default function AdminClientSettingsCompany() {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('id');

  const { data: company = null } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => base44.asServiceRole.entities.Companies.filter({ id: companyId }).then(c => c[0]),
    enabled: !!companyId
  });

  const { data: userAssignments = [] } = useQuery({
    queryKey: ['assignments', company?.id],
    queryFn: () => company ?
      base44.asServiceRole.entities.ClientUserAssignments.filter({ company_id: company.id }) : [],
    enabled: !!company?.id
  });

  const { data: approvalPolicies = [] } = useQuery({
    queryKey: ['approval_policies', company?.id],
    queryFn: () => company ?
      base44.asServiceRole.entities.ClientApprovalPolicies.filter({ company_id: company.id }) : [],
    enabled: !!company?.id
  });

  const { data: visibilitySettings = [] } = useQuery({
    queryKey: ['visibility_settings', company?.id],
    queryFn: () => company ?
      base44.asServiceRole.entities.ClientPortalVisibilitySettings.filter({ company_id: company.id }) : [],
    enabled: !!company?.id
  });

  const { data: notificationPrefs = [] } = useQuery({
    queryKey: ['notification_prefs', company?.id],
    queryFn: () => company ?
      base44.asServiceRole.entities.ClientNotificationPreferences.filter({ 
        company_id: company.id,
        preference_scope: 'company_default'
      }) : [],
    enabled: !!company?.id
  });

  if (!company) return <AdminNav><div className="p-8">Loading...</div></AdminNav>;

  const primaryContact = userAssignments.find(a => a.is_primary_contact);
  const billingContact = userAssignments.find(a => a.is_billing_contact);

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-slate-900">{company.company_name}</h1>
              <Button variant="outline" onClick={() => window.history.back()}>
                Back
              </Button>
            </div>
            <p className="text-slate-600">Manage client portal settings and permissions</p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-slate-600">Portal Users</p>
                <p className="text-2xl font-bold text-slate-900">{userAssignments.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-slate-600">Primary Contact</p>
                <p className="text-sm font-semibold text-slate-900">{primaryContact ? 'Assigned' : 'Not Set'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-slate-600">Approval Policies</p>
                <p className="text-2xl font-bold text-slate-900">{approvalPolicies.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="team">
            <TabsList className="mb-6">
              <TabsTrigger value="team">Team Access</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="visibility">Visibility</TabsTrigger>
            </TabsList>

            {/* Team Access Tab */}
            <TabsContent value="team" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Portal Users</h3>
                <Button size="sm">Add User</Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">User</th>
                          <th className="text-left py-3 px-4 font-semibold">Role</th>
                          <th className="text-left py-3 px-4 font-semibold">Contacts</th>
                          <th className="text-left py-3 px-4 font-semibold">Notifications</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userAssignments.map(assignment => (
                          <tr key={assignment.id} className="border-b hover:bg-slate-50">
                            <td className="py-3 px-4 font-semibold">{assignment.user_id}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">Role</Badge>
                            </td>
                            <td className="py-3 px-4 text-xs">
                              {assignment.is_primary_contact && <Badge className="mr-1">Primary</Badge>}
                              {assignment.is_billing_contact && <Badge className="bg-blue-100 text-blue-800">Billing</Badge>}
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={assignment.can_receive_notifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {assignment.can_receive_notifications ? 'Enabled' : 'Disabled'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={assignment.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {assignment.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Approvals Tab */}
            <TabsContent value="approvals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Approval Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {approvalPolicies.length > 0 ? (
                    approvalPolicies.map(policy => (
                      <div key={policy.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-slate-900 capitalize">{policy.approval_type.replace(/_/g, ' ')}</p>
                          <Badge className={policy.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {policy.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-600 space-y-1 mt-2">
                          {policy.requires_named_approver && <p>✓ Requires named approver</p>}
                          {policy.fallback_to_primary_contact && <p>✓ Falls back to primary contact</p>}
                          {policy.multiple_approvers_required && <p>✓ Multiple approvers required</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600">No approval policies configured.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company-Default Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notificationPrefs.length > 0 ? (
                    notificationPrefs.map(pref => (
                      <div key={pref.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                        <div>
                          <p className="font-semibold text-slate-900 capitalize">{pref.notification_type.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-slate-600 mt-1">via {pref.delivery_channel}</p>
                        </div>
                        <Badge className={pref.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {pref.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600">No notification preferences configured.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Visibility Tab */}
            <TabsContent value="visibility" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portal Section Visibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {visibilitySettings.length > 0 ? (
                    visibilitySettings.map(setting => (
                      <div key={setting.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                        <p className="font-semibold text-slate-900 capitalize">{setting.section_key.replace(/_/g, ' ')}</p>
                        {setting.visible ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">Visible</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-400">
                            <EyeOff className="w-4 h-4" />
                            <span className="text-sm">Hidden</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600">No visibility settings configured.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminNav>
  );
}