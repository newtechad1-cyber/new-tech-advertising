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
proof that the live connection works. `check:release` is an alias for `check:ci`.

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

### F3 is separate and still open

This narrow F2 repair does NOT claim every test file is wired into CI. The
unwired-test inventory and the previously ungated lint/typecheck backlog remain
separate work. No existing application test or assertion is removed to get green
CI, and no application copy is changed to match a stale expectation. Review each
failure against approved behavior/content before updating a test or the application.
The experimental discovery runner and its inventory tests remain recoverable at
PR #106's initial commit 4c47b89; they are not part of this narrowed change.
`npm run lint` and `npm run typecheck` remain available; typecheck uses --noEmit.
Bring them into required CI only after an honest, reviewed baseline is established.

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

This pass addresses F2, not F3 or F4-F7. It changes no application handlers,
permissions, customer data, dependency versions, lockfile, branch protection,
page content or IndexNow timing. Proposed changes stay on the review branch
until Rick explicitly approves their merge.
