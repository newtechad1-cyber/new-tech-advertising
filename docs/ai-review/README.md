# New Tech Advertising — independent AI code-review working agreement

**Status as of November 6, 2026:** the manual Claude round and Gemini follow-up have produced verified, merged and published corrections. PR #134's two request-size guards are published and their oversized-body rejection was verified live. The supplied [Gemini follow-up report](reports/gemini-follow-up-2026-11-06.md) and [coordinator closeout](coordinator-status-2026-11-06.md) record the source, evidence, minor notes and remaining verification limits. Read coordinator conclusions **only after** delivering an independent first report. This remains a manual process, **not an active bot, GitHub enforcement rule or automatic Claude/Gemini integration**.

## Why we do this
NTA is a Digital Growth Office and AI education platform. The goal is to catch consequential website, data and release problems early without replacing approved wording, damaging visitor journeys or multiplying AI subscriptions and noise.

## Operating process
1. **Owner and source.** Rick approves the business intent. The coordinator writes a neutral, limited review brief from `docs/ai-review/assignment-template.md`, with the exact GitHub repository and frozen commit SHA, affected journeys and boundaries.
2. **Independent review.** Claude or another separately available reviewer reads the source and reports what it actually inspected. Keep the other model's findings and all `coordinator-status-*.md` records out of the first report. Reviewers use `docs/ai-review/review-template.md`. Do not invent tests or source access.
3. **Evidence and triage.** The coordinator verifies the reviewer's evidence. Record each item as confirmed bug, plausible risk, unverified concern or preference. High-impact claims require file/line, reproduction or a regression test, affected user process and smallest practical correction. AI agreement alone is not proof.
4. **One writer.** A single implementer prepares an approved, narrow branch/PR with suitable tests. Review changes against the actual current `main`; don't build blindly on a stale feature branch.
5. **Checks and independent re-review.** Inspect `package.json`, run applicable offline checks, and document unperformed checks as NOT RUN. If the fix changes behavior/security, examine the final diff, verify with Base44 preview/test data when practical and ask a reviewer to revisit changed lines.
6. **Human-controlled release.** Rick separately approves merges and uses Base44 **Publish -> Publish App** when there is an app change. Verify GitHub head, Base44 working-copy SHA, checkpoint, preview and live result as different milestones. A merge is not a publication; synchronizing a Base44 schema may affect public API permissions before the Publish step. Confirm the actual behavior.
7. **After publication.** Check the changed public path, access boundaries, user journey and recovery option. The current `Notify IndexNow` GitHub workflow is **manual only**, to be run after a relevant published change has been verified, not on each merge.
8. **Preserve the handoff.** GitHub stores code, PR comments and versioned review artifacts. Rick Hesse Working Brain in Google Drive stores the human-readable decision, next actions and authoritative pointers. Never copy private Brain contents, customer credentials or sensitive client records into this public repository.

## Current technical guardrails
- Public NTA repo: `newtechad1-cyber/new-tech-advertising`; public Base44 app: `691f41a18de4a7f498c8f884`.
- Published application source at this closeout: `4defd67942f072522154a2dec01f507e663b8549`. The original Gemini report reviewed `eff17b32af5369cdf00b7187ace61da30c21c41e`; the request-size fix started from prior published source `48fb433e5e09102b445b6fc860b44b7370b55ce9`. **Freeze a fresh commit for each future assignment; do not assume this stays current.**
- `npm run check:ci` is the CI/offline candidate chain. `npm run check:release` aliases it. `npm run check:release-live` calls the production Core check and is **not suitable for read-only review**.
- `npm run lint` and `npm run typecheck` are separate commands, not automatic proof from CI. Run/report them only with an appropriate approved scope.
- `.github/workflows/release-checks.yml` runs candidate-only checks. `.github/workflows/indexnow.yml` runs on manual `workflow_dispatch`, and its `--submit` step is a live search-engine notification.
- The presence of `AGENTS.md`, `CLAUDE.md` or `GEMINI.md` is **guidance only**. It does not connect an AI reviewer, enforce branch protection or schedule a scan. Do not enable GitHub enforcement without verifying compatibility with Base44 and getting Rick's separate approval.

## Actual first round trip (historical)
- Read-only pilot source: `f0943734a2f7b4acf97909b2dbda74f162f26e86`. The neutral assignment is archived in `docs/ai-review/pilot-2026-11-05.md`. An independent Claude report surfaced nine findings; the full review was brought into the working conversation rather than automatically posted to GitHub.
- `#115`: public-read permissions and internal-field exposure — merged, synchronized to Base44, independently checked with synthetic data and then verified through anonymous live API requests.
- `#116`: public Channel Help Center no longer reads connection credentials — merged, synchronized and published.
- `#117`: IndexNow changed to deliberate post-publication notification — merged, synchronized and published. GitHub run `42062592742` completed successfully and reported 236 URLs accepted, HTTP 200.
- `#104` is an earlier documentation-only draft and should not be merged blindly. The refreshed working agreement in `#114` is merged.
- The [November 5 status](coordinator-status-2026-11-05.md) preserves that round's history. The [November 6 status](coordinator-status-2026-11-06.md) records the Gemini dispositions and current remaining limits. Read coordinator status **only after** completing an independent report; reported concerns are not automatically proven defects.

## Cost and completion
Prefer two perspectives and one accountable implementer over multiple paid models. Document paid tools and actual spend when known. A complete review has a fixed source, independent evidence, verified disposition, necessary regression and a human-approved release path. A new model, an automated bot or a GitHub green check is not the goal.
