import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Plus, Edit2, Trash2, Mail, Lock } from 'lucide-react';

const ROLE_DESCRIPTIONS = {
  district_admin: 'Full platform access, manage schools',
  principal_admin: 'School admin, manage all content and staff',
  teacher_editor: 'Can create, edit, and publish content',
  reviewer: 'Can approve submissions and content',
  contributor: 'Can submit media and content',
  student_media_lead: 'Student leadership role, curate content',
};

export default function AdminSchoolUsers() {
  const { schoolSlug } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('contributor');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.User.list();
        setUsers(data);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleInviteUser = async () => {
    if (!newUserEmail) {
      alert('Please enter an email address');
      return;
    }

    setInviting(true);
    try {
      await base44.users.inviteUser(newUserEmail, newUserRole);
      alert(`Invited ${newUserEmail} as ${newUserRole}`);
      setNewUserEmail('');
      setNewUserRole('contributor');
      setShowAddUser(false);
    } catch (error) {
      console.error('Error inviting user:', error);
      alert('Failed to invite user');
    } finally {
      setInviting(false);
    }
  };

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Users & Access</h1>
          <p className="text-gray-600">Manage team members and permissions</p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Add User
        </button>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">Invite Team Member</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="contributor">Contributor</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="teacher_editor">Teacher/Editor</option>
                  <option value="principal_admin">Principal/Admin</option>
                  <option value="student_media_lead">Student Media Lead</option>
                </select>
                <p className="text-xs text-gray-600 mt-2">{ROLE_DESCRIPTIONS[newUserRole]}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteUser}
                  disabled={inviting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold"
                >
                  {inviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{user.full_name || 'Unnamed'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" /> {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold capitalize">
                        {user.role || 'contributor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
                        <Edit2 className="h-4 w-4" /> Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1">
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No users added yet</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}