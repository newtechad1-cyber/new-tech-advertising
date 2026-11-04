# Base44 App

## Candidate code and published-site checks

Use Node 22 and the committed lockfile. Code verification and live-site
verification are different results; neither authorizes a merge or publication.

### Before review / merge

```sh
npm ci --ignore-scripts --no-audit --no-fund
node --test tests/indexnow.test.mjs tests/release-checks.test.mjs
npm run check:ci
```

`check:ci` retains the pre-PR-106 strict source security audit and named tests,
in their existing order: backend authentication, Growth Guide, route governance,
candidate build, public boundary/SEO/search/video/journey/tracking/reporting tests,
Core bridge tests, and the local Core rollout-record check. The build precedes
all tests that inspect its generated output. The rollout-record check is not
proof that the live connection works. The first F3 batch appends
`npm run test:discovery` after that unchanged chain. The second F3 batch appends
`npm run test:content-follow-up` after discovery, preserving the full PR #107
chain byte-for-byte. The third F3 batch appends `npm run test:video-library`
after content follow-up, preserving the full PR #108 chain byte-for-byte.
The fourth F3 batch appends the existing `npm run test:podcast` command after
video library, preserving the full PR #109 chain byte-for-byte.
`check:release` remains an alias for `check:ci`.

The necessary F2 build separation is explicit: `build:ci` runs the normal Vite
production lifecycle with `NTA_PODCAST_BUILD_MODE=candidate-offline` in its child
process only. The podcast generator uses the existing checked-in episode and
verified-audio records without refreshing the live GrowthShowEpisode entity.
The same generator, audio size/hash checks and SEO output generation still run.
There is no network-error fallback and no skipped build. This candidate-only
output is NOT for publication and does not prove that live episode data is current.
The workflow neither uploads nor deploys it.

Normal `npm run build` and Base44's direct Vite invocation remain unchanged:
without that explicitly selected mode the podcast generator refreshes live
records and fails on refresh errors, rather than silently publishing seed data.
Do not set NTA_PODCAST_BUILD_MODE=candidate-offline in a publishing environment.

GitHub installs dependencies first, without lifecycle scripts. It then runs
candidate checks in a Linux network namespace with no external network, as the
unprivileged runner user and without the GitHub/production environment. There is
no network-enabled fallback if isolation fails. Standalone npm commands do not
provide OS-level isolation: review tests and use an isolated workspace without
production credentials. The dependency-free safeguards mock network/subprocess
operations. The real candidate gate must pass in GitHub before readiness is assessed.

### F3: discovery, content follow-up, video library and podcast; coverage is still open

`npm run test:discovery` runs the three existing discovery-input-mode,
discovery-question-selection and discovery-trigger-routing test files. They
are also required by `check:ci`. Their assertions and application source are
unchanged. The two question-selection cases execute the selector; the other
nine cases inspect source structure. Passing is not proof of microphone access,
consent enforcement in production, interpretation delivery or a complete journey.

`npm run test:content-follow-up` runs the existing content-journey (five cases)
and content-follow-up-form (four cases) suites, unchanged. The first executes
the real content-context, safe-link and follow-up helpers. The second executes
Contact.jsx in a controlled harness with simulated hooks and submission results.
It covers reply preference, one in-flight submission, retained questions after
failure, confirmed-save feedback and an editable Guide draft that is not sent
automatically. It uses TypeScript and React from the committed lockfile.
These are runtime checks, not a real browser, Turnstile, Core or delivery test.
They do not prove browser field validation, mailbox receipt or live consent.
No real inquiry, email, text or call is made.

`npm run test:video-library` runs three existing suites unchanged: growth-show
(six cases), video-gallery (eight), and youtube-learning-identity (five).
The Growth Show and identity suites call real helpers with fixture records.
The gallery suite has three helper cases and five cases that execute the real
playlist parser/handler in a VM, with Base44 identity, environment and fetch
replaced by test doubles. TypeScript and fast-xml-parser are already committed
dependencies; this batch does not add or upgrade packages. These 19 runtime
cases cover episode relationships/classification, parsing and rejected input,
request guards/caching/rate limits in the simulated handler, archive merging,
filtering and stable lesson identity. They do not verify actual YouTube access,
current public/private video status, real playback, browser rendering, live
rate limiting, or the deployed Base44 function. No real YouTube request is made.

`npm run test:podcast` runs the existing growth-show-podcast suite unchanged.
Its three cases execute the real readiness, RSS and episode helpers and read
local files. They check eight incomplete-metadata variants; XML validity,
escaped teaching text, stable identity, deduplication and draft exclusion; and
local feed counts, unique GUIDs, declared MIME type and enclosure file sizes.
It uses the already locked fast-xml-parser package and checked-in audio files.
In `check:ci` it runs after the existing candidate build has generated the
seed-based feed. The standalone command only reads the feed already on disk.

Despite the third test's title, it does not decode or listen to MP3s, compare
audio hashes, verify sound quality/completeness, or check HTTP playback/seeking.
Readiness booleans are stored assertions, not a new listening review. The count
and GUID checks are not an exact comparison of every expected episode identity.
No feed is fetched from the published site and no podcast directory is contacted.
The generator, public XML, audio metadata and media files are unchanged by this
batch. Passing does not establish live-feed freshness or fix the tracked-feed
candidate-output risk described below.

The [F3 inventory](docs/testing/f3-inventory-2026-11-04.md) records the 16 test
files outside the original gate: three covered by PR #107, two by PR #108,
three by PR #109, and the podcast suite proposed in this fourth batch, leaving
seven ungated after its approval (eight on main until then). No test is retired
or silently skipped.
This does NOT claim all-repository coverage. Review failures against approved
behavior/content; do not change website copy merely to satisfy an old assertion.

The experimental all-test runner remains recoverable at PR #106's initial
commit 4c47b89; it is not enabled by this batch. `npm run lint` and
`npm run typecheck` remain available and ungated; typecheck uses --noEmit.
Bring them into required CI only after an honest, reviewed baseline is established.
Use disposable checkouts: candidate builds may rewrite tracked generated files,
including public/growth-show.xml. Do not commit or publish that generated output.

### After publication, with explicit authorization

```sh
npm run check:release-live
```

This invokes the existing `check:core-bridge-live` diagnostic and makes a real
request to the published NTA intake endpoint. It checks three fixed Core
connection receivers, not the candidate. It is not part of push/PR CI. Do not
run it during a read-only review. Passing establishes connection readiness,
not lead capture, mailbox receipt, indexing or business results.

Record the exact candidate, performed checks, review findings, Rick's approval,
publication/checkpoint when applicable, and outstanding verification gaps.
Rick remains the merge approver and Base44 publisher.

### IndexNow and scope

PR #105's explicit-key fix, notification workflow, and both hosted key files
remain unchanged. Its notification still runs on qualifying pushes to main;
post-publication timing is a separate decision. Candidate CI never runs --submit.

The F2 separation, discovery, content follow-up and video-library batches are
retained. Batch four adds only the existing podcast suite to automatic checks.
F3 is not complete, and F4-F7 remain separate. This changes no application handlers,
permissions, customer data, dependency versions, lockfile, branch protection,
page content or IndexNow timing. Proposed changes stay on the review branch
until Rick explicitly approves their merge.
