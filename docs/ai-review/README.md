# NTA multi-AI code review

Status: pilot prepared; provider connections, independent reviews and enforced GitHub protection are separate work items. No autonomous or paid review service is activated by this documentation.

## Why this exists

Use independent AI reviews to improve existing work, not to replace NTA's approved intent or create competing rewrites. ChatGPT can coordinate the context and implementation; Claude and another model can provide fresh reviews. These are assigned responsibilities, not a claim that one model is inherently better at a specialty. Rick retains consequential decisions and publishing authority.

## One work item, one source, one writer

1. Record the business goal, repository, exact source commit, scope and approval boundary. Read existing decisions before proposing a new structure.
2. Take a stable review snapshot on a separate branch. Each reviewer receives the same neutral brief and source files. A provider that cannot read commit metadata must say so; the coordinator records the verified source version.
3. Collect independent read-only reports before sharing any other review. Use `review-template.md`; do not force reviewers to invent a fixed number of findings.
4. Reproduce and triage findings. Accept, reject, defer or request evidence with reasons. Evidence and business risk decide; model agreement does not. A single confirmed authorization flaw matters more than several favorable opinions.
5. Assign one implementation owner. Put one bounded, approved fix in its own branch / pull request with a regression test when practical. Another AI may later implement a different approved task, but not concurrently in the same working copy.
6. Run applicable existing checks, inspect the changed behavior, and re-review the final diff. A new code commit invalidates an earlier review for affected files; record the version actually rechecked.
7. Obtain Rick's approval before merge or consequential changes. Verify Base44 synchronization and preview. Rick publishes the app, then verify the affected live journey. Distinguish prepared, reviewed, approved, merged, published and verified-live.
8. Retain the technical evidence in GitHub and a concise decision / next-action pointer in Rick Hesse Working Brain in Google Drive. Do not put the private Brain or client data into this public repository.

## Review lanes

Start with one bounded lane rather than claiming an entire large repository is audited:

- Release safety: CI, test coverage, dependency handling, authorization and public/private boundaries.
- Customer experience: forms, navigation, mobile and accessibility, media destinations and downstream handoffs.
- Discoverability and measurement: routing, titles, canonical URLs, schema, sitemap, tracking and truthful reporting.

A source-code review cannot by itself confirm live indexing, mailbox receipt, customer response, conversions or revenue. Track those separately when relevant. For client work, record work status, approvals, tested connections, observed response, direct costs and actual business outcomes without conflating them.

## Existing checks and execution boundary

At the initial baseline, `package.json` defines `audit:security`, `test:backend-auth`, `test:growth-guide`, `test:route-governance`, `test:public-seo`, `test:tracking`, `test:analytics-reporting`, `test:core-bridge`, `check:core-bridge`, `check:core-bridge-live`, `test:podcast`, `lint`, `typecheck`, `build` and `check:release`.

Read the current scripts before execution. `check:release` chains several checks and ends with `check:core-bridge-live`, which makes a production connection-check request. It is NOT a purely offline test suite. Do not execute production checks under an independent read-only review assignment. Existing GitHub CI already invokes the release command on pushes and pull requests; this pilot does not add a workflow or change its triggers. Record CI results as observed, not as tests personally run.

Run tests only in an approved isolated environment with no production credentials, after inspecting what they do. Do not run `lint:fix`, dependency upgrades or live submissions during the initial review.

## GitHub / Base44 safeguards

Use separate branches now. Do not claim main is technically protected until GitHub settings have been inspected and enforced. Branch protection must be designed and tested around Base44's existing integration rather than switched on blindly. Check whether the app can work through review branches, which actors need narrowly scoped access, and whether any bypass would undermine the intended gate. Do not require approvals that no eligible human can provide, or required checks that never run. No account settings or bypass permissions are changed by this pilot.

## Provider handoff

Start with Claude's repository-file integration for a read-only review; use the exact brief in `pilot-2026-11-04.md`. Authorize only this pilot repository when the provider allows repository selection. Claude's standard repository-file integration is distinct from a coding agent that can write branches and run commands; confirm the actual capability rather than assuming write access.

Add a third reviewer after this first handoff is proven useful. Google's Code Assist products have changed: the consumer GitHub reviewer shut down July 17, 2026, and new Standard / Enterprise subscriptions stopped October 9, 2026. Do not purchase or install an obsolete setup from an older instruction. Confirm the currently available Gemini / Google tool or use another supported reviewer. No provider subscription, API key, app installation or paid run is authorized by this document.

Official setup references checked November 4, 2026:
- https://support.claude.com/en/articles/10167454-use-the-github-integration
- https://developers.google.com/gemini-code-assist/docs/deprecations/consumer-code-review
- https://developers.google.com/gemini-code-assist/docs/deprecations

## Success measure for the pilot

A useful result is a verifiable issue or improvement, a clear decision, and a small tested correction that does not damage the existing workflow. Record review time / actual cost if available; unknown cost stays unknown. Do not equate the number of suggestions with value.
