# Connected NTA learning access — 2026-10-06

Prepared in New Tech Advertising, app 691f41a18de4a7f498c8f884. Rick publishes through Publish → Publish App.

## Changes

- Dedicated /podcasts page with eight complete Growth Show audio episodes, search, Watch and related Read links, and RSS access.
- Video Library and Podcast Library inside the Learn menu, with no duplicate top-level header buttons; Read / Watch / Listen / Books navigation across the learning and book destinations.
- Podcast links in the gallery and video detail views; twelve lessons with confirmed editorial video connections, including seven connected to actual podcast audio.
- Curated gallery now includes both previously missing Growth Show uploads, for 35 selected videos.
- Public /podcasts route, canonical metadata, sitemap and static search content.
- Fixed the native lesson canary’s undefined LESSON_PATH and updated its generation template to preserve media controls.

## Inventory

NTA-Content-Inventory-2026-10-06.xlsx contains 353 distinct public YouTube uploads (326 videos, 26 Shorts, one stream), 69 lessons, 60 PublishingArticle records, 17 website YouTube records, eight Growth Show episodes, 31 JournalIssue records, ten collections and two books. It includes confirmed pairings and the 57 lessons requiring content-based video review. Public channel scan covers @RickHesse, UCdGaYoTxcO-W6wuC3iDqFDg; private/unlisted/deleted assets are outside the scan.

## Matching rules

Existing connections are editorial topic pairings, not word-for-word recordings. Check actual video content before adding a new connection. Do not publish every older client or promotional video into the learning library. Eight Growth Show episodes have real full audio; other uploads do not yet have verified podcast audio. Review Episode 7’s stored source_article_slug websites-as-salespeople separately; its confirmed topic pairing is Understanding Before Spending. Repeated Journal issue numbers require review before merging.

## Verification and handoff

Browser checks verified all twelve paired native lesson routes with no page errors, Watch/Listen switching, eight podcast players, actual audio playback and seeking, and mobile navigation with no horizontal overflow. Desktop and mobile screenshots were inspected. Production build and podcast integrity tests pass. Source is autosynced to the matching GitHub repository. Saved changes require Rick’s Publish → Publish App step; live discovery UI has not yet been verified after publication.

After publishing, check /podcasts, Learn → Video Library / Podcasts, gallery Growth Show Listen links, and /knowledge/business-foundations/understanding-before-spending. Existing public MP3 URLs were verified separately; never treat source saves as a production UI deployment.

## Follow-up navigation correction

A fresh browser verified the published Episode 10 Growth Show page has its real audio player and the published Learn dropdown has both library links. Rick then confirmed finding the links and directed both libraries to remain within Learn. Separate Video Library and Podcasts header buttons were removed, and the dropdown now says Podcast Library — Listen. Episode 10’s lesson now shows explicit Watch, Listen and Read choices plus its full audio player above the video. The episode page renders verified available seed content while related resources are loading. Browser checks passed with no page errors; these follow-up edits still require Rick’s publishing step.
