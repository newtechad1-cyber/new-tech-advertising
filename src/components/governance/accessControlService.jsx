/**
 * Access Control Service
 * Unified role, permission, plan, and scope-based access evaluation
 */

import { base44 } from '@/api/base44Client';

/**
 * Check if user has permission for a resource
 * @returns { allowed: boolean, reason?: string, requiresUpgrade?: boolean, upgradeTo?: string }
 */
export async function checkAccess(userId, organizationId, permissionKey) {
  try {
    // 1. Get user's role assignment in org
    const assignments = await base44.entities.UserAccessAssignment.filter({
      userId,
      organizationId,
      status: 'active'
    });

    if (!assignments || assignments.length === 0) {
      return { allowed: false, reason: 'no_role_assigned' };
    }

    const assignment = assignments[0];

    // 2. Check if assignment is suspended or expired
    if (assignment.status === 'suspended') {
      return { allowed: false, reason: 'user_suspended' };
    }

    if (assignment.expiresAt && new Date(assignment.expiresAt) < new Date()) {
      return { allowed: false, reason: 'assignment_expired' };
    }

    // 3. Check explicit denial
    const deniedPerms = assignment.deniedPermissions ? JSON.parse(assignment.deniedPermissions) : [];
    if (deniedPerms.includes(permissionKey)) {
      return { allowed: false, reason: 'permission_explicitly_denied' };
    }

    // 4. Get role definition
    const roles = await base44.entities.RoleDefinition.filter({ roleKey: assignment.roleKey });
    if (!roles || roles.length === 0) {
      return { allowed: false, reason: 'role_not_found' };
    }
    const role = roles[0];

    // 5. Check minimum plan requirement for role
    const org = await base44.entities.Organization.filter({ organizationId });
    const currentPlan = org?.[0]?.subscriptionPlan || 'free_trial';
    
    if (role.minPlanRequired && role.minPlanRequired !== 'none') {
      const planHierarchy = ['free_trial', 'diy', 'guided_growth', 'done_for_you', 'premium', 'enterprise'];
      const minIndex = planHierarchy.indexOf(role.minPlanRequired);
      const currentIndex = planHierarchy.indexOf(currentPlan);

      if (currentIndex < minIndex) {
        return {
          allowed: false,
          reason: 'insufficient_plan_for_role',
          requiresUpgrade: true,
          upgradeTo: role.minPlanRequired
        };
      }
    }

    // 6. Check permission in role's permission list (from overrides first)
    const overridePerms = assignment.overridePermissions ? JSON.parse(assignment.overridePermissions) : [];
    if (overridePerms.includes(permissionKey)) {
      return { allowed: true };
    }

    // 7. Check role's default permissions
    const rolePerms = role.permissions ? JSON.parse(role.permissions) : [];
    if (!rolePerms.includes(permissionKey)) {
      return { allowed: false, reason: 'permission_not_in_role' };
    }

    // 8. Get permission definition to check min plan
    const perms = await base44.entities.PermissionDefinition.filter({ permissionKey });
    if (perms && perms.length > 0) {
      const permission = perms[0];

      if (permission.minPlanRequired && permission.minPlanRequired !== 'none') {
        const planHierarchy = ['free_trial', 'diy', 'guided_growth', 'done_for_you', 'premium', 'enterprise'];
        const minIndex = planHierarchy.indexOf(permission.minPlanRequired);
        const currentIndex = planHierarchy.indexOf(currentPlan);

        if (currentIndex < minIndex) {
          return {
            allowed: false,
            reason: 'insufficient_plan_for_permission',
            requiresUpgrade: true,
            upgradeTo: permission.minPlanRequired
          };
        }
      }
    }

    return { allowed: true };
  } catch (error) {
    console.error('[AccessControl] Error checking access:', error);
    return { allowed: false, reason: 'access_check_error' };
  }
}

/**
 * Get all permissions for a user in an organization
 */
export async function getUserPermissions(userId, organizationId) {
  try {
    const assignments = await base44.entities.UserAccessAssignment.filter({
      userId,
      organizationId,
      status: 'active'
    });

    if (!assignments || assignments.length === 0) {
      return [];
    }

    const assignment = assignments[0];
    const roles = await base44.entities.RoleDefinition.filter({ roleKey: assignment.roleKey });

    if (!roles || roles.length === 0) {
      return [];
    }

    let permissions = JSON.parse(roles[0].permissions || '[]');
    const overrides = JSON.parse(assignment.overridePermissions || '[]');
    permissions = [...new Set([...permissions, ...overrides])];

    const denied = JSON.parse(assignment.deniedPermissions || '[]');
    permissions = permissions.filter(p => !denied.includes(p));

    return permissions;
  } catch (error) {
    console.error('[AccessControl] Error getting permissions:', error);
    return [];
  }
}

/**
 * Get user's role in organization
 */
export async function getUserRole(userId, organizationId) {
  try {
    const assignments = await base44.entities.UserAccessAssignment.filter({
      userId,
      organizationId,
      status: 'active'
    });

    if (!assignments || assignments.length === 0) {
      return null;
    }

    const assignment = assignments[0];
    const roles = await base44.entities.RoleDefinition.filter({ roleKey: assignment.roleKey });

    return roles?.[0] || null;
  } catch (error) {
    console.error('[AccessControl] Error getting user role:', error);
    return null;
  }
}

/**
 * Filter entity records based on user scope
 */
export async function filterByUserScope(userId, organizationId, records, scopeField = 'created_by') {
  try {
    const assignmentList = await base44.entities.UserAccessAssignment.filter({
      userId,
      organizationId,
      status: 'active'
    });

    if (!assignmentList || assignmentList.length === 0) {
      return [];
    }

    const scopeRestriction = assignmentList[0].scopeRestriction;

    if (!scopeRestriction || scopeRestriction === 'none') {
      return records;
    }

    if (scopeRestriction === 'own_content_only') {
      return records.filter(r => r[scopeField] === userId);
    }

    return records;
  } catch (error) {
    console.error('[AccessControl] Error filtering by scope:', error);
    return [];
  }
}

/**
 * Check plan feature access
 */
export async function checkFeatureAccess(planKey, featureKey) {
  try {
    const features = await base44.entities.PlanFeatureAccess.filter({
      planKey,
      featureKey
    });

    if (!features || features.length === 0) {
      return {
        allowed: false,
        reason: 'feature_not_available',
        message: 'This feature is not available in your plan.'
      };
    }

    const feature = features[0];

    if (feature.accessLevel === 'none') {
      return {
        allowed: false,
        reason: 'feature_not_available',
        message: feature.upgradeMessage || 'Upgrade your plan to access this feature.',
        upgradePath: feature.upgradePath
      };
    }

    return {
      allowed: true,
      accessLevel: feature.accessLevel,
      limit: feature.limit,
      limitUnit: feature.limitUnit
    };
  } catch (error) {
    console.error('[AccessControl] Error checking feature:', error);
    return { allowed: false, reason: 'feature_check_error' };
  }
}

/**
 * Log access audit event
 */
export async function logAccessAudit(auditData) {
  try {
    await base44.entities.AccessAuditLog.create({
      auditId: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...auditData
    });
  } catch (error) {
    console.error('[AccessControl] Error logging audit:', error);
  }
}