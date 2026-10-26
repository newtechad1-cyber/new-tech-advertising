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

## October 26 — Episode 13 uploaded and connected

Rick supplied https://youtu.be/wFRRiJu-DHs after approving the complete teaching package. YouTube oEmbed confirms the actual episode title and @RickHesse channel. Public episode record 6adf52a1987fff35ce9595ba and video record 6adf5286b5d2d79c6784d173 are saved. Journal record 6ade0878c60a1eccf8c023e2 now links the video; Core Journal 6ade0879513423da3bdcb9c0 has the matching featured_video for eventual subscriber delivery. newsletter_sent remains false; no email or automation was sent/scheduled.

Verified live: /growth-show/from-ideas-to-finished-work displays Episode 13 and the correct YouTube embed. Journal Issue 13 displays the uploaded video link on desktop/mobile. Full YouTube playback could not be checked due bot protection; oEmbed verified title/channel/embed metadata.

Prepared code: native lesson Read/Watch controls, video gallery selection, episode and source-lesson adapters, Journal fallback, and library Watch Episode 13 link. Build, scoped ESLint, and nine podcast/route tests pass. Direct relationship check confirms lesson/Journal/video identity and pending-audio gating. Built lesson Watch control tested at 1365 and 390 widths with the correct youtube-nocookie ID, no horizontal overflow. Built library mobile displays Watch Episode 13. Local built dynamic episode route did not render under localhost checks; production episode renders correctly. No unrelated routing changes made.

Remaining: Rick clicks Publish → Publish App in New Tech Advertising public app 691f41a18de4a7f498c8f884 for lesson/library source changes and episode resource adapter; live pages still show the prior pending recording text there. After Publish, verify the updated lesson Watch control and reciprocal lesson link on the episode page. Original full podcast audio/RSS remains pending; no synthetic substitute generated. Tuesday October 27 8 a.m. Central remains a target, not an active schedule; subscriber test/send remains outstanding.

## October 26 follow-up — explicit audio source blocker

Rick asked to finish the podcast and YouTube website connection. Checked all four live destinations at desktop 1365 and mobile 390 widths. Episode 13 embeds the correct ID and Journal links correctly; no page errors or horizontal overflow. Clicking embedded Play displays YouTube’s bot/sign-in challenge in the sandbox. Both normal and Android VR yt-dlp metadata retrieval were also blocked. Therefore full playback and source audio are not verified, and no MP3 was fabricated or marked Ready. Drive search for the title and recent video/audio found no assembled master. Need Rick’s final assembled MP4 or complete original audio file to extract/verify/attach podcast and RSS. Individual HeyGen segments cannot replace the assembled show including intro/outro.

Live JavaScript is still index-CS0y-mUG and contains neither the new video ID nor Watch Episode 13. Lesson/library still show recording pending. Prepared source connections remain saved at the preceding checkpoint; owner Publish → Publish App remains necessary after the audio can be completed. No email sent or new schedule activated.
