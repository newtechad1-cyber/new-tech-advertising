# NTA security and visitor journey review — September 15, 2026

The public-source repairs are saved. The final cross-app protection is prepared and tested, but **not activated**. Do not report the whole system secure or the release complete yet.

## One required setting

Create `NTA_CORE_BRIDGE_SECRET` in the Secrets settings of both **New Tech Advertising** (`691f41a18de4a7f498c8f884`) and **NTA Core Admin Hub** (`6a7215451eb90dc843a94546`). Use the same newly generated random value of at least 32 characters in both apps. Keep its value in the secret stores and the owner's password manager, never in browser code, source files, screenshots, logs, or chat. These credentials are separate from the existing Turnstile settings.

The available Base44 tools do not expose secret-setting management. The owner must enter this setting. No secret value was generated, retrieved, or saved in this repository.

## Saved public-source repairs

- Six visitor entry points use the same server-verified Turnstile implementation: `growthGuideChat`, `publicationSignup`, `ntaUnifiedIntake`, `startDiscoverySession`, `submitPublicTrialSignup`, and `submitRecruitingApplication`. Verified admin/service workflows retain access. The public recruiting page still calls Core directly until the staged bridge changes are activated.
- Seven legacy/internal entry points require verified admin/service identities, including the two legacy analytics writers. Browser journey and book-click measurement uses the platform analytics API. The existing Core book counters will no longer receive browser click events; server book-access requests remain part of the staged authenticated connection.
- Guided setup submits once. Its server records the trial and sends the CRM handoff. Failed handoffs retain a review status, and the visitor sees a visible error when a request fails. Confirmation copy describes a saved request instead of promising a ready dashboard. The existing background provisioning workflow still needs a real end-to-end check.
- Contact and Gap Audit fields have connected labels; newsletter email has an accessible name. Returning book subscribers can reach their existing free download instead of being blocked by an already-subscribed response.
- The public NTA Opportunity navigation now points to `/account-manager`. The Core URL currently sends anonymous visitors to a sign-in page. Existing intentional staff/client sign-in links remain private entrances.
- The security inventory includes helper-wrapped calls and anonymous cross-app relays. Shared-guard, route, analytics-isolation, and handoff regression tests are part of the release process.

## Core connection changes awaiting activation

`rollout.json` contains exact edits for 20 files: 5 public-app files and 15 Core files. `candidates.json` contains the resulting source used in isolated tests. Apply the edits only when their `old_text` still matches; rebase against new changes instead of overwriting newer work.

The four public senders use SDK 0.8.48 and put the new credential in `x-nta-core-bridge-secret`. Core intake, recruiting, and book tracking verify that credential or a verified administrator/service identity before privileged work. Rejected calls do not write records or send messages. Exact authenticated `{ "connection_check": true }` requests provide a no-data connection check.

Public forms remaining in Core route through the public visitor gateway. The two Core recruiting forms gain the business-observation answer required by their backend. One currently never asks for it, and the older form also omitted it. This is a real request-contract mismatch, not a confirmed delivered application.

Coordinate publication of both apps once the settings and source are ready. A mixed release can temporarily reject old calls; do not leave only half of the change published. Reload any open recruiting form after the cutover. Update `rollout.json` to `active_source_verified` only after checking the actual Core files against the prepared changes. Then run the final release command again.

## Evidence and limits

- **249 automated tests passed:** 210 for active public-source behavior and 39 for staged Core guards/senders/forms. The public build and an isolated Core build with all 15 Core changes passed.
- The public source preflight reports 0 critical/high/medium findings across 365 functions and 737 entities. This heuristic result is not a fresh hosted scan and does not certify the entire Core app.
- All 167 URLs from the live sitemap returned HTTP 200. This checks availability, not every interaction on every page. Both book download targets returned PDF bytes. Rick's calendar opens with available appointment times.
- The question doorway, Guide opening, audit/contact/publication forms, public opportunity page, and all three Growth Conversation steps were inspected in the live desktop browser. No contact information was submitted, no appointment booked, and no new email sent. A phone walkthrough remains necessary.
- Existing Core records show recent audit submissions arrived. The newest report email has Brevo acceptance evidence, not confirmed mailbox delivery. A historical August record has delivered/opened evidence. Fresh successful Cloudflare, intake, CRM, notification, and recipient-delivery checks remain after the coordinated publication.
- Earlier automatic approval review rejected live negative POST probes because the published receiver could still perform writes or downstream actions. Those probes were not rerouted or repeated here. This review used read-only live requests and isolated handler tests.

## Repeatable release process

Run `npm run check:release` before publishing. It runs the security inventory, authentication/visitor tests, Guide tests, route tests, builds, journey checks, staged bridge tests, and source readiness check. **It currently stops intentionally at Core bridge readiness** until the secret-backed changes are activated.

`.github/workflows/release-checks.yml` runs this command on repository pushes/pull requests when GitHub Actions is connected and enabled. Execution and branch protection were not verified. Base44's Publish button does not automatically enforce this repository workflow.

Run Base44's hosted Security Scan after meaningful form, permission, backend, or integration changes and after the coordinated publish. Base44 recommends checking before publishing and after significant changes: https://docs.base44.com/Setting-up-your-app/running-a-security-scan

A short weekly walkthrough is our recommended steady maintenance cadence while the site is active. When a connection, credential, or email workflow changes, add one agreed real submission and confirm the actual mailbox result. Daily development can justify daily release checks; repeated findings alone are not evidence of a new daily attack. No recurring ChatGPT task was created in this review.

Cloudflare documents that a configured root hostname covers its subdomains: https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/
