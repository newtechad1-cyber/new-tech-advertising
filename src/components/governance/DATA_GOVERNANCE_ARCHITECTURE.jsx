# NTA Master Data + Entity Governance Layer

## Overview
A clean, scalable core data architecture with strong entity relationships, source-of-truth rules, lifecycle statuses, and admin governance visibility.

---

## Core Entities

### 1. Organization
**Source of Truth**: Primary entity for all data
- organizationId: Unique identifier
- businessName: Official company name
- industry: Classification (hvac, plumbing, dental, etc.)
- subscriptionPlan: Current plan tier (diy, guided_growth, done_for_you, premium, enterprise)
- lifecycleStage: prospect → trial → onboarding → active → at_risk → churned
- ownerUserId: Primary admin/owner
- status: active, inactive, suspended, cancelled, archived

**Key Rules**:
- Every other entity must have valid organizationId reference
- Cannot delete org with active subscriptions (move to archived)
- status changes trigger automation cascades

### 2. DataGovernanceUser (extends base44 User)
**Source of Truth**: User access and permissions within organization
- userId: Maps to base44 User
- organizationId: Foreign key to Organization
- role: owner, admin, manager, contributor, viewer
- accessLevel: full_access, team_access, limited_access, readonly
- status: active, inactive, invited, suspended

**Key Rules**:
- Must have valid organizationId
- role determines what entities user can create/modify
- Only owners can invite other owners
- Cannot delete last owner (must reassign first)

### 3. Subscription
**Source of Truth**: Billing and plan entitlements
- subscriptionId: Unique identifier
- organizationId: Foreign key
- stripeCustomerId/stripeSubscriptionId: Billing system sync
- currentPlan: Subscription tier
- billingStatus: active, trialing, past_due, cancelled, incomplete, paused
- renewalDate: Next billing date
- onboardingStatus: not_started → in_progress → completed

**Key Rules**:
- 1:1 relationship with Organization
- Cannot have multiple active subscriptions per org
- billingStatus past_due triggers warning cascade
- onboardingStatus=completed triggers job queue setup

### 4. OnboardingProfile
**Source of Truth**: Customer profiling and readiness scoring
- onboardingProfileId: Unique identifier
- organizationId: Foreign key
- primaryGrowthGoal: Selected objective
- revenueGrowthTarget: 5k, 10k, 25k, 50k, 100k+
- timeCommitmentLevel: minimal to 20+ hours/week
- upgradeReadinessScore: 0-100 (calculated)

**Key Rules**:
- Created when subscription moves to onboarding
- completedAt timestamp triggers automation pipeline
- upgradeReadinessScore updates trigger marketing campaigns

### 5. Campaign
**Source of Truth**: Marketing initiatives and orchestration
- campaignId: Unique identifier
- organizationId: Foreign key
- campaignType: onboarding, weekly_content, seasonal, promotion, retention, upgrade, custom
- status: draft → scheduled → active → paused → completed → archived
- assignedAgentFlow: AI agent or workflow ID
- priority: low, medium, high, critical

**Key Rules**:
- Cannot schedule campaign without active Subscription
- status=active triggers assigned AI agent
- endDate in past auto-archives
- Can only have 1 active onboarding campaign per org

### 6. ContentAsset
**Source of Truth**: All generated content and publishing
- contentAssetId: Unique identifier
- organizationId: Foreign key
- campaignId: Optional parent campaign
- assetType: blog_post, video_script, social_post, email, landing_page, etc.
- status: draft → pending_review → approved → scheduled → published
- sourceAgent: Which AI agent created this
- publishDestination: website, blog, social_media, email, all, none
- publishStatus: not_published, scheduled, published, failed

**Key Rules**:
- Cannot publish without approval
- publishedAt timestamp is immutable once set
- qualityScore (0-100) must be > 60 to publish
- Tracks full publish history (source → destination)

### 7. DataGovernanceLead
**Source of Truth**: Sales pipeline and attribution
- leadId: Unique identifier
- organizationId: Foreign key
- email: Contact email (unique within org)
- source: organic_search, paid_ad, social_media, referral, direct, etc.
- status: new → contacted → qualified → proposal_sent → negotiating → won/lost
- estimatedValue: Deal value in cents
- revenueAttributed: Actual revenue when won

**Key Rules**:
- Cannot have duplicate emails within same org
- status=won creates revenue attribution
- Cannot delete won leads (archive instead)

