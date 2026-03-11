# Visual Reference Guide - Architecture Control Center

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ Navigation & Page Registry                                 │
│  Master control center for routes, pages, navigation families   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│ 📊 Pages         │ 🛣️ Routes        │ 🧭 Nav Families  │ 🎨 Layouts      │
│ 24               │ 24               │ 7                │ 8                │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘

TABS:
┌──────────┬──────────┬───────────┬────────────┬───────┬────────┬────────┬────────┐
│Overview  │Health&   │Conflicts  │Categories │Pages  │Routes  │Nav     │Layouts │
│          │Risk      │           │           │       │        │        │        │
└──────────┴──────────┴───────────┴────────────┴───────┴────────┴────────┴────────┘
```

---

## Overview Tab

```
┌─ ORIGINAL COMPONENTS ─────────────────────────────────────────┐
│                                                               │
│ ┌─ Navigation Health Score ────────────────────────────────┐ │
│ │ • Overall health metrics                               │ │
│ │ • Route family breakdown                               │ │
│ │ • Recent issues                                        │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                               │
│ ┌─ Route Conflict Detection ───────────────────────────────┐ │
│ │ • Duplicates: 0                                        │ │
│ │ • Orphans: 2                                           │ │
│ │ • Mismatches: 1                                        │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                               │
│ ┌─ Recent Governance Changes ──────────────────────────────┐ │
│ │ • Page updated at 10:30 AM                             │ │
│ │ • Route added at 9:15 AM                               │ │
│ │ • Layout changed at 8:45 AM                            │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Health & Risk Tab

