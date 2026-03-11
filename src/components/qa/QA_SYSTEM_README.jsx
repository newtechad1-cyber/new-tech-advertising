# NTA Navigation QA System

**Internal Admin Tool** — Development/Testing Only

## Overview

The Navigation QA System is a temporary diagnostic toolset to audit, validate, and stabilize routing across the NTA platform. It tracks route family enforcement, layout boundaries, and navigation collisions.

---

## Quick Start

### Access the QA Dashboard
```
URL: /adminqa/navigation
Admin auth required
Dev-only banner displays at top of all admin layouts
```

### What You Can Do

1. **View all routes** grouped by family
2. **Test routes** — click "Open" to launch in new tab
3. **Mark as pass/fail** — quick action buttons
4. **Search & filter** — by route, status, family
5. **View metrics** — total routes, tested count, pass rate
6. **Add notes** — observations for each test

---

## System Components

### 1. QA Banner (Dev-Only)
**File**: `components/admin/QABannerDev.jsx`

Displays at top of all admin layouts (only in development):
```
🔧 Navigation QA Mode Active    [Launch QA Dashboard →]
```

### 2. Route Family Badges
**Files**: 
- `components/admin/RouteFamilyBadge` (Admin layouts)
- `Layout.js` (Public/Client pages)

Shows current route family in bottom-right corner:
- `main_admin` (red)
- `school_admin` (blue)
- `client_portal` (purple)
- `public` (green)

### 3. QA Dashboard Page
**File**: `pages/AdminNavigationQA.jsx`

Main interface for testing and validation:
- Metrics cards (total, tested, passed, issues)
- Search & filter controls
- Tabbed view by family
- Quick action buttons for each route

### 4. Route QA Detection Utilities
**File**: `components/qa/routeQADetection.js`

Exports:
- `ROUTE_INVENTORY` — all routes with metadata
- `groupRoutesByFamily()` — organize by family
- `calculateQAMetrics()` — stats from QA checks
- `detectRuntimeEnvironment()` — identify current layout/family
- `validatePageRoute()` — validate page against route map
- `detectRoutingCollision()` — find cross-family issues

### 5. Route Table Row Component
**File**: `components/qa/RouteTableRow.jsx`

Renders individual route with status and actions.

### 6. Navigation QA Entity
**File**: `entities/NavigationQACheck.json`

Tracks test results:
```json
{
  "route": "/admindashboard",
  "page_key": "AdminDashboard",
  "page_family": "main_admin",
  "tested": true,
  "status": "pass",
  "nav_source": "MainSidebar",
  "load_time_ms": 1200,
  "collision_detected": false,
  "notes": "Working as expected",
  "tested_by": "admin@example.com",
  "tested_at": "2026-03-11T14:30:00Z"
}
```

### 7. Route Map Integration
**File**: `components/config/routeMap`

Added new QA route:
```
'/adminqa/navigation': { page: 'AdminNavigationQA', family: 'main_admin', ... }
```

### 8. Route Inventory Document
**File**: `components/qa/NAVIGATION_QA_INVENTORY.md`

Authoritative list of all routes grouped by family (38 total):
- 14 Public
- 18 Main Admin
- 7 School Admin
- 4 Client Portal
- 1 Internal (QA)

---

## Validation Rules

### Layout Boundaries
✅ Each page must use its designated layout:
- Main Admin → `AdminNav`
- School Admin → `AdminShell`
- Client Portal → `ClientGuard`
- Public → `PublicLayout`

### Navigation Sources
✅ Nav components must only link to pages in their family:
- `AdminSidebar` → Admin pages only
- `SchoolAdminNav` → School pages only
- `ClientNav` → Client pages only
- `MarketingNav` → Public pages only

### Breadcrumb Trails
✅ Breadcrumbs must stay within family:
- Parent route must be same family as child
- No cross-family breadcrumb chains

### Routing Collisions
❌ Flag if detected:
- Page renders in wrong family
- URL doesn't match expected family
- Layout wrapper mismatch

---

## Test Workflow

### Manual Route Testing
1. Open `/adminqa/navigation`
2. Select a route from the list
3. Click "Open" → page opens in new tab
4. Verify:
   - Page loads (no 404/500)
   - Correct layout renders
   - Correct family badge shows
   - Navigation works
   - Data loads
5. Return to QA dashboard
6. Click "Pass" or "Fail" with any notes

### Batch Testing
- Filter by family
- Sort by status (untested first)
- Work through systematically

### Metrics Tracking
- Coverage % = tested / total
- Pass rate = passed / tested
- Issues = broken + redirect + layout errors

---

## Status Codes

| Status | Meaning | Action |
|--------|---------|--------|
| `untested` | No test yet | Need to run test |
| `pass` | Page works correctly | ✅ No action |
| `broken` | Page 404/500 or unusable | 🔴 Needs fix |
| `redirect_issue` | Unexpected redirect | 🟡 Investigate |
| `wrong_layout` | Layout wrapper mismatch | 🟡 Layout error |
| `wrong_data_context` | Data loading issue | 🟡 Data error |
| `timeout` | Page loads > 5 seconds | 🟡 Performance issue |

---

## Key Metrics

### Current Baseline (2026-03-11)
- **Total Routes**: 38
- **Tested**: 0 (fresh baseline)
- **Passed**: 0
- **Issues**: 0
- **Coverage**: 0%

### Target
- **Coverage**: ≥ 95%
- **Pass Rate**: 100%
- **Issues**: 0

---

## FAQ

### Q: Do non-admin users see the QA banner?
**A**: No. Banner is dev-only (`process.env.NODE_ENV === 'development'`). Not visible in production.

### Q: Can I edit routes from QA page?
**A**: No. QA page is read-only diagnostic. Route changes go in `routeMap` config.

### Q: What happens if a page is in wrong family?
**A**: Route family badge will mismatch. QA will flag `collision_detected = true`.

### Q: How do I test school routes?
**A**: School routes use URL param structure (e.g., `/admin/schools/:slug/dashboard`). QA inventory covers the canonical paths only.

### Q: Can I delete QA checks?
**A**: Yes, via entity editor. Use sparingly — QA history is useful.

---

## Files Reference

| File | Purpose |
|------|---------|
| `entities/NavigationQACheck.json` | QA tracking entity schema |
| `pages/AdminNavigationQA.jsx` | Main QA dashboard |
| `components/admin/QABannerDev.jsx` | Dev-only banner in admin |
| `components/qa/routeQADetection.js` | Validation utilities |
| `components/qa/RouteTableRow.jsx` | Route display component |
| `components/config/routeMap` | Route inventory (updated) |
| `components/qa/NAVIGATION_QA_INVENTORY.md` | Route list document |
| `components/qa/QA_SYSTEM_README.md` | This file |

---

## Roadmap (Future)

- [ ] Automated route loading tests
- [ ] Layout boundary violation alerts
- [ ] Navigation link crawling
- [ ] Breadcrumb validation
- [ ] Performance profiling per route
- [ ] Scheduled QA runs
- [ ] Slack notifications for failures
- [ ] Route analytics (which routes most used)

---

**Created**: 2026-03-11  
**Status**: Internal/Development  
**Owner**: Platform Team  
**Access**: Admins only