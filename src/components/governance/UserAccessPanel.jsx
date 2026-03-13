import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { AlertTriangle, Trash2, Edit2, Clock } from 'lucide-react';

export default function UserAccessPanel() {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const queryClient = useQueryClient();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['user-assignments', selectedOrg],
    queryFn: async () => {
      if (!selectedOrg) {
        const all = await base44.entities.UserAccessAssignment.list('-assignedAt', 50);
        return all || [];
      }
      return await base44.entities.UserAccessAssignment.filter({ organizationId: selectedOrg });
    },
  });

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => base44.entities.Organization.list(),
  });

  const statusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending_activation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpired = (expiresAt) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  if (isLoading) return <div className="animate-spin">Loading assignments...</div>;

  return (
    <Card className="p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User Access Assignments</h2>
        <div className="w-64">
          <Select
            value={selectedOrg || ''}
            onValueChange={(val) => setSelectedOrg(val || null)}
          >
            <option value="">All Organizations</option>
            {organizations?.map(org => (
              <option key={org.id} value={org.organizationId}>
                {org.businessName}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Organization</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Plan</th>
              <th className="px-4 py-2 text-left">Scope</th>
              <th className="px-4 py-2 text-left">Expires</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments?.map(assignment => (
              <tr key={assignment.id} className={`border-b hover:bg-gray-50 ${isExpired(assignment.expiresAt) ? 'bg-red-50' : ''}`}>
                <td className="px-4 py-3 font-medium">{assignment.userId}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{assignment.organizationId}</td>
                <td className="px-4 py-3">
                  <Badge>{assignment.roleKey}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge className={statusBadgeColor(assignment.status)}>
                    {assignment.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">{assignment.effectivePlan || 'N/A'}</td>
                <td className="px-4 py-3 text-xs">
                  {assignment.scopeRestriction && (
                    <Badge variant="outline">{assignment.scopeRestriction}</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  {assignment.expiresAt ? (
                    <div className="flex items-center gap-1">
                      {isExpired(assignment.expiresAt) && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={isExpired(assignment.expiresAt) ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                        {new Date(assignment.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">No expiry</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      title="Edit assignment"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                      title="Remove assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(!assignments || assignments.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No user access assignments found.
        </div>
      )}
    </Card>
  );
}