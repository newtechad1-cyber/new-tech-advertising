# NTA multi-AI code review — working agreement

Status: documentation-only installation candidate prepared November 5, 2026. This branch does not install a bot, connect a provider, execute an independent review, turn on branch protection or change production.

## Purpose
Use two independent perspectives to inspect NTA code before approved changes go live. ChatGPT coordinates implementation and verification; Claude can review independently. Gemini or another provider is optional after the first complete round trip. Neither model agreement nor a passing test replaces evidence and Rick's approval.

## One source, separate reviewers, one writer
1. Record the request, approved intent, repository, exact commit SHA, and what must not change. Preserve NTA's education-first positioning and approved wording.
2. Assign the same neutral, bounded brief and fixed source to reviewers. Reviewers must report which version and files they could actually access.
3. Keep each report private from the other reviewer until both are complete; do not seed one AI with the other's conclusions.
4. Label each finding confirmed bug, plausible risk, unverified concern or preference. Require file/line evidence, reproduction or a test proposal, and business impact. Verify important findings rather than counting votes.
5. Assign one writer to make an approved, bounded correction on a new branch/PR. No concurrent edits to the same working copy and no direct write to main.
6. Run the applicable current checks, review the final changed commit and affected behavior; re-review changed lines after a correction. Record omitted checks as NOT RUN.
7. Rick approves merge and performs the Base44 Publish action. Confirm GitHub/Base44 reconciliation and browser/mobile behavior before the publishing handoff. Verify the live result after publication.
8. Keep technical detail and decisions in GitHub and a concise handoff in Rick Hesse Working Brain in Google Drive. Do not copy private Brain data or client records into this public repository.

## Current first assignment
Read `docs/ai-review/pilot-2026-11-05.md` and `docs/ai-review/review-template.md`.
- Public website repo: `newtechad1-cyber/new-tech-advertising`
- Frozen application-code baseline: `f0943734a2f7b4acf97909b2dbda74f162f26e86` (main after merged PR #113).
- Review only. Do not edit code, submit forms, request production actions, change settings, upgrade packages or start a paid service.
- The original November 4 pilot remains in draft PR #104 as history; do not confuse its earlier baseline with this current assignment.

## Review lanes
Start with **release safety**: CI, auth/public-private boundaries, release commands, tests and risks. Next look at customer experience (forms, Guide, mobile, media, accessibility), then discoverability and measurement (routing, canonical, schema, crawlability, analytics). A source review cannot prove actual mail delivery, search indexing, conversion results, or published mobile behavior.

## Commands and safe execution
Read `package.json` and any script targets before running commands. As of the frozen baseline:
- `check:ci` runs the CI/test/build chain.
- `check:release` aliases `check:ci` and no longer calls the live Core check.
- `check:release-live` runs `check:core-bridge-live`, which contacts a production Core endpoint. **Never run this in a read-only independent review.**
- `lint` and `typecheck` are separate scripts and are not automatically part of `check:ci`. They may reveal additional problems, but report anything not executed as NOT RUN.
- Inspect installation/build scripts, use isolated/no-credential execution, and avoid network or production writes. A passed GitHub run is evidence for its exact commit, not for every later commit.

## Enforced gates versus written instructions
Main-branch protection was not enabled in the pilot. These documents are guidance, not enforcement. GitHub rulesets and required checks must be investigated against Base44's current integration before enabling them. Do not block the existing sync path without a verified plan and Rick's separate approval.

## Evidence, ownership and cost
Record reviewed source SHA, tested SHA, files inspected, findings, decision, cost if known, merge approval, Base44 checkpoint, visual verification and actual live proof. Unknown cost and unperformed checks remain unknown. A useful pilot produces an actionable finding or credible clean review and a tested, safe decision — not the largest number of AI suggestions.
