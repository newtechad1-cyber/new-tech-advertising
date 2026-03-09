import React from 'react';
import { useParams } from 'react-router-dom';
import AdminShell from '@/components/school-tv/AdminShell';
import { Settings, Users, Lock, Bell } from 'lucide-react';

export default function AdminSettings() {
  const { schoolSlug } = useParams();

  return (
    <AdminShell schoolSlug={schoolSlug}>
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 mb-8">Manage school settings and integrations</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" /> General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Upload Size</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>500 MB</option>
                <option>1 GB</option>
                <option>2 GB</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Auto-publish Approved Content</label>
              <input type="checkbox" className="accent-blue-600" defaultChecked /> <span className="text-sm text-gray-600">Automatically publish approved submissions after 24 hours</span>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
              Save Changes
            </button>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" /> User Management
          </h3>
          <p className="text-gray-600 text-sm mb-4">Invite staff members and manage permissions</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
            Invite Staff Member
          </button>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5" /> Security
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-sm mb-1">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                Enable 2FA
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-sm mb-1">Change Password</p>
              <p className="text-sm text-gray-600 mb-3">Update your account password</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-blue-600" defaultChecked />
              <span className="text-sm text-gray-700">Email me about new submissions</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-blue-600" defaultChecked />
              <span className="text-sm text-gray-700">Email me about publish approvals</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-blue-600" />
              <span className="text-sm text-gray-700">Email me about failed render jobs</span>
            </label>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
              Save Preferences
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-900 mb-4">Danger Zone</h3>
          <p className="text-sm text-red-800 mb-4">These actions cannot be undone. Please proceed with caution.</p>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold">
            Delete All Data
          </button>
        </div>
      </div>
    </AdminShell>
  );
}