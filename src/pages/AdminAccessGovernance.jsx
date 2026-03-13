import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import RoleMatrix from '@/components/governance/RoleMatrix';
import PlanFeatureMatrix from '@/components/governance/PlanFeatureMatrix';
import UserAccessPanel from '@/components/governance/UserAccessPanel';
import AccessAuditFeed from '@/components/governance/AccessAuditFeed';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Lock, Key, AlertCircle, BarChart3, Activity } from 'lucide-react';

export default function AdminAccessGovernance() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ['access-stats'],
    queryFn: async () => {
      const [roles, perms, assignments, audits] = await Promise.all([
        base44.entities.RoleDefinition.list(),
        base44.entities.PermissionDefinition.list(),
        base44.entities.UserAccessAssignment.list(),
        base44.entities.AccessAuditLog.list('-timestamp', 1000),
      ]);

      const suspendedUsers = assignments?.filter(a => a.status === 'suspended')?.length || 0;
      const expiredAssignments = assignments?.filter(a => 
        a.expiresAt && new Date(a.expiresAt) < new Date()
      )?.length || 0;

      const deniedEvents = audits?.filter(a => a.result === 'denied')?.length || 0;
      const sensitiveEvents = audits?.filter(a => a.isSensitive)?.length || 0;

      return {
        totalRoles: roles?.length || 0,
        totalPermissions: perms?.length || 0,
        totalAssignments: assignments?.length || 0,
        suspendedUsers,
        expiredAssignments,
        deniedEvents,
        sensitiveEvents,
      };
    },
  });

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Access & Permissions Governance</h1>
          <p className="text-gray-600 mt-2">
            Unified role, plan, and scope-based access control system
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold">{stats?.totalRoles || 0}</p>
              </div>
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Permissions</p>
                <p className="text-2xl font-bold">{stats?.totalPermissions || 0}</p>
              </div>
              <Key className="w-8 h-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Assignments</p>
                <p className="text-2xl font-bold">{stats?.totalAssignments || 0}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className={`p-4 ${(stats?.suspendedUsers || 0) + (stats?.expiredAssignments || 0) > 0 ? 'bg-red-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {(stats?.suspendedUsers || 0) + (stats?.expiredAssignments || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.suspendedUsers} suspended, {stats?.expiredAssignments} expired
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Access Denials (24h)</p>
                <p className="text-2xl font-bold text-yellow-900">{stats?.deniedEvents || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">Sensitive Actions</p>
                <p className="text-2xl font-bold text-orange-900">{stats?.sensitiveEvents || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="plans">Plans & Features</TabsTrigger>
            <TabsTrigger value="users">User Access</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AccessAuditFeed />
          </TabsContent>

          <TabsContent value="roles">
            <RoleMatrix />
          </TabsContent>

          <TabsContent value="plans">
            <PlanFeatureMatrix />
          </TabsContent>

          <TabsContent value="users">
            <UserAccessPanel />
            <AccessAuditFeed />
          </TabsContent>
        </Tabs>

        {/* Legend & Info */}
        <Card className="p-6 mt-6 bg-gray-50">
          <h3 className="font-semibold mb-3">Access Control Model</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium mb-2">Role Types</p>
              <ul className="space-y-1 text-gray-600">
                <li>• <Badge variant="outline">internal</Badge> Platform admins</li>
                <li>• <Badge variant="outline">client_facing</Badge> Client users</li>
                <li>• <Badge variant="outline">reseller</Badge> Reseller partners</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Access Layers</p>
              <ul className="space-y-1 text-gray-600">
                <li>• Role-based (RBAC)</li>
                <li>• Plan-based feature gating</li>
                <li>• Organization scope</li>
                <li>• Scope restrictions</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Denial Reasons</p>
              <ul className="space-y-1 text-gray-600">
                <li>• insufficient_plan</li>
                <li>• permission_denied</li>
                <li>• out_of_scope</li>
                <li>• user_suspended</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}