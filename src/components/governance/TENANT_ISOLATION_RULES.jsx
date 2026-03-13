# NTA White-Label / Reseller Governance Layer

## Tenant Isolation Architecture

### Tenant Types

1. **Master Tenant** (`tenantType: "master"`)
   - NTA corporate master platform
   - Owns all resellers and white-label tenants
   - Full access to all data
   - Can create and manage resellers
   - Can override any reseller decisions

2. **Reseller Tenant** (`tenantType: "reseller"`)
   - White-label partner company
   - Manages subset of clients
   - Can customize branding, plans, pricing
   - Views filtered analytics
   - Cannot see other reseller data

3. **White-Label Tenant** (`tenantType: "white_label"`)
   - Dedicated instance for large reseller
   - Complete brand customization
   - Own domain
   - Own user management
   - Own plan catalog

### Isolation Rules

#### Rule 1: Single Tenant Assignment
```
CONSTRAINT: Each Organization belongs to exactly ONE Tenant
- On Organization creation: require tenantId assignment
- On Organization update: tenantId cannot change
- Denormalize: TenantOrganizationMap must have one row per Organization
- Enforce: UNIQUE(organizationId) on TenantOrganizationMap
```

**Implementation:**
```sql
SELECT * FROM TenantOrganizationMap WHERE organizationId = ?
-- Must return exactly 1 row
```

#### Rule 2: Tenant Data Isolation
```
CONSTRAINT: Users can only see data from their assigned tenant(s)
- Query filter: ALL queries must include tenantId WHERE clause
- Cross-tenant: FORBIDDEN - no data leakage
- Escalation: Only Master Tenant can see cross-tenant data
```

**Implementation:**
```js
// Before querying any organization/campaign/asset:
const userTenants = await getTenantsByUser(userId);
const query = {
  tenantId: { $in: userTenants }
};
return await base44.entities.Organization.filter(query);
```

#### Rule 3: Reseller Client Isolation
```
CONSTRAINT: Resellers can only manage their assigned clients
- Reseller sees: Only organizations in their TenantOrganizationMap
- Master sees: All organizations across all tenants
- Cross-reseller: FORBIDDEN
```

**Implementation:**
```js
// Reseller dashboard
const maps = await base44.entities.TenantOrganizationMap.filter({
  tenantId: resellerTenantId
});
const clientOrgIds = maps.map(m => m.organizationId);
const clients = await base44.entities.Organization.filter({
  id: { $in: clientOrgIds }
});
```

#### Rule 4: Branding Isolation
```
CONSTRAINT: Each tenant has independent branding
- BrandProfile per Tenant (1:1)
- Displayed on: onboarding, dashboard header, support footer
- Inheritance: Reseller brand shown to reseller's clients
- Master brand shown only to master tenant users
```

**Implementation:**
```js
const userTenants = await getTenantsByUser(userId);
const brandProfile = await base44.entities.BrandProfile.filter({
  tenantId: { $in: userTenants }
}, '-createdAt', 1);
// Use brandProfile.logoUrl, primaryColor, etc.
```

#### Rule 5: User Scope by Tenant
```
CONSTRAINT: TenantUserAssignment controls access
- User + Tenant = unique assignment
- Role: tenant_admin, tenant_manager, tenant_member, tenant_viewer
- Permissions: Inherited from role + overrides
- Expiry: Optional auto-revocation
```

**Implementation:**
```js
const assignment = await base44.entities.TenantUserAssignment.filter({
  tenantId: resellerTenantId,
  userId: currentUserId
}, null, 1);

if (!assignment || !isActive(assignment)) {
  throw new AccessDenied('Not assigned to this tenant');
}

return assignment.tenantRole; // "tenant_admin", etc.
```

#### Rule 6: Plan Catalog Override
```
CONSTRAINT: Each tenant can customize plan offerings
- TenantPlanCatalog: Customized display names, prices, features
- Inheritance: Falls back to master PlanFeatureAccess if not overridden
- Visibility: Reseller can hide plans from clients
- Pricing: Can mark up/down from master pricing
```

**Implementation:**
```js
const tenantPlan = await base44.entities.TenantPlanCatalog.filter({
  tenantId: userTenantId,
  basePlanKey: 'diy'
}, null, 1);

// Use tenant-specific price/name or fall back to master
const displayPrice = tenantPlan?.[0]?.displayPrice || masterPrice;
const displayName = tenantPlan?.[0]?.displayPlanName || masterName;
```

#### Rule 7: No Cross-Tenant User Management
```
CONSTRAINT: Users cannot manage users across tenants
- Reseller cannot invite Master users to their tenant
- Master can invite users to any tenant
- Each user assignment is explicit (TenantUserAssignment)
```

