> Publication update: Rick has published both apps. The checked public build and all 16 live unauthorized rejection checks are verified. Follow [LIVE-VERIFICATION.md](LIVE-VERIFICATION.md) for current evidence and the remaining fresh visitor/email test. The original publication handoff below is historical.

# NTA security and visitor journey review — September 15, 2026

The Core connection changes are **active in the saved source of both apps**. Rick confirmed that `NTA_CORE_BRIDGE_SECRET` is saved in both app secret stores. Both release commands and builds passed. The final UI publication and live submission/delivery checks remain; do not report the whole system fully verified.

## Publication handoff

1. Open **NTA Core Admin Hub** (`6a7215451eb90dc843a94546`) in Base44 and click **Publish**.
2. Then open **New Tech Advertising** (`691f41a18de4a7f498c8f884`) and click **Publish**.
3. Reload open visitor forms after both apps are published. Inspect the live public experience, run the hosted Security Scan, and complete one agreed visitor submission with actual mailbox confirmation.

The connector has no final Publish control in this session. Backend resource files can synchronize as they are saved; a saved checkpoint is not evidence that the latest frontend bundle was published. Do not leave the two app releases at different versions. Do not make the whole Core app public.

## Active connection protections

Four public backend senders put the shared credential in the `x-nta-core-bridge-secret` request header: `ntaUnifiedIntake`, `submitRecruitingApplication`, `publicationSignup` book-access tracking, and the authorized legacy `trackBookEvent` relay. SDK 0.8.48 supports this configuration. The credential is read only from server settings and is never put in browser code or form payloads. A missing or too-short credential prevents the handoff.

Core intake, recruiting, and book tracking verify the shared credential or an authenticated administrator/service identity before privileged work. Exact authenticated `{ "connection_check": true }` requests return no-data connection metadata. A matching Origin, body role, or public site key is not authorization.

The public recruiting form and eleven remaining Core visitor forms now use the website's verified visitor gateway. The two Core recruiting forms now ask for the required business-observation answer. Core's private staff interfaces retain their authenticated internal calls.

All 20 activation files match the prepared candidates after ignoring final newline differences. `rollout.json` records the active state, Core source hashes, and recovery checkpoints. Its old-text edits are retained as a historical review record; **do not apply the activation bundle again**.

## Saved visitor journey repairs

- Six public entry points verify Cloudflare Turnstile proof server-side: Guide chat, publication signup, unified intake, discovery-session start, guided setup, and recruiting.
- Seven legacy/internal entry points require verified admin/service identities, including legacy analytics writers. Browser journey and book-click measurement uses platform analytics; existing GA4 calls remain.
- Guided setup submits once and records its CRM handoff status. Failed requests show a visible error; confirmation describes a saved setup request instead of promising an immediately ready dashboard. The existing background provisioning workflow still needs a real end-to-end check.
- Contact and Gap Audit fields have connected labels; newsletter email has an accessible name. Returning book subscribers can reach their existing download.
- Public NTA Opportunity navigation points to `/account-manager`; the Core root currently redirects anonymous visitors to sign-in. Intentional private sign-in links remain private.

## Verification completed

- **Public app:** `npm run check:release` passed — 249 test cases, production build, and the final Core-source readiness gate.
- **Core app:** `npm run check:release` passed — 35 cases against its active receiver/form source and a production build. Some Core boundary cases repeat in the public review suite; the counts are test executions, not 284 unique workflows.
- The public source heuristic reports 0 critical/high/medium findings across 365 functions and 737 entities. This is not a fresh hosted scan or a complete Core security audit.
- Existing live review: all 167 sitemap URLs returned HTTP 200; both book downloads returned PDF bytes; Rick's calendar showed available appointments. The three Growth Conversation questions advanced to a recommendation/contact form.
- The question doorway, Guide opening, audit/contact/publication forms, and public opportunity page were inspected on desktop. No contact information was submitted, no appointment booked, no AI message sent, and no new email sent in this review.
- Recent audit submissions exist in Core. The newest audit email has Brevo acceptance evidence, not confirmed recipient delivery. Historical August records contain delivered/opened evidence.

## Remaining verification

The actual runtime secret values were not read or compared. Rick's confirmation establishes that he saved them; a successful authenticated live handshake remains to prove they match and the published runtimes are using them. Fresh Cloudflare verification, visitor intake/CRM handoff, notification/email delivery, and a phone walkthrough remain after publication.

Earlier automatic approval review rejected live negative POST probes because the published receiver could still perform writes or downstream actions. Those probes were not repeated through another route. This activation used isolated handler tests and source/build checks; any live probe must satisfy the approval boundary and be proven nonmutating.

## Keeping the repair in place

Both app repositories now provide `npm run check:release`. Core tests read its active files; public sender tests read active public files. The public repository retains reviewed Core snapshots as supporting evidence, while Core's own command detects subsequent receiver changes.

GitHub workflows are configured for pushes, pull requests, and manual runs. GitHub execution and branch protection were not verified, and Base44's Publish button does not automatically enforce these repository commands.

Run release checks and Base44's hosted Security Scan before publishing meaningful form, route, backend, permission, or integration changes. Base44 recommends scans before publishing and after significant changes: https://docs.base44.com/Setting-up-your-app/running-a-security-scan

A short weekly visitor walkthrough is our maintenance recommendation. After connection, credential, or email-workflow changes, add an agreed real submission and confirm its mailbox result. No recurring ChatGPT task was created.

Cloudflare documents that a configured root hostname covers its subdomains: https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/
