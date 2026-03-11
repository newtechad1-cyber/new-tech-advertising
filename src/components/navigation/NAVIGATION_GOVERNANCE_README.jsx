# NTA Master Navigation + Page Registry Layer

## Overview

A comprehensive governance system for pages, routes, layouts, and navigation families across the platform. Prevents route collisions, layout mismatches, orphan pages, and navigation family cross-linking.

---

## Core Entities (8 Total)

### 1. **MasterPageDefinition**
Canonical page registry.

**Key Fields:**
- `page_key` - Unique identifier (e.g., AdminDashboard)
- `page_name` - Display name
- `route_path` - React Router path
- `route_family` - Enum: public, main_admin, school_admin, client_portal, reseller, governance, agent_ops
- `layout_key` - Required layout
- `nav_family` - Navigation family
- `page_category` - dashboard, explorer, workspace, settings, form, detail, list, command, other
- `owner_team` - Team responsible
- `primary_entity_key` - Primary entity (if any)
- `access_rules_json` - Who can access
- `context_scope_json` - Data isolation scope
- `page_status` - active, deprecated, experimental, archived
- `deprecated` - Boolean flag

### 2. **MasterRouteDefinition**
Route-to-page mappings.

**Key Fields:**
- `route_path` - Route path
- `route_family` - Enum (7 options)
- `page_key` - Maps to page
- `layout_key` - Wrapper layout
- `canonical` - Is this canonical route
- `dynamic_route` - Has dynamic segments
- `guard_rules_json` - Access guards
- `fallback_route` - Fallback if fails
- `redirect_rules_json` - Old routes that redirect here

### 3. **NavigationDefinition**
Navigation family registry.

**Key Fields:**
- `nav_key` - Navigation identifier
- `nav_name` - Display name
- `nav_family` - admin, school_admin, client, reseller, public, governance
- `layout_key` - Parent layout
- `description` - Purpose

### 4. **NavigationItemDefinition**
Individual nav menu items.

**Key Fields:**
- `nav_key` - Parent navigation
- `label` - Display label
- `page_key` - Target page
- `route_path` - Route path
- `display_order` - Sort order
- `visibility_rules_json` - Visibility conditions
- `parent_nav_item` - For hierarchy

### 5. **LayoutDefinition**
Layout governance.

**Key Fields:**
- `layout_key` - Identifier
- `layout_name` - Display name
- `layout_family` - admin, school_admin, client, reseller, public, blank
- `allowed_route_families_json` - Allowed route families
- `allowed_page_categories_json` - Allowed page categories

### 6. **PageDependencyDefinition**
Page dependencies tracking.

**Key Fields:**
- `page_key` - Page with dependency
- `dependency_type` - uses_entity, uses_integration, uses_agent, uses_function, depends_on_page, references_layout, requires_feature_flag
- `dependency_name` - Name of dependency
- `dependency_target` - Specific target

### 7. **PageGovernanceAuditLog**
Audit trail for page/route changes.

**Key Fields:**
- `page_key` - Page that changed
- `route_path` - Route path
- `change_type` - page_created, page_updated, page_deprecated, route_added, route_changed, layout_changed, nav_family_changed, access_rules_updated, page_archived
- `old_value_json` - Previous value
- `new_value_json` - New value
- `changed_by` - Email
- `changed_by_role` - admin, system, audit

### 8. **RouteHealthSnapshot**
Health monitoring for routes.

**Key Fields:**
- `snapshot_time` - Timestamp
- `route_path` - Route path
- `page_key` - Primary page
- `layout_match_status` - match, mismatch, missing
- `nav_match_status` - match, mismatch, missing
- `family_match_status` - match, mismatch
- `access_rule_status` - defined, missing, ambiguous
- `duplicate_risk_status` - none, low, medium, high
- `orphan_risk_status` - none, low, medium, high
- `health_score` - 0-100 overall
- `issues_json` - Array of detected issues

---

## Dashboard Pages

### **AdminNavigation** (`/adminnavigation`)
Master command center for navigation architecture.

**Features:**
- KPI cards: Registered Pages, Routes, Nav Families, Layouts
- Navigation Health Score with breakdown
- Route Conflict Detection (duplicates, orphans, family mismatches)
- Recent Page Governance Changes audit log
- Quick links to sub-explorers