```
┌─ ARCHITECTURE HEALTH SCORING ─────────────────────────────────┐
│                                                               │
│ ┌─ OVERALL HEALTH ──────────────────────────────────────────┐ │
│ │ ┌─ Overall  ┐ ┌─ Healthy  ┐ ┌─ At Risk  ┐ ┌─ Critical┐ │ │
│ │ │   82%     │ │    18     │ │     4     │ │    2    │ │ │
│ │ │ ✓ Good   │ │ ✓ Pages   │ │ ⚠ Pages   │ │ ✗ Pages │ │ │
│ │ └──────────┘ └───────────┘ └───────────┘ └─────────┘ │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                               │
│ ┌─ HEALTH BY ROUTE FAMILY ──────────────────────────────────┐ │
│ │ ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐       │ │
│ │ │ public  │ │main_    │ │client_   │ │reseller  │       │ │
│ │ │   92%   │ │admin    │ │portal    │ │   76%    │       │ │
│ │ │ ✓ 5/5   │ │ ⚠ 85%  │ │ ✓ 89%    │ │ ⚠ 4/6    │       │ │
│ │ └─────────┘ └─────────┘ └──────────┘ └──────────┘       │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                               │
│ ┌─ TOP ISSUES ──────────────────────────────────────────────┐ │
│ │                                                            │ │
│ │ ⚠️ AdminPublishing                            72% Risk    │ │
│ │    • No active route                                     │ │
│ │    • Layout family mismatch                              │ │
│ │                                                            │ │
│ │ ⚠️ ClientDashboard                            65% Risk    │ │
│ │    • Missing access rules                                │ │
│ │                                                            │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘

┌─ HIGH-RISK PAGES (CORE ROUTES) ───────────────────────────────┐
│                                                               │
│ ┌─ AdminDashboard /admin/dashboard         45% Risk ✓SAFE───┐ │
│ │ Route: ✓ /admin/dashboard                                 │ │
│ │ Layout: ✓ AdminLayout                                     │ │
│ │ Access: ✓ {"role": "admin"}                               │ │
│ │ Owner: ✓ Platform                                         │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                               │
│ ┌─ AdminPublishing /admin/publishing    78% Risk ⚠HIGH──────┐ │
│ │ Route: ✗ No route registered       [CRITICAL]             │ │
│ │ Layout: ✓ PublishingLayout                                │ │
│ │ Access: ✗ Missing rules            [HIGH]                 │ │
│ │ Owner: ✓ Publishing Team                                  │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                               │
│ ┌─ ClientDashboard /client/dashboard     52% Risk ⚠HIGH──────┐ │
│ │ Route: ✓ /client/dashboard                                │ │
│ │ Layout: ⚠ ClientLayout (family mismatch) [CRITICAL]       │ │
│ │ Access: ✗ Missing rules            [HIGH]                 │ │
│ │ Owner: ✓ Client Services                                  │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘

┌─ NEXT BEST ARCHITECTURE ACTIONS ──────────────────────────────┐
│                                                               │
│ 💡 FIX LAYOUT MISMATCH: ClientDashboard                      │
│    ClientDashboard uses ClientLayout but family client_     │
│    portal is not allowed.                                    │
│    → Update ClientLayout to allow 'client_portal'            │
│                                                               │
│ 💡 REGISTER ORPHAN PAGE: AdminPublishing                     │
│    Page has no active route. It's unreachable.               │
│    → Create MasterRouteDefinition entry                      │
│                                                               │
│ 💡 TIGHTEN ACCESS RULES: AdminPublishing                     │
│    No access rules defined for main_admin family.            │
│    → Define access_rules_json with role requirements         │
│                                                               │
│ 💡 TIGHTEN ACCESS RULES: ClientDashboard                     │
│    No access rules defined for client_portal family.         │
│    → Define access_rules_json with client authorization      │
│                                                               │
│ 💡 CLARIFY PAGE OWNERSHIP                                    │
│    Multiple pages share same owner in same family.           │
│    → Review and redistribute ownership assignments           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Conflicts Tab

```
┌─ ARCHITECTURE CONFLICTS ───────────────────────────────────────┐
│                                                               │
│ [6 issues]  [3 Critical]  [2 High]  [1 Medium]               │
│                                                               │
│ ─── WRONG-FAMILY LINKS ───────────────────────────────────────│
│ 🔗 Wrong-Family Navigation Link              [HIGH]           │
│    Nav item "Publishing" links to AdminPublishing but route   │
│    family mismatch (main_admin ≠ publishing)                  │
│    → Publishing                                               │
│                                                               │
│ ─── LAYOUT-FAMILY CONFLICTS ───────────────────────────────────│
│ ⚡ Layout-Family Conflict                    [CRITICAL]       │
│    Page ClientDashboard uses layout ClientLayout but          │
│    client_portal is not allowed.                              │
│    → ClientDashboard → ClientLayout                           │
│                                                               │
│ ─── MISSING ACCESS RULES ─────────────────────────────────────│
│ 🔒 Missing Access Rules                     [HIGH]            │
│    Page AdminPublishing (main_admin) has no access control    │
│    defined.                                                    │
│    → AdminPublishing                                          │
│                                                               │
│ ─── DEPRECATED PAGES IN NAVIGATION ────────────────────────────│
│ ⚠️ Deprecated Page in Navigation             [HIGH]           │
│    Nav item "Legacy Publishing" links to deprecated page      │
│    AdminVideoPublishingV1.                                    │
│    → Legacy Publishing → AdminVideoPublishingV1               │
│                                                               │
│ ─── DUPLICATE PAGE OWNERSHIP ──────────────────────────────────│
│ 👥 Duplicate Page Ownership                 [MEDIUM]          │
│    Team "Publishing" owns 3 pages in main_admin family. May   │
│    dilute accountability.                                      │
│    → Publishing: AdminPublishing, AdminVideoPublishing...     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Categories Tab

