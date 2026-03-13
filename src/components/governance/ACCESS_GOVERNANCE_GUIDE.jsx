# NTA Master Permissions + Access Governance Layer

## Overview
Unified, multi-layered access control system combining:
- **Role-based access control (RBAC)** — Define who can do what
- **Plan-based feature gating** — Feature availability per subscription tier
- **Organization scope** — Data isolation across orgs
- **Scope restrictions** — Granular data visibility (own content, team, org, or global)
- **Audit logging** — Complete trail of sensitive actions with denial reasons

---

## Core Entities

### 1. RoleDefinition
**Defines roles and their baseline capabilities**

```
roleKey: "admin_ops" (unique identifier)
roleName: "Operations Admin"
description: "Manages fulfillment, delivery, and team operations"
roleType: "internal" | "client_facing" | "reseller"
minPlanRequired: "done_for_you" (minimum plan to assign this role)
permissions: ["content_create", "content_publish", "team_manage"] (JSON array)
canManageUsers: true
canManageRoles: false
canViewAnalytics: true
canModifyContent: true
canPublishContent: true
canAccessBilling: false
isActive: true
```

**Built-in Roles:**
- `super_admin` — Platform super admin (all permissions, all orgs)
- `admin_ops` — Operations manager (fulfillment, team, analytics)
- `sales` — Sales team (pipeline, proposals, deals)
- `strategist` — Client strategist (campaigns, content, analytics)
- `support` — Support team (tickets, client communication)
- `client_owner` — Client account owner (full org access)
- `client_team` — Client team member (assigned content/campaigns)
- `reseller_admin` — Reseller admin (manage reseller clients)

---

### 2. PermissionDefinition
**Granular permissions that can be granted or denied**

```
permissionKey: "content_create" (unique identifier)
permissionName: "Create Content"
category: "content_creation" | "publishing" | "analytics" | "billing" | "admin"
description: "Can create new content assets"
resourceType: "ContentAsset" (entity this applies to)
action: "create" | "read" | "update" | "delete" | "publish" | "export"
minPlanRequired: "diy" (minimum plan to use)
scopeLevel: "organization" | "team" | "personal" | "global"
isSensitive: true (triggers audit logging)
isActive: true
```

**Permission Categories:**
- **user_management**: Add/remove users, manage roles
- **content_creation**: Create drafts, assets, campaigns
- **publishing**: Publish content to channels
- **analytics**: View reports, dashboards
- **billing**: Manage payments, subscriptions
- **admin**: System administration
- **organization**: Org settings, structure
- **automation**: Configure automations
- **integrations**: Connect external services
- **client_access**: Client portal management
- **reseller_management**: Manage reseller network

---

### 3. RolePermissionMap
**Links roles to permissions (with conditions and scope overrides)**

```
mapId: "map_admin_ops_content_create"
roleKey: "admin_ops"
permissionKey: "content_create"
allowed: true
conditions: null (future: time restrictions, etc.)
scopeOverride: "none" | "own_only" | "team_only" | "organization" | "global"
```

**Scope Overrides:**
- `none` — Use permission's default scope
- `own_only` — Can only access own records
- `team_only` — Can access team records
- `organization` — Can access all org records
- `global` — Can access all records across platform

---

### 4. PlanFeatureAccess
**Gates features by subscription plan**

```
featureId: "feat_1"
planKey: "diy" | "guided_growth" | "done_for_you" | "premium" | "enterprise"
featureKey: "weekly_content_automation"
featureName: "Weekly Content Automation"
category: "automation" | "ai_capabilities" | "integrations" | "support"
accessLevel: "none" | "limited" | "standard" | "advanced" | "unlimited"
limit: 52 (max campaigns per year)
limitUnit: "monthly" | "yearly" | "total" | "concurrent"
upgradePath: "guided_growth" (next plan for more access)
upgradeMessage: "Upgrade to Guided Growth to automate weekly content"
```

**Feature Access Levels:**
- `none` — Feature not available
- `limited` — Basic access with strict limits
- `standard` — Full access with reasonable limits
- `advanced` — Enhanced features, high limits
- `unlimited` — Full access, no limits

**Example Plan Matrix:**
```
Feature                      Free Trial   DIY         Guided Growth   Done For You
-------                      ----------   ---         -------         ---------
Campaigns                    limited(3)   unlimited   unlimited       unlimited
Content Assets               limited(20)  unlimited   unlimited       unlimited
Team Members                 1            3           10              unlimited
Integrations                 none         limited     standard        advanced
AI Capabilities              limited      standard    advanced        unlimited
Automation Rules             limited(5)   standard    advanced        unlimited
Video Generation             none         limited     standard        advanced
```

