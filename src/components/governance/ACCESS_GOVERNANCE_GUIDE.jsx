# NTA Master Permissions + Access Governance Layer

## Architecture Overview

A comprehensive, centralized access control governance system that manages roles, permissions, tenant scopes, feature access, page access, entity operations, agent execution rights, and audit visibility across the platform.

---

## CORE GOVERNANCE ENTITIES

### 1. MasterRoleDefinition
**Purpose:** Registry of all platform roles

**Fields:**
- `role_key` (string) - Unique identifier (e.g., 'platform_superadmin', 'reseller_owner')
- `role_name` (string) - Display name
- `role_category` (enum) - Category: platform, reseller, client, school, system
- `description` (string) - Role purpose and responsibilities
- `default_scope_type` (enum) - Default scope: global, tenant, context, limited
- `priority_level` (number) - Priority level (higher = more privileged)
- `active` (boolean) - Is role active

**File:** `entities/MasterRoleDefinition.json`

---

### 2. MasterPermissionDefinition
**Purpose:** Registry of all permissions in the platform

**Fields:**
- `permission_key` (string) - Unique identifier (e.g., 'publish_content', 'manage_roles')
- `permission_label` (string) - Display label
- `permission_category` (enum) - page_access, entity_crud, agent_execution, automation, reporting, billing, admin, system
- `description` (string) - What this permission grants
- `target_type` (string) - Target (page, entity, agent, automation)
- `action_type` (enum) - create, read, update, delete, execute, publish, approve, view
- `tenant_sensitive` (boolean) - Does this access tenant data
- `high_risk` (boolean) - Is this a high-risk permission
- `active` (boolean) - Is permission active

**File:** `entities/MasterPermissionDefinition.json`

---

### 3. RolePermissionMap
**Purpose:** Maps roles to permissions with conditional rules

**Fields:**
- `role_key` (string) - Reference to MasterRoleDefinition
- `permission_key` (string) - Reference to MasterPermissionDefinition
- `scope_override_json` (string) - Custom scope restrictions (tenant_level, access_depth, visibility)
- `conditional_rules_json` (string) - Conditional access rules (requires_approval, feature_flag, time_based, context_specific)
- `active` (boolean) - Is mapping active

**File:** `entities/RolePermissionMap.json`

---

### 4. TenantAccessScope
**Purpose:** Enforces data isolation and visibility per role

**Fields:**
- `role_key` (string) - Reference to MasterRoleDefinition
- `tenant_level` (enum) - global, agency, reseller, client, school, none
- `access_depth` (enum) - full_access, parent_only, sibling_only, self_only, restricted
- `data_visibility_rules_json` (string) - Visibility rules (can_see_parent, can_see_siblings, can_see_children, field_level_restrictions)
- `active` (boolean) - Is scope active

**File:** `entities/TenantAccessScope.json`

---

### 5. FeatureAccessPolicy
**Purpose:** Controls feature access by plan, role, and tenant

**Fields:**
- `policy_key` (string) - Unique policy identifier
- `feature_key` (string) - Feature identifier (e.g., 'ai_video_generation', 'advanced_publishing')
- `tenant_level` (enum) - global, agency, reseller, client, school
- `role_key` (string) - Required role
- `plan_required` (string) - Plan tier required (if any)
- `enabled` (boolean) - Is policy enabled
- `usage_limits_json` (string) - Limits (daily_limit, monthly_limit, concurrent_limit, rate_limit)
- `active` (boolean) - Is policy active

**File:** `entities/FeatureAccessPolicy.json`

---

### 6. AccessAuditLog
**Purpose:** Complete audit trail of all access events

**Fields:**
- `user_email` (string) - User email
- `role_key` (string) - User's role at time of action
- `action_type` (enum) - page_access, entity_read, entity_create, entity_update, entity_delete, agent_execute, publish, approve, permission_change, role_change, impersonate, login, logout
- `target_type` (string) - Target type (page, entity, agent, etc)
- `target_id` (string) - Target ID or name
- `context_type` (enum) - global, agency, reseller, client, school
- `tenant_id` (string) - Tenant accessed
- `success` (boolean) - Was action successful
- `ip_address` (string) - IP address
- `session_id` (string) - Session ID
- `details_json` (string) - Additional details