### 8. ActivityEvent
**Source of Truth**: Immutable audit log of all changes
- activityEventId: Unique identifier
- organizationId: Foreign key
- userId: Who triggered (optional for system events)
- eventType: entity_created, entity_updated, entity_deleted, user_action, etc.
- eventSource: user_interface, automation, api, webhook, system, ai_agent
- relatedEntityType/relatedEntityId: What changed
- timestamp: ISO datetime (IMMUTABLE)
- changes: JSON diff of what changed

**Key Rules**:
- APPEND-ONLY (never delete or modify)
- Tracks every create/update/delete
- Required for compliance and audit trails
- Used for rollback and forensics

---

## Governance Entities

### 9. DataGovernanceRule
**Enforces data quality standards**
- ruleId: Unique identifier
- entityType: Which entity this rule applies to
- ruleType: required_field, relationship_constraint, status_transition, permission_rule, lifecycle_rule, data_quality
- condition: Rule logic (JSON)
- isActive: Whether enforced
- severity: warning, error, critical
- violationCount: Tracked automatically

**Built-in Rules**:
- Organization: businessName is required, ownerUserId must exist
- DataGovernanceUser: organizationId must exist, role must be valid
- Subscription: organizationId must exist, cannot have duplicates
- Campaign: organizationId must exist, cannot overlap onboarding campaigns
- ContentAsset: organizationId must exist, quality_score must be > 60 to publish
- Lead: organizationId must exist, no duplicate emails per org

### 10. DataGovernanceSnapshot
**Periodic health analysis results**
- snapshotDate: When analysis ran
- entityCounts: Count of each entity type
- healthScore: 0-100 (100 = perfect)
- orphanRecords: Records with missing parent entities
- duplicates: Potential duplicate records found
- violations: Count of rule violations
- statusDistribution: JSON breakdown of statuses per entity
- relationshipHealth: Percentage health of each relationship
- issues: Array of detected problems

---

## Relationship Integrity Map

```
Organization (1)
  ├── (1:N) DataGovernanceUser
  ├── (1:1) Subscription
  ├── (1:1) OnboardingProfile
  ├── (1:N) Campaign
  ├── (1:N) ContentAsset
  ├── (1:N) DataGovernanceLead
  └── (1:N) ActivityEvent

Campaign (1)
  └── (1:N) ContentAsset (optional)

Subscription (1)
  └── (triggers) Campaign (onboarding_campaign auto-created)
```

---

## Status Lifecycle Flows

### Organization
```
prospect → trial → onboarding → active → at_risk → churned
                   └─ suspended ─┘
```

### Subscription
```
trialing → active ← paused
  │           ↓
  └─ incomplete → past_due → cancelled
```

### Campaign
```
draft → scheduled → active → paused → completed → archived
           ↑                   ↑
           └──────────────────┘
```

### ContentAsset
```
draft → pending_review → approved → scheduled → published
  ↓                                                    ↑
  └─────────────────── rejected ─────────────────────┘
```

### DataGovernanceLead
```
new → contacted → qualified → proposal_sent → negotiating → won
                                                              ↑
                                                         archived
                                                              ↑
                                                            lost
```

---

## Permission Model

### Role-Based Access

**Owner**
- Full access to all entities
- Can manage users (invite/remove)
- Can change subscription plan
- Can view all activity
- Can archive organization

**Admin**
- All owner permissions except subscription/billing
- Can manage users
- Can view all entities
- Can export/analyze data

**Manager**
- Can view and create campaigns
- Can manage content assets
- Can view team activity
- Cannot manage users

**Contributor**
- Can create and edit content assets
- Can view campaigns they're assigned to
- Cannot delete
- Limited visibility to org data

**Viewer**
- Read-only access
- Can view published content
- Cannot create or modify

### Subscription-Based Entitlements

**Free Trial**
- Up to 1 user
- Limited to 1 campaign
- No integrations

**DIY**
- Up to 3 users
- Unlimited campaigns
- Basic integrations

**Guided Growth**
- Up to 10 users
- Unlimited campaigns
- Advanced integrations
- Dedicated support

**Done For You**
- Unlimited users
- Unlimited campaigns
- All integrations
- White-label

**Premium**
- Everything in Done For You
- API access
- Custom integrations
- Dedicated account manager

---

## Governance Dashboard (`/admin/data-governance`)

