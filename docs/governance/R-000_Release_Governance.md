# R-000 Release Governance

## NTA Operating System

**Type:** Governance Specification  
**Status:** Active  
**Owner:** CEO  
**Implementation:** Viktor (Lead Systems Builder)  
**QA:** Gemini  
**Effective:** Release 0.4 forward  

---

## Purpose

This document defines the permanent release lifecycle for the NTA Operating System. Every future release — features, fixes, documentation, and architectural decisions — must follow this governance model.

R-000 is not a suggestion. It is the engineering law of the Operating System.

---

## Version Numbering Standard

### Format

```
{major}.{minor}
```

| Component | Meaning | Example |
|-----------|---------|---------|
| Major | Fundamental platform shift | 1.0 |
| Minor | Feature release | 0.5 |

### Rules

- Version numbers are sequential and never reused.
- A release may contain multiple builds (e.g., Release 0.4 contained 6 builds in one commit).
- Patch-level versions (0.4.1) are reserved for hotfixes only.
- Version 1.0 is reserved for the first production-ready deployment of the complete Operating System.

---

## Release Naming Convention

Every release receives a human-readable name that describes its primary capability.

| Version | Name |
|---------|------|
| 0.1 | Sales Engine |
| 0.2 | Knowledge Engine |
| 0.3 | Knowledge Navigator |
| 0.4 | Intelligence Layer |
| 0.5 | Intelligence Automation |

### Rules

- Names must be concise (2–3 words maximum).
- Names describe the release's dominant contribution, not every feature.
- Names are permanent once assigned — they do not change after release.

---

## Branch Strategy

### Branch Naming

```
feature/r{version}-{slug}
```

Examples:
- `feature/r004-intelligence-layer`
- `feature/r005-intelligence-automation`

### Branch Rules

1. Every release gets its own feature branch off `main`.
2. Feature branches may build on top of prior unreleased branches when releases are sequential.
3. `main` is the production branch — only merged, reviewed, approved code lives here.
4. No direct commits to `main` except emergency hotfixes (see Hotfix Policy).
5. Feature branches are deleted after successful merge to `main`.

### Hotfix Branches

```
fix/{description}
```

Example: `fix/honeypot-spam-protection`

Hotfix branches are created from `main`, merged back to `main`, and then merged forward into any active feature branches.

---

## Pull Request Policy

### Requirements

1. Every merge to `main` requires a Pull Request.
2. Every PR must use the standardized PR template (`docs/templates/PULL_REQUEST_TEMPLATE.md`).
3. PRs must include:
   - Release summary
   - Complete file manifest (added, modified, deleted)
   - Database/entity changes
   - Deployment steps
   - Risk assessment
   - Rollback plan
4. Draft PRs are permitted for work-in-progress visibility but must not be merged.

### Consolidated PRs

When multiple releases accumulate on a branch chain (e.g., R0.2 → R0.3 → R0.4), a single consolidated PR may be created that:
- Documents all included releases
- Supersedes earlier open PRs
- Provides a single review point

Earlier PRs must be closed (not merged) after the consolidated PR is reviewed.

---

## Merge Requirements

A PR may be merged to `main` only when ALL of the following are satisfied:

1. **Engineering Complete** — Viktor confirms all builds are committed and verified.
2. **QA Approved** — Gemini has reviewed and approved (or CEO has waived QA for documentation-only releases).
3. **CEO Approved** — Rick has reviewed and explicitly approved the merge.
4. **No Conflicts** — The branch is up-to-date with `main` (merge `main` into feature branch before PR if needed).
5. **Release Verification Checklist** — All items checked (see below).

### Merge Method

- **Merge commit** (not squash, not rebase) — preserves full commit history.
- Merge commit message must reference the release version and name.

---

## Release Verification Checklist

Every release must complete this checklist before merge:

- [ ] Documentation committed to `docs/`
- [ ] Source code committed (entities, functions, pages)
- [ ] GitHub feature branch created and pushed
- [ ] Pull Request created with standardized template
- [ ] All files verified present (artifact audit)
- [ ] Database migrations documented (entity schemas)
- [ ] Base44 deployment steps documented
- [ ] QA review completed (or waived for docs-only releases)
- [ ] CEO review completed
- [ ] Release notes finalized
- [ ] Release Registry updated (R-001)
- [ ] Git tag created after merge
- [ ] Superseded PRs closed

---

## QA Workflow (Gemini)

### Role

Gemini serves as the QA reviewer for the NTA Operating System.

### Responsibilities

1. Review entity schemas for completeness and consistency.
2. Review function logic for correctness and error handling.
3. Review page components for proper entity/function integration.
4. Verify documentation accuracy.
5. Flag potential issues, missing validations, or architectural concerns.

### Process

1. Viktor completes a build and commits to the feature branch.
2. Viktor requests QA review, providing the file list and build context.
3. Gemini reviews and returns findings (approved, approved with notes, or changes requested).
4. Viktor addresses any changes requested.
5. Gemini re-reviews if needed.
6. QA status is recorded in the PR.

