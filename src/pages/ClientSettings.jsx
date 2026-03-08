import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { Users, Bell, Shield, Eye, Lock } from 'lucide-react';

export default function ClientSettings() {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        
        const companies = await base44.entities.Companies.filter({ created_by: u.email });
        if (companies.length > 0) {
          setCompany(companies[0]);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };
    loadUser();
  }, []);

  // Fetch user assignment
  const { data: userAssignment = null } = useQuery({
    queryKey: ['user_assignment', user?.id, company?.id],
    queryFn: () => user && company ?
      base44.entities.ClientUserAssignments.filter({
        company_id: company.id,
        user_id: user.id,
        active: true
      }).then(a => a[0]) : null,
    enabled: !!user && !!company
  });

  // Fetch role
  const { data: role = null } = useQuery({
    queryKey: ['role', userAssignment?.client_portal_role_id],
    queryFn: () => userAssignment?.client_portal_role_id ?
      base44.entities.ClientPortalRoles.filter({ id: userAssignment.client_portal_role_id }).then(r => r[0]) : null,
    enabled: !!userAssignment?.client_portal_role_id
  });

  // Fetch permissions
  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions', role?.id],
    queryFn: () => role?.id ?
      base44.entities.ClientPortalPermissions.filter({ role_id: role.id, allowed: true }) : [],
    enabled: !!role?.id
  });

  // Fetch team
  const { data: teamUsers = [] } = useQuery({
    queryKey: ['team', company?.id],
    queryFn: () => company?.id ?
      base44.entities.ClientUserAssignments.filter({
        company_id: company.id,
        active: true
      }) : [],
    enabled: !!company?.id
  });

  // Fetch notification preferences
  const { data: notificationPrefs = [] } = useQuery({
    queryKey: ['notification_prefs', company?.id, user?.id],
    queryFn: () => company?.id && user?.id ?
      base44.entities.ClientNotificationPreferences.filter({
        company_id: company.id,
        $or: [
          { preference_scope: 'company_default' },
          { user_id: user.id, preference_scope: 'user_specific' }
        ]
      }) : [],
    enabled: !!company?.id && !!user?.id
  });

  // Fetch approval policies
  const { data: approvalPolicies = [] } = useQuery({
    queryKey: ['approval_policies', company?.id],
    queryFn: () => company?.id ?
      base44.entities.ClientApprovalPolicies.filter({ company_id: company.id, active: true }) : [],
    enabled: !!company?.id
  });

  // Fetch visibility settings
  const { data: visibilitySettings = [] } = useQuery({
    queryKey: ['visibility_settings', company?.id],
    queryFn: () => company?.id ?
      base44.entities.ClientPortalVisibilitySettings.filter({ company_id: company.id }) : [],
    enabled: !!company?.id
  });

  const canManageUsers = permissions.some(p => p.permission_key === 'manage_portal_users');
  const canManageNotifications = permissions.some(p => p.permission_key === 'manage_notifications');

  if (!user || !company) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8"><div className="max-w-6xl mx-auto">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Account & Portal Settings</h1>
          <p className="text-slate-600">Manage your portal access, team, and preferences</p>
        </div>

        {/* Account Overview Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-600 mb-1">Company</p>
              <p className="font-semibold text-slate-900">{company.company_name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Your Role</p>
              <p className="font-semibold text-slate-900">{role?.role_name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Active Portal Users</p>
              <p className="text-2xl font-bold text-slate-900">{teamUsers.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Notifications</p>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="team" className="space-y-6">
          <TabsList>
            <TabsTrigger value="team">
              <Users className="w-4 h-4 mr-2" />
              Team Access
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <Shield className="w-4 h-4 mr-2" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="approvals">
              <Lock className="w-4 h-4 mr-2" />
              Approvals
            </TabsTrigger>
            <TabsTrigger value="visibility">
              <Eye className="w-4 h-4 mr-2" />
              Portal Visibility
            </TabsTrigger>
          </TabsList>

          {/* Team Access Tab */}
          <TabsContent value="team" className="space-y-6">
            {canManageUsers && (
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Portal Users</h3>
                <Button size="sm">Add User</Button>
              </div>
            )}

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Role</th>
                        <th className="text-left py-3 px-4 font-semibold">Contacts</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamUsers.map(assignment => (
                        <tr key={assignment.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold">User Name</td>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Portal Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {permissions.length > 0 ? (
                  permissions.map(perm => (
                    <div key={perm.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-900">{perm.permission_label}</p>
                        <p className="text-xs text-slate-600 mt-1">{perm.permission_key}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">✓ Allowed</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600">No specific permissions assigned.</p>
                )}
              </CardContent>
            </Card>

            {canManageUsers && (
              <Card>
                <CardHeader>
                  <CardTitle>Role Descriptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border border-slate-200 rounded-lg">
                    <p className="font-semibold text-slate-900">Owner</p>
                    <p className="text-sm text-slate-600 mt-1">Full company portal access and management rights</p>
                  </div>
                  <div className="p-3 border border-slate-200 rounded-lg">
                    <p className="font-semibold text-slate-900">Approver</p>
                    <p className="text-sm text-slate-600 mt-1">Can approve proposals, deliverables, and renewals</p>
                  </div>
                  <div className="p-3 border border-slate-200 rounded-lg">
                    <p className="font-semibold text-slate-900">Viewer</p>
                    <p className="text-sm text-slate-600 mt-1">Read-only access to portal information</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notificationPrefs.length > 0 ? (
                  notificationPrefs.map(pref => (
                    <div key={pref.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 capitalize">{pref.notification_type.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-slate-600 mt-1">via {pref.delivery_channel}</p>
                      </div>
                      <Toggle pressed={pref.enabled}>
                        {pref.enabled ? '✓' : '○'}
                      </Toggle>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600">No notification preferences configured.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            {canManageUsers ? (
              <Card>
                <CardHeader>
                  <CardTitle>Approval Routing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {approvalPolicies.length > 0 ? (
                    approvalPolicies.map(policy => (
                      <div key={policy.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-slate-900 capitalize">{policy.approval_type.replace(/_/g, ' ')}</p>
                          <Badge className="bg-blue-100 text-blue-800">Configured</Badge>
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
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-slate-600">
                  You don't have permission to manage approval policies.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Visibility Tab */}
          <TabsContent value="visibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portal Sections Visible to Your Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {visibilitySettings.length > 0 ? (
                  visibilitySettings.map(setting => (
                    <div key={setting.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <p className="font-semibold text-slate-900 capitalize">{setting.section_key.replace(/_/g, ' ')}</p>
                      {setting.visible ? (
                        <Badge className="bg-green-100 text-green-800">Visible</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Hidden</Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600">No visibility settings configured.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <p className="text-sm text-slate-700">
                  Some settings are managed by NTA. Contact your account team if you'd like to enable additional portal sections.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}