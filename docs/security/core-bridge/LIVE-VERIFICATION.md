# Live publication verification — September 15, 2026

Rick reported publishing both NTA apps. The public site's JavaScript asset matches the checked production build byte for byte.

## Security results

**All 16 direct unauthenticated rejection checks passed:**

- Six public visitor endpoints returned **403 / VERIFICATION_REQUIRED** without a valid visitor proof.
- Seven public internal/legacy endpoints returned **401** without a verified session.
- Three Core receiver endpoints returned **401** without an authenticated administrator/service identity or the private server credential.

These requests included the trusted website Origin. The Origin did not authorize them. Six exact visitor-configuration requests returned their expected public site-key/action metadata, and all three Core receivers rejected GET with 405.

The payloads contained no contact information, business details, visitor proof, valid server credential, or AI prompt. No leads, subscriptions, appointments, or new emails were deliberately created. One initial internal-endpoint tool request timed out; a single bounded repeat returned all seven expected 401 responses.

This verifies live rejection of unauthorized calls. It does **not** yet prove a successful live shared-credential handshake or real visitor delivery, and it is not a replacement for the Base44 hosted Security Scan.

## Visitor journey

The published Opportunity navigation goes to the public `/account-manager` page, which includes the required interest and business-observation answers. The Gap Audit has connected field labels and still requires the business website.

The three Growth Conversation questions reach a Visibility & Growth recommendation and contact form, with call/text/email alternatives. Talk to My Office stays closed initially, opens on request, and minimizes again. No AI chat message or contact form was submitted.

The Core sign-in surface remains visible to the anonymous review browser. The owner reports the Core frontend was published; its authenticated private screens were not inspected. A phone walkthrough remains.

## Delivery evidence

The September 13 Gap Audit email is present in the connected `info@newtechadvertising.com` inbox. This confirms that earlier email reached the mailbox. Existing provider status fields were not overwritten: receipt in the mailbox and provider reconciliation are separate evidence.

The latest Submission record observed is September 14. There is no postpublication visitor submission to trace yet. The current Core email template already offers clear choices to keep learning, contact Rick, start a Growth Conversation, or book a time; it uses the audit's business name and avoids the older fixed call-duration promise.

## Next test

Complete one agreed fresh Gap Audit through the public form using NTA business details. Trace its success/error response, Submission, SalesLead, GapAudit, provider status, and actual connected mailbox. The NTA Lead & Funnel Troubleshooting workflow requires confirmation before entering personal contact information for this live test; sending its email also needs explicit authorization. Cloudflare may require a separate human-verification interaction.

A test from Rick's phone would also cover the mobile visitor experience. The agent's review browser currently has the empty Gap Audit form available; it has not entered Rick's details.

The hosted Base44 Security Scan is not exposed through the current connector and remains an owner-side check. No further source changes or publication are required just to save this report.