**Components:**
- `NavigationHealthScore` - Health metrics visualization
- `RouteConflictDetection` - Conflict alerting
- `RecentPageGovernanceChanges` - Audit feed

### **AdminNavigationPages** (`/adminnavigation/pages`)
Page Registry Explorer.

**Shows:**
- All registered pages with search
- Route status per page
- Layout, nav family, owner
- Primary entity
- Access scope
- Page status badges
- Description

### **AdminNavigationRoutes** (`/adminnavigation/routes`)
Route Registry Explorer.

**Shows:**
- All routes with search
- Page mappings
- Route family
- Layout wrapper
- Canonical flag
- Dynamic flag
- Guard rules
- Fallback routes

### **AdminNavigationNav** (`/adminnavigation/nav`)
Navigation Families Explorer.

**Shows:**
- All nav families
- Layout assignments
- Navigation items per family
- Deprecated target warnings
- Item count
- Family type badges

### **AdminNavigationLayouts** (`/adminnavigation/layouts`)
Layout Governance View.

**Shows:**
- All layout definitions
- Allowed route families
- Allowed page categories
- Pages using each layout
- Mismatch detection and highlighting

---

## Governance Rules

### Route Family Enforcement
- Pages must declare one route family
- Routes must match page family
- Violations flagged in health checks

### Layout Family Enforcement
- Pages must reference valid layout
- Layout must exist and be active
- Layout must allow page's route family and category
- Mismatches trigger alerts

### Navigation Family Enforcement
- Nav families limited to specific types
- Nav items must reference active pages
- Deprecated page targets highlighted
- Cross-family navigation prevented

### Page Ownership
- Every page has owner_team
- Every page has source_of_truth system
- Primary entity optional but tracked
- Enables impact analysis

### Access Rules
- Pages declare access_rules_json
- Routes have guard_rules_json
- Rules tracked in audit log
- Changes require governance audit

### Duplicate Detection
- Routes with same path flagged
- Pages with same route path detected
- Health score reduced for duplicates
- Critical severity alert

### Orphan Detection
- Pages with no route flagged
- Routes with invalid page_key flagged
- Orphan risk scoring
- High priority alerts

---

## Health Monitoring

**RouteHealthSnapshot** captures:
- Layout matching (route layout = page layout?)
- Nav family matching (consistent nav family?)
- Route family matching (route family = page family?)
- Access rule status (rules defined?)
- Duplicate risks (route path collisions?)
- Orphan risks (page has route?)

**Health Score Calculation:**
- 0-100 aggregate score
- Weighted by issue severity
- Layout mismatches = major issue
- Family mismatches = major issue
- Duplicate risks = critical
- Orphan pages = critical
- Missing access rules = medium

---

## Key Features

### 1. **Conflict Detection**
- Duplicate route detection
- Orphan page detection
- Layout mismatch detection
- Family mismatch detection
- Access rule gap detection

### 2. **Dependency Tracking**
- Page → Entity dependencies
- Page → Integration dependencies
- Page → Agent dependencies
- Page → Function dependencies
- Enables impact analysis

### 3. **Audit Trail**
- All page/route changes logged
- Who changed what and when
- Old/new value comparison
- Change reasons
- Enables governance review

### 4. **Health Scoring**
- Per-route health assessment
- Aggregate platform health
- Trend monitoring
- Issue prioritization
- Visual dashboards

### 5. **Governance Enforcement**
- Canonical page/route per page
- Required layout per page
- Required nav family per page
- Required access rules per page
- Page status lifecycle

---

## Initial Route Families

### 1. **public**
Public marketing/landing pages. No auth required.

### 2. **main_admin**
Core administrative dashboard and operations. Admin role required.

### 3. **school_admin**
School/education system administrative pages. School admin role required.

### 4. **client_portal**
Client-facing dashboard and capabilities. Client role required.

### 5. **reseller**
Reseller management and dashboard. Reseller role required.

### 6. **governance**
Data governance, master data, compliance. Admin role required.

### 7. **agent_ops**
Agent orchestration, task queues, automations. Admin role required.

