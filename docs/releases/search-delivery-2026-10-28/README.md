# Search delivery and video metadata — October 28, 2026

Status: source repairs prepared in Base44; final Publish belongs to Rick. Initial-response delivery remains a platform issue and is not declared fixed.

## What changed

- Restored native route registration for all five Business Planning Guide question URLs using their existing content. Added the missing native Episode 13 wrapper for the existing Published record; no article or episode copy was rewritten.
- Generate initial HTML and sitemap entries for source-published Growth Show episodes automatically. The prepared sitemap has 232 public URLs, including the existing Episode 13 record; the live diagnostic examined the original 231.
- Replaced eight date-only/placeholder-midnight video dates and filled six missing originals using YouTube's own publication microformat. Exact source URLs, timestamps and channel evidence are in video-publication-evidence.json. The tools/system video's original date is July 15, not the old July 25 value. Other previously verified timestamps remain intact.
- Shared static, React/native, SEOHead and video-sitemap paths now use verified timestamps. Generation rejects absent dates, date-only strings and timestamps without a timezone. Runtime paths omit unsupported schema rather than invent a time. Native video pages retain their listening links and existing content.
- Added a repeatable initial-HTTP verifier with separate ordinary and Googlebot requests. Failed first responses are retained independently of a later successful recheck.
- Added video/date and all-37 artifact checks to the existing public SEO/release commands. Corrected an aging test fixture so it computes a synthetic newest item relative to the archive.

## Verification

- Base44 production build passed. Native video generation ran successfully.
- 35 focused tests passed: public boundary, route governance, generated SEO output, search delivery, video gallery and video publication.
- All 37 original URLs have page-specific generated initial HTML, their intended canonical, an H1 and indexable metadata. All 232 prepared sitemap URLs remain indexable; existing private, administrative, retired and unknown-path cleanup checks passed. No global noindex removal or SEO-settings changes were made.
- Generated video schemas and sitemap publication dates match their verified video source. Original Episode 2 timestamp: 2026-08-10T14:00:57-07:00; Representation or Deception: 2026-10-20T06:07:17-07:00; Show Me Before You Sell Me: 2026-10-13T05:47:50-07:00.
- Preview browser checks confirmed representative flagged pages and video metadata. YouTube embed playback produced Error 153 in the test browser; successful playback is not claimed.

## What is verified live

The public site has not been published during this work. Live results below are observations of its existing version, not proof that the prepared repairs are public.

The first full Googlebot pass checked 231 sitemap URLs: all returned 200, none had noindex, and 228 had the expected canonical. Two Business Planning Guide question responses fell back to the homepage; one additional Journal URL returned /journal as its canonical.

A separate dual-agent recheck covered all 37 initially flagged URLs plus four controls. All 37 returned their own canonicals for Googlebot. All 37 ordinary requests still received homepage HTML before JavaScript. The additional Journal URL still returned its hub canonical for Googlebot. These results demonstrate request-dependent and changing delivery, not a count of Google exclusions or proof of indexing.

Evidence: live-all-231-googlebot.json and live-37-and-controls-dual-agent.json. Keep first responses and rechecks separate.

## Remaining Base44 action

The APIs expose SEO settings, per-page visibility and redirects, but no supported cache purge, manual snapshot refresh or static-route rewrite control. The connected editor URL returned 404 in this session; the sandbox preview worked. Existing custom domain registration is verified and enabled. No DNS change, paid service, GSC Wizard, account reconnection or artificial entity update was used.

Base44's official documentation says publication marks saved crawler copies stale and refreshes them in the background; a first crawler visit may still receive the older copy. Manual refresh belongs to Customer Care:
https://docs.base44.com/Performance-and-SEO/SEO-and-search-visibility#refreshing-what-crawlers-see

Use the prepared Customer Care request in base44-support-request.md. Ask for manual refresh and investigation of homepage fallback on snapshot misses and clean-path resolution to the already-correct .html or /index.html artifacts. Do not disable SEO globally: that would also disable prerendering and platform noindex behavior.

## Rick's handoff

1. Review the checkpoint and existing unpublished work together. This preserves the prior work; it does not certify all unrelated unpublished changes for release.
2. In https://app.base44.com/apps/691f41a18de4a7f498c8f884/editor choose Publish → Publish App when ready.
3. Re-run the dual-agent checks after Base44 refreshes. If the initial response still falls back, send the prepared Customer Care request with its exact URL list. The task remains open until clean initial responses consistently identify their intended page.
4. Then inspect Google's exact email issue examples in direct Search Console and validate the repaired video-date issue. Index counts and traffic impact remain unverified; Windsor's account-limit placeholder zeros are not measurements.

Rollback: pre-repair checkpoint 6ae245b623cbef03fadb1399, “Preserve unpublished work before search and video repairs — Oct 28 2026,” based on 646d35e993789d39365e1dabe2fd85b0be7ccc0d. Restoring it also removes these repairs, so coordinate rollback with Rick's other pending work.
