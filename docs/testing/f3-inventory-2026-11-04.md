# F3 test coverage: discovery, content follow-up, video, podcast and lessons

Original inventory baseline: `0279a89b1b930ed65cb2f7103e13dde01c98c544` (merged PR #106).
Batch-two baseline: `b5e239e185c8e09cf1ab339402140e097a2483e9` (merged PR #107).
Batch-three baseline: `29b2eac46e147952f23df757ac34dde5e258741b` (merged PR #108).
Batch-four baseline: `800cbdb2e03fe53fd9a5c1ffc0bb98f7c3986e18` (merged PR #109).
Batch-five baseline: `721b967571447d328729d8f8ea9a9c55947e9ecb` (merged PR #110).
This is a scoped wiring inventory, not a runtime audit or an all-tests result.
The source of truth for executed results is the candidate's GitHub Actions log.
An unmerged candidate is not active coverage on main.

## Why this batch

The first independent review identified 15 tests without npm wiring and a
podcast suite outside the release gate. Its follow-up recommended separating
F3 from the F2 repair and checking existing tests before enabling them.
PR #107 added three discovery files and PR #108 added two content-to-inquiry
files, with their assertions unchanged. PR #109 added growth-show,
video-gallery and youtube-learning-identity. PR #110 appended test:podcast.
Batch five appends `test:lesson-content` with `&&` after that exact chain.
It corrects only the three lesson-test assumptions independently reviewed
following diagnostic PR #111. That diagnostic remains unmerged; its temporary
workflow and scope document are not part of this candidate.
Application source, lesson wording, media, dependencies, the lockfile, existing
workflows and the F2/IndexNow fixes are unchanged. Earlier test commands and
their order are preserved; a nonzero exit still fails the job.
GitHub's existing no-network step runs the extended chain. No live diagnostic,
YouTube request, email, interpretation request or URL submission is added.

The lesson batch has 14 existing cases across three suites:
- ai-confusion-lesson: seven cases. Find the established predecessor by slug,
  not the penultimate array position. Retain identity/content uniqueness,
  reciprocal navigation, related links, source links, native-route wiring,
  no invented media and both real generated HTML forms.
- ai-foundations-conversation-lesson: three cases. Parse the AI sitemap and
  require exactly one lesson record with the established full canonical URL
  across its knowledge collections. The sitemap stores canonicalUrl, not slug.
  Retain the XML occurrence check, canonical lesson identity, publishing package
  and every human-responsibility teaching assertion.
- ai-foundations-editorial: four cases. Keep the seven-core-foundations and
  AI-in-Practice distinction, section boundary, completion and negative checks;
  require the forward handoff without freezing the number of future lessons.
  Only that case title and transition assertion change. The other assertions
  remain intact. The existing 12-lesson uniqueness/punctuation source inventory
  covers the original lessons 1-12, NOT the full 21-lesson curriculum. Expanding
  that scope and correcting its broad title remain separate follow-up work.

Most of these are source/data checks. The confusion suite also executes real
curriculum helpers and reads candidate HTML. The conversation sitemap assertion
reads regenerated public files after build:ci in CI, but committed files when
run standalone before a build. None is a live search or browser test.

The retained video-library batch has 19 cases with fixture data:
- growth-show: six helper cases covering explicit classification, connected
  episode/lesson/Journal relationships, migrated records, editorial overlays,
  exclusion/order and lookup.
- video-gallery: five cases execute the real parser/handler with mocked auth,
  environment and fetch; three exercise real gallery merge/filter helpers.
  They cover parsing, rejected input, request guards, simulated caching/rate
  limits, explicit errors, deduplication, safe destinations and topic/search.
  Existing TypeScript and fast-xml-parser dependencies are needed for this suite.
- youtube-learning-identity: five helper-runtime identity/fallback cases for
  permanent lesson identity, source-slug and legacy fallbacks, and related videos.

These are runtime tests, not browser or production tests. Fixtures cannot prove
current YouTube visibility, live access, player behavior, deployed rate limits,
Base44 environment values or correctness of all live episode relationships.
The retained podcast batch has three unchanged cases in growth-show-podcast:
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

The podcast command itself does not build or rewrite the feed. In check:ci the
earlier candidate build rewrites public/growth-show.xml using checked-in records,
so the test checks that candidate file, not the public URL or necessarily the
originally committed XML. The standalone test checks the file on disk.
The build also rewrites tracked public/ai-sitemap.json, public/sitemap.xml and
public/llms.txt through scripts/generate-seo-pages.mjs. The earlier feed-only
warning understated this existing risk. These generators and outputs are not
changed or repaired by this patch. Disposable output must not be committed or
published; no clean-working-tree or separate-output-path guard is added here.

## Baseline inventory and disposition

These 16 files existed under `tests/` but were not reached by the original
PR #106 release workflow or its recursively invoked npm scripts. PR #107
covered three, PR #108 covered two, PR #109 covered three, and PR #110 covered
the podcast file. Main therefore has seven of these files still ungated.
Batch five proposes the three corrected lesson suites, leaving four ungated
only after review, approval and merge. The first 15 had no npm test command;
`growth-show-podcast` already had `test:podcast`, but was not originally gated.
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
| ai-confusion-lesson | Batch five: correct and add | Seven cases; stable-identity predecessor plus preserved assertions. Requires actual generated HTML after build:ci. |
| ai-foundations-conversation-lesson | Batch five: correct and add | Three cases; exact canonicalUrl count, not a nonexistent slug field. Verify regenerated sitemap and retained XML count. |
| ai-foundations-editorial | Batch five: correct and add | Four cases; preserve seven-core/practice distinction without a fixed future lesson count. Original uniqueness inventory covers only lessons 1-12. |
| brand-positioning | Still ungated | Positioning decisions remain; both Home and About need review. Keep the retired-agency prohibition. No brand wording is approved by this patch. |
| homepage-business-audiences | Still ungated | Shared FAQ repair is deferred with the four homepage/content failures. Keep truthful client-example and current-content decisions explicit. |
| homepage-live-review | Still ungated | Inspect the current verified Guide mechanism and current homepage contract. No direct-call text substitution in this batch. |
| talk-to-my-office-homepage | Still ungated | Current Guide labels/navigation need appropriate behavior checks; confirm-before-action placement remains Rick's decision. |
| growth-show-podcast | Required since PR #110 | Three runtime/local-file cases after the candidate build; not a live-feed or audio-listening test. |

Diagnostic PR #111 ran the seven unchanged remaining suites after a real build:
37 cases, 19 passed, 18 failed, none skipped. The independent review reproduced
all non-build discrepancies but could not access the authenticated CI log and
had no dist output. Do not present that review as a second observed CI run.
Its sitemap diagnosis is a test field-assumption error, not a duplicate lesson
or obsolete title. The candidate's new execution, not the diagnostic baseline,
must determine whether all 14 lesson cases now pass.

Lint/typecheck, F4-F7, PR #104, generated-output handling and live verification
remain open. The reviewer also raised a plausible repeated-retry issue in the
Guide; it is unconfirmed, needs a runtime check and is outside this patch.
Do not repeat the withdrawn expanded-suite counts from the first PR #106
assessment or the withdrawn initial 20/17 report from PR #111.

## Verification and review

Before readiness, inspect the actual candidate Actions log, not just its badge.
Require the entire previous gate, including 11 discovery, nine content-follow-up,
19 video-library and three podcast cases, to finish. Then test:lesson-content
must actually run all 14 cases, zero failed, skipped or cancelled. Confirm the
confusion lesson's generated HTML case and the conversation lesson's exact-one
sitemap case individually after the build. No substitute dist files are valid.
The release-check safeguard must reject removing the appended command, replacing
any of its three paths, suppressing failures, dropping an earlier batch or
reordering the prior chain. Exercise mutations as evidence of that guard.
The guard is structural; the actual Node tests still determine pass/fail.

Claude reviews the exact base-to-head difference before Rick considers merging.
Passing this batch establishes only these automated checks. It does not verify
microphones, browser validation, live consent, Turnstile, Core delivery, mailbox
receipt, current podcast data, YouTube availability/visibility, video playback,
indexing or sales. The form harness replaces React hooks and the verified
submission client; it is not an end-to-end test. Homepage crawler-visible FAQ
schema and all four deferred content suites are outside this batch.
Read the actual run for this candidate, not historical reviewer results.

Candidate builds remain disposable and must not be published or committed.
The generated-output risk remains open; no output-path or working-tree guard
is implemented here. No new schedule, service or paid model connection is
activated. Rollback before approval is to leave the draft unmerged; after
approval, revert only this batch to restore the PR #110 gate. Leave diagnostic
PR #111 unmerged. Rick remains merge approver and Base44 publisher.
