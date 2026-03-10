import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { useSchoolPermissions, DEFAULT_PERMISSIONS, ROLE_META } from '@/components/school-tv/useSchoolPermissions';
import { Shield, Edit2, Eye, Lock, FileText, Film, BookOpen, Save, CheckCircle, Zap } from 'lucide-react';

const PERMISSION_GROUPS = {
  'Content': [
    { id: 'view_all_content',   label: 'View All Content' },
    { id: 'create_content',     label: 'Create Content' },
    { id: 'edit_stories',       label: 'Edit Stories' },
  ],
  'Submissions': [
    { id: 'approve_submissions', label: 'Approve Submissions' },
    { id: 'reject_submissions',  label: 'Reject Submissions' },
    { id: 'moderate_content',    label: 'Moderate Content' },
  ],
  'AI & Production': [
    { id: 'use_ai_tools',          label: 'Use AI Tools' },
    { id: 'trigger_ai_jobs',       label: 'Trigger AI Jobs' },
    { id: 'manage_video_projects', label: 'Manage Video Projects' },
    { id: 'queue_render',          label: 'Queue Renders' },
    { id: 'publish_video',         label: 'Publish Videos' },
  ],
  'Yearbook': [
    { id: 'manage_yearbook', label: 'Manage Yearbook' },
  ],
  'Administration': [
    { id: 'configure_settings', label: 'Configure Settings' },
    { id: 'edit_branding',      label: 'Edit Branding' },
    { id: 'manage_users',       label: 'Manage Users' },
    { id: 'manage_roles',       label: 'Manage Roles' },
    { id: 'view_analytics',     label: 'View Analytics' },
  ],
};

const GROUP_ICONS = {
  'Content':        <FileText className="h-4 w-4" />,
  'Submissions':    <Eye className="h-4 w-4" />,
  'AI & Production':<Zap className="h-4 w-4" />,
  'Yearbook':       <BookOpen className="h-4 w-4" />,
  'Administration': <Shield className="h-4 w-4" />,
};

const COLOR_CARD = {
  red:    'bg-red-50 border-red-200',
  purple: 'bg-purple-50 border-purple-200',
  yellow: 'bg-yellow-50 border-yellow-200',
  blue:   'bg-blue-50 border-blue-200',
  green:  'bg-green-50 border-green-200',
  gray:   'bg-gray-50 border-gray-200',
};

const COLOR_BADGE = {
  red:    'bg-red-100 text-red-800',
  purple: 'bg-purple-100 text-purple-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  blue:   'bg-blue-100 text-blue-800',
  green:  'bg-green-100 text-green-800',
  gray:   'bg-gray-100 text-gray-700',
};

