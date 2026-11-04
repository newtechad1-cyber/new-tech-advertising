# F3 test coverage: discovery, content follow-up and video library

Original inventory baseline: `0279a89b1b930ed65cb2f7103e13dde01c98c544` (merged PR #106).
Batch-two baseline: `b5e239e185c8e09cf1ab339402140e097a2483e9` (merged PR #107).
Batch-three baseline: `29b2eac46e147952f23df757ac34dde5e258741b` (merged PR #108).
This is a scoped wiring inventory, not a runtime audit or an all-tests result.
The source of truth for executed results is the candidate's GitHub Actions log.
An unmerged candidate is not active coverage on main.

## Why this batch

The first independent review identified 15 tests without npm wiring and a
podcast suite outside the release gate. Its follow-up recommended separating
F3 from the F2 repair and checking existing tests before enabling them.
PR #107 added three discovery files and PR #108 added two content-to-inquiry
files, with their assertions unchanged. Batch three selects growth-show,
video-gallery and youtube-learning-identity, also unchanged. Application source,
page wording, dependencies and the F2/IndexNow fixes are unchanged.

The new `test:video-library` command is appended with `&&` after the exact
PR #108 `check:ci` chain, including discovery and content follow-up. Existing
tests and their order are preserved; a nonzero exit still fails the job.
GitHub's existing no-network step runs the extended chain. No live diagnostic,
YouTube request, email, interpretation request or URL submission is added.

The selected 19 cases exercise real implementation with fixture data:
- growth-show: six helper cases covering explicit classification, connected
  episode/lesson/Journal relationships, migrated records, editorial overlays,
  exclusion/order and lookup.
- video-gallery: five cases execute the real parser/handler with mocked auth,
  environment and fetch; three exercise real gallery merge/filter helpers.
  They cover parsing, rejected input, request guards, simulated caching/rate
  limits, explicit errors, deduplication, safe destinations and topic/search.
  Existing TypeScript and fast-xml-parser dependencies are needed for this suite.
- youtube-learning-identity: five helper cases for permanent lesson identity,
  source-slug and legacy fallbacks, and matching related videos.

These are runtime tests, not browser or production tests. Fixtures cannot prove
current YouTube visibility, live access, player behavior, deployed rate limits,
Base44 environment values or correctness of all live episode relationships.
The separate podcast suite and tracked-feed-output risk remain outside this batch.

## Baseline inventory and disposition

These 16 files existed under `tests/` but were not reached by the original
PR #106 release workflow or its recursively invoked npm scripts. PR #107
covered three and PR #108 covered two; batch three proposes three more,
leaving eight ungated after approval. Until then, main still has 11 ungated.
The first 15 had no npm test
command; `growth-show-podcast` already had `test:podcast`, but was not gated.
All names below end in `.test.mjs`. No remaining file has been deleted, retired
or declared correct merely because it is deferred.

| File stem | Current / proposed disposition | Evidence / next action |
| --- | --- | --- |
| discovery-input-mode | Required since PR #107 | Five source-structure cases: voice/text choices, microphone recovery, consent guards, saved-answer progression and storage-failure handling. Not browser or backend execution. |
| discovery-question-selection | Required since PR #107 | Two runtime selector cases. Imports the dependency-free walkthrough module; no service calls. |
| discovery-trigger-routing | Required since PR #107 | Four source-structure cases for the fixed internal transport, credential forwarding and event guards. Does not execute the backend handler. |
| content-journey | Required since PR #108 | Five runtime helper cases: context handoff without private query values, rejected destinations, safe learning links, published video relationships and follow-up details. Verify all five in the candidate log. |
| content-follow-up-form | Required since PR #108 | Four runtime Contact.jsx harness cases: reply preference, one in-flight submission with context, failed/unconfirmed response handling and an editable unsent Guide draft. Uses existing locked TypeScript and React; verify all four in the candidate log. |
| growth-show | Batch three: add unchanged | Six helper-runtime cases; require fresh isolated execution of all six. |
| video-gallery | Batch three: add unchanged | Eight runtime cases: five parser/handler cases with mocked services and three gallery-helper cases. Require dependency-complete execution. |
| youtube-learning-identity | Batch three: add unchanged | Five helper-runtime identity/fallback cases; require fresh isolated execution of all five. |
| ai-confusion-lesson | Still ungated | Prior review reported failures, including absent build output. Separate artifact availability from assertion/content questions. |
| ai-foundations-conversation-lesson | Still ungated | Prior source-test failure; verify approved meaning before changing source or expectations. |
| ai-foundations-editorial | Still ungated | Prior source-test failure; verify approved meaning before changing source or expectations. |
| brand-positioning | Still ungated | Prior wording mismatch; compare with approved NTA positioning, not majority AI opinion. |
| homepage-business-audiences | Still ungated | Prior failures include absent build output; rerun with artifacts and review wording separately. |
| homepage-live-review | Still ungated | Prior source-test failures; content/structure review required. |
| talk-to-my-office-homepage | Still ungated | Prior source-test failures; content/structure review required. |
| growth-show-podcast | Still ungated | Existing test:podcast is not required by check:ci. Reproduce separately before enabling. |

Historical reviewer results above are leads for triage, not fresh results for
this commit and not proof of a live application defect. Lint and typecheck also
remain open. Do not repeat the withdrawn expanded-suite counts from the first
PR #106 evaluation: its build stopped before that suite ran.

## Verification and review

Before readiness, inspect the actual candidate Actions log, not just its badge.
Require the entire previous gate, including all 11 discovery and nine content
follow-up cases, to finish. Then `test:video-library` must actually run and
report 19 passing cases, zero failed and zero skipped. Confirm all eight gallery
cases individually, not just the group total. The release-check safeguard must
reject removing the appended command, omitting any of the three files,
suppressing failures, dropping an earlier batch or reordering the prior chain.
The new guard is structural; the existing Node tests still determine pass/fail.

Claude reviews the exact base-to-head difference before Rick considers merging.
Passing this batch establishes only these automated checks. It does not verify
microphones, browser validation, live consent, Turnstile, Core delivery, mailbox
receipt, current podcast data, YouTube availability/visibility, video playback,
indexing or sales. The form harness replaces
React hooks and the verified submission client; it is not an end-to-end test.
Read the actual run for this candidate, not historical reviewer results.

Candidate builds remain disposable and must not be published or committed.
The tracked generated-feed risk from PR #106 remains open; no output-path or
working-tree guard is implemented here. No new schedule, service or paid model
connection is activated. Rollback before approval is to leave the draft unmerged;
after approval, revert only this batch to restore the previous gate.
