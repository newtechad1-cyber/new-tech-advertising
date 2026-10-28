# Post-publication recheck — October 28, 2026

Rick reported that he published and requested a recheck. Live sitemap now has 232 URLs.

- All 232 returned HTTP 200; none of the sitemap pages returned noindex.
- All 37 originally flagged URLs identified their own canonical for Googlebot. Across the full sitemap, 231 of 232 had the expected canonical. /journal/the-free-ai-guy-comes-to-life still returned /journal, on a separate second check too.
- All 37 ordinary initial responses still returned homepage HTML and the homepage canonical before JavaScript. This is separate from successful rendered-browser or Googlebot results.
- The published Episode 2 browser page has its correct canonical and original 2026-08-10T14:00:57-07:00 upload timestamp.
- Live explicit HTML for Episode 2, Representation or Deception, and Show Me Before You Sell Me has the repaired original timestamp.
- All 20 live video-sitemap publication timestamps match the verified source.
- One stale Googlebot schema remains: /growth-show/show-me-before-you-sell-me still emits 2026-10-13, on both first and separate second checks; its explicit HTML emits 2026-10-13T05:47:50-07:00. Episode 2, Representation or Deception and Episode 13 returned valid timestamps for Googlebot.
- /AdminMetaSetup retains noindex. /agency/AgencyClientCMS and an unknown URL still receive an indexable homepage fallback, despite source cleanup/noindex controls.

Conclusion: publication is confirmed and the timestamp repairs are deployed, but crawler copies and generic clean-URL initial delivery are not fully repaired. These are HTTP/canonical/schema observations, not Google indexing counts or traffic measurements.

Next action: use base44-support-request.md, adding a specific request to refresh /growth-show/show-me-before-you-sell-me and /journal/the-free-ai-guy-comes-to-life on the custom domain; fix clean-path fallback while preserving private/unknown noindex behavior. No support message, indexing request or additional website publication was sent/performed.

Evidence: post-publish-recheck.json. Initial responses and the separate recheck are retained independently. This note supersedes the earlier Publish-pending status for website code; the remaining delivery defects stay open.
