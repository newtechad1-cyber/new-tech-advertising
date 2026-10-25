# From Ideas to Finished Work — weekly release handoff

Rick approved the Knowledge Library lesson, Journal teaching and all three Growth Show scripts on October 25, 2026 and explicitly authorized website publication while he renders the video.

## Reader destinations
- Lesson: https://newtechadvertising.com/knowledge/ai-foundations/from-ideas-to-finished-work
- Journal Issue 13: https://newtechadvertising.com/journal/issue-13-from-ideas-to-finished-work
- Knowledge Library and AI Foundations discovery link to the new lesson. Journal and lesson link reciprocally.

## Verified
- Source lesson and curriculum use one governing text. Approved paragraph meaning preserved; presentation adds normal Markdown headings and source reference navigation.
- Public and Core JournalIssue records match the approved Journal text, subject and lesson CTA; both newsletter_sent values are false.
- Public route tests: 6 passed. Build and 23 public-boundary/production-SEO/search-delivery/visitor tests passed. Scoped ESLint passed. Core check:release passed (19 agreement, 258 security, 35 bridge, 412 workspace tests, plus build).
- Built and live browser reader checks at widths 1365 and 390 found the approved opening and closing, correct titles, no page errors and no horizontal overflow on both reader routes. Mobile viewport screenshots were inspected. Existing global floating office guide can overlap part of the mobile viewport; its positioning was not changed by this content release.
- Full initial lesson and Journal HTML is generated in dist. The live host still returns the generic SPA shell before JavaScript; live reader content and initial HTML are distinct, and that hosting behavior is not claimed fixed here.

## Remaining media and email work
- Rick renders three approved Rick–Free AI Guy segments, assembles with his own intro/outro and uploads to YouTube.
- After the actual URL exists, verify playback, extract complete original audio, prepare RSS and link Read / Watch / Listen to this same source and Journal identity.
- No subscriber email, test, post schedule or recurring automation was activated. Tuesday October 27 at 8 a.m. America/Chicago remains the target for the reviewed Brevo subscriber send, not a scheduled task.
- The approved production copy includes a consistent studio/monitor prompt and a suggested attentive-listener direction. HeyGen output has not been rendered or verified by this session.

## Recovery
Before-change public checkpoint: 6ade06c729cf8fb95ad33dd8, commit 79377dd86c4cec37e1e934a150ef4e845095464c.
Before-change Core checkpoint: 6ade06caf80bdfc484489816, commit 431ea04a9b923ae142f5cce9cfe4a55371952bfc.
Do not delete or overwrite the historical public Journal record numbered 13 with slug digital-risks; it is a legacy article, not this weekly edition. Canonical weekly identity is issue-13-from-ideas-to-finished-work. Do not resend Issue 12; its Core delivery state is already sent.