---

## Priority Pages to Register

### Main Admin
- AdminDashboard
- AdminSales
- AdminVideos
- AdminVideoDetail
- AdminPublishing
- AdminConnections
- AdminReports
- AdminOnboarding
- AdminAgents
- AdminGovernance
- AdminResellers

### School Admin
- AdminSchoolDashboard
- AdminSchoolSubmissions
- AdminSchoolAnalytics

### Client Portal
- ClientDashboard
- ClientApprovals
- ClientCalendar
- ClientReports

### Reseller
- ResellerDashboard
- ResellerClients

---

## Usage

### 1. Register a New Page
```
1. Create MasterPageDefinition record
2. Define MasterRouteDefinition
3. Add NavigationItemDefinition to nav family
4. Assign LayoutDefinition
5. Set access_rules_json
6. Log in PageGovernanceAuditLog
```

### 2. Check Health
```
1. Go to /adminnavigation
2. View NavigationHealthScore
3. Check RouteConflictDetection
4. Review audit log
```

### 3. Update Page
```
1. Update MasterPageDefinition
2. Update MasterRouteDefinition if route changes
3. Update access_rules_json if access changes
4. Log change in audit log
5. Health snapshot auto-updates
```

### 4. Track Dependencies
```
1. Create PageDependencyDefinition for each dependency
2. Specify dependency_type
3. Link to entity/function/agent
4. Enables impact analysis
```

---

## Alerts & Violations

### Critical
- Duplicate routes (same path, different pages)
- Orphan pages (no route registered)
- Layout mismatch (page family ≠ layout allowed families)
- Missing access rules

### High
- Family mismatch (route family ≠ page family)
- Deprecated page targets in nav
- Missing primary entity (when required)

### Medium
- Nav family mismatch
- Ambiguous access rules
- Missing owner assignment

### Low
- Experimental pages active
- Incomplete descriptions

---

## Architecture

```
MasterPageDefinition (Source of Truth)
        ↓
    MasterRouteDefinition
        ↓
    LayoutDefinition (Wrapper)
        ↓
    NavigationDefinition
        ↓
    NavigationItemDefinition (Menu items)

All changes → PageGovernanceAuditLog

Health monitoring → RouteHealthSnapshot

Dependencies → PageDependencyDefinition
```

---

## Design & UX

- Premium NTA admin styling (dark mode, professional)
- Architecture control center feel
- Health badges and status indicators
- Clear family labeling and color coding
- Explorer tables with sorting/filtering
- Route maps and dependency graphs
- Audit visibility with change tracking
- Conflict highlighting and alerting

---

## Files Delivered

**Entities:**
1. MasterPageDefinition.json
2. MasterRouteDefinition.json
3. NavigationDefinition.json
4. NavigationItemDefinition.json
5. LayoutDefinition.json
6. PageDependencyDefinition.json
7. PageGovernanceAuditLog.json
8. RouteHealthSnapshot.json

**Components:**
1. NavigationHealthScore.jsx
2. RouteConflictDetection.jsx
3. RecentPageGovernanceChanges.jsx

**Pages:**
1. AdminNavigation.jsx (Command Center)
2. AdminNavigationPages.jsx (Page Explorer)
3. AdminNavigationRoutes.jsx (Route Explorer)
4. AdminNavigationNav.jsx (Nav Families)
5. AdminNavigationLayouts.jsx (Layout Governance)

---

## Next Steps

1. **Seed Initial Data**: Create MasterPageDefinition/MasterRouteDefinition for priority pages
2. **Enable Health Checks**: Automated RouteHealthSnapshot generation (scheduled function)
3. **Setup Audit Logging**: Automation on page/route create/update to log changes
4. **Dashboard Integration**: Link AdminNav to /adminnavigation
5. **Validation Rules**: Implement governance rule enforcement in backend functions

---

## Future Enhancements

- Page dependency impact analysis (show cascade effects)
- Route migration tools (bulk route updates with audit)
- Layout mismatch auto-fix suggestions
- Nav family conflict resolution wizard
- Real-time health monitoring dashboard
- Governance report generation
- Integration with CI/CD for route validation