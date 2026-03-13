import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export default function RoleMatrix() {
  const { data: roles, isLoading } = useQuery({
    queryKey: ['role-definitions'],
    queryFn: () => base44.entities.RoleDefinition.list(),
  });

  if (isLoading) return <div className="animate-spin">Loading roles...</div>;

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Role Definition Matrix</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Min Plan</th>
              <th className="px-4 py-2 text-center">Manage Users</th>
              <th className="px-4 py-2 text-center">Manage Roles</th>
              <th className="px-4 py-2 text-center">Billing</th>
              <th className="px-4 py-2 text-center">Analytics</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {roles?.map(role => (
              <tr key={role.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{role.roleName}</td>
                <td className="px-4 py-3">
                  <Badge variant={role.roleType === 'internal' ? 'default' : 'secondary'}>
                    {role.roleType}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">{role.minPlanRequired}</td>
                <td className="px-4 py-3 text-center">
                  {role.canManageUsers ? 
                    <CheckCircle className="w-4 h-4 text-green-600 mx-auto" /> :
                    <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                  }
                </td>
                <td className="px-4 py-3 text-center">
                  {role.canManageRoles ? 
                    <CheckCircle className="w-4 h-4 text-green-600 mx-auto" /> :
                    <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                  }
                </td>
                <td className="px-4 py-3 text-center">
                  {role.canAccessBilling ? 
                    <CheckCircle className="w-4 h-4 text-green-600 mx-auto" /> :
                    <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                  }
                </td>
                <td className="px-4 py-3 text-center">
                  {role.canViewAnalytics ? 
                    <CheckCircle className="w-4 h-4 text-green-600 mx-auto" /> :
                    <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                  }
                </td>
                <td className="px-4 py-3">
                  {role.isActive ? 
                    <Badge className="bg-green-100 text-green-800">Active</Badge> :
                    <Badge variant="outline">Inactive</Badge>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}