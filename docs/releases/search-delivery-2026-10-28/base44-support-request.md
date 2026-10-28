# Prepared Base44 Customer Care request — not sent

App: New Tech Advertising, 691f41a18de4a7f498c8f884
Domain: https://newtechadvertising.com
Repository: newtechad1-cyber/new-tech-advertising

Please manually refresh the saved prerenders for the URLs below and investigate clean-path delivery. Requests can return the homepage title, H1 and canonical even though the explicit .html and /index.html artifacts contain correct page-specific HTML. Googlebot snapshots and ordinary initial responses differ. Two Business Planning Guide routes failed on the first full Googlebot pass and recovered on a separate recheck. All 37 listed URLs recovered for Googlebot on that recheck, while ordinary requests still received homepage HTML. A successful rendered-browser visit does not resolve the initial-HTTP issue.

Please ensure a missing/stale snapshot cannot identify an inner URL as the homepage; check path matching and fallback metadata. Please also resolve generated route-specific HTML before the root SPA fallback, serving HTML with the correct content type and intended clean canonical. Preserve existing intentional private/admin/retired noindex rules; do not turn SEO off globally. Confirm whether a publish refresh is sufficient or whether platform routing/cache correction is required.

The source already generates distinct .html and /index.html files. Source repairs also register the five Business Planning Guide routes natively. The attached repository evidence preserves first responses and later rechecks. Please refresh the custom domain copies, not only the free Base44 domain.

Original 37 initially flagged URLs (evidence list, not a Google exclusion count):

https://newtechadvertising.com/accessibility
https://newtechadvertising.com/business-planning-guide/questions/borrow-money-or-start-small
https://newtechadvertising.com/business-planning-guide/questions/how-much-money-to-start-small-business
https://newtechadvertising.com/business-planning-guide/questions/is-my-business-idea-worth-pursuing
https://newtechadvertising.com/business-planning-guide/questions/start-a-business-while-working-full-time
https://newtechadvertising.com/business-planning-guide/questions/start-business-without-running-one-before
https://newtechadvertising.com/growth-show/nta-growth-show-episode-2
https://newtechadvertising.com/growth-systems-vs-campaigns
https://newtechadvertising.com/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it
https://newtechadvertising.com/knowledge/ai-foundations/ai-does-not-have-to-be-a-monster
https://newtechadvertising.com/knowledge/ai-foundations/i-see-artificial-intelligence-differently
https://newtechadvertising.com/knowledge/business-foundations/what-building-my-own-digital-growth-office-taught-me
https://newtechadvertising.com/knowledge/how-businesses-turn-trust-into-lasting-relationships
https://newtechadvertising.com/knowledge/how-customers-decide-who-to-trust/people-trust-what-they-can-understand
https://newtechadvertising.com/knowledge/how-customers-decide-who-to-trust/trust-means-putting-the-relationship-before-the-transaction
https://newtechadvertising.com/knowledge/questions/am-i-paying-for-too-many-ai-tools
https://newtechadvertising.com/knowledge/questions/can-ai-help-me-stop-starting-over-every-day
https://newtechadvertising.com/knowledge/questions/do-i-need-a-perfect-prompt
https://newtechadvertising.com/knowledge/questions/do-i-need-the-newest-ai-model-for-my-business
https://newtechadvertising.com/knowledge/questions/how-can-employees-use-ai-at-work
https://newtechadvertising.com/knowledge/questions/how-do-i-compare-ai-cost-with-business-value
https://newtechadvertising.com/knowledge/questions/how-do-i-give-different-ai-tools-different-jobs
https://newtechadvertising.com/knowledge/questions/how-do-i-know-what-my-customers-really-need
https://newtechadvertising.com/knowledge/questions/is-social-media-enough-for-a-small-business
https://newtechadvertising.com/knowledge/questions/is-using-ai-the-same-as-multitasking
https://newtechadvertising.com/knowledge/questions/should-a-small-business-still-advertise-on-tv
https://newtechadvertising.com/knowledge/questions/which-business-decisions-should-ai-not-make
https://newtechadvertising.com/knowledge/questions/why-do-customers-say-one-thing-and-do-another
https://newtechadvertising.com/knowledge/questions/why-should-a-business-listen-before-selling
https://newtechadvertising.com/knowledge/turning-what-a-business-knows-into-an-asset/customer-questions-reveal-what-the-business-should-teach
https://newtechadvertising.com/knowledge/turning-what-a-business-knows-into-an-asset/your-business-knows-more-than-it-has-documented
https://newtechadvertising.com/knowledge/what-is-digital-trust/what-is-digital-trust
https://newtechadvertising.com/knowledge/what-is-digital-trust/why-traditional-marketing-is-no-longer-enough
https://newtechadvertising.com/learning-center/videos/MsiyOAZrCNo
https://newtechadvertising.com/our-story
https://newtechadvertising.com/our-work
https://newtechadvertising.com/web-accessibility-trust

Additional live canonical mismatch observed outside that list:
https://newtechadvertising.com/journal/the-free-ai-guy-comes-to-life (returned https://newtechadvertising.com/journal for Googlebot).

Expected acceptance: repeated initial HTTP requests with Googlebot and ordinary user agents return each URL’s own title, heading and intended canonical; directives remain appropriate. Explicit HTML variants must keep the clean URL canonical.

Additional directive evidence: /AdminMetaSetup correctly returned noindex. /agency/AgencyClientCMS and /definitely-not-a-real-page returned an indexable homepage fallback, despite source cleanup/unknown-path metadata being noindex. Please preserve those source directives in the initial response; do not solve the public canonical issue by removing noindex globally. Evidence: live-private-and-retired-directives.json.
