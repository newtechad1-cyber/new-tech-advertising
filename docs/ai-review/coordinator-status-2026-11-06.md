# Gemini follow-up — coordinator status, November 6, 2026

**Coordinator record. Read only after delivering an independent first report.** This records verified dispositions and remaining limits; it is not a new independent review or a clean bill of health.

## Source and release state

- The manually supplied original Use.ai report identified its model as **Gemini 4 Argon (Google / Use AI)** and reviewed frozen commit `eff17b32af5369cdf00b7187ace61da30c21c41e`. That is reported provenance, not independently verified model identity. An earlier UseAI Instant report could not be independently identified as Gemini.
- The nine main corrective PRs below were included in earlier published source `48fb433e5e09102b445b6fc860b44b7370b55ce9`.
- The additional two-handler request-limit fix in **PR #134 is merged, synchronized and published**, not awaiting another release. Published application source is `4defd67942f072522154a2dec01f507e663b8549`, tree `be940e2e982460db2665c4bff46c377f4e20b600`. The merge had no source-file differences from tested head `0b613890d293eb696ca62f3e021d9528b7b2108c`.
- Verified published Base44 main checkpoint: `6aee4c13ee09b5a799a1ba13`, **PR134 merged and synced - source checks passed**, published November 6 at **22:25:20.901 UTC**. Source synchronization, checkpoint, publication and live backend behavior were verified as distinct milestones.
- The working agreement in PR #114 is merged. The November 5 coordinator file remains historical.
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
| F9 — Discovery consent | Summary creation/confirmation now rechecks affirmative, active discovery-processing consent. Retention already required separate save-and-return consent; Journal signup requires its own consent. The request-size residual is released in #134, described below. | #125, #134 |
| F10 — visitor logging | Full visitor form/error console logging was removed from Rebuild Intake. The reported missing ListOrderedIcon was not confirmed: its local definition exists. Repository-wide lint/typecheck maintenance remains separate. | #126 |

## Released follow-up: bound two remaining Discovery request bodies

Both `setDiscoveryRetention` and `subscribeDiscoveryJournal` previously called `req.json()` without bounding the body. PR #134 limits each request to **65,536 bytes (64 KiB)**, a generous ceiling for their small session/consent fields.

The handlers reject an oversized declared Content-Length before reading the body. They also count actual streamed bytes, stop and cancel when the ceiling is crossed, and reject with a safe HTTP 413 before parsing or accessing session/subscriber entities. Missing or understated length headers cannot bypass the actual byte ceiling. Valid UTF-8 JSON at the limit is accepted.

Origin, rate, session-key, expiry, consent, save, subscription update and audit behavior remain in place. Malformed/failed small requests retain the existing safe 401 response. The parser follows the existing bounded-stream pattern used by the voice handler. It is kept local to each independently deployed function.

### Validation actually performed

- Before changing the handlers, the targeted file ran 21 tests: **17 passed and four size-limit regressions failed**, covering declared and streamed oversized bodies in both handlers.
- After the fix, `npm run test:discovery` passed **27/27**.
- `npm run check:release` (the offline `check:ci` chain) passed, including strict audit, authorization tests, candidate production build, search/SEO output, content connections and existing visitor-flow checks.
- The new network-free tests execute the actual TypeScript handlers with fake entities and Web API requests/streams. They cover oversized headers, absent/understated headers, cancellation before reading the tail, UTF-8 byte counting, a request exactly at the limit, missing/nonaffirmative consent, invalid/expired/deleted sessions, untrusted origins, malformed/failed streams, and updating an existing subscriber.
- During candidate preparation, no live retention/signup request, subscriber mutation, paid provider call, production Core diagnostic, function deployment, IndexNow submission or publication was performed. The subsequent approved release and dummy-request checks are recorded below.
- `npm run lint` and `npm run typecheck` were **not rerun** for this scoped follow-up. Passing release checks does not imply those separate commands pass.

### Subsequent release verification

