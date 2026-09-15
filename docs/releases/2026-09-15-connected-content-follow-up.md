# Connected content and first-project clarity — 2026-09-15

Status: code saved and checked; public publication and post-publication review pending.
App: New Tech Advertising, 691f41a18de4a7f498c8f884.
Restore point before this change: 6aa99fd9f8b7f26c4baead68 (commit 7c9fd6382cb7dccfbd6c355b942d0ae8db07a853).

## Approved purpose
Make the existing NTA site and first engagement easier to understand. Connect articles, lessons and videos to relevant learning, the Growth Guide, a Gap Audit and a requested personal follow-up. Preserve the custom Growth Roadmap and first-project approach.

## Changes
- Home and Services explain the Growth Roadmap, agreed scope/cost/responsibilities, focused first project and review. /services#first-project scrolls to the explanation.
- Journal issues, canonical articles, Knowledge Library lessons, question pages, NTA Point of View articles and Growth Show episode templates include consistent next steps.
- Related videos use explicit published episode-to-content relationships. Canonical articles use recorded related articles/lessons and linked Journal issues. No private or guessed video links are added.
- Journal section Markdown now renders embedded links and formatting.
- The Guide receives the selected topic, prepares an editable question and stays closed until chosen.
- Choosing personal follow-up from the Guide carries the visitor question as an editable navigation-state draft, outside the URL.
- Contact offers email, call or text. It carries the topic, source page, visitor message and chosen reply method into the existing verified intake. Those notes reach the Core Submission, opportunity, follow-up task and notification.
- Personal follow-up and Journal subscription are separately described. Viewing content never creates a submission.
- Contact displays saved confirmation only for a confirmed Submission ID. Failure preserves the message; repeated clicks during submission do not create another request.

## Verification
- Production build passed, including 168 public SEO URLs and 963 legacy/alias outputs.
- 82 targeted checks passed: content relationships and URL filtering, follow-up interactions, existing visitor/route boundaries, Growth Show relationships, backend auth boundaries and visitor verification client.
- Strict security preflight: 366 functions, 737 entities; 0 critical, high or medium findings.
- Live public-to-Core authentication passed for all three existing receivers. The probe creates no leads, audits or emails.
- Edited page/component/helper lint passed before the final small handoff and anchor refinements; the final build and interaction checks passed afterward.
- Responsive classes and reachable form controls were reviewed in source. No desktop/mobile browser screenshot review or live follow-up submission was performed for this release.

## Release
The connected tools do not expose the final Base44 Publish control. Open the public New Tech Advertising app and click Publish. Then review one Journal issue, one lesson, a Growth Show episode, the first-project anchor, the Guide handoff and a personally approved follow-up submission.

## Prior audit-review items outside this public presentation change
The fresh Gap Audit was received by Rick. Its Core record confirms provider acceptance, not an independently observed delivered event. The generator's recipient lookup still needs a separate correction: it used the existing lead email instead of the email on the fresh submission. The report generator also needs a separate evidence-quality review before treating its directional score or unverified follow-up observations as measured findings.