```
┌─ PAGE CATEGORIES ──────────────────────────────────────────────┐
│                                                               │
│ ▶ Executive Dashboards                          [5]           │
│   ▼ EXPANDED:                                                  │
│   • AdminDashboard (AdminDashboard)                           │
│     main_admin | 👤 Platform                                  │
│   • ResellerDashboard (ResellerDashboard)                     │
│     reseller | 👤 Reseller Ops                                │
│   • AdminOperations (AdminOperations)                         │
│     governance | 👤 Operations                                │
│                                                               │
│ ▶ Publishing                                    [4]           │
│   • AdminPublishing (AdminPublishing)                         │
│     main_admin | 👤 Publishing Team                           │
│   • AdminVideos (AdminVideos)                                 │
│     main_admin | 👤 Media Ops                                 │
│   • AdminVideoLibrary (AdminVideoLibrary)                     │
│     main_admin | 👤 Media Ops                                 │
│                                                               │
│ ▶ Sales                                         [3]           │
│   • AdminSales (AdminSales)                                   │
│     main_admin | 👤 Sales Ops                                 │
│   • SalesRoom (SalesRoom)                                     │
│     main_admin | 👤 Sales Ops                                 │
│                                                               │
│ ▶ Client Experience                             [5]           │
│   • ClientDashboard (ClientDashboard)                         │
│     client_portal | 👤 Client Services                        │
│   • ClientApprovals (ClientApprovals)                         │
│     client_portal | 👤 Client Services                        │
│   • ClientReports (ClientReports)                             │
│     client_portal | 👤 Client Services                        │
│                                                               │
│ ▶ Reseller                                      [2]           │
│ ▶ Governance                                    [4]           │
│ ▶ AI Operations                                 [3]           │
│ ▶ School Media                                  [4]           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Color Palette

### Health Scores
```
┌─────────────────────────────────────────┐
│ 🟢 90-100: Healthy (Emerald)            │
│   ✓ All checks passed, no issues        │
├─────────────────────────────────────────┤
│ 🟡 75-89: At Risk (Amber)               │
│   ⚠ Some issues detected, monitor       │
├─────────────────────────────────────────┤
│ 🟠 50-74: High Risk (Orange)            │
│   ⚠ Significant issues, plan fix        │
├─────────────────────────────────────────┤
│ 🔴 0-49: Critical (Red)                 │
│   ✗ Critical issues, immediate action   │
└─────────────────────────────────────────┘
```

### Severity Levels
```
┌──────────────────────────────────────────┐
│ 🔴 CRITICAL: Will break production       │
│    e.g., Layout mismatch, no route       │
├──────────────────────────────────────────┤
│ 🟠 HIGH: Security/functionality risk     │
│    e.g., Missing access rules, deprecated│
├──────────────────────────────────────────┤
│ 🟡 MEDIUM: Accountability risk           │
│    e.g., Duplicate ownership             │
├──────────────────────────────────────────┤
│ ⚪ LOW: Minor documentation issues       │
│    e.g., Missing description             │
└──────────────────────────────────────────┘
```

---

## Component Hierarchy

```
AdminNavigation Dashboard
│
├─ Overview Tab
│  ├─ NavigationHealthScore (original)
│  ├─ RouteConflictDetection (original)
│  └─ RecentPageGovernanceChanges (original)
│
├─ Health & Risk Tab
│  ├─ ArchitectureHealthScoring
│  │  ├─ Overall Health Card (4 metrics)
│  │  ├─ Family Health Grid (7 families)
│  │  └─ Top Issues List (6 items)
│  ├─ HighRiskPagesPanel
│  │  └─ 5 Core Routes (detailed checks)
│  └─ NextBestArchitectureAction
│     └─ 5 Actions (prioritized)
│
├─ Conflicts Tab
│  └─ ArchitectureConflictAlerts
│     ├─ Wrong-Family Links
│     ├─ Duplicate Ownership
│     ├─ Layout-Family Conflicts
│     ├─ Missing Access Rules
│     └─ Deprecated in Navigation
│
├─ Categories Tab
│  └─ PageCategoryBrowser
│     ├─ Executive Dashboards [5]
│     ├─ Publishing [4]
│     ├─ Sales [3]
│     ├─ Client Experience [5]
│     ├─ Reseller [2]
│     ├─ Governance [4]
│     ├─ AI Operations [3]
│     └─ School Media [4]
│
└─ Explorer Tabs (Pages/Routes/Nav/Layouts)
   └─ Links to detailed explorers
```

---

**Visual Reference Generated:** March 11, 2026  
**Status:** Complete