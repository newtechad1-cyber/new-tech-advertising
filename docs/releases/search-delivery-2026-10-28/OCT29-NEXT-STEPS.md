# October 29 — remaining search issues and next steps

Status: the previously stale video upload date has cleared live. One Journal routing repair is prepared and not published. Clean-URL initial HTML delivery remains a Base44 platform issue.

## Verified today

- Googlebot receives Show Me Before You Sell Me with the verified original upload timestamp 2026-10-13T05:47:50-07:00. This closes the stale date-only crawler response observed October 28.
- The sampled AI-tools question still has its own canonical for Googlebot, but its ordinary initial HTTP response is the homepage.
- The Journal issue still returns the Journal hub for Googlebot. The agency URL still receives an indexable homepage fallback. These are focused rechecks, not a new complete-site scan.

## Prepared Journal repair

The issue 4 data contains two Published records with the same title, number and date, using slugs the-free-ai-guy-comes-to-life and issue-4-the-free-ai-guy-comes-to-life. The shared data merge retains one record per issue number. The old native wrapper passed the shorter slug, which has no numeric fallback when the other record is selected. That can redirect the valid issue URL to /journal.

Changed only the native wrapper lookup to issue-4-the-free-ai-guy-comes-to-life. The existing resolver can find either stored variant by issue number. The public canonical URL and the issue content remain unchanged. No data record was deleted or rewritten.

Validation: reproduced the old failed lookup with the actual resolver body; the repaired wrapper resolves both stored slug variants. Base44 production build passed, generating 232 public and 1176 cleanup/alias outputs. Existing unrelated work was preserved. A rendered preview was not independently inspected in this turn; the connected browser session was not initialized. Rick retains Publish.

## Exact remaining steps

1. Review the saved Base44 change, then choose Publish → Publish App in the New Tech Advertising editor: https://app.base44.com/apps/691f41a18de4a7f498c8f884/editor . After publication, verify /journal/the-free-ai-guy-comes-to-life before and after JavaScript and allow Base44's crawler copy to refresh.
2. Submit the platform request below through Base44 Customer Care. It has not been sent. No paid service or global SEO/noindex change was used.

## Prepared Customer Care request

App 691f41a18de4a7f498c8f884, https://newtechadvertising.com:

Please investigate clean-URL initial-response delivery. For example, /knowledge/questions/am-i-paying-for-too-many-ai-tools identifies itself correctly for Googlebot, while an ordinary initial HTTP request returns the homepage title, heading and canonical. The generated .html and /index.html artifacts already contain the correct page-specific content. Please resolve those artifacts before root SPA fallback, or otherwise ensure initial server responses identify the requested page consistently, without changing the intended clean canonical addresses.

Also ensure /agency/AgencyClientCMS and unknown/private paths keep their intended noindex/cleanup behavior instead of receiving an indexable homepage fallback. Do not disable SEO or remove noindex globally. The original 37 affected URLs and October 28 evidence are attached in this repository's search-delivery-2026-10-28 folder.

The stale Show Me Before You Sell Me uploadDate is now correct and no longer needs refresh. A source fix for the issue 4 Journal alias has been prepared; refresh that URL after Rick publishes if its crawler copy still shows the Journal hub.

Acceptance: ordinary and crawler initial responses identify each public URL's own page and canonical; private, retired and unknown paths retain their intended directives.
