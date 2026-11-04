# F3 test coverage: discovery batch one

Baseline: `0279a89b1b930ed65cb2f7103e13dde01c98c544` (merged PR #106).
This is a scoped wiring inventory, not a runtime audit or an all-tests result.
The source of truth for executed results is the candidate's GitHub Actions log.
An unmerged candidate is not active coverage on main.

## Why this batch

The first independent review identified 15 tests without npm wiring and a
podcast suite outside the release gate. Its follow-up recommended separating
F3 from the F2 repair and checking existing tests before enabling them.
This batch selects three related discovery tests, without changing their
assertions, production behavior, content, dependencies or the F2/IndexNow fixes.

The new `test:discovery` command is appended with `&&` after the exact previous
`check:ci` chain. Existing tests and their order are preserved. A nonzero exit
still fails the job. GitHub's existing no-network step runs the extended chain;
no live diagnostic, email, interpretation request or URL submission is added.

## Baseline inventory and disposition

These 16 files exist under `tests/` but are not reached by the baseline release
workflow or its recursively invoked npm scripts. The first 15 had no npm test
command; `growth-show-podcast` already had `test:podcast`, but was not gated.
All names below end in `.test.mjs`. No remaining file has been deleted, retired
or declared correct merely because it is deferred.

| File stem | This batch | Evidence / next action |
| --- | --- | --- |
| discovery-input-mode | Add unchanged | Five source-structure cases: voice/text choices, microphone recovery, consent guards, saved-answer progression and storage-failure handling. Not browser or backend execution. |
| discovery-question-selection | Add unchanged | Two runtime selector cases. Imports the dependency-free walkthrough module; no service calls. |
| discovery-trigger-routing | Add unchanged | Four source-structure cases for the fixed internal transport, credential forwarding and event guards. Does not execute the backend handler. |
| content-journey | Still ungated | Previous reviewer reported passing; reproduce on the chosen future baseline before adding. |
| content-follow-up-form | Still ungated | Previous reviewer could not run its TypeScript-dependent harness. Inspect and reproduce. |
| growth-show | Still ungated | Previous reviewer reported passing; reproduce before adding. |
| video-gallery | Still ungated | Obtain a dependency-complete, isolated result before disposition. |
| youtube-learning-identity | Still ungated | Previous reviewer reported passing; reproduce before adding. |
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
Require the previous gate to finish and `test:discovery` to report all 11 cases
passing, with zero failed or skipped tests. The release-check guard must reject
both removing this appended command and omitting a file from the batch.
The new guard is structural; the existing Node tests still determine pass/fail.

Claude reviews the exact base-to-head difference before Rick considers merging.
Passing this batch establishes only these automated checks. It does not verify
microphones, live consent, Core delivery, current podcast data, indexing or sales.

Candidate builds remain disposable and must not be published or committed.
The tracked generated-feed risk from PR #106 remains open; no output-path or
working-tree guard is implemented here. No new schedule, service or paid model
connection is activated. Rollback before approval is to leave the draft unmerged;
after approval, revert only this batch to restore the previous gate.