- The supported GitHub pull applied all five files to Base44 main without conflicts or content omissions. Both handler blob hashes and the clean tree matched the tested source.
- On synchronized main, `npm run test:discovery` passed **27/27**, `npm run build:ci` and `git diff --check` passed, and tracked source remained clean.
- The candidate offline release chain passed **480 tests**. GitHub NTA release checks [run 42292726575](https://github.com/newtechad1-cyber/new-tech-advertising/actions/runs/42292726575) succeeded. The full chain was not redundantly rerun after publication.
- Rick explicitly approved two oversized dummy-request checks. Before the new checkpoint was published, both returned HTTP 401; those were recorded as **inconclusive**, not passed.
- After Rick published the verified checkpoint, one further agreed request per handler returned **HTTP 413 / Request body too large** at **22:26:50.906 UTC** and **22:26:51.670 UTC**, respectively.
- Each dummy JSON body was exactly **65,537 bytes**, containing only a probe marker and padding. Requests used the normal public origin and public app ID, with no session ID/key, email, retention action, token or cookie. No valid retention/signup flow, subscriber mutation or paid provider call was attempted.
- A read-only public homepage GET returned HTTP 200. This is not rendered browser regression coverage or genuine crawler-delivery verification.
- No separate manual function redeploy was executed. Rick's publication and the subsequent live responses established the runtime milestone.

## Supplied Gemini re-review and coordinator disposition

Rick supplied a [follow-up report](reports/gemini-follow-up-2026-11-06.md), archived as received. It identifies its model as Gemini 4 Argon and says its attachment was not mounted, so it read GitHub source at `4defd67942f072522154a2dec01f507e663b8549`. These are reported model/access details, not independently verified access logs.

The reviewer reports no substantive residual defects in the original ten items and no defect in PR #134. It marks its build/tests **NOT RUN**. It read coordinator conclusions before its follow-up; treat it as a source-based follow-up to its existing report, not a fresh blinded first review. Keep the earlier evidence boundaries rather than adopting every heading or inference.

| Re-review note | Coordinator disposition |
| --- | --- |
| F1 date-rollover wording | Retain the original conditional finding: missing editorial dates caused build-day dependence. The evidence did not establish that every existing build failed at every UTC rollover. The saved-date correction remains released. |
| F2 heading includes `access_token` | Backend/app identity overrides are blocked. Legitimate Base44 `access_token` callback handling was intentionally preserved; this is not a claim that all session/token concerns are solved. |
| F3 CORS and possible single-use-token retry | The preflight hypothesis remains **not reproduced**. No new microphone, transcription or forced-fallback test was run. The conditional token-consumption comment supplies no reproduction and is not a confirmed defect. |
| F6 Guide links normalize to `www` | Confirmed consistency preference: `YourDigitalGrowthGuide.jsx` and `growthGuideChat` use the same `https://www.newtechadvertising.com` link origin. No failed destination or canonical/schema defect was demonstrated by this note. Defer optional normalization. |
| F7 static honeypot IDs on separate forms | `NewsletterPopup` uses unique `useId()` IDs. Reusing `company_url` on separate form pages does not itself demonstrate duplicate IDs in one rendered document. No reproduced collision or new accessibility defect was supplied. |
| Rate-limit map housekeeping | Source inspection of the three cited Discovery handlers confirms no explicit entry-count cap or expired-key cleanup. Isolate lifetime is **not** proof of a bounded entry count. Retain as a plausible operational maintenance concern; no resource-exhaustion incident or measured release-blocking impact was reproduced. This is separate from F7 accessibility. |
| Report's final instruction to sync/deploy PR #134 | **Stale.** Source synchronization, Rick's publication and both live size-limit rejections were already verified. Do not repeat the release solely because the supplied report says to deploy. |

## Remaining limits and closure

The original substantive findings have verified corrective dispositions. No additional code change is justified solely by this follow-up report. Optional consistency/housekeeping notes remain separate from confirmed defects and are not silently activated as projects.

Full microphone capture, actual voice transcription and forced same-origin-404 fallback remain unverified in this round. Valid live retention/signup mutations were not exercised. Genuine crawler delivery remains unverified; ordinary nonbrowser GETs previously returned generic initial HTML for some clean routes. These are verification limits, not evidence of a new request-handler defect.

The previous published checkpoint `6aee23be3384ac2a989aa462` / source `48fb433e5e09102b445b6fc860b44b7370b55ce9` remains recovery information. No new merge or app Publish is needed for the already released application fix. This documentation closeout changes no application code and does not activate a reviewer.