**Implementation:**
```js
// Prevent: Regular user inviting to different tenant
if (userTenantId !== targetTenantId && userRole !== 'super_admin') {
  throw new Error('Cannot invite users to other tenants');
}
```

#### Rule 8: Audit Trail Per Tenant
```
CONSTRAINT: AccessAuditLog includes tenantId for filtering
- Master sees: All audit logs across all tenants
- Reseller sees: Only audit logs for their organizations
- Compliance: Audit logs are immutable per tenant
```

**Implementation:**
```js
const auditLogs = await base44.entities.AccessAuditLog.filter({
  tenantId: { $in: userTenants }
}, '-timestamp', 50);
```

### Multi-Tenant Query Patterns

#### Pattern 1: List Tenant's Organizations
```js
async function getTenantOrganizations(tenantId) {
  const maps = await base44.entities.TenantOrganizationMap.filter({
    tenantId,
    status: 'active'
  });
  
  const orgIds = maps.map(m => m.organizationId);
  return await base44.entities.Organization.filter({
    organizationId: { $in: orgIds }
  });
}
```

#### Pattern 2: Verify User Belongs to Tenant
```js
async function checkUserTenantAccess(userId, tenantId) {
  const assignment = await base44.entities.TenantUserAssignment.filter({
    tenantId,
    userId,
    status: { $in: ['active', 'pending_activation'] }
  });
  
  return assignment.length > 0;
}
```

#### Pattern 3: List User's Tenants
```js
async function getUserTenants(userId) {
  const assignments = await base44.entities.TenantUserAssignment.filter({
    userId,
    status: 'active'
  });
  
  return assignments.map(a => a.tenantId);
}
```

#### Pattern 4: Filter Data by User Context
```js
async function getOrganizationsForUser(userId) {
  const tenants = await getUserTenants(userId);
  
  const maps = await base44.entities.TenantOrganizationMap.filter({
    tenantId: { $in: tenants },
    status: 'active'
  });
  
  const orgIds = maps.map(m => m.organizationId);
  return await base44.entities.Organization.filter({
    organizationId: { $in: orgIds }
  });
}
```

---

## Reseller Dashboard Architecture

**Route:** `/reseller/dashboard`

**User Context:** Logged-in reseller user

### Dashboard Sections

#### 1. KPI Cards (Top)
```
- Total Clients: Count of organizations in TenantOrganizationMap
- Active Subscriptions: Count of active DIYSubscription records
- At-Risk Clients: Organizations with churn signals
- Upgrade-Ready: Orgs with high engagement
```

#### 2. Brand Settings Shortcut
```
- Quick link to `/reseller/brand-settings`
- Shows: Logo preview, brand colors, domain status
- Actions: Edit branding, preview white-label
```

#### 3. Client Management Table
```
Columns:
- Client Name (Organization.businessName)
- Industry (Organization.industry)
- Plan (Organization.subscriptionPlan)
- Status (Organization.status)
- Monthly Revenue (Subscription.monthlyRecurringRevenue)
- Health (Calculated from metrics)
- Last Activity (from ActivityEvent)
- Actions: View, Edit, Manage Users, View Analytics

Sorting: Default by Last Activity DESC
Filtering: By Plan, Status, Industry
Search: By client name
```

#### 4. Recent Activity Feed
```
- Last 20 ActivityEvent records filtered to tenant
- Shows: Client name, event type, timestamp
- Types: onboarding_complete, upgrade, campaign_launched, etc.
```

#### 5. At-Risk Clients Panel
```
- Organizations with status = 'at_risk'
- Shows: Risk reason, engagement score, last update
- Actions: Quick email, schedule call, view details
```

#### 6. Upgrade-Ready Clients Panel
```
- High engagement orgs not yet on premium plan
- Shows: Current plan, recommended plan, engagement score
- Actions: Send upgrade offer, view analytics
```

---

## Admin Tenant Governance Page

**Route:** `/admin/tenant-governance`

**User Context:** Master tenant super admin

### Dashboard Sections

#### 1. Tenant Overview Table
```
Columns:
- Tenant Name (Tenant.tenantName)
- Tenant Type (master/reseller/white_label)
- Status (Tenant.status)
- Organization Count (COUNT from TenantOrganizationMap)
- User Count (COUNT from TenantUserAssignment)
- Branding Complete (BrandProfile exists AND required fields filled)
- Revenue (SUM of Subscription.monthlyRecurringRevenue)
- Actions: View, Edit, Suspend, View Organizations

Sorting: Default by Revenue DESC
Filtering: By tenant type, status
Search: By tenant name
```

