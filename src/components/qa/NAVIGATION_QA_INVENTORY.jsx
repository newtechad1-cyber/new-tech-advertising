# NTA Navigation QA — Complete Route Inventory

**Generated: 2026-03-11**

## Overview

This document provides the authoritative inventory of all routes across the NTA platform, grouped by family. Use this as your QA baseline for navigation and routing validation.

---

## PUBLIC FAMILY
Public-facing pages (no auth required)

| Route | Page Key | Layout | Nav Source | Status |
|-------|----------|--------|-----------|--------|
| / | Home | PublicLayout | MarketingNav | live |
| /pricing | Pricing | PublicLayout | MarketingNav | live |
| /about | About | PublicLayout | MarketingNav | live |
| /contact | Contact | PublicLayout | MarketingNav | live |
| /blog | Blog | PublicLayout | MarketingNav | live |
| /case-studies | CaseStudies | PublicLayout | MarketingNav | live |
| /demo | Demo | PublicLayout | MarketingNav | live |
| /get-started | Get-Started | PublicLayout | MarketingNav | live |
| /hvac-industry | HvacIndustry | PublicLayout | MarketingNav | live |
| /industries | IndustriesHub | PublicLayout | MarketingNav | live |
| /plumbing-marketing | PlumbingMarketing | PublicLayout | MarketingNav | live |
| /roofing-marketing | RoofingMarketing | PublicLayout | MarketingNav | live |
| /ada-compliance | Ada-Compliance | PublicLayout | MarketingNav | live |
| /streaming-tv | Streaming-TV | PublicLayout | MarketingNav | live |

---

## MAIN ADMIN FAMILY
Internal NTA admin dashboard and management tools

| Route | Page Key | Layout | Nav Source | Status |
|-------|----------|--------|-----------|--------|
| /admindashboard | AdminDashboard | AdminNav | AdminNav | live |
| /adminclients | AdminClients | AdminNav | AdminNav | live |
| /adminsales | AdminSalesDashboard | AdminNav | AdminNav | live |
| /adminvideos | AdminVideoQueue | AdminNav | AdminNav | live |
| /adminvideodetail | AdminVideoDetail | AdminNav | AdminNav | live |
| /adminpublishing | AdminVideoPublishing | AdminNav | AdminNav | live |
| /adminconnections | AdminConnections | AdminNav | AdminNav | live |
| /adminconnections/meta | AdminMetaSetup | AdminNav | AdminNav | live |
| /adminconnections/youtube | AdminYouTubeSetup | AdminNav | AdminNav | live |
| /admincontent | AdminContentEngine | AdminNav | AdminNav | live |
| /admincontentmultiplier | AdminContentMultiplier | AdminNav | AdminNav | live |
| /adminautomation | AdminPlatform | AdminNav | AdminNav | live |
| /adminagents | AgentArchitecture | AdminNav | AdminNav | live |
| /adminsettings | AdminSettings | AdminNav | AdminNav | live |
| /adminbilling | AdminBilling | AdminNav | AdminNav | live |
| /adminreports | AdminAnalytics | AdminNav | AdminNav | live |
| /adminsupport | AdminHelp | AdminNav | AdminNav | live |
| /adminqa/navigation | AdminNavigationQA | AdminNav | AdminNav | internal |

---

## SCHOOL ADMIN FAMILY
School TV administrative dashboard (multi-school SaaS)

| Route | Page Key | Layout | Nav Source | Status |
|-------|----------|--------|-----------|--------|
| /adminschooldashboard | AdminSchoolDashboard | AdminShell | SchoolAdminNav | live |
| /adminschoolsubmissions | AdminSchoolSubmissions | AdminShell | SchoolAdminNav | live |
| /adminschoolanalytics | AdminSchoolAnalytics | AdminShell | SchoolAdminNav | live |
| /adminschoolailab | AdminSchoolAILab | AdminShell | SchoolAdminNav | live |
| /adminschoolvideolibrary | AdminSchoolVideoLibrary | AdminShell | SchoolAdminNav | live |
| /adminschoolrenderqueue | AdminSchoolRenderQueue | AdminShell | SchoolAdminNav | live |
| /adminschoolsettings | AdminSchoolSettings | AdminShell | SchoolAdminNav | live |

