# R-001 Release Registry

## NTA Operating System — Master Release Record

**Governed by:** R-000 Release Governance  
**Maintained by:** Viktor (Lead Systems Builder)  
**Authority:** CEO  

---

## Active Releases

| Version | Release Name | Status | Branch | Pull Request | Git Tag | Release Date | Owner | Notes |
|---------|-------------|--------|--------|-------------|---------|-------------|-------|-------|
| 0.1 | Sales Engine | Released | `main` | — | — | 2026-06 | Viktor | Initial platform: Gap Audit, Proposals, CRM, Blog Engine, Learning Center, Video Integration |
| 0.2 | Knowledge Engine | Released | `feature/r002-knowledge-engine` | PR #6 (superseded by #7) | — | 2026-07 | Viktor | K-001 Knowledge Capture, Knowledge Review Queue, Discovery Call Workspace (E-003), Executive Dashboard (M-001) |
| 0.3 | Knowledge Navigator | Released | `feature/r003-knowledge-navigator` | — (included in #7) | — | 2026-07 | Viktor | K-002 Knowledge Navigator, Knowledge Relationships, E-000 Operating System Constitution |
| 0.4 | Intelligence Layer | Released | `feature/r004-intelligence-layer` | PR #7 (merged) | `v0.4.0` | 2026-07-03 | Viktor | K-003 Knowledge Search API, A-006 Knowledge Capture Automation, E-004 Sales Intelligence, Knowledge Dependency Map, Release Notes Template, I-000 Intelligence Framework, R-000 Release Governance, R-001 Release Registry. First governance-validated release. |
| 0.5 | Intelligence Automation | In Progress | — | — | — | — | Viktor | I-001 through I-006 — governed by I-000 (delivered in R0.4) |
| 0.5.1 | Access Governance & SEO Cleanup | Released | `emergency/r0.5.1-access-governance` | PR #10 (merged) | `v0.5.1` | 2026-07-05 | Viktor | Emergency stabilization: Route Governance Registry, auth enforcement, SEO cleanup. R-002 policy. CEO approved. |
| 0.6.0 | Growth Visibility Sprint — Search Foundation | Released | `build/g-002-search-foundation` | PR #11 (merged) | `v0.6.0` | 2026-07-05 | Viktor | G-001 Audit + G-002 Search Foundation. Canonical URLs, homepage consolidation, SEOHead 78/78, Services hub page, sitemap lastmod, deployment checklist. CEO approved — no QA hold (technical SEO, not business logic). |

---

## R0.5 Build Tracker

| Build | Module | Status | PR | Merge Commit | Date | Notes |
|-------|--------|--------|-----|-------------|------|-------|
| Build 1 | I-001 Recommendation Engine v1.0 | Merged | PR #8 | `a1b5adae` | 2026-07-03 | First intelligence module. generateRecommendations function + RecommendationPanel component. 4 workspace integrations. QA passed (3 fixes applied). CEO approved. |
| Build 2 | I-002 Business Pattern Recognition v1.0 | Merged | PR #9 | `039c2103` | 2026-07-03 | BusinessPatternPanel + GapAudit filter fix. QA passed. CEO approved. |
| Build 3 | I-003 Executive Daily Briefing | Planned | — | — | — | — |
| Build 4 | I-004 Client Intelligence Timeline | Planned | — | — | — | — |
| Build 5 | I-005 AI Mentor | Planned | — | — | — | — |
| Build 6 | I-006 Knowledge Health Score | Planned | — | — | — | — |

---

## Release Statistics

| Metric | Value |
|--------|-------|
| Total Releases | 7 |
| Released | 6 |
| In Progress | 1 |
| Planned | 0 |
| Total Entities | 15+ |
| Total Functions | 21+ |
| Total Pages | 25+ |
| Total Documents | 8 |

---

## Release Timeline

```
2026-06     R0.1 Sales Engine ...................... Released
2026-07     R0.2 Knowledge Engine .................. Released
2026-07     R0.3 Knowledge Navigator ............... Released
2026-07-03  R0.4 Intelligence Layer ................ Released (v0.4.0)
2026-07-03  R0.5 Build 1 — I-001 Recommendation ... Merged (in progress)
2026-07-05  R0.5.1 Access Governance & SEO ......... Released (v0.5.1)
2026-07-05  R0.6.0 Search Foundation ............... Released (v0.6.0)
TBD         R0.5 Intelligence Automation ........... In Progress
TBD         R1.0 Production Release ................ Future
```

---

## Hotfix Registry

| Version | Description | Branch | PR | Date | Notes |
|---------|------------|--------|-----|------|-------|
| — | Honeypot spam protection | `fix/honeypot-spam-protection` | Merged direct | 2026-07-03 | Pre-governance hotfix; synced into R0.4 branch |
| 0.5.1 | Access Governance & SEO Cleanup | `emergency/r0.5.1-access-governance` | PR #10 (merged) | 2026-07-05 | Emergency: 508 PascalCase pages.config routes bypassing auth; SEO pollution from internal routes. Merged, tagged `v0.5.1`. |

---

## Superseded PRs

| PR | Original Title | Superseded By | Status |
|----|---------------|--------------|--------|
| #5 | feat: E-003 Discovery Call Workspace + M-001 Executive Dashboard | PR #7 | Closed |
| #6 | feat: Release 0.2 — K-001 Knowledge Engine + Dashboard Updates | PR #7 | Closed |

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| Released | Merged to `main`, tagged, deployed or ready to deploy |
| In Progress | Engineering actively building |
| Pending Merge | Code committed, PR open, awaiting review and CEO approval |
| Planned | Specification exists, engineering not started |
| Rolled Back | Was released but reverted due to issues |

---

## Version Reservation

| Version | Reserved For |
|---------|-------------|
| 0.6 | Growth Visibility Sprint (Released) |
| 0.7 | Client Portal (tentative) |
| 1.0 | Production Release — full Operating System |

*Reservations are tentative and may be reassigned by the CEO.*

---

## Future Hardening Backlog

| # | Item | Priority | Origin | Notes |
|---|------|----------|--------|-------|
| 1 | Consolidate duplicate AdminGuard implementations | Low | R0.5.1 QA | Two files export `AdminGuard`: standalone `AdminGuard.jsx` (rich UI) and `RoleGuard.jsx` (named export, simple redirect). Both inject `NoIndexMeta`. Merge into single canonical implementation. |
| 2 | Add default auth-required fallback for unknown page keys | Medium | R0.5.1 QA | `classifyPageKey()` defaults to `public` for unrecognized prefixes. Change to `auth_required` so new pages are locked by default and must be explicitly whitelisted. |

---

## Pre-Governance Note

Releases 0.1, 0.2, and 0.3 predate R-000 Release Governance (effective R0.4 forward). These releases are grandfathered and exempt from Git tag, PR template, and release notes requirements established by R-000. Git tags may be backfilled retroactively at the CEO's discretion.

---

## Governance

- This registry is updated by Viktor after every release milestone (commit, merge, tag, deploy).
- Only the CEO may approve new version assignments.
- Historical entries are never deleted — rolled-back releases are marked accordingly.
- This document is governed by R-000 Release Governance.

---

*R-001 is the single source of truth for NTA Operating System release history.*