**File:** `entities/AccessAuditLog.json`

---

### 7. ImpersonationSession
**Purpose:** Tracks admin impersonation of users for audit

**Fields:**
- `impersonator_user_email` (string) - Admin's email
- `impersonator_role` (string) - Admin's role
- `target_user_email` (string) - User being impersonated
- `target_user_role` (string) - Target user's role
- `tenant_scope` (string) - Scope for this session
- `reason` (string) - Reason for impersonation
- `start_time` (date-time) - Session start
- `end_time` (date-time) - Session end
- `audit_reference` (string) - Reference to AccessAuditLog
- `active` (boolean) - Is session active

**File:** `entities/ImpersonationSession.json`

---

### 8. PermissionHealthSnapshot
**Purpose:** Health scoring and risk assessment for roles

**Fields:**
- `snapshot_time` (date-time) - When snapshot was taken
- `role_key` (string) - Role being evaluated
- `over_permission_risk_score` (number) - Risk of over-permissioning (0-100)
- `missing_permission_conflict_score` (number) - Risk of permission gaps (0-100)
- `tenant_leak_risk_score` (number) - Risk of tenant data leakage (0-100)
- `agent_execution_risk_score` (number) - Risk of unauthorized agent execution (0-100)
- `governance_health_score` (number) - Overall health (0-100)
- `issues_json` (string) - Detected issues

**File:** `entities/PermissionHealthSnapshot.json`

---

## GOVERNANCE DASHBOARDS

### 1. Admin Access (Main Hub)
**Path:** `/adminaccess`
**File:** `pages/AdminAccess.js`

Features:
- KPI cards: Active roles, permissions, high-risk permissions, violations, impersonations, health alerts
- Role registry overview
- Permission registry overview
- Tenant leak risks visualization
- Access violations detection
- Recent sensitive actions tracking
- Impersonation history

---

### 2. Role Registry Explorer
**Path:** `/adminaccess/roles`
**File:** `pages/AdminAccessRoles.js`

Features:
- Searchable role registry
- Role categorization
- Permission count per role
- Priority levels
- Active/inactive status

---

### 3. Permission Registry Explorer
**Path:** `/adminaccess/permissions`
**File:** `pages/AdminAccessPermissions.js`

Features:
- Searchable permission registry
- High-risk permissions flagged
- Tenant-sensitive permissions highlighted
- Category filtering
- Usage count per permission

---

### 4. Tenant Scope Governance
**Path:** `/adminaccess/scopes`
**File:** `pages/AdminAccessScopes.js`

Features:
- Scope enforcement visualization
- Data visibility rules per role
- Access depth indicators
- Feature access policies
- Tenant-level visibility controls

---

### 5. Access Audit Center
**Path:** `/adminaccess/audit`
**File:** `pages/AdminAccessAudit.js`

Features:
- Complete audit trail (200+ logs)
- Action filtering and search
- Success/failure tracking
- Sensitive action highlighting
- Impersonation session tracking
- IP address logging

---

## INITIAL ROLES + PERMISSIONS COVERAGE

### Roles Registered (9 total):

1. **PlatformSuperAdmin**
   - Full platform access
   - Governance override
   - System administration
   - Scope: Global

2. **PlatformOperations**
   - Monitor and maintain platform health
   - Access logs and audit trails
   - Scope: Global

3. **ResellerOwner**
   - Owns reseller account
   - Manages clients
   - Sets permissions
   - Scope: Tenant (Reseller)

4. **ResellerAdmin**
   - Administrates reseller operations
   - Onboarding and billing
   - Scope: Tenant (Reseller)

5. **ClientOwner**
   - Client account owner
   - Approves content
   - Manages permissions
   - Scope: Context (Client)

6. **ClientApprover**
   - Approves content publications
   - Scope: Context (Client)

7. **ClientViewer**
   - View-only access to client resources
   - Scope: Limited