---

## CLIENT PORTAL FAMILY
Client-facing dashboard and content management

| Route | Page Key | Layout | Nav Source | Status |
|-------|----------|--------|-----------|--------|
| /clientdashboard | ClientDashboard | ClientGuard | ClientNav | live |
| /clientcommerce | ClientCommerce | ClientGuard | ClientNav | live |
| /clientcontentproduction | ClientContentProduction | ClientGuard | ClientNav | live |
| /clientsettings | ClientSettings | ClientGuard | ClientNav | live |

---

## QA TRACKING FIELDS

Each route should be tested and recorded in the `NavigationQACheck` entity with:

- **route**: Full path (e.g., `/admindashboard`)
- **page_key**: Component key (e.g., `AdminDashboard`)
- **page_family**: One of: `public`, `main_admin`, `school_admin`, `client_portal`
- **layout_expected**: Expected wrapper (e.g., `AdminNav`, `ClientGuard`)
- **tested**: Boolean — has this route been tested?
- **status**: One of: `untested`, `pass`, `broken`, `redirect_issue`, `wrong_layout`, `wrong_data_context`, `timeout`
- **nav_source**: Which component launched it: `MainSidebar`, `SchoolSidebar`, `ClientNav`, `CTAButton`, `TableRowLink`, `DirectURL`, `Unknown`
- **load_time_ms**: Performance metric
- **layout_detected**: Actual layout at runtime
- **actual_family_detected**: Route family detected (may differ from expected)
- **breadcrumb_parent**: Parent in breadcrumb trail
- **collision_detected**: Boolean — potential routing collision?
- **notes**: Observations
- **tested_by**: QA tester email
- **tested_at**: Timestamp

---

## VALIDATION CHECKLIST

### Layout Validation
- [ ] Admin pages use `AdminNav` layout
- [ ] School Admin pages use `AdminShell` layout
- [ ] Client pages use `ClientGuard` layout
- [ ] Public pages use `PublicLayout`

### Navigation Source Validation
- [ ] All Admin nav links come from `AdminSidebar`
- [ ] School nav links come from `SchoolAdminNav`
- [ ] Client nav links come from `ClientNav`
- [ ] No cross-family nav sources

### Breadcrumb Validation
- [ ] Breadcrumb parents match route family
- [ ] No cross-family breadcrumb trails
- [ ] All breadcrumbs resolve correctly

### Routing Collision Detection
- [ ] No page renders in wrong family
- [ ] No cross-family redirects
- [ ] URL params are family-scoped (e.g., `school_slug` in school routes)

### Performance Baselines
- [ ] Public pages load < 2s
- [ ] Admin pages load < 3s
- [ ] Client pages load < 3s
- [ ] No console errors or warnings

---

## How to Use the QA Dashboard

1. **Navigate to**: `/adminqa/navigation`
2. **View metrics**: Total routes, tested count, pass/fail rates
3. **Quick actions**:
   - Click **Open** to launch page in new tab
   - Click **Pass** to mark route as passing QA
   - Click **Broken** to flag issues
4. **Search & filter**: Use search box or status dropdown
5. **Track notes**: Add observations for each test

---

## Summary Statistics

- **Total Routes**: 38
- **Public**: 14
- **Main Admin**: 18
- **School Admin**: 7
- **Client Portal**: 4 (+ 1 deprecated)
- **Internal (QA)**: 1

---

## Deprecated Routes

⚠️ Do NOT link to these:

| Old Key | Replacement | Reason |
|---------|------------|--------|
| `Dashboard` | `ClientDashboard` | Ambiguous — use explicit page key |
| `Settings` | Page-specific (e.g., `AdminSettings`) | Ambiguous |
| `Videos` | `AdminVideoQueue` | Ambiguous |
| `Analytics` | Page-specific (e.g., `AdminAnalytics`) | Ambiguous |

---

**Last Updated**: 2026-03-11  
**Next Review**: After new page additions or routing changes  
**QA Owner**: Platform Team