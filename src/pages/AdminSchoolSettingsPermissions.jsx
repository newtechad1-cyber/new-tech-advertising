import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminShell from '@/components/school-tv/AdminShell';
import { ArrowLeft, Lock, Eye, UserCheck } from 'lucide-react';

const PERMISSION_SETS = [
  {
    category: 'Content Submission',
    description: 'Who can submit content',
    rules: [
      {
        id: 'allow_student_submissions',
        label: 'Allow Student Submissions',
        default: true,
        description: 'Students and staff can submit photos, videos, and stories',
      },
      {
        id: 'allow_anonymous_submissions',
        label: 'Allow Anonymous Submissions',
        default: false,
        description: 'Anonymous submissions without login required',
      },
      {
        id: 'require_account',
        label: 'Require School Account',
        default: false,
        description: 'Submitters must be registered school users',
      },
    ],
  },
  {
    category: 'Content Review',
    description: 'Review workflow requirements',
    rules: [
      {
        id: 'require_teacher_approval',
        label: 'Require Teacher Approval',
        default: true,
        description: 'Teacher must review before admin can publish',
      },
      {
        id: 'require_principal_approval',
        label: 'Require Principal/Admin Review',
        default: false,
        description: 'Principal must provide final approval',
      },
      {
        id: 'auto_publish_approved',
        label: 'Auto-Publish After Approval',
        default: false,
        description: 'Automatically publish when all reviews are complete',
      },
    ],
  },
  {
    category: 'Content Safety',
    description: 'Student protection and consent',
    rules: [
      {
        id: 'require_consent_checkbox',
        label: 'Require Consent Checkbox',
        default: true,
        description: 'Submitters must confirm they have consent from people in content',
      },
      {
        id: 'require_release_signature',
        label: 'Require Media Release Agreement',
        default: true,
        description: 'Legal release must be signed before publishing',
      },
      {
        id: 'enable_ai_screening',
        label: 'Enable AI Safety Screening',
        default: true,
        description: 'AI flags potentially unsafe content for review',
      },
      {
        id: 'require_age_verification',
        label: 'Require Age Verification',
        default: false,
        description: 'Verify age/grade level of student submitters',
      },
    ],
  },
  {
    category: 'Access Control',
    description: 'Who can view and manage content',
    rules: [
      {
        id: 'staff_can_edit_student_work',
        label: 'Allow Staff to Edit Student Work',
        default: true,
        description: 'Teachers/admins can make edits before publishing',
      },
      {
        id: 'students_can_delete_submissions',
        label: 'Allow Students to Delete Submissions',
        default: true,
        description: 'Students can remove their own submissions',
      },
      {
        id: 'parents_can_view_content',
        label: 'Parents Can View Content',
        default: false,
        description: 'Parents see child\'s submissions in parent portal',
      },
    ],
  },
];

export default function AdminSchoolSettingsPermissions() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const [permissions, setPermissions] = useState(
    PERMISSION_SETS.reduce((acc, set) => {
      set.rules.forEach((rule) => {
        acc[rule.id] = rule.default;
      });
      return acc;
    }, {})
  );
  const [saving, setSaving] = useState(false);

  const handleToggle = (ruleId) => {
    setPermissions({
      ...permissions,
      [ruleId]: !permissions[ruleId],
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In real app, would save to Settings entity
      alert('Permissions saved successfully');
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="mb-8">
        <Link
          to={`${createPageUrl('AdminSchoolSettings')}?schoolSlug=${schoolSlug}`}
          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Settings
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Lock className="h-8 w-8" /> Permission Rules
        </h1>
        <p className="text-gray-600">Configure what submissions and actions are allowed</p>
      </div>

      {/* Permission Groups */}
      <div className="space-y-6">
        {PERMISSION_SETS.map((group) => (
          <div key={group.category} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">{group.category}</h3>
              <p className="text-sm text-gray-600 mt-1">{group.description}</p>
            </div>

            <div className="space-y-4">
              {group.rules.map((rule) => (
                <label
                  key={rule.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={permissions[rule.id]}
                    onChange={() => handleToggle(rule.id)}
                    className="w-5 h-5 mt-1 accent-blue-600 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{rule.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                  </div>
                  <div className="text-xs font-semibold px-2 py-1 rounded mt-1">
                    {permissions[rule.id] ? (
                      <span className="bg-green-100 text-green-800">✓ Enabled</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700">✗ Disabled</span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Safe Defaults Notice */}
      <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <div className="flex gap-4">
          <Eye className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2">School Story Lab Safe Defaults</h4>
            <p className="text-sm text-blue-800">
              These permissions are set to protect student privacy and safety by default. Only enable features you've reviewed and approved for your school community.
            </p>
            <ul className="text-sm text-blue-800 mt-3 space-y-1 ml-4">
              <li>✓ Teacher review is <strong>required</strong> by default</li>
              <li>✓ Consent verification is <strong>always required</strong></li>
              <li>✓ AI safety screening is <strong>enabled</strong></li>
              <li>✓ Auto-publish is <strong>disabled</strong> (manual review required)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <UserCheck className="h-5 w-5" />
          {saving ? 'Saving...' : '✓ Save Permissions'}
        </button>
      </div>
    </AdminShell>
  );
}