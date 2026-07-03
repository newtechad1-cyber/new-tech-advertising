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
| 0.4 | Intelligence Layer | Pending Merge | `feature/r004-intelligence-layer` | PR #7 (consolidated) | — | — | Viktor | K-003 Knowledge Search API, A-006 Knowledge Capture Automation, E-004 Sales Intelligence, Knowledge Dependency Map, Release Notes Template, I-000 Intelligence Framework (architecture spec for R0.5), R-000 Release Governance, R-001 Release Registry |
| 0.5 | Intelligence Automation | Planned | — | — | — | — | Viktor | I-001 through I-006 (planned) — governed by I-000 (delivered in R0.4) |

---

## Release Statistics

| Metric | Value |
|--------|-------|
| Total Releases | 5 |
| Released | 3 |
| Pending Merge | 1 |
| Planned | 1 |
| Total Entities | 15+ |
| Total Functions | 20+ |
| Total Pages | 25+ |
| Total Documents | 6 |

---

## Release Timeline

```
2026-06     R0.1 Sales Engine ...................... Released
2026-07     R0.2 Knowledge Engine .................. Released
2026-07     R0.3 Knowledge Navigator ............... Released
2026-07     R0.4 Intelligence Layer ................ Pending Merge (PR #7)
TBD         R0.5 Intelligence Automation ........... Planned
TBD         R1.0 Production Release ................ Future
```

---

## Hotfix Registry

| Version | Description | Branch | PR | Date | Notes |
|---------|------------|--------|-----|------|-------|
| — | Honeypot spam protection | `fix/honeypot-spam-protection` | Merged direct | 2026-07-03 | Pre-governance hotfix; synced into R0.4 branch |

---

## Superseded PRs

| PR | Original Title | Superseded By | Status |
|----|---------------|--------------|--------|
| #5 | feat: E-003 Discovery Call Workspace + M-001 Executive Dashboard | PR #7 | Open — close after #7 review |
| #6 | feat: Release 0.2 — K-001 Knowledge Engine + Dashboard Updates | PR #7 | Open — close after #7 review |

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| Released | Merged to `main`, tagged, deployed or ready to deploy |
| Pending Merge | Code committed, PR open, awaiting review and CEO approval |
| Planned | Specification exists, engineering not started |
| In Progress | Engineering actively building |
| Rolled Back | Was released but reverted due to issues |

---

## Version Reservation

| Version | Reserved For |
|---------|-------------|
| 0.6 | Community Intelligence (tentative) |
| 0.7 | Client Portal (tentative) |
| 1.0 | Production Release — full Operating System |

*Reservations are tentative and may be reassigned by the CEO.*

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
