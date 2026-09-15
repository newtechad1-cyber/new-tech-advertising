# Seven backend authentication findings — 2026-09-15

Target: New Tech Advertising, public Base44 app `691f41a18de4a7f498c8f884`.
Production site: https://newtechadvertising.com

## Current status

Five authentication fixes are saved in the active app source. The two public handlers now include read-only Turnstile configuration responses, and the browser helper plus four caller updates are saved and ready to publish. The enforcing backend replacements remain staged and **are not active**. Rick confirmed that both Turnstile keys were saved in Base44 Secrets. Narrow live configuration checks still returned the previously published validation errors, so hosted configuration and real visitor verification remain unconfirmed. See `rollout-state.json` for current hashes and the next release steps.

| Function | Saved change / remaining action |
| --- | --- |
| adaIntake | Require verified Base44 administrator or service identity before privileged work. |
| auditWebsiteAccessibility | Same authentication gate; preserve URL/DNS/redirect safeguards in its own entry point. |
| chatbotChat | Same authentication gate before reading chat configuration or constructing the AI client. |
| chatbotLeadCapture | Same authentication gate; preserve verified workflow/service calls. |
| demoAiChat | Same authentication gate before any AI work. |
| growthGuideChat | Configuration response and browser integration saved; server-side verification remains staged until the browser release is verified. |
| publicationSignup | Configuration response, browser integration and consent payload saved; server verification and consent enforcement remain staged. |

Only growthGuideChat and publicationSignup have callers in the current public import graph. The five restricted functions belong to older UI components or internal workflows. The legacy lead-capture agent/workflow still needs a live authenticated service invocation checked after release. No emails, real signups, or paid AI calls were sent during this work.

## Verified

- 66 isolated behavioral tests pass: anonymous/invalid/member rejection, administrator/service admission, forged header/body claims, private URL/redirect rejection, scan form-label handling, provider rejection/outage/missing configuration, wrong action/hostname, expiry, replay, consent, cancellation, and fresh browser tokens.
- `npm run build` passes and produces SEO HTML for 167 public URLs plus 963 legacy cleanup/alias URLs.
- The staged browser changes also pass an isolated Vite production build.
- `git diff --check` passes.
- The active browser helper and four updated public callers pass the production build; the six client behavior tests now execute the active helper.
- Ten additional isolated checks of the active metadata handlers passed: configured response shape/no secret disclosure, missing settings, public test keys, untrusted origins, and extra-field rejection; all produced zero provider, entity, AI or downstream calls.

The provider and Base44 identity/data operations are mocked in the behavioral tests. Real Turnstile, live administrator/service calls, live visitor submissions, and the hosted Base44 Security Scan are not yet verified.

Base44 initially reported a failed accessibility-function revision with no build detail. The independently deployed entry point now contains its URL safeguards directly instead of importing another function directory, and a pre-existing form-label variable-scope error was repaired. The updated source passes local checks; the hosted revision still needs release verification.

## Finish the two public functions

Create a real **Managed** Cloudflare Turnstile widget for the NTA hostnames:
`newtechadvertising.com`, `www.newtechadvertising.com`, `app.newtechadvertising.com`, and `new-tech-advertising.base44.app`.

Save these values directly in this Base44 app's Secrets settings:

- `NTA_TURNSTILE_SITE_KEY` — the public widget site key.
- `NTA_TURNSTILE_SECRET_KEY` — the server-only verification secret.

Rick confirmed both keys are saved in this app’s Secrets settings. Hosted secret storage is not exposed through the connected tools, and the sandbox shell does not inherit those settings. The live configuration requests still return the earlier published handlers’ 400 validation errors, so neither saved-key availability nor provider validity has been verified yet. Do not request or copy the private key into source, logs or chat.

The staged implementation checks the provider's success result, hostname, action and issue time. It rejects missing configuration, known public test keys, invalid/expired/replayed proof and provider failures. The browser receives only the public site key and uses a fresh single-use token per request. It does not store tokens or retry mutations automatically.

Coordinate rollout to keep public features working:

1. Completed: checked original baseline hashes, added the metadata responses, applied the exact tested browser edits, and verified the build plus 66 behavior tests and 10 metadata checks.
2. Rick must publish this prepared browser/configuration release in Base44; the current connection has no Publish action.
3. Check both live metadata responses and the published browser bundle. Have Rick refresh the public site and send a short Guide question to confirm real visitor verification succeeds.
4. After the published browser supplies tokens, compare current source against the hashes in `rollout-state.json` and apply the two enforcing backend candidates. Preserve any newer unrelated edits. Do not reapply the original full patch over the already updated browser.
5. Confirm those enforcing backend revisions are live; another Publish step may be needed if production still serves the preparation version.
6. Confirm anonymous/forged requests are rejected and real verified visitors and authenticated administrator/service workflows succeed. Use narrowly scoped non-mutating live checks; do not send bulk probes that might invoke privileged work. Older browser tabs may need a refresh.
7. Rerun the hosted Base44 Security Scan. Its interpretation of intentionally public but provider-verified endpoints has not been tested.

The staged `public-verification.patch` is review material for the final state; applying it blindly before keys and the browser rollout are ready would interrupt the Guide and publication signups.

## Audit correction and remaining review

The earlier source-only audit reported zero findings because it counted origin/rate/spam checks as a sufficient public boundary. The revised heuristic flags anonymous privileged mutations with an origin-based admission path, while distinguishing public reads and existing custom session checks.

It currently flags the two pending functions above, plus three additional endpoints for a separate review: `startDiscoverySession`, `submitPublicTrialSignup`, and `trackJourneyEvent`. These are source-review candidates, not a hosted scan result. They were not silently changed or suppressed during this seven-function repair.

## Recovery

Before-change checkpoint: **Before seven-function authentication repair — 2026-09-15**.
Checkpoint ID: `6aa88d4746a213d6be335f7c`.
Baseline commit: `3c3ba44c581a765d11a882dcd141253ccfe24ccb`.

Restoring that baseline also restores the previous unauthenticated behavior. Prefer a targeted repair if release verification finds a problem.

## Provider reference

[Server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) and [widget configuration](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/).