---

### 5. UserAccessAssignment
**Assigns users to roles within organizations (with overrides and scope restrictions)**

```
assignmentId: "assign_user123_org456"
userId: "user123"
organizationId: "org456"
roleKey: "client_team"
status: "active" | "inactive" | "suspended" | "pending_activation"
assignedBy: "admin_user_id"
assignedAt: "2026-03-13T10:00:00Z"
effectivePlan: "guided_growth" (plan in this org)
overridePermissions: ["content_publish"] (grant additional)
deniedPermissions: ["billing_manage"] (explicitly deny)
scopeRestriction: "own_content_only" | "team_only" | "read_only" | "limited_scope"
expiresAt: "2026-06-13T23:59:59Z" (role expires)
reason: "Hired new strategist for Q2"
```

---

### 6. AccessAuditLog
**Immutable audit trail of all access-related actions (append-only)**

```
auditId: "audit_123456_abc"
timestamp: "2026-03-13T10:05:22Z" (IMMUTABLE)
userId: "user123" (who performed action)
organizationId: "org456"
actionType: "role_assigned" | "permission_overridden" | "access_denied" | "data_accessed"
resourceType: "User" | "Campaign" | "ContentAsset"
resourceId: "resource_id"
targetUserId: "target_user" (if applicable)
result: "allowed" | "denied" | "requires_upgrade" | "out_of_scope" | "suspended"
denialReason: "insufficient_plan" | "permission_denied" | "out_of_scope"
details: { ... } (JSON context)
ipAddress: "192.168.1.1"
userAgent: "Mozilla/5.0..."
isSensitive: true (marks for review)
```

**Action Types:**
- `role_assigned` — User assigned to role
- `role_revoked` — Role removed from user
- `permission_overridden` — Permission grant/denial override
- `access_denied` — User access attempt denied
- `plan_feature_gated` — Feature not available
- `data_accessed` — Sensitive data viewed
- `sensitive_resource_modified` — Admin action taken
- `user_suspended` — User account suspended
- `export_performed` — Data export by user

**Denial Reasons:**
- `insufficient_role` — Role doesn't have permission
- `insufficient_plan` — Subscription too low for feature
- `out_of_scope` — Data outside user's scope
- `user_suspended` — User account suspended
- `permission_denied` — Explicitly denied
- `feature_not_available` — Plan doesn't include feature
- `limit_exceeded` — Monthly/yearly limit reached

---

## Access Evaluation Flow

### Step 1: Check User Assignment
```
SELECT * FROM UserAccessAssignment
WHERE userId = ? AND organizationId = ?
  AND status IN ('active', 'pending_activation')
```
❌ No assignment → DENY (no_role_assigned)

### Step 2: Check Assignment Status
- If `status = 'suspended'` → DENY (user_suspended)
- If `expiresAt < now()` → DENY (assignment_expired)
- ✓ Continue

### Step 3: Check Explicit Denials
```
Parse assignment.deniedPermissions
If permissionKey in deniedPermissions → DENY (permission_explicitly_denied)
```

### Step 4: Verify Role Exists & Min Plan
```
SELECT * FROM RoleDefinition WHERE roleKey = ?
If role.minPlanRequired > org.subscriptionPlan
  → REQUIRE_UPGRADE (insufficient_plan_for_role)
```

### Step 5: Check Permission Overrides
```
Parse assignment.overridePermissions
If permissionKey in overrides → ALLOW
```

### Step 6: Check Role's Permissions
```
Parse role.permissions
If permissionKey NOT in role.permissions
  → DENY (permission_not_in_role)
```

### Step 7: Check Permission's Min Plan
```
SELECT * FROM PermissionDefinition WHERE permissionKey = ?
If permission.minPlanRequired > org.subscriptionPlan
  → REQUIRE_UPGRADE (insufficient_plan_for_permission)
```

### Step 8: Evaluate Scope
```
Determine data visible to user based on scopeRestriction:
- "own_only" → Filter to records where created_by = userId
- "team_only" → Filter to team's records
- "organization" → All org records
- "global" → All records
```

✅ **ALLOW**

---

## Implementation Guide

### 1. Route Protection

```jsx
// Before rendering route
const access = await checkAccess(user.id, orgId, 'content_create');

if (!access.allowed) {
  if (access.requiresUpgrade) {
    return <UpgradeRequired upgradeTo={access.upgradeTo} />;
  }
  return <AccessDenied reason={access.reason} />;
}

// Render route
```

