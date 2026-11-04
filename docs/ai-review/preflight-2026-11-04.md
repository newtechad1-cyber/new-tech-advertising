# Coordinator preflight - November 4, 2026

Independent reviewers: do not read this file until delivering your own review.

This is a limited setup / release preflight by ChatGPT, not a full code or security audit and not a Claude or Gemini report.

## Verified observations

Repository: `newtechad1-cyber/new-tech-advertising`; visibility reported by GitHub as public. The private Core Hub and client repositories are outside this pilot. Do not add private Brain or client records here.

Baseline `main` commit: `81064ccbf0bca5a4410bc4dcb250462cdbd3f4fe`, authored by `base44-builder[bot]` on November 4, 2026 at 13:28:40 UTC.

GitHub's branch response reported `protected: false`, protection disabled, and no required status-check contexts. This is a configuration gap, not proof of a vulnerability in application code. No protection settings were changed. Source: https://api.github.com/repos/newtechad1-cyber/new-tech-advertising/branches/main (observed November 4; endpoint is mutable).

The existing NTA release-check run for that baseline completed successfully. This was an observed GitHub Actions result, not a new local test run: https://github.com/newtechad1-cyber/new-tech-advertising/actions/runs/41838451853 . Passing this suite is not a comprehensive security or production certification.

Base44's connection status for app `691f41a18de4a7f498c8f884` reported this same repository, `connected: true`, `status: active`, and `webhook_active: true`. The inspected package scripts and workflow files in the Base44 working copy matched the inspected GitHub setup. A full tree comparison and sync round-trip were NOT performed; do not infer that every Base44 file matches.

## Questions worth checking

1. How should main-branch protection be implemented without breaking Base44's current direct-write / sync workflow? A policy document alone is not enforcement. Determine an integration-compatible design before enabling it.
2. At this baseline, `check:release` does not invoke `lint`, `typecheck` or the separately defined `test:podcast`. That is an observable coverage omission, not by itself proof that the omitted checks fail. Evaluate which should become release requirements without weakening the existing suite.
3. `check:release` ends with a live Core connection check. `scripts/check-core-bridge-live.mjs` performs a production POST with fixed connection-check metadata. The script says it creates no leads, audits or emails. The receiver implementation and side-effect guarantee were not independently audited in this preflight. Independent reviewers must not assume the release command is offline or execute live checks under read-only authority.

## Not performed

No Claude or Gemini execution, no full code audit, no secret scan, no new dependency audit, no new local build, no visual / mobile / accessibility inspection, no production form submission, no authorization penetration test, no deployment, no merge, no paid service activation, no branch-protection change and no live website edit.

## Intended handoff

Get Claude's independent report against the fixed pilot source first; verify file access. Reproduce findings before implementation, then make the smallest approved correction through a separate PR and the established Base44 review / Rick Publish workflow. A third provider can follow once the first round-trip is proven.
