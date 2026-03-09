import React from 'react';
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Edit,
  Trash2,
  Mail,
  Users,
  Shield,
} from 'lucide-react';

export default function AdminSchoolUsers() {
  const { schoolSlug, currentPath } = useSchoolRoute();

  const users = [
    {
      id: 1,
      name: 'Sarah Jensen',
      email: 'sjensen@hampton-dumont.edu',
      role: 'District Admin',
      status: 'active',
      permissions: 'Full access',
    },
    {
      id: 2,
      name: 'Coach Davis',
      email: 'cdavis@hampton-dumont.edu',
      role: 'Teacher/Editor',
      status: 'active',
      permissions: 'Can edit, approve, publish',
    },
    {
      id: 3,
      name: 'Ms. Johnson',
      email: 'mjohnson@hampton-dumont.edu',
      role: 'Reviewer',
      status: 'active',
      permissions: 'Can review & approve',
    },
    {
      id: 4,
      name: 'Emma Chen',
      email: 'echen@hamptondumont.edu',
      role: 'Contributor',
      status: 'active',
      permissions: 'Can submit content',
    },
    {
      id: 5,
      name: 'Mr. Martinez',
      email: 'mmartinez@hampton-dumont.edu',
      role: 'Teacher/Editor',
      status: 'active',
      permissions: 'Can edit, approve, publish',
    },
  ];

  const roleColors = {
    'District Admin': 'bg-red-100 text-red-800',
    'Teacher/Editor': 'bg-blue-100 text-blue-800',
    'Reviewer': 'bg-green-100 text-green-800',
    'Contributor': 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users & Permissions</h1>
              <p className="text-gray-600 mt-1">Manage team members and access control</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Permissions</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.permissions}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Role Descriptions */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Role Descriptions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: 'District Admin',
                  desc: 'Full system access. Can manage all users, settings, and content.',
                  color: 'bg-red-50',
                },
                {
                  name: 'Teacher/Editor',
                  desc: 'Can create, edit, and publish stories and videos. Can approve submissions.',
                  color: 'bg-blue-50',
                },
                {
                  name: 'Reviewer',
                  desc: 'Can review and approve student submissions before publication.',
                  color: 'bg-green-50',
                },
                {
                  name: 'Contributor',
                  desc: 'Can submit photos, videos, and stories for review.',
                  color: 'bg-gray-50',
                },
              ].map((role, idx) => (
                <div key={idx} className={`rounded-lg border border-gray-200 p-6 ${role.color}`}>
                  <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                  <p className="text-gray-700 mt-2">{role.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}