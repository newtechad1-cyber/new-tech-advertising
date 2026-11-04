# F3 test coverage: discovery, content follow-up, video library and podcast

Original inventory baseline: `0279a89b1b930ed65cb2f7103e13dde01c98c544` (merged PR #106).
Batch-two baseline: `b5e239e185c8e09cf1ab339402140e097a2483e9` (merged PR #107).
Batch-three baseline: `29b2eac46e147952f23df757ac34dde5e258741b` (merged PR #108).
Batch-four baseline: `800cbdb2e03fe53fd9a5c1ffc0bb98f7c3986e18` (merged PR #109).
This is a scoped wiring inventory, not a runtime audit or an all-tests result.
The source of truth for executed results is the candidate's GitHub Actions log.
An unmerged candidate is not active coverage on main.

## Why this batch

The first independent review identified 15 tests without npm wiring and a
podcast suite outside the release gate. Its follow-up recommended separating
F3 from the F2 repair and checking existing tests before enabling them.
PR #107 added three discovery files and PR #108 added two content-to-inquiry
files, with their assertions unchanged. PR #109 added growth-show,
video-gallery and youtube-learning-identity. Batch four appends the existing
`test:podcast` command with `&&` after the exact PR #109 `check:ci` chain,
including all three earlier batches. The podcast test file, its assertions,
application source, media, dependencies and the F2/IndexNow fixes are unchanged.
Existing tests and their order are preserved; a nonzero exit still fails the job.
GitHub's existing no-network step runs the extended chain. No live diagnostic,
YouTube request, email, interpretation request or URL submission is added.

The retained video-library batch has 19 cases with fixture data:
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
The new podcast batch has three unchanged cases in growth-show-podcast:
- Eight incomplete-metadata variants are rejected by the real readiness and RSS
  helpers; the episode helper leaves their audio URL empty.
- Generated XML is valid, escapes teaching text, retains the tested stable GUID
  and declared audio MIME type, and excludes a draft and duplicate identity.
- Local feed item count matches the ready checked-in audio metadata count;
  enclosure lengths match local file sizes, MIME types are declared audio/mpeg,
  and GUIDs are unique. This is not exact expected-GUID-set validation.

The suite imports existing fast-xml-parser plus dependency-free repository
modules, uses fixtures and local read/stat operations, and makes no service call.
It does not decode or listen to audio or compare audio hashes, despite the third
test's broad title. Stored sound/seek/completeness flags are not new observation.
It cannot verify deployed MIME headers, HTTP byte ranges, playback, directory
acceptance, live-feed freshness or the full content of an episode.

The command itself does not build or rewrite the feed. In check:ci the earlier
candidate build already rewrites public/growth-show.xml using checked-in records,
so this added step checks that candidate file, not the public URL or necessarily
the originally committed XML. The standalone test checks the file on disk.
The generator, media and XML are not edited in this patch. The tracked-feed-output
risk remains open; this batch neither fixes nor conceals it.

## Baseline inventory and disposition

These 16 files existed under `tests/` but were not reached by the original
PR #106 release workflow or its recursively invoked npm scripts. PR #107
covered three, PR #108 covered two, and PR #109 covered three. Batch four
proposes the podcast file, leaving seven ungated after approval. Until then,
main still has eight ungated.
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
| growth-show | Required since PR #109 | Six helper-runtime cases; require fresh isolated execution of all six. |
| video-gallery | Required since PR #109 | Eight runtime cases: five parser/handler cases with mocked services and three gallery-helper cases. Require dependency-complete execution. |
| youtube-learning-identity | Required since PR #109 | Five helper-runtime identity/fallback cases; require fresh isolated execution of all five. |
| ai-confusion-lesson | Still ungated | Prior review reported failures, including absent build output. Separate artifact availability from assertion/content questions. |
| ai-foundations-conversation-lesson | Still ungated | Prior source-test failure; verify approved meaning before changing source or expectations. |
| ai-foundations-editorial | Still ungated | Prior source-test failure; verify approved meaning before changing source or expectations. |
| brand-positioning | Still ungated | Prior wording mismatch; compare with approved NTA positioning, not majority AI opinion. |
| homepage-business-audiences | Still ungated | Prior failures include absent build output; rerun with artifacts and review wording separately. |
| homepage-live-review | Still ungated | Prior source-test failures; content/structure review required. |
| talk-to-my-office-homepage | Still ungated | Prior source-test failures; content/structure review required. |
| growth-show-podcast | Batch four: add unchanged | Existing test:podcast; three runtime/local-file cases. Require dependency-complete execution after the candidate build; not a live-feed or audio-listening test. |

Historical reviewer results above are leads for triage, not fresh results for
this commit and not proof of a live application defect. Lint and typecheck also
remain open. Do not repeat the withdrawn expanded-suite counts from the first
PR #106 evaluation: its build stopped before that suite ran.

## Verification and review

Before readiness, inspect the actual candidate Actions log, not just its badge.
Require the entire previous gate, including 11 discovery, nine content-follow-up
and 19 video-library cases, to finish. Then `test:podcast` must actually run and
report three passing cases, zero failed and zero skipped. Confirm each podcast
case individually, including the local enclosure-size case. Distinguish the
post-build candidate feed from the originally committed feed. The release-check
safeguard must reject removing the appended command, replacing its test path,
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