### 2. Feature Gating

```jsx
const feature = await checkFeatureAccess(plan, 'weekly_automation');

if (!feature.allowed) {
  return (
    <FeatureLocked
      message={feature.message}
      upgradePath={feature.upgradePath}
    />
  );
}

// Show feature
```

### 3. Data Filtering

```jsx
// Load all records
const records = await fetchCampaigns(orgId);

// Filter by user scope
const filtered = await filterByUserScope(user.id, orgId, records);

// Return only what user can see
return filtered;
```

### 4. Audit Logging

```jsx
// Log sensitive action
await logAccessAudit({
  userId: user.id,
  organizationId: orgId,
  actionType: 'role_assigned',
  targetUserId: newUser.id,
  result: 'allowed',
  isSensitive: true
});
```

---

## Role Examples

### Super Admin
```
Roles: ["super_admin"]
Org Scope: Global
Permissions: ALL
Plan Required: None
Can: Everything
```

### Client Owner
```
Role: "client_owner"
Org Scope: Single organization
Permissions: [
  "team_manage",
  "content_create", "content_publish",
  "campaign_manage",
  "analytics_view",
  "billing_manage"
]
Plan Required: Any
Scope Override: "organization"
```

### Client Team Member
```
Role: "client_team"
Org Scope: Single organization
Permissions: [
  "content_create", "content_publish",
  "campaign_view",
  "analytics_view"
]
Plan Required: Any
Scope Override: "own_content_only"
Can only see/modify their own content
```

### Strategist (DFY)
```
Role: "strategist"
Org Scope: Single organization
Permissions: [
  "campaign_create", "campaign_manage",
  "content_create", "content_publish",
  "analytics_view",
  "reporting_create"
]
Plan Required: "done_for_you"
Scope Override: "organization"
Can see all content, but limited to this org
```

---

## Plan Feature Matrix

| Feature | Free Trial | DIY | Guided | DFY | Premium | Enterprise |
|---------|-----------|-----|--------|-----|---------|-----------|
| Campaigns | 3 | ∞ | ∞ | ∞ | ∞ | ∞ |
| Team Members | 1 | 3 | 10 | ∞ | ∞ | ∞ |
| Integrations | Limited | Limited | Standard | Advanced | Advanced | Unlimited |
| AI Capabilities | Limited | Standard | Advanced | Advanced | Unlimited | Unlimited |
| Automation | 5 rules | Standard | Advanced | Unlimited | Unlimited | Unlimited |
| API Access | None | None | None | Limited | Full | Full |
| White Label | None | None | None | Yes | Yes | Yes |
| Support | Email | Email | Phone | Dedicated | Dedicated | Dedicated |

---

## Admin Access Governance Page

**Route:** `/admin/access-governance`

**Sections:**
1. **Overview** — Statistics, alerts, recent audit events
2. **Role Matrix** — All roles, capabilities, permissions
3. **Plan Feature Matrix** — Feature availability per plan
4. **User Access** — User assignments, roles, scope restrictions
5. **Audit Log** — Recent access events with denial reasons

**Key Features:**
- Real-time statistics (total roles, permissions, assignments)
- Alerts for suspicious activity (denials, suspensions)
- Search and filter by organization, role, user
- Export audit logs
- View assignment details (role, scope, expires)
- See denial patterns and trends

---

## Security Best Practices

1. **Principle of Least Privilege**
   - Assign minimum permissions needed
   - Use scope restrictions aggressively
   - Deny by default, allow explicitly

2. **Regular Audits**
   - Review access audit logs weekly
   - Check for suspicious denial patterns
   - Audit sensitive action frequency

3. **Temporary Access**
   - Use `expiresAt` for temporary role assignments
   - Auto-revoke after duration
   - Require re-approval for extension

4. **Scope Isolation**
   - Always enforce organization scope
   - Use scope restrictions for team separation
   - Never allow global access unless necessary

5. **Sensitive Action Logging**
   - Mark sensitive actions (`isSensitive: true`)
   - Review admin actions regularly
   - Alert on unusual patterns

6. **Role Inheritance**
   - Create role hierarchy (super_admin > admin > manager > viewer)
   - Avoid role sprawl
   - Document role responsibilities

---

## Future Extensions

- **Time-based access** — Allow/deny based on time window
- **Risk-based access** — Deny if suspicious login location
- **Session management** — Force re-auth for sensitive ops
- **Rate limiting** — Limit API calls per role
- **Approval workflows** — Require approval for high-risk actions
- **Delegation** — Temporarily delegate permissions
- **Audit reports** — Auto-generated compliance reports