export default function AdminSchoolRoles() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';

  const { can } = useSchoolPermissions(schoolSlug);

  // All role IDs in display order
  const ROLE_IDS = Object.keys(ROLE_META);

  // Per-school overrides loaded from entity: { [role_id]: { id, permissions[] } }
  const [savedDefs, setSavedDefs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Which role is selected in the left panel
  const [selectedRoleId, setSelectedRoleId] = useState('school_admin');
  const [editMode, setEditMode] = useState(false);

  // Editable permissions for the currently selected role
  const [editingPerms, setEditingPerms] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const defs = await base44.entities.SchoolRoleDefinitions.filter({ school_slug: schoolSlug });
        const map = {};
        defs.forEach(d => {
          try { map[d.role_id] = { id: d.id, permissions: JSON.parse(d.permissions) }; } catch {}
        });
        setSavedDefs(map);
      } catch (err) {
        console.error('Error loading role definitions:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [schoolSlug]);

  // Resolve effective permissions for a role (saved override OR hardcoded default)
  const effectivePerms = (roleId) => savedDefs[roleId]?.permissions ?? DEFAULT_PERMISSIONS[roleId] ?? [];
  const isCustomised = (roleId) => !!savedDefs[roleId];

  const handleSelectRole = (roleId) => {
    setSelectedRoleId(roleId);
    setEditMode(false);
  };

  const handleStartEdit = () => {
    setEditingPerms([...effectivePerms(selectedRoleId)]);
    setEditMode(true);
  };

  const handleTogglePerm = (permId) => {
    setEditingPerms(prev =>
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const permJson = JSON.stringify(editingPerms);
      const existing = savedDefs[selectedRoleId];
      if (existing?.id) {
        await base44.entities.SchoolRoleDefinitions.update(existing.id, { permissions: permJson });
      } else {
        const created = await base44.entities.SchoolRoleDefinitions.create({
          school_slug: schoolSlug,
          role_id: selectedRoleId,
          display_name: ROLE_META[selectedRoleId].display_name,
          description: ROLE_META[selectedRoleId].description,
          color: ROLE_META[selectedRoleId].color,
          permissions: permJson,
        });
        setSavedDefs(prev => ({ ...prev, [selectedRoleId]: { id: created.id, permissions: editingPerms } }));
      }
      setSavedDefs(prev => ({ ...prev, [selectedRoleId]: { ...prev[selectedRoleId], permissions: editingPerms } }));
      setEditMode(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving role:', err);
      alert('Failed to save role permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    if (!confirm('Reset this role to default permissions? This will remove any school-specific customisation.')) return;
    const existing = savedDefs[selectedRoleId];
    if (existing?.id) {
      await base44.entities.SchoolRoleDefinitions.delete(existing.id);
      const updated = { ...savedDefs };
      delete updated[selectedRoleId];
      setSavedDefs(updated);
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const meta = ROLE_META[selectedRoleId];
  const activePerms = editMode ? editingPerms : effectivePerms(selectedRoleId);

  if (loading) {
    return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12 text-gray-500">Loading roles...</div></AdminShell>;
  }

  return (
    <AdminShell schoolSlug={schoolSlug}>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-1">
            <Shield className="h-8 w-8" /> Roles & Permissions
          </h1>
          <p className="text-gray-500 text-sm">Per-school customisation of what each role can do</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-300 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold">
            <CheckCircle className="h-4 w-4" /> Permissions saved
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Role list */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Roles ({ROLE_IDS.length})</p>
            </div>
            <div className="divide-y divide-gray-100">
              {ROLE_IDS.map((roleId) => {
                const m = ROLE_META[roleId];
                const custom = isCustomised(roleId);
                return (
                  <button
                    key={roleId}
                    onClick={() => handleSelectRole(roleId)}
                    className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors ${
                      selectedRoleId === roleId ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 text-sm">{m.display_name}</p>
                      {custom && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">Custom</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{effectivePerms(roleId).length} permissions</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Role detail */}
        <div className="md:col-span-2">
          <div className={`rounded-lg border-2 p-6 ${COLOR_CARD[meta.color]}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${COLOR_BADGE[meta.color]}`}>
                  {meta.display_name}
                </span>
                {isCustomised(selectedRoleId) && (
                  <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-semibold">School-customised</span>
                )}
                <p className="text-sm text-gray-600">{meta.description}</p>
              </div>
              {!editMode && can('manage_roles') && (
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-semibold"
                >
                  <Edit2 className="h-4 w-4" /> Edit
                </button>
              )}
            </div>

            {/* Permissions grid */}
            <div className="space-y-5">
              {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => (
                <div key={group}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-500">{GROUP_ICONS[group]}</span>
                    <h4 className="text-sm font-bold text-gray-800">{group}</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 ml-6">
                    {perms.map((perm) => {
                      const has = activePerms.includes(perm.id);
                      return (
                        <label
                          key={perm.id}
                          className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 transition-colors ${
                            has ? 'bg-white/70' : 'opacity-50'
                          } ${editMode ? 'hover:bg-white' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={has}
                            disabled={!editMode}
                            onChange={() => handleTogglePerm(perm.id)}
                            className="w-4 h-4 rounded accent-blue-600"
                          />
                          <span className={`text-sm ${has ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                            {perm.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Edit mode actions */}
            {editMode && (
              <div className="mt-6 flex flex-wrap gap-3 border-t border-black/10 pt-5">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold text-sm"
                >
                  <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-lg font-semibold text-sm"
                >
                  Cancel
                </button>
                {isCustomised(selectedRoleId) && (
                  <button
                    onClick={handleResetToDefault}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold ml-auto"
                  >
                    Reset to defaults
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Permission matrix summary */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Permission Matrix — All Roles</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-2 text-left text-gray-600 font-semibold w-40">Permission</th>
                    {ROLE_IDS.map(r => (
                      <th key={r} className={`px-3 py-2 text-center font-semibold ${selectedRoleId === r ? 'text-blue-700' : 'text-gray-600'}`}>
                        {ROLE_META[r].display_name.split(' ')[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.values(PERMISSION_GROUPS).flat().map((perm) => (
                    <tr key={perm.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-1.5 text-gray-700">{perm.label}</td>
                      {ROLE_IDS.map(r => (
                        <td key={r} className="px-3 py-1.5 text-center">
                          {effectivePerms(r).includes(perm.id)
                            ? <span className="text-green-600 font-bold">✓</span>
                            : <span className="text-gray-200">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {!can('manage_roles') && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2 text-sm text-amber-800">
              <Lock className="h-4 w-4 flex-shrink-0" />
              Your role does not have <strong>manage_roles</strong> permission. You can view but not edit role definitions.
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}