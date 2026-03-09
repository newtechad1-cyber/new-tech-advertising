import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Users, Plus, Trash2, Edit2, Mail, UserCheck, UserX } from 'lucide-react';
import UserFormModal from '@/components/school-tv/UserFormModal.jsx';

const ROLE_LABELS = {
  'district_admin': 'District Admin',
  'principal': 'Principal/Admin',
  'teacher': 'Teacher/Editor',
  'reviewer': 'Reviewer',
  'contributor': 'Contributor',
  'student_media_lead': 'Student Media Lead',
};

export default function AdminSchoolUsers() {
  const { schoolSlug } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [schoolSlug]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // In a real app, this would query school-specific users
      // For now, we'll load all users and filter/mock by school
      const allUsers = await base44.entities.User.list();
      setUsers(allUsers || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    try {
      // In real implementation, would delete user record
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        // Update existing user
        await base44.auth.updateMe(userData);
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
      } else {
        // Invite new user
        await base44.users.inviteUser(userData.email, userData.role || 'user');
        setUsers([...users, userData]);
      }
      setShowModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user');
    }
  };

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Users className="h-8 w-8" /> School Users
          </h1>
          <p className="text-gray-600">Manage staff, teachers, and contributors</p>
        </div>
        <button
          onClick={handleAddUser}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Add User
        </button>
      </div>

      {/* User List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-600">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            <p className="mb-4">No users yet</p>
            <button
              onClick={handleAddUser}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Add the first user
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {user.full_name || 'Unnamed User'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {ROLE_LABELS[user.role] || user.role || 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {user.active !== false ? (
                        <>
                          <UserCheck className="h-4 w-4 text-green-600" />
                          <span className="text-green-700 font-semibold">Active</span>
                        </>
                      ) : (
                        <>
                          <UserX className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500">Inactive</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User Form Modal */}
      {showModal && (
        <UserFormModal
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={() => setShowModal(false)}
        />
      )}
    </AdminShell>
  );
}