#### 2. Tenant Warnings Panel
```
High-Priority Alerts:
- Missing brand profile
- No users assigned to tenant
- Zero organizations assigned
- Tenant status = 'suspended'
- Plan catalog not configured
```

#### 3. Plan Catalog Mappings
```
Table:
- Tenant Name
- Base Plan (diy, guided_growth, done_for_you, premium, enterprise)
- Custom Display Name
- Custom Price
- Visible to Clients (Y/N)
- Actions: Edit, Add Plan
```

#### 4. Reseller Performance Metrics
```
For each reseller tenant:
- Client Count (TenantOrganizationMap count)
- Total MRR (ResellerProfile.monthlyRecurringRevenue)
- Tier (ResellerProfile.tier: bronze/silver/gold/platinum)
- At-Risk Count (Orgs with churn signals)
- Upgrade-Ready Count
- Health Score (Calculated from metrics)
```

#### 5. Organization Mappings
```
Show all TenantOrganizationMap records:
- Organization Name
- Tenant Name
- Relationship Type (client/partner/internal)
- Status (active/suspended/archived)
- Assigned Date
- Actions: Edit, Reassign, Suspend
```

#### 6. User Access by Tenant
```
Table:
- User Email
- Tenant Name
- Tenant Role (tenant_admin/tenant_manager/tenant_member/tenant_viewer)
- Status (active/inactive/suspended/invited)
- Assigned Date
- Expires (if applicable)
- Actions: Edit, Remove, Extend
```

---

## Tenant Creation Flow

### Step 1: Create Tenant
```js
const tenant = await base44.entities.Tenant.create({
  tenantId: generateId(),
  tenantType: 'reseller',
  tenantName: 'Reseller Company Name',
  ownerUserId: adminUserId,
  status: 'pending_setup'
});
```

### Step 2: Create Brand Profile
```js
const brand = await base44.entities.BrandProfile.create({
  brandProfileId: generateId(),
  tenantId: tenant.tenantId,
  brandName: 'Reseller Company',
  supportEmail: 'support@reseller.com'
});
```

### Step 3: Create Reseller Profile
```js
const reseller = await base44.entities.ResellerProfile.create({
  resellerProfileId: generateId(),
  tenantId: tenant.tenantId,
  companyName: 'Reseller Company',
  contactEmail: 'contact@reseller.com',
  allowedPlanTypes: ['diy', 'guided_growth', 'done_for_you'],
  revenueShareModel: 'percentage',
  revenueShareValue: 30,
  status: 'onboarding'
});
```

### Step 4: Assign Owner User
```js
const assignment = await base44.entities.TenantUserAssignment.create({
  tenantUserAssignmentId: generateId(),
  tenantId: tenant.tenantId,
  userId: ownerUserId,
  tenantRole: 'tenant_admin'
});
```

### Step 5: Create Plan Catalog
```js
for (const basePlan of ['diy', 'guided_growth', 'done_for_you']) {
  await base44.entities.TenantPlanCatalog.create({
    tenantPlanCatalogId: generateId(),
    tenantId: tenant.tenantId,
    basePlanKey: basePlan,
    displayPlanName: customName,
    displayPrice: customPrice,
    visibleToClients: true,
    upgradeOrder: order++
  });
}
```

### Step 6: Update Status
```js
await base44.entities.Tenant.update(tenant.tenantId, {
  status: 'active'
});
```

---

## Security Best Practices

1. **Always Filter by Tenant**
   - No tenant-agnostic queries
   - Always include `tenantId` in WHERE clause

2. **Verify Tenant Membership**
   - Before showing data, confirm user has `TenantUserAssignment`
   - Check assignment status is 'active'
   - Verify assignment hasn't expired

3. **Prevent Cross-Tenant Access**
   - Never allow user to modify other tenant's data
   - Audit all cross-tenant access attempts
   - Log sensitive actions with tenantId

4. **Branding Isolation**
   - Each page must check user's tenant
   - Use tenant's brand colors/logo
   - Display tenant's support contact info

5. **Plan Enforcement**
   - Check TenantPlanCatalog overrides
   - Enforce reseller's `allowedPlanTypes`
   - Don't allow plans outside reseller's quota

6. **User Lifecycle**
   - Invitation = `status: 'invited'`
   - Acceptance = `status: 'active'`
   - Suspension = `status: 'suspended'`
   - Expiry = Auto-revoke on `expiresAt`

---

## Future Extensions

- **Sub-resellers**: Hierarchy of resellers
- **Revenue Automation**: Auto-calculate reseller commission
- **Usage Metering**: Per-client feature usage tracking
- **SLA Enforcement**: Per-tenant SLA terms
- **Bulk Operations**: Reseller bulk import of clients
- **Custom Domains**: Domain management UI
- **White-Label Domains**: Full DNS setup automation