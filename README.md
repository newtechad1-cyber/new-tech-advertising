# Base44 App

## Candidate code and published-site checks

Use Node 22 and the committed lockfile. Code verification and live-site
verification are different results; neither authorizes a merge or publication.

### Before review / merge

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run check:ci
```

`check:ci` runs the existing strict source security audit, builds the candidate,
runs every `*.test.js`, `*.test.mjs` and `*.test.cjs` under `tests/` and
`src/lib/growth-guide/` (recursively), then checks the local Core bridge rollout
record. The rollout-record check is not proof that the live connection works.
The build must precede the tests because some tests inspect generated HTML/RSS.
No test is skipped or quarantined by this change. The runner prints the exact
inventory and propagates failures, timeouts and missing test roots.

`npm run check:release` is a backward-compatible alias for `check:ci`. It no
longer calls the published website. Existing targeted test commands remain.
To inspect the complete file inventory without executing tests:

```sh
node scripts/run-ci-tests.mjs --list
```

GitHub installs dependencies first, without lifecycle scripts. It then runs
candidate code checks in a Linux network namespace with no external network,
as the unprivileged runner user and without the GitHub/production environment.
There is no fallback to a network-enabled check if isolation fails. The
standalone npm command does not provide this OS-level isolation by itself;
review new tests before running it locally and use an isolated workspace with
no production credentials. Tests must mock external services.

The draft also measures `npm run lint` and `npm run typecheck` explicitly. These
steps must report their real outcomes: no `continue-on-error`, ignored failures
or relaxed assertions. `typecheck` uses `--noEmit` so it cannot rewrite source
files. Baseline results and any existing failures are recorded in the PR; do
not call this change ready for merge until its results have been reviewed.

### After Rick publishes, with explicit authorization

```sh
npm run check:release-live
```

This separate command invokes the existing `check:core-bridge-live` diagnostic.
It makes a real request to the published NTA intake endpoint and checks three
fixed Core connection receivers. It is not part of push/PR CI. Do not run it
during an independent read-only code review. Its success is only connection
readiness, not proof of lead capture, mailbox receipt or business results.

Record candidate commit, checks run, Rick's approval, publication/checkpoint
when applicable, live diagnostic result and any remaining verification gaps.
Rick remains the Base44 publisher. This CI-only change does not publish pages.

### IndexNow and scope

The PR #105 explicit-key fix and both hosted key files remain unchanged.
Its notification still runs on qualifying pushes to `main`; changing that to
post-publication timing is a separate decision. CI never runs `--submit`.
A successful notification does not prove indexing.

This pass addresses F2 and evaluates F3 from the November 4 independent review.
It does not alter application handlers, permissions, customer data, dependencies,
branch protection, IndexNow timing, or findings F4-F7. No new scheduled service
or paid model review is configured. Proposed changes remain on a review branch
until Rick explicitly approves their merge.