### Metrics Displayed
- **Health Score**: 0-100, deductions for orphans (-5), duplicates (-3), violations (-2)
- **Entity Counts**: Total records per entity type
- **Orphan Records**: Records with missing parent entities
- **Duplicates**: Potential duplicate records
- **Rule Violations**: Count of rule breaches
- **Relationship Health**: % integrity per relationship
- **Status Distribution**: Breakdown of statuses per entity
- **Active Rules**: Count of enforced governance rules

### Automatic Analysis
- Runs daily via scheduled automation
- Admin can trigger manual refresh
- Identifies:
  - Missing required fields
  - Broken foreign keys
  - Duplicate email addresses
  - Invalid status transitions
  - Permission mismatches
  - Subscription/entitlement misalignment

### Issue Types
- **orphaned_records**: Entity with missing parent
- **duplicate_records**: Multiple records with same unique value
- **rule_violation**: Governance rule breach
- **permission_mismatch**: User role doesn't match access level
- **status_anomaly**: Invalid status transition detected
- **relationship_broken**: Foreign key reference invalid

---

## Data Quality Standards

### Required Fields by Entity
- **Organization**: businessName, industry, ownerUserId
- **DataGovernanceUser**: userId, organizationId, email, role
- **Subscription**: subscriptionId, organizationId, stripeCustomerId, stripeSubscriptionId
- **Campaign**: campaignId, organizationId, campaignName, campaignType
- **ContentAsset**: contentAssetId, organizationId, assetType, title
- **DataGovernanceLead**: leadId, organizationId, email, source

### Immutable Fields
- ActivityEvent.activityEventId
- ActivityEvent.timestamp
- ContentAsset.publishedAt (once set)
- DataGovernanceLead.createdDate

### Uniqueness Constraints
- Organization.organizationId (global)
- DataGovernanceUser.userId (global)
- DataGovernanceUser.email (per organization)
- Subscription.organizationId (1:1 per org)
- Subscription.stripeCustomerId (global)
- Campaign.campaignId (global)
- ContentAsset.contentAssetId (global)
- DataGovernanceLead.leadId (global)

---

## Integration Points

### On Subscription Create
1. Create Subscription record
2. Create OnboardingProfile record
3. Create onboarding Campaign
4. Create first ActivityEvent
5. Trigger automation job queue

### On Onboarding Complete
1. Update OnboardingProfile.completedAt
2. Update Subscription.onboardingStatus
3. Update Organization.lifecycleStage → active
4. Trigger weekly content automation
5. Log ActivityEvent

### On Status Change
1. Validate status transition
2. Update entity status
3. Create ActivityEvent with old→new states
4. Trigger associated automations
5. Update governance rules

### On Content Publish
1. Validate quality score > 60
2. Update ContentAsset.publishStatus
3. Update ContentAsset.publishedAt (immutable)
4. Create ActivityEvent
5. Trigger distribution workflows

---

## Admin Workflows

### Fix Orphaned Records
1. Dashboard shows orphaned records
2. Admin can:
   - Delete orphaned record
   - Reassign to valid parent
   - Archive record
3. ActivityEvent logged for audit

### Resolve Duplicates
1. Dashboard flags duplicates
2. Admin can:
   - Merge records (keep primary, archive secondary)
   - Delete duplicate
   - Update one to remove duplication
3. ActivityEvent logged for all changes

### Permission Mismatch
1. Dashboard detects user access level doesn't match role
2. Admin corrects role or access level
3. ActivityEvent logged
4. User session invalidated to apply new permissions

### Subscription Expiration
1. Automation detects renewalDate passed
2. Creates warning ActivityEvent
3. Dashboard shows in at_risk state
4. Triggers retention campaign

---

## Compliance & Audit Trail

- **Full History**: ActivityEvent logs every change
- **Immutable Log**: Cannot delete or modify audit events
- **Timestamp Proof**: All events timestamped
- **User Attribution**: Tracks who made each change
- **Source Tracking**: Tracks UI vs API vs automation changes
- **Rollback Ready**: Can reconstruct state at any point in time

---

## Performance Optimization

- Index on all foreign keys (organizationId, etc.)
- Index on timestamps for range queries
- Index on status for filtering
- Governance snapshots cached daily
- Orphan detection runs on scheduled job
- Duplicate detection only on specified fields

---

## Future Extensions

- Audit log export (CSV/JSON)
- Data lineage visualization
- Governance rule templates
- Automated remediation scripts
- Data anonymization tools
- GDPR compliance toolkit