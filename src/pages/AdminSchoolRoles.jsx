import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminShell from '@/components/school-tv/AdminShell';
import { createPageUrl } from '@/utils';
import { Shield, Edit2, Eye, Lock, FileText } from 'lucide-react';

const ROLE_DEFINITIONS = [
  {
    id: 'district_admin',
    name: 'District Admin',
    description: 'Full system access across all schools',
    color: 'red',
    permissions: [
      'view_all_content',
      'manage_users',
      'configure_settings',
      'moderate_content',
      'publish_content',
      'manage_roles',
      'view_analytics',
      'manage_ai_tools',
    ],
  },
  {
    id: 'principal',
    name: 'Principal / Admin Staff',
    description: 'Administrative oversight and approvals',
    color: 'blue',
    permissions: [
      'view_all_content',
      'manage_users',
      'configure_settings',
      'moderate_content',
      'publish_content',
      'view_analytics',
      'manage_ai_tools',
    ],
  },
  {
    id: 'teacher',
    name: 'Teacher / Editor',
    description: 'Create and edit school content',
    color: 'purple',
    permissions: [
      'create_content',
      'edit_own_content',
      'submit_for_review',
      'view_own_submissions',
      'moderate_student_content',
      'use_ai_tools',
    ],
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    description: 'Review and approve content submissions',
    color: 'yellow',
    permissions: [
      'view_submissions',
      'moderate_content',
      'approve_content',
      'reject_content',
      'add_comments',
    ],
  },
  {
    id: 'contributor',
    name: 'Contributor',
    description: 'Submit content for review',
    color: 'green',
    permissions: [
      'submit_content',
      'view_own_submissions',
      'edit_own_submissions',
      'view_published_content',
    ],
  },
  {
    id: 'student_media_lead',
    name: 'Student Media Lead',
    description: 'Student leader managing submissions and projects',
    color: 'cyan',
    permissions: [
      'create_content',
      'edit_own_content',
      'submit_for_review',
      'view_submissions',
      'moderate_student_content',
      'coordinate_projects',
    ],
  },
];

const PERMISSION_GROUPS = {
  'Content Management': [
    { id: 'create_content', label: 'Create Content' },
    { id: 'edit_own_content', label: 'Edit Own Content' },
    { id: 'view_all_content', label: 'View All Content' },
  ],
  'Review & Moderation': [
    { id: 'view_submissions', label: 'View Submissions' },
    { id: 'moderate_content', label: 'Moderate Content' },
    { id: 'approve_content', label: 'Approve Content' },
    { id: 'reject_content', label: 'Reject Content' },
    { id: 'moderate_student_content', label: 'Moderate Student Content' },
    { id: 'add_comments', label: 'Add Comments' },
  ],
  'Publishing': [
    { id: 'publish_content', label: 'Publish Content' },
    { id: 'submit_for_review', label: 'Submit for Review' },
  ],
  'Administration': [
    { id: 'manage_users', label: 'Manage Users' },
    { id: 'manage_roles', label: 'Manage Roles' },
    { id: 'configure_settings', label: 'Configure Settings' },
  ],
  'Analytics & AI': [
    { id: 'view_analytics', label: 'View Analytics' },
    { id: 'use_ai_tools', label: 'Use AI Tools' },
    { id: 'manage_ai_tools', label: 'Manage AI Tools' },
  ],
  'Other': [
    { id: 'view_own_submissions', label: 'View Own Submissions' },
    { id: 'edit_own_submissions', label: 'Edit Own Submissions' },
    { id: 'view_published_content', label: 'View Published Content' },
    { id: 'coordinate_projects', label: 'Coordinate Projects' },
  ],
};

const PERMISSION_ICONS = {
  'Content Management': <FileText className="h-5 w-5" />,
  'Review & Moderation': <Eye className="h-5 w-5" />,
  'Publishing': <Lock className="h-5 w-5" />,
  'Administration': <Shield className="h-5 w-5" />,
};

export default function AdminSchoolRoles() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const [selectedRole, setSelectedRole] = useState(ROLE_DEFINITIONS[0]);
  const [editMode, setEditMode] = useState(false);

  const colorClasses = {
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200',
    cyan: 'bg-cyan-50 border-cyan-200',
  };

  const colorBadges = {
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    cyan: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Shield className="h-8 w-8" /> School Roles & Permissions
        </h1>
        <p className="text-gray-600">Manage user roles and what they can do</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Role List */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-700">Roles</p>
            </div>
            <div className="divide-y divide-gray-200">
              {ROLE_DEFINITIONS.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role);
                    setEditMode(false);
                  }}
                  className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors ${
                    selectedRole.id === role.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <p className="font-semibold text-gray-900">{role.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{role.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Role Details */}
        <div className="md:col-span-2">
          <div className={`rounded-lg shadow-md p-6 border-2 ${colorClasses[selectedRole.color]}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${colorBadges[selectedRole.color]}`}>
                  {selectedRole.name}
                </span>
                <p className="text-sm text-gray-600">{selectedRole.description}</p>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            </div>

            {/* Permissions */}
            <div className="space-y-6">
              {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => (
                <div key={group}>
                  <div className="flex items-center gap-2 mb-3">
                    {PERMISSION_ICONS[group] && <span className="text-gray-600">{PERMISSION_ICONS[group]}</span>}
                    <h4 className="font-bold text-gray-900">{group}</h4>
                  </div>
                  <div className="space-y-2 ml-7">
                    {perms.map((perm) => {
                      const hasPermission = selectedRole.permissions.includes(perm.id);
                      return (
                        <label key={perm.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hasPermission}
                            disabled={!editMode}
                            onChange={() => {
                              // In real app, would update permissions
                            }}
                            className="w-4 h-4 rounded accent-blue-600"
                          />
                          <span className={`text-sm ${hasPermission ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                            {perm.label}
                          </span>
                          {hasPermission && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Allowed</span>}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Mode Buttons */}
            {editMode && (
              <div className="mt-8 flex gap-3">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold">
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Role definitions are school-wide and apply to all users. Custom roles can be created in enterprise plans.
            </p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}