8. **SchoolAdmin**
   - Administrates school account
   - Content management
   - Scope: Context (School)

9. **AutomationSystemRole**
   - System role for automation execution
   - Event handling
   - Scope: Global

---

### Permissions Registered (18+ total):

**Page Access:**
- `access_admin_dashboard`
- `access_admin_access`
- `access_admin_audit`

**Entity CRUD:**
- `create_user`, `read_user`, `update_user`, `delete_user`
- `create_content`

**Publishing:**
- `publish_content`

**Agent Execution:**
- `execute_agent_task`
- `execute_ai_video_agent`

**Automation:**
- `manage_automations`
- `view_automation_audit`

**Reporting:**
- `view_analytics`
- `generate_reports`

**Billing:**
- `manage_billing`

**Admin:**
- `manage_roles`
- `manage_permissions`
- `impersonate_user`

---

## GOVERNANCE RULES ENFORCED

1. **Explicit Page Permission Requirements**
   - Each page access checked against RolePermissionMap
   - Tenant scope validated

2. **Explicit Entity CRUD Permission Requirements**
   - Create, read, update, delete operations require specific permissions
   - Tenant data isolation enforced
   - Field-level restrictions applied

3. **Explicit Agent Execution Permissions**
   - Agent execution requires specific permission
   - Scope restrictions applied
   - Usage limits enforced

4. **Tenant Scope Enforcement Visibility**
   - TenantAccessScope defines access boundaries
   - Data visibility rules applied
   - Parent/sibling/child access controlled

5. **High-Risk Permission Flagging**
   - Permissions marked `high_risk: true` tracked in audit
   - Extra visibility in dashboards
   - Over-permission risk detected

6. **Feature Access by Plan + Role + Tenant**
   - FeatureAccessPolicy controls feature availability
   - Plan requirements enforced
   - Usage limits applied

---

## RISK DETECTION & SCORING

### Over-Permission Risk
- Detects roles with excessive permissions
- Flags high-risk permissions assigned to low-priority roles
- Recommends permission removal

### Tenant Leak Risk
- Identifies roles that can access multiple tenants
- Detects cross-tenant visibility issues
- Scores based on data sensitivity

### Agent Execution Risk
- Tracks unauthorized agent execution attempts
- Monitors automation system role usage
- Detects privilege escalation through agents

### Access Violation Tracking
- Failed access attempts logged
- IP-based anomaly detection
- Session-level tracking

---

## SEED DATA FUNCTION

**Path:** `functions/seedAccessGovernance.js`

Registers:
- 9 master roles
- 18 permissions
- 36 role-permission mappings
- 4 tenant access scopes
- Initial governance baseline

**Usage:**
```
Call via: base44.functions.invoke('seedAccessGovernance', {})
```

---

## NAVIGATION INTEGRATION

Add to AdminNav:
```javascript
{
  label: 'Access Control',
  icon: 'Lock',
  pages: [
    { name: 'AdminAccess', label: 'Access Governance' },
    { name: 'AdminAccessRoles', label: 'Roles' },
    { name: 'AdminAccessPermissions', label: 'Permissions' },
    { name: 'AdminAccessScopes', label: 'Tenant Scopes' },
    { name: 'AdminAccessAudit', label: 'Audit Center' },
  ]
}
```

---

## SECURITY CONSIDERATIONS

- All audit logs are immutable (append-only)
- Impersonation sessions require admin role + reason
- High-risk permission changes create audit records
- Tenant data isolation enforced at entity level
- IP logging for anomaly detection
- Session ID tracking for correlation
- Role priority prevents escalation

---

## NEXT STEPS

1. **Implement enforcement layer** in API gateway/middleware
2. **Connect to page/entity access controls** in frontend/backend
3. **Add real-time audit streaming** for compliance
4. **Create permission sync automation** when roles/perms change
5. **Build compliance reports** for certifications (SOC2, HIPAA, etc)
6. **Implement consent tracking** for sensitive operations
7. **Add 2FA requirement** for high-risk permission usage