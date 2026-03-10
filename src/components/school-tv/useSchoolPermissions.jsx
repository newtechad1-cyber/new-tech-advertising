import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

// Canonical permission list for each built-in role.
// AdminSchoolRoles can override these per-school via SchoolRoleDefinitions.
export const DEFAULT_PERMISSIONS = {
  school_admin: [
    'view_all_content', 'create_content', 'edit_stories',
    'approve_submissions', 'reject_submissions', 'moderate_content',
    'trigger_ai_jobs', 'use_ai_tools',
    'manage_video_projects', 'queue_render', 'publish_video',
    'manage_yearbook',
    'configure_settings', 'edit_branding', 'manage_users', 'manage_roles',
    'view_analytics',
  ],
  editor: [
    'view_all_content', 'create_content', 'edit_stories',
    'trigger_ai_jobs', 'use_ai_tools', 'view_analytics',
  ],
  content_reviewer: [
    'view_all_content',
    'approve_submissions', 'reject_submissions', 'moderate_content',
    'view_analytics',
  ],
  yearbook_manager: [
    'view_all_content', 'create_content',
    'manage_yearbook', 'trigger_ai_jobs', 'use_ai_tools',
    'view_analytics',
  ],
  video_manager: [
    'view_all_content',
    'manage_video_projects', 'queue_render', 'publish_video',
    'trigger_ai_jobs', 'use_ai_tools', 'view_analytics',
  ],
  viewer: [
    'view_all_content', 'view_analytics',
  ],
};

export const ALL_PERMISSIONS = Object.values(DEFAULT_PERMISSIONS).flat().filter((v, i, a) => a.indexOf(v) === i);

export const ROLE_META = {
  school_admin:     { display_name: 'School Admin',      description: 'Full access across this school', color: 'red' },
  editor:           { display_name: 'Editor',             description: 'Create and edit stories, use AI tools', color: 'purple' },
  content_reviewer: { display_name: 'Content Reviewer',   description: 'Approve and reject submissions', color: 'yellow' },
  yearbook_manager: { display_name: 'Yearbook Manager',   description: 'Manage yearbook pages and seasons', color: 'blue' },
  video_manager:    { display_name: 'Video Manager',      description: 'Manage projects, render, and publish', color: 'green' },
  viewer:           { display_name: 'Viewer',             description: 'Read-only access', color: 'gray' },
};

/**
 * Returns the resolved permission set for the current authenticated user
 * within the given school, plus a `can(permission)` helper.
 *
 * Resolution order (highest wins):
 *   1. app-level admin → ALL permissions
 *   2. SchoolUsers.permissions (per-user override JSON array)
 *   3. SchoolRoleDefinitions for the school (per-school role customisation)
 *   4. DEFAULT_PERMISSIONS hardcoded above
 */
export function useSchoolPermissions(schoolSlug) {
  const [permissions, setPermissions] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolSlug) { setLoading(false); return; }

    const load = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) { setPermissions([]); setLoading(false); return; }

        // App-level admins get everything
        if (user.role === 'admin') {
          setPermissions(ALL_PERMISSIONS);
          setRole('school_admin');
          setLoading(false);
          return;
        }

        // Look up school-scoped user record
        const schoolUsers = await base44.entities.SchoolUsers.filter({
          school_slug: schoolSlug,
          user_email: user.email,
        });

        if (!schoolUsers.length) {
          setPermissions([]);
          setRole(null);
          setLoading(false);
          return;
        }

        const schoolUser = schoolUsers[0];
        setRole(schoolUser.role);

        // Per-user override takes highest precedence
        if (schoolUser.permissions) {
          try {
            setPermissions(JSON.parse(schoolUser.permissions));
            setLoading(false);
            return;
          } catch {}
        }

        // Check for school-specific role override
        const roleDefs = await base44.entities.SchoolRoleDefinitions.filter({
          school_slug: schoolSlug,
          role_id: schoolUser.role,
        });

        if (roleDefs.length > 0 && roleDefs[0].permissions) {
          try {
            setPermissions(JSON.parse(roleDefs[0].permissions));
            setLoading(false);
            return;
          } catch {}
        }

        // Fall back to hardcoded defaults
        setPermissions(DEFAULT_PERMISSIONS[schoolUser.role] || []);
      } catch (err) {
        console.error('[useSchoolPermissions] error:', err);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [schoolSlug]);

  const can = (permission) => {
    if (!permissions) return false;
    return permissions.includes(permission);
  };

  return { can, role, permissions, loading };
}