### Waiver

Documentation-only releases may proceed without QA review at CEO discretion.

---

## Engineering Workflow (Viktor)

### Role

Viktor serves as the Lead Systems Builder and Director of Operations.

### Responsibilities

1. Receive build specifications from the CEO.
2. Implement all builds (entities, functions, pages, documents).
3. Commit all work to the correct feature branch.
4. Create Pull Requests with full documentation.
5. Conduct artifact verification audits.
6. Coordinate with QA (Gemini).
7. Report build status to CEO.
8. Maintain the Release Registry.
9. Update the Build Protocol skill after every release.

### Engineering Rules

1. Never commit directly to `main`.
2. Never merge without CEO approval.
3. Never begin a new release until the current release governance is satisfied.
4. Every intelligence module must conform to I-000 and consume K-003.
5. Every release must end with the Release Verification Checklist.

---

## CEO Approval Workflow (Rick)

### Role

Rick serves as the CEO and final authority on all releases.

### Approval Scope

1. Feature specifications — what gets built.
2. Architecture decisions — how it gets built.
3. Merge approvals — when it ships.
4. Deployment approvals — when it goes live in Base44.

### Process

1. Viktor presents the PR report (commit SHA, files, risks, review order).
2. Rick reviews the PR on GitHub or via Viktor's summary.
3. Rick explicitly approves or requests changes.
4. Only after explicit CEO approval does Viktor merge.

---

## Base44 Deployment Workflow

### Process

1. Code is merged to `main` on GitHub.
2. Viktor prepares the Base44 deployment manifest:
   - Entities to create (with full schema)
   - Functions to create (with full source)
   - Pages to create (with full source and routes)
   - Navigation updates
3. CEO authorizes Base44 deployment.
4. Viktor deploys in dependency order:
   - Entities first (data layer)
   - Functions second (logic layer)
   - Pages third (presentation layer)
   - Navigation last (routing)
5. Viktor confirms deployment and updates the Release Registry.

### Credits

Base44 operations consume credits. Viktor must confirm credit availability before deployment.

---

## GitHub Tagging Policy

### Format

```
v{version}
```

Examples: `v0.4`, `v0.5`, `v1.0`

### Rules

1. Tags are created on `main` after the merge commit.
2. Tags are annotated (not lightweight) and include the release name and date.
3. Tag message format:

```
Release {version} — {name}

Released: {date}
PR: #{number}
Builds: {count}
```

4. Tags are never moved or deleted.
5. Hotfix releases use patch tags: `v0.4.1`

---

## Rollback Policy

### When to Rollback

- Critical bug discovered after merge that breaks existing functionality.
- Data integrity issue in Base44 after deployment.
- CEO orders rollback.

### Process

1. Revert the merge commit on `main` via a new PR.
2. Deploy the reverted state to Base44 if the release was already deployed.
3. Create a post-mortem document in `docs/post-mortems/`.
4. Record the rollback in the Release Registry.
5. Fix the issue on a new branch and re-release.

### Rules

- Rollbacks do not change version numbers — the original version is marked "Rolled Back" in the registry.
- The fix gets the next available version number.

---

## Hotfix Policy

### Definition

A hotfix is an urgent fix to `main` that cannot wait for the next scheduled release.

### Process

1. Create a `fix/{description}` branch from `main`.
2. Implement the minimal fix — no feature additions.
3. Create a PR with the standard template.
4. Fast-track review: CEO approval required, QA optional for critical fixes.
5. Merge to `main`.
6. Tag with patch version (e.g., `v0.4.1`).
7. Merge `main` into any active feature branches to sync the fix.
8. Update the Release Registry.

### Rules

- Hotfixes must be surgical — fix only the reported issue.
- Hotfixes must not introduce new features or architectural changes.
- Hotfixes still require a PR and CEO approval.

---

## Definition of Done

A release is "Done" when ALL of the following are true:

1. All specified builds are committed to the feature branch.
2. All builds pass the artifact verification audit.
3. QA has reviewed and approved (or waiver granted).
4. CEO has reviewed and approved.
5. PR is merged to `main`.
6. Git tag is created on the merge commit.
7. Release Registry is updated.
8. Superseded PRs are closed.
9. Build Protocol skill is updated with new module entries.
10. Release notes are finalized.

A release is *not* done when code is merely committed. Merge, tag, and registry update are required.

---

## Release Archive Requirements

Every completed release must have the following archived in the repository:

1. **Release Notes** — `docs/releases/RELEASE_NOTES_{version}.md` (using the Release Notes Template)
2. **Registry Entry** — Updated row in `docs/releases/R-001_Release_Registry.md`
3. **Git Tag** — Annotated tag on the merge commit
4. **PR Record** — GitHub PR with full template, review comments, and approval record

### Optional Archives

- Architecture Decision Records — `docs/architecture/ADR-{number}_{title}.md`
- Post-mortems — `docs/post-mortems/PM-{number}_{title}.md`

---

*R-000 is a living document. Changes to this governance model require CEO approval and must be recorded as an Architecture Decision Record.*
