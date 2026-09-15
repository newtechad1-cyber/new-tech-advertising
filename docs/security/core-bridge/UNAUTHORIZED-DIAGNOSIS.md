# Gap Audit Unauthorized diagnosis — 2026-09-15

Status: code repair is saved and locally verified; matching secret values and a fresh publish are still required. A successful production audit has not yet been verified.

## Confirmed cause

A temporary, read-only diagnostic ran inside the public app and Core without creating records or sending email.

| Check | Observed result |
| --- | --- |
| Public NTA_CORE_BRIDGE_SECRET configured | Yes |
| Core NTA_CORE_BRIDGE_SECRET configured | Yes |
| Credential header reaches Core | Yes |
| Received header matches Core's expected key | No |
| Independent domain-separated HMAC comparison matches | No |

The two runtimes are using different key values. This is an app connection configuration failure. It does not mean the visitor needs an account. No actual secret, reusable fingerprint, or diagnostic signature was exposed in the tool results.

The reported failed attempt did not create a new Core Submission at triage; the newest prior Submission was dated September 14. No live lead, audit, LLM, email or booking was submitted by the assistant during this investigation.

## Saved repair

- Public ntaUnifiedIntake and submitRecruitingApplication translate upstream 401/403 into a 503 response with code NTA_CONNECTION_UNAVAILABLE and clear call/text guidance. They do not claim the request was saved.
- Exact public intake metadata {"connection_check":true} requests only the three fixed Core receivers' authenticated connection-check responses. No caller payload or contact details are forwarded.
- The three Core receivers return their authenticated metadata before entity access, LLMs, notifications or email.
- The readiness check coalesces concurrent requests, caches the result briefly and has a timeout.
- npm run check:core-bridge-live now verifies an actual authenticated connection to all three receivers, and is included in check:release.
- Both temporary checkCoreBridgeTransport diagnostics were retired and verified to return HTTP 410.

## Verification

- 177 backend authentication/provider/client tests passed.
- 47 bridge boundary/readiness tests passed.
- Static source audit: 0 critical, 0 high, 0 medium findings.
- Public production build completed and generated route-aware SEO output.
- Published normal intake without visitor proof still returns 403 VERIFICATION_REQUIRED.
- Published Core intake without credentials still returns 401.
- The new readiness metadata is present in the reviewed source, but the published intake still returned 403 VERIFICATION_REQUIRED at 2026-09-15T17:52:06Z. Live activation is not confirmed. Resource saves and checkpoints alone did not make this branch observable in the published intake.
- The live release gate exits 1. Do not report a successful connection or completed release.

## Required next steps

1. In the public New Tech Advertising app and NTA Core Admin Hub, save the same existing value under the exact secret name NTA_CORE_BRIDGE_SECRET. Do not generate a different key for each app and do not paste the secret into chat.
2. Publish both apps to apply the reviewed changes and configuration.
3. Run npm run check:core-bridge-live. Require HTTP 200, connection_ready:true and true for ntaUnifiedIntake, submitRecruitingApplication and trackBookEvent.
4. Only after the handshake passes, repeat the user's Gap Audit once and trace Submission, SalesLead, GapAudit, provider event and actual mailbox receipt. Preserve action-time confirmation requirements if the assistant will type contact information or send an email.

Do not remove authentication or fall back to Origin-only admission. Base44's Publish UI does not automatically enforce the repository command; the live gate must actually be run.
