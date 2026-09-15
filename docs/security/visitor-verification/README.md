# Seven backend authentication findings — 2026-09-15

Target: New Tech Advertising, public Base44 app `691f41a18de4a7f498c8f884`.
Production site: https://newtechadvertising.com

## Current status

Five authentication fixes are saved in the active app source. Two public replacements are staged in this directory and are **not active**. Production endpoint probes still returned the earlier behavior; saving the code is not evidence that production is protected. Final release and live verification remain required.

| Function | Saved change / remaining action |
| --- | --- |
| adaIntake | Require verified Base44 administrator or service identity before privileged work. |
| auditWebsiteAccessibility | Same authentication gate; preserve URL/DNS/redirect safeguards in its own entry point. |
| chatbotChat | Same authentication gate before reading chat configuration or constructing the AI client. |
| chatbotLeadCapture | Same authentication gate; preserve verified workflow/service calls. |
| demoAiChat | Same authentication gate before any AI work. |
| growthGuideChat | Staged server-side Turnstile verification; needs real configuration and coordinated frontend rollout. |
| publicationSignup | Staged server-side Turnstile verification and explicit consent; needs real configuration and coordinated frontend rollout. |

Only growthGuideChat and publicationSignup have callers in the current public import graph. The five restricted functions belong to older UI components or internal workflows. The legacy lead-capture agent/workflow still needs a live authenticated service invocation checked after release. No emails, real signups, or paid AI calls were sent during this work.

## Verified

- 66 isolated behavioral tests pass: anonymous/invalid/member rejection, administrator/service admission, forged header/body claims, private URL/redirect rejection, scan form-label handling, provider rejection/outage/missing configuration, wrong action/hostname, expiry, replay, consent, cancellation, and fresh browser tokens.
- `npm run build` passes and produces SEO HTML for 167 public URLs plus 963 legacy cleanup/alias URLs.
- The staged browser changes also pass an isolated Vite production build.
- `git diff --check` passes.
- Current public browser callers remain unchanged until the staged rollout.

The provider and Base44 identity/data operations are mocked in the behavioral tests. Real Turnstile, live administrator/service calls, live visitor submissions, and the hosted Base44 Security Scan are not yet verified.

Base44 initially reported a failed accessibility-function revision with no build detail. The independently deployed entry point now contains its URL safeguards directly instead of importing another function directory, and a pre-existing form-label variable-scope error was repaired. The updated source passes local checks; the hosted revision still needs release verification.

## Finish the two public functions

Create a real **Managed** Cloudflare Turnstile widget for the NTA hostnames:
`newtechadvertising.com`, `www.newtechadvertising.com`, `app.newtechadvertising.com`, and `new-tech-advertising.base44.app`.

Save these values directly in this Base44 app's Secrets settings:

- `NTA_TURNSTILE_SITE_KEY` — the public widget site key.
- `NTA_TURNSTILE_SECRET_KEY` — the server-only verification secret.

No usable Turnstile configuration was found in the app source or visible sandbox process. The connected tools do not expose app-secret management or a connected Cloudflare account. Hosted secret storage itself was not readable, so it has not been declared empty.

The staged implementation checks the provider's success result, hostname, action and issue time. It rejects missing configuration, known public test keys, invalid/expired/replayed proof and provider failures. The browser receives only the public site key and uses a fresh single-use token per request. It does not store tokens or retry mutations automatically.

Coordinate rollout to keep public features working:

1. Recheck the baseline hashes in `manifest.json` and `frontend-edits.json` against current source.
2. Configure the real widget and keys.
3. Add only the harmless verification-config response to the existing two public handlers first, preserving their existing behavior during preparation.
4. Publish the browser helper and four caller edits, then verify real token acquisition from the published site.
5. Activate the enforcing backend candidates only after the published browser sends tokens. Do not add an origin-only fallback or a configuration switch that bypasses verification.
6. Confirm anonymous/forged requests are rejected and a real verified visitor succeeds; check signed-in administrator and service workflows. Older browser tabs may need a refresh.
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
