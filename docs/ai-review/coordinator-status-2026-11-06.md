# Gemini follow-up — coordinator status, November 6, 2026

**Coordinator record. Read only after delivering an independent first report.** This records verified dispositions; it is not an independent re-review or a clean bill of health.

## Source and release state

- The manually supplied Use.ai report identified itself as **Gemini 4 Argon (Google / Use AI)** and reviewed frozen commit `eff17b32af5369cdf00b7187ace61da30c21c41e`. That is reported provenance, not an independently verified model identity. An earlier UseAI Instant report could not be independently identified as Gemini.
- The nine corrective PRs below are merged. Their combined source is included in released main `48fb433e5e09102b445b6fc860b44b7370b55ce9` (tree `3ed65378c043c5a1b172dd291435a7727452b8b7`).
- Base44 main was synchronized to that source and published November 6 at 19:05:41 UTC. This is separate from the new request-size candidate described below.
- The working-agreement documentation in PR #114 is merged. The November 5 coordinator file remains historical.
- These are manual reviews and scoped fixes. No automated Gemini/Claude reviewer, paid review integration, branch enforcement or recurring review task has been installed.

## Gemini finding dispositions

| Item | Verified disposition | Corrective PR |
| --- | --- | --- |
| F1 — build-day dates | Conditional reproducibility bug: existing dated records stayed stable; a missing Journal/lesson date changed generated search sources with the build day. Generation now requires a valid saved editorial date before rewriting source. | #132 |
| F2 — public app configuration | Public backend/app identity is locked against URL and local-storage overrides while preserving callback/editor handling. | #123 |
| F3 — voice fallback CORS | The specific missing-preflight hypothesis was **not reproduced**. Both the direct Base44 and same-origin function URLs returned OPTIONS 200 for the public origin, allowed POST and the requested content-type/x-app-id headers. Gateway behavior handles this probe despite the handler's POST-only check. No CORS patch was justified by that evidence. | No fix |
| F4 — static call discovery | Audit discovery now covers literal lazy imports, same-file wrapper calls and literal fetch URLs. This is still static analysis, not proof of every dynamic call. | #127 |
| F5 — public Core error exposure | Recruiting and book handlers mask raw upstream error detail, including error payloads returned with HTTP 200. | #124 |
| F6 — canonical/schema ownership | Canonical and structured-data ownership were consolidated while retaining the connected video, lesson and book graphs. | #130 |
| F7 — Guide/newsletter accessibility | Named controls/dialogs, associated labels, keyboard behavior and focus restoration were corrected with targeted runtime tests. | #129 |
| F8 — public proposal exposure | Rick chose to retire a client-specific proposal from the public routes and bundle. Private preservation was handled separately. This record contains no private archive location or commercial details. | #128 |
| F9 — Discovery consent | Summary creation/confirmation now rechecks affirmative, active discovery-processing consent. Retention already required separate save-and-return consent; Journal signup requires its own consent. The request-size residual is covered below. | #125 |
| F10 — visitor logging | Full visitor form/error console logging was removed from Rebuild Intake. The reported missing ListOrderedIcon was not confirmed: its local definition exists. Repository-wide lint/typecheck maintenance remains separate. | #126 |

## New candidate: bound two remaining Discovery request bodies

Both `setDiscoveryRetention` and `subscribeDiscoveryJournal` previously called `req.json()` without bounding the body. This candidate limits each request to **65,536 bytes (64 KiB)**, a generous ceiling for their small session/consent fields.

The handlers reject an oversized declared Content-Length before reading the body. They also count actual streamed bytes, stop and cancel when the ceiling is crossed, and reject with a safe HTTP 413 before parsing or accessing session/subscriber entities. Missing or understated length headers cannot bypass the actual byte ceiling. Valid UTF-8 JSON at the limit is accepted.

Origin, rate, session-key, expiry, consent, save, subscription update and audit behavior remain in place. Malformed/failed small requests retain the existing safe 401 response. The parser follows the existing bounded-stream pattern used by the voice handler. It is kept local to each independently deployed function.

### Validation actually performed

- Before changing the handlers, the targeted file ran 21 tests: **17 passed and four size-limit regressions failed**, covering declared and streamed oversized bodies in both handlers.
- After the fix, `npm run test:discovery` passed **27/27**.
- `npm run check:release` (the offline `check:ci` chain) passed, including strict audit, authorization tests, candidate production build, search/SEO output, content connections and existing visitor-flow checks.
- The new network-free tests execute the actual TypeScript handlers with fake entities and Web API requests/streams. They cover oversized headers, absent/understated headers, cancellation before reading the tail, UTF-8 byte counting, a request exactly at the limit, missing/nonaffirmative consent, invalid/expired/deleted sessions, untrusted origins, malformed/failed streams, and updating an existing subscriber.
- No live retention/signup request, subscriber mutation, paid provider call, production Core diagnostic, function deployment, IndexNow submission or publication was performed for this candidate.
- `npm run lint` and `npm run typecheck` were **not rerun** for this scoped follow-up. Passing release checks does not imply those separate commands pass.

## Remaining verification limits and next step

The preflight probe does not prove actual microphone capture or a forced same-origin-404 fallback. The request-limit checks use an offline VM rather than a deployed Deno invocation. No separate model has re-reviewed this new candidate.

The prior published content was checked in a JavaScript browser; ordinary nonbrowser GETs still served the generic initial HTML for some clean routes. Genuine crawler delivery was not verified. This is a delivery-verification limit, not evidence that these new handler changes affect crawlers.

Next: review this scoped PR, then Rick approves the merge. Verify GitHub/Base44 source synchronization and backend resource deployment separately, checkpoint the synchronized source, and let Rick perform Publish -> Publish App if an app publication is needed. Keep the previous checkpoint available for recovery. Do not run a live subscriber or retention test without an explicitly authorized synthetic test plan.
