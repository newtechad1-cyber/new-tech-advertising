# F3 homepage/Guide batch: approved wording, current content contract

Baseline: `cd13460dfe1c4806e95a135e137049bc6440bcba` (merged PR 112).
Status: draft prepared for execution and independent review. No passing result
is claimed by this scope document; the PR conversation records observed runs.

## Rick's approval

Rick replied "I approve" to the two proposed wording changes while retaining
the current homepage layout and Guide assets:

- Both navigation Guide buttons: **Ask the Guide**, with the accessible name
  **Open Your Digital Growth Guide**. The desktop title is aligned too.
- Beside the primary hero Guide entrance: **We’ll confirm what we heard before
  recommending a next step. You stay in control of important decisions.**

Only `HeroSection.jsx` and `MarketingNav.jsx` change application source. The
Guide implementation, assets, routes, contacts, handlers, backend, consent and
tracking mechanisms are unchanged. The reminder is a visible commitment, not
proof of runtime enforcement. The existing static SEO shell keeps its current
human-control message; this patch does not alter the generator or claim that
its initial HTML contains the new exact reminder or homepage FAQ schema.

## Decisions carried into the four existing suites

The previous inventory's four pending homepage/positioning files are the scope
of this draft. No files are deleted, skipped or retired. Their 23 top-level
cases remain, with case names changed where the old names described a retired
design or overclaimed behavioral coverage. They are appended as `test:homepage`
after the exact complete previous `check:ci`, including the lesson batch.
The full-chain and new-command equality guards fail on omission/reordering.

| File | Cases | Updated contract and retained protections |
| --- | ---: | --- |
| brand-positioning | 3 | Education AND Digital Growth Office; verify Home's imported/rendered identity and About's actual teaching/owner-authority wording rather than one literal in every file. Keep the retired-agency prohibition on all eight original surfaces. Require the actual approved combined sitemap topic. |
| homepage-business-audiences | 8 | Preserve the concise question-first sequence; keep industry links in the active nav, valid destination anchors, truthful restaurant progress status, shared visible/structured FAQ wiring, all retail/restaurant distinctions, description consistency and real built homepage next steps. Do not restore removed homepage client/publication blocks. |
| homepage-live-review | 5 | Historical filename, no live requests. Keep publication destinations in active navigation, the retained card's existing artwork invariant, current Guide identity/assets, verified request wrapper, knowledge fallback and all safe-link checks. Execute the same sanitizer cases in an isolated VM. |
| talk-to-my-office-homepage | 7 | Historical filename. Protect both Guide entrances, current close/minimize cleanup, visitor-triggered opening, mobile keyboard/scroll source paths, verified response/fallback/retry affordances, unchanged voice-draft and fresh-state assertions, and the approved reminder with existing human authority. |

Most of these checks still inspect source text. One evaluates only the FAQ
array literal plus its wiring, one executes the actual extracted scroll effect
against a stub document, one executes the extracted reply sanitizer, and one
reads the real post-build homepage HTML. These are not end-to-end browser tests.
No assertion of real accessibility, provider verification, inquiry delivery,
playback, actual transcript handling or correct repeated retry is justified.
The Guide retry concern remains explicitly open; presence of its control is
not correctness, and this draft changes no Guide behavior.

The FAQ data VM receives no process, filesystem, document or fetch. The scroll
effect VM receives only the stub document when invoked. The sanitizer VM gets
only URL. All test execution should still occur with outbound networking
blocked and production/session credentials removed. No substitute dist files
are authorized. The standalone homepage case fails without a real build.

## Source and preview boundaries

GitHub main is the reviewed code baseline. Base44 main was inspected and its
homepage files matched, but its package commands lagged the merged podcast and
lesson batches. It was NOT overwritten or merged. A private Base44 preview
branch, `review/approved-guide-copy-2026-11-05`, holds only the two approved
component edits. It is a copy preview, not evidence of full GitHub/source parity.
Do NOT merge that stale preview branch into main. After Rick approves the
GitHub merge, reconcile Base44 against merged main, recheck preview, then let
Rick publish. A saved branch/checkpoint is not a public release.

## Acceptance and limits

Read the exact candidate's authenticated CI log: full prior chain must pass,
then all 23 homepage cases must pass without failures or skips, including the
real built HTML case. Inspect the actual diff before accepting dependency,
handler and asset invariance. Independently review the changed assertions and
their intended protections, rather than rubber-stamping a green badge.

If merged, this addresses the last four original ungated test files (all 16
original files including the already-named podcast suite are then connected).
That is not completion of F3: lint/typecheck and broad test coverage are still
open. The editorial inventory still covers lessons 1–12 rather than all 21.
Generated tracked files can still be rewritten by builds; use disposable
checkouts and never commit or publish candidate artifacts. F4–F7, PR 104 and
live verification remain separate. Leave diagnostic PR 111 unmerged.

No dependency upgrade, lockfile change, workflow change, generator edit,
permission change, real inquiry, message, IndexNow submission, main merge or
publication is part of preparing this draft. A later merge touches src and can
trigger the existing main-only IndexNow workflow; that unchanged behavior may
notify search engines before Rick's manual Base44 